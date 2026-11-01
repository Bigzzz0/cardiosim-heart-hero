import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

// Set CARDIOSIM_BROWSER_CHANNEL=msedge to use an installed Edge on Windows.
const port = 4188;
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { stdio: 'ignore' });
let browser;
try {
  let ready = false;
  for (let i = 0; i < 60 && !ready; i++) {
    try { ready = (await fetch(base)).ok; } catch { /* Waiting for Vite. */ }
    if (!ready) await new Promise(resolve => setTimeout(resolve, 250));
  }
  assert(ready, 'Vite did not start');
  browser = await chromium.launch({ headless: true, ...(process.env.CARDIOSIM_BROWSER_CHANNEL ? { channel: process.env.CARDIOSIM_BROWSER_CHANNEL } : {}) });
  await mkdir('screenshots/illustrated-entry', { recursive: true });
  for (const viewport of [{ width: 1440, height: 1100 }, { width: 1024, height: 900 }, { width: 768, height: 1024 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, isMobile: viewport.width < 600, hasTouch: viewport.width < 600 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.url().includes('/game/medical-illustration/') && response.status() >= 400) errors.push(`Missing art: ${response.url()}`);
    });
    const capture = async name => {
      await page.evaluate(async () => { await document.fonts.ready; });
      await page.screenshot({ path: `screenshots/illustrated-entry/${viewport.width}-${name}.png`, fullPage: true });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${name}: horizontal overflow`);
    };
    await page.goto(base);
    await page.locator('.illustrated-cover-art').evaluate(image => image.decode());
    await capture('cover');
    const start = page.getByRole('button', { name: 'เริ่มเกม START', exact: true });
    const startBox = await start.boundingBox();
    assert(startBox.width >= 44 && startBox.height >= 44, 'Start touch target is too small');
    await start.focus();
    await page.keyboard.press('Enter');
    await page.getByRole('heading', { name: 'เข้าสู่บทเรียน', exact: true }).waitFor();
    await page.getByRole('button', { name: 'เข้าสู่บทเรียน', exact: true }).click();
    assert(await page.locator('#entry-student-id').evaluate(input => !input.validity.valid), 'Empty identity should be rejected');
    await page.locator('#entry-student-id').fill('   ');
    assert(await page.locator('#entry-student-id').evaluate(input => !input.validity.valid), 'Whitespace-only identity should be rejected');
    await page.getByLabel('รหัสนักศึกษา').fill(' 67010001 ');
    await page.getByLabel('ชื่อ–นามสกุล').fill(' ผู้เล่นทดสอบ ');
    await page.getByLabel('สถาบันการศึกษา / ชั้นปี').fill(' คณะพยาบาลศาสตร์ ');
    await capture('login');
    await page.getByRole('button', { name: 'กลับหน้าปก' }).click();
    assert(await page.getByRole('button', { name: 'เริ่มเกม START', exact: true }).evaluate(button => button === document.activeElement), 'Back should return keyboard focus');
    await page.getByRole('button', { name: 'เริ่มเกม START', exact: true }).click();
    assert.equal(await page.getByLabel('รหัสนักศึกษา').inputValue(), ' 67010001 ', 'Back must preserve entered identity');
    await page.getByRole('button', { name: 'เข้าสู่บทเรียน', exact: true }).click();
    await page.getByRole('heading', { name: /Pre-Test/ }).waitFor();
    for (let question = 0; question < 10; question++) {
      await page.getByRole('button', { name: /^ก / }).click();
      if (question < 9) await page.getByRole('button', { name: 'ข้อถัดไป' }).click();
    }
    await page.getByRole('button', { name: 'ส่งแบบทดสอบ & ไปต่อ' }).click();
    await page.getByRole('button', { name: 'เข้าสู่การเลือกสถานการณ์ (เลือกเคส)' }).click();
    await page.getByRole('heading', { name: 'เลือกเคสผู้ป่วย', exact: true }).waitFor();
    await capture('cases');
    for (const caseNumber of [1, 2]) {
      if (caseNumber === 2) await page.goto(`${base}/?stage=SCENARIO_SELECT`);
      await page.getByRole('button', { name: `เริ่มเล่นสถานการณ์ที่ ${caseNumber}`, exact: true }).click();
      await page.waitForURL(`**/game.html?case=case-0${caseNumber}&from=web`);
      await page.locator('canvas').first().waitFor();
      const bridge = await page.evaluate(() => JSON.parse(sessionStorage.getItem('cardiosim.game.return.v1')));
      assert.equal(bridge.student.studentId, '67010001');
      assert.equal(bridge.student.name, 'ผู้เล่นทดสอบ');
      assert.equal(bridge.student.institution, 'คณะพยาบาลศาสตร์');
    }
    assert.deepEqual(errors, [], 'Browser errors');
    await context.close();
    console.log(`PASS ${viewport.width}px: cover → login → pretest → learning hub → both game cases; input validation, focus, profile handoff and layout`);
  }
} finally {
  await browser?.close();
  server.kill();
}
