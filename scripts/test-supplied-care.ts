import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import { CaseEngine } from '../src/game/core/CaseEngine';
import { verticalSlice } from '../src/game/cases/verticalSlice';
import { case02 } from '../src/game/cases/case02';
import type { GameCase, MissionState } from '../src/game/types';

const port = 4191;
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { stdio: 'ignore' });
let browser;
try {
  let ready = false;
  for (let i = 0; i < 60 && !ready; i++) {
    try { ready = (await fetch(base)).ok; } catch { /* Vite starting */ }
    if (!ready) await new Promise(resolve => setTimeout(resolve, 250));
  }
  assert(ready);
  browser = await chromium.launch({ headless: true, channel: process.env.CARDIOSIM_BROWSER_CHANNEL || 'msedge' });
  await mkdir('screenshots/supplied-care', { recursive: true });
  for (const [width, height] of [[1440, 900], [1024, 768], [390, 844]]) {
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: width < 760, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.url().includes('/assets/') && response.status() >= 400) errors.push(response.url()); });
    const capture = async (name: string) => {
      await page.evaluate(async () => { await document.fonts.ready; });
      if (await page.locator('.supplied-quiz').count()) await page.evaluate(() => window.scrollTo(0, 0));
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${name}: horizontal overflow`);
      await page.screenshot({ path: `screenshots/supplied-care/${width}-${name}.png`, fullPage: true });
    };
    const launch = async (config: GameCase, mission: MissionState) => {
      const engine = new CaseEngine(config);
      engine.mission.jumpTo(mission);
      await page.goto(base);
      await page.evaluate(checkpoint => localStorage.setItem(`cardiosim.phaser.checkpoint.${checkpoint.caseId}.v2`, JSON.stringify(checkpoint)), engine.checkpoint());
      await page.goto(`${base}/game.html?case=${config.scenarios.find(scenario => scenario.enabled)!.id}`);
      await page.getByRole('button', { name: 'เล่นต่อ', exact: true }).click();
      await page.locator(`main[data-mission="${mission}"]`).waitFor();
    };
    try {
      for (const stage of ['PRETEST', 'POSTTEST']) {
        await page.goto(`${base}/?stage=${stage}`);
        await page.locator('.supplied-quiz .quiz-paper').waitFor();
        const option = page.getByRole('button', { name: /^ก / });
        await option.focus();
        await page.keyboard.press('Enter');
        assert.equal(await option.getAttribute('aria-pressed'), 'true');
        await page.getByRole('button', { name: 'ข้อถัดไป' }).click();
        await page.getByRole('button', { name: 'ข้อก่อนหน้า' }).click();
        assert.equal(await page.getByRole('button', { name: /^ก / }).getAttribute('aria-pressed'), 'true', 'Answers lost when navigating');
        await capture(stage);
        for (let i = 0; i < 10; i++) {
          await page.getByRole('button', { name: /^ก / }).click();
          if (i < 9) await page.getByRole('button', { name: 'ข้อถัดไป' }).click();
        }
        await page.locator('.supplied-quiz button').filter({ hasText: /ส่งแบบทดสอบ/ }).click();
        await page.locator('.supplied-quiz').waitFor({ state: 'detached' });
      }
      await launch(verticalSlice, 'MEDICATION');
      await page.locator('.supplied-order-document>summary').click();
      await page.locator('.order-document-body').waitFor();
      assert.match(await page.locator('.order-document-body').innerText(), /Furosemide/i);
      await capture('order');
      await page.locator('[data-workbench-object="order"]').click();
      await page.locator('[data-workbench-object="order"].reviewed').waitFor();
      await launch(case02, 'MEDICATION');
      assert.equal(await page.locator('.supplied-order-document,input,select').count(), 0, 'Case 2 invented medication fields');
      await page.getByRole('button', { name: 'บันทึกว่าไม่มีข้อมูลใน Case' }).click();
      await page.getByRole('button', { name: 'บันทึกข้อมูลที่ขาด' }).click();
      assert.equal(await page.locator('main').getAttribute('data-decision-confirmed'), 'true');
      await capture('missing-order');
      await launch(case02, 'EMERGENCY_TRANSITION');
      await page.locator('.room-alert .supplied-emergency-art').waitFor();
      await capture('emergency');
      await page.getByRole('button', { name: 'พักเกม', exact: true }).click();
      if (width === 390) {
        await page.waitForTimeout(5500);
        assert.equal(await page.locator('main').getAttribute('data-mission'), 'EMERGENCY_TRANSITION', 'Pause must freeze transition');
      }
      await page.getByRole('button', { name: 'เล่นต่อ', exact: true }).click();
      await page.locator('main[data-mission="ABC_ASSESSMENT"]').waitFor();
      assert.equal(await page.locator('.room-alert').count(), 0);
      assert(await page.locator('.hud-emergency').isVisible());
      assert((await page.locator('.hud-emergency b').boundingBox())!.width > 40, 'Emergency label must remain visible on mobile');
      await page.locator('[data-tool-id="hand"]').click();
      for (const target of ['head', 'chest', 'wrist']) {
        const point = await page.locator(`[data-patient-hotspot="${target}"]`).boundingBox();
        assert(point);
        assert(await page.evaluate(({ x, y }) => !document.elementFromPoint(x, y)?.closest('.hud-emergency,.room-alert'), { x: point.x + point.width / 2, y: point.y + point.height / 2 }), 'Emergency art blocks examination');
      }
      await capture('ABC');
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}px: both quizzes, answer persistence/submission, readable order/inspection, missing order, emergency pause/transition and unobstructed ABC`);
    } catch (error) {
      await capture('failure');
      throw error;
    } finally { await context.close(); }
  }
} finally {
  await browser?.close();
  server.kill();
}
