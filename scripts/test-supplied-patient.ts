import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { chromium, type Page } from 'playwright';
import { CaseEngine } from '../src/game/core/CaseEngine';
import { case02 } from '../src/game/cases/case02';

const port = 4189;
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { stdio: 'ignore' });
let browser;

async function dragToPatient(page: Page, tool: string, target: string, touch: boolean) {
  const source = await page.locator(`[data-tool-id="${tool}"]`).boundingBox();
  const destination = await page.locator(`[data-patient-hotspot="${target}"]`).boundingBox();
  assert(source && destination, 'Interaction bounds unavailable');
  assert(destination.width >= 44 && destination.height >= 44, 'Patient targets must be usable on touch screens');
  const from = { x: source.x + source.width / 2, y: source.y + source.height / 2 };
  const to = { x: destination.x + destination.width / 2, y: destination.y + destination.height / 2 };
  assert(await page.evaluate(point => !document.elementFromPoint(point.x, point.y)?.closest('.mission-panel,.monitor,.game-hud,.toolbar'), to), `${target} is covered by UI`);
  if (touch) {
    const cdp = await page.context().newCDPSession(page);
    try {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ id: 1, ...from }] });
      for (let step = 1; step <= 10; step++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ id: 1, x: from.x + (to.x - from.x) * step / 10, y: from.y + (to.y - from.y) * step / 10 }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    } finally { await cdp.detach(); }
  } else {
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    await page.mouse.move(to.x, to.y, { steps: 10 });
    await page.mouse.up();
  }
}

try {
  let ready = false;
  for (let i = 0; i < 60 && !ready; i++) {
    try { ready = (await fetch(base)).ok; } catch { /* Vite starting */ }
    if (!ready) await new Promise(resolve => setTimeout(resolve, 250));
  }
  assert(ready, 'Vite failed to start');
  browser = await chromium.launch({ headless: true, ...(process.env.CARDIOSIM_BROWSER_CHANNEL ? { channel: process.env.CARDIOSIM_BROWSER_CHANNEL } : {}) });
  await mkdir('screenshots/supplied-patient', { recursive: true });
  for (const [width, height] of [[1440, 900], [1024, 768], [390, 844]]) {
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: width < 760, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.url().includes('/game/') && response.status() >= 400) errors.push(`${response.status()}: ${response.url()}`); });
    const game = new CaseEngine(case02);
    game.mission.jumpTo('ASSESSMENT');
    await page.addInitScript(checkpoint => {
      const key = `cardiosim.phaser.checkpoint.${checkpoint.caseId}.v2`;
      if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(checkpoint));
    }, game.checkpoint());
    try {
      await page.goto(`${base}/game.html?case=case-02`);
      await page.getByRole('button', { name: 'เล่นต่อ', exact: true }).click();
      await page.waitForFunction(() => document.querySelector('main')?.getAttribute('data-mission') === 'ASSESSMENT');
      await page.locator('.room-stage[data-world-view]').waitFor();
      await page.locator('[data-tool-id="stethoscope"]').focus();
      await page.keyboard.press('Enter');
      await page.screenshot({ path: `screenshots/supplied-patient/${width}-assessment.png` });
      for (const [index, [tool, target]] of [['stethoscope', 'chest'], ['bp', 'arm'], ['spo2', 'finger']].entries()) {
        await dragToPatient(page, tool, target, width < 760);
        await page.waitForFunction(count => document.querySelectorAll('.objective.done').length === count, index + 1);
      }
      assert.equal(await page.locator('main').getAttribute('data-mistakes'), '0');
      assert.deepEqual(await page.locator('.monitor .vital-large b, .monitor .vital-small b').allTextContents(), ['—', '—', '—/—', '—']);
      await page.reload();
      await page.getByRole('button', { name: 'เล่นต่อ', exact: true }).click();
      await page.waitForFunction(() => document.querySelectorAll('.objective.done').length === 3);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Horizontal overflow');
      await page.screenshot({ path: `screenshots/supplied-patient/${width}-resumed.png` });
      for (const mission of ['PATIENT_INFORMATION', 'ABC_ASSESSMENT'] as const) {
        const phase = new CaseEngine(case02);
        phase.mission.jumpTo(mission);
        await page.evaluate(checkpoint => localStorage.setItem(`cardiosim.phaser.checkpoint.${checkpoint.caseId}.v2`, JSON.stringify(checkpoint)), phase.checkpoint());
        await page.reload();
        await page.getByRole('button', { name: 'เล่นต่อ', exact: true }).click();
        await page.waitForFunction(id => document.querySelector('main')?.getAttribute('data-mission') === id, mission);
        const objectives = phase.mission.current.objectives!;
        await page.locator(`[data-tool-id="${objectives[0].tool}"]`).focus();
        await page.keyboard.press('Enter');
        await page.screenshot({ path: `screenshots/supplied-patient/${width}-${mission}.png` });
        for (const [index, objective] of objectives.entries()) {
          await dragToPatient(page, objective.tool, objective.target, width < 760);
          await page.waitForFunction(count => document.querySelectorAll('.objective.done').length === count, index + 1);
        }
        assert.equal(await page.locator('main').getAttribute('data-mistakes'), '0');
      }
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}px: illustrated patient, history/assessment/ABC, ${width < 760 ? 'real touch' : 'mouse'} drag, unobstructed targets, blank vitals and checkpoint resume`);
    } catch (error) {
      await page.screenshot({ path: `screenshots/supplied-patient/${width}-failure.png` });
      throw error;
    } finally { await context.close(); }
  }
} finally {
  await browser?.close();
  server.kill();
}
