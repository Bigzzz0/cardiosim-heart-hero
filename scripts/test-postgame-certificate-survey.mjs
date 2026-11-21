import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const port = 4192;
const base = `http://127.0.0.1:${port}`;
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
  { stdio: 'ignore' }
);

function makeBridgePayload(caseKind) {
  if (caseKind === 'case-01') {
    return {
      student: {
        studentId: '66010111',
        name: 'นศ.พ. ทดสอบ เคสหนึ่ง',
        institution: 'คณะพยาบาลศาสตร์ มหาวิทยาลัยขอนแก่น',
      },
      telemetry: {
        student: {
          studentId: '66010111',
          name: 'นศ.พ. ทดสอบ เคสหนึ่ง',
          institution: 'คณะพยาบาลศาสตร์ มหาวิทยาลัยขอนแก่น',
        },
        preTestScore: 4,
        preTestAnswers: {},
        postTestScore: 8,
        postTestAnswers: {},
        learningGain: 0.67,
        discoveredHotspots: [],
        prioritizationErrors: 0,
        medicationErrors: 0,
        ioErrors: 0,
        crisisResponseTimeSeconds: 0,
        totalTimeSeconds: 310,
        surveyScores: {},
        feedbackText: '',
        gameResult: {
          caseId: 'case-01',
          completedAt: '2026-11-21T02:20:00.000Z',
          durationMs: 260_000,
          attempts: 13,
          mistakes: 2,
          hints: 0,
          findings: [
            'history',
            'lungs',
            'bp',
            'oxygen',
            'diagnosis',
            'nursing-care',
            'medication',
            'io',
            'airway',
            'breathing',
            'circulation',
            'ecg',
            'ecg-read',
            'emergency-treatment',
          ],
          clinicalStatus: 'CASE 01 · DEMO DATA · รอผู้เชี่ยวชาญตรวจรับรอง',
          demoScore: 94,
          scoreStatus: 'demo',
        },
      },
    };
  }

  return {
    student: {
      studentId: '66010999',
      name: 'นศ.พ. ทดสอบ เคสสอง',
      institution: 'คณะพยาบาลศาสตร์ มหาวิทยาลัยขอนแก่น',
    },
    telemetry: {
      student: {
        studentId: '66010999',
        name: 'นศ.พ. ทดสอบ เคสสอง',
        institution: 'คณะพยาบาลศาสตร์ มหาวิทยาลัยขอนแก่น',
      },
      preTestScore: 5,
      preTestAnswers: {},
      postTestScore: 9,
      postTestAnswers: {},
      learningGain: 0.8,
      discoveredHotspots: [],
      prioritizationErrors: 0,
      medicationErrors: 0,
      ioErrors: 0,
      crisisResponseTimeSeconds: 0,
      totalTimeSeconds: 240,
      surveyScores: {},
      feedbackText: '',
      gameResult: {
        caseId: 'case-02',
        completedAt: '2026-11-21T02:30:00.000Z',
        durationMs: 215_000,
        attempts: 11,
        mistakes: 0,
        hints: 1,
        findings: [
          'history',
          'lungs',
          'bp',
          'oxygen',
          'diagnosis',
          'nursing-care',
          'medication',
          'io',
          'cpr-started',
          'ecg',
          'emergency-treatment',
        ],
        clinicalStatus: 'CASE 02 · รอบฝึก · อัปเดตการช่วยชีวิตตามคำตอบทีม',
        demoScore: null,
        scoreStatus: 'unscored',
      },
    },
  };
}

let browser;
try {
  let ready = false;
  for (let i = 0; i < 60 && !ready; i++) {
    try {
      ready = (await fetch(base)).ok;
    } catch {
      // Waiting for Vite.
    }
    if (!ready) await new Promise((resolve) => setTimeout(resolve, 250));
  }
  assert(ready, 'Vite did not start');

  browser = await chromium.launch({
    headless: true,
    ...(process.env.CARDIOSIM_BROWSER_CHANNEL ? { channel: process.env.CARDIOSIM_BROWSER_CHANNEL } : {}),
  });

  await mkdir('screenshots/postgame', { recursive: true });

  // 1. Certificate preview & 1-page A4 print-media verification (Desktop)
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.goto(`${base}/?test=certificate`, { waitUntil: 'networkidle' });
    await page.locator('#certificate-canvas').waitFor();
    await page.locator('#certificate-canvas img').evaluate((img) => img.decode());

    const canvasText = await page.locator('#certificate-canvas').innerText();
    assert(canvasText.includes('คณะพยาบาลศาสตร์ มหาวิทยาลัยขอนแก่น'), 'Certificate must show KKU Faculty of Nursing');
    assert(canvasText.includes('รองศาสตราจารย์ ดร.วาสนา รวยสูงเนิน'), 'Missing advisor 1');
    assert(canvasText.includes('ผู้ช่วยศาสตราจารย์ ดร.มะลิวรรณ ศิลารัตน์'), 'Missing advisor 2');
    assert(!canvasText.includes('มหิดล'), 'Legacy institution must not appear');

    await page.screenshot({ path: 'screenshots/postgame/certificate-modal.png' });

    await page.emulateMedia({ media: 'print' });
    const printMetrics = await page.evaluate(() => {
      const root = document.querySelector('#root');
      const portal = document.querySelector('.certificate-print-portal');
      const canvas = document.querySelector('#certificate-print-canvas');
      const style = canvas ? getComputedStyle(canvas) : null;
      const rect = canvas ? canvas.getBoundingClientRect() : null;
      return {
        rootDisplay: root ? getComputedStyle(root).display : null,
        portalDisplay: portal ? getComputedStyle(portal).display : null,
        visibility: style?.visibility,
        width: rect?.width ?? 0,
        height: rect?.height ?? 0,
      };
    });

    assert.equal(printMetrics.rootDisplay, 'none', '#root must be hidden in print media');
    assert.equal(printMetrics.portalDisplay, 'block', 'Print portal must be display:block in print media');
    assert.equal(printMetrics.visibility, 'visible', 'Certificate print canvas must be visible in print media');
    assert(printMetrics.width > 900 && printMetrics.height > 600, `Certificate A4 print box too small: ${printMetrics.width}x${printMetrics.height}`);

    const pdfBytes = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      path: 'screenshots/postgame/certificate-print.pdf',
    });
    const pdfText = Buffer.from(pdfBytes).toString('latin1');
    const pageCountMatches = pdfText.match(/\/Type\s*\/Page\b/g) || [];
    assert.equal(pageCountMatches.length, 1, `Certificate PDF must be exactly 1 A4 page, got ${pageCountMatches.length}`);
    assert(pdfBytes.byteLength > 20_000, 'Generated certificate PDF looks unexpectedly small/blank');
    await page.screenshot({ path: 'screenshots/postgame/certificate-print.png' });

    assert.deepEqual(errors, [], `Certificate desktop errors: ${errors.join('; ')}`);
    await context.close();
  }

  // 2. Case 1 Stage15Results (Desktop)
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.addInitScript((payload) => {
      sessionStorage.setItem('cardiosim.game.return.v1', JSON.stringify(payload));
    }, makeBridgePayload('case-01'));

    await page.goto(`${base}/?stage=RESULTS_DASHBOARD`, { waitUntil: 'networkidle' });
    const resultsText = await page.locator('main').innerText();
    assert(resultsText.includes('CASE 01'), 'Case 1 results should show CASE 01');
    assert(resultsText.includes('94/100'), 'Case 1 results should show demo score 94/100');
    assert(resultsText.includes('Furosemide'), 'Case 1 results should show Furosemide milestone');
    assert(!resultsText.includes('Amiodarone'), 'Case 1 results must not leak Case 2 Amiodarone');
    assert(!resultsText.includes('90.8%'), 'Must not show hardcoded 90.8% fake NCJMM score');
    await page.screenshot({ path: 'screenshots/postgame/results-case1.png', fullPage: true });
    assert.deepEqual(errors, [], `Case 1 desktop errors: ${errors.join('; ')}`);
    await context.close();
  }

  // 3. Case 2 Stage15Results -> Stage16Survey (10 items) -> CSV download verification (Desktop)
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      acceptDownloads: true,
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.addInitScript((payload) => {
      sessionStorage.setItem('cardiosim.game.return.v1', JSON.stringify(payload));
    }, makeBridgePayload('case-02'));

    await page.goto(`${base}/?stage=RESULTS_DASHBOARD`, { waitUntil: 'networkidle' });
    const resultsText = await page.locator('main').innerText();
    assert(resultsText.includes('CASE 02'), 'Results should show CASE 02');
    assert(resultsText.includes('AF with RVR'), 'Results should show Case 2 title');
    assert(resultsText.includes('Amiodarone'), 'Results should show Case 2 Amiodarone milestone');
    assert(resultsText.includes('+700 mL'), 'Results should show Case 2 I/O milestone');
    assert(resultsText.includes('CPR'), 'Results should show Case 2 CPR milestone');
    assert(resultsText.includes('6/6'), 'Results should show 6/6 completed Case 2 steps');
    assert(!resultsText.includes('-200 mL'), 'Case 2 results must not leak Case 1 -200 mL text');
    assert(!resultsText.includes('90.8%'), 'Must not show hardcoded 90.8% fake NCJMM score');

    await page.screenshot({ path: 'screenshots/postgame/results-case2.png', fullPage: true });

    await page.getByRole('button', { name: /ทำแบบประเมินความพึงพอใจ/ }).click();
    await page.getByText('ด้านที่ 1 ความชัดเจนของเนื้อหาและความเข้าใจ').waitFor();
    await page.getByText('ด้านที่ 2 การลดความวิตกกังวลก่อนขึ้นฝึกปฏิบัติ').waitFor();
    await page.getByText('ด้านที่ 3 ความพึงพอใจโดยรวมและความตั้งใจใช้ต่อ').waitFor();

    await page.getByRole('button', { name: 'ส่งแบบประเมิน', exact: true }).click();
    await page.getByText(/ยังขาดอีก 10 ข้อ/).waitFor();

    const fiveButtons = page.locator('form button[aria-pressed]', { hasText: /^5/ });
    assert.equal(await fiveButtons.count(), 10, 'Expected 10 Likert score-5 buttons');
    for (let i = 0; i < 10; i++) {
      await fiveButtons.nth(i).click();
    }
    await page.locator('form textarea').fill('ฝึกเคส 2 ได้ชัดเจนมาก');
    await page.getByRole('button', { name: 'ส่งแบบประเมิน', exact: true }).click();
    await page.getByText(/ค่าเฉลี่ยรวม 5\.00 \/ 5\.00/).waitFor();

    await page.screenshot({ path: 'screenshots/postgame/survey-submitted.png', fullPage: true });

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /SPSS \.CSV/ }).click(),
    ]);
    await download.saveAs('screenshots/postgame/exported-case2.csv');
    const csv = await readFile('screenshots/postgame/exported-case2.csv', 'utf8');
    assert(csv.startsWith('\uFEFF'), 'CSV missing UTF-8 BOM');
    assert(csv.includes('survey_q10'), 'CSV missing survey_q10 header');
    assert(csv.includes('game_score_status'), 'CSV missing game_score_status header');
    assert(csv.includes('"case-02"'), 'CSV missing case-02 value');
    assert(csv.includes('"unscored"'), 'CSV missing unscored value');
    assert(csv.includes('คณะพยาบาลศาสตร์ มหาวิทยาลัยขอนแก่น'), 'CSV missing KKU institution');
    assert(csv.includes('ฝึกเคส 2 ได้ชัดเจนมาก'), 'CSV missing feedback text');

    assert.deepEqual(errors, [], `Case 2 desktop errors: ${errors.join('; ')}`);
    await context.close();
  }

  // 4. Mobile (390x844) responsive & touch checks for Results, Certificate Modal, and Survey
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.addInitScript((payload) => {
      sessionStorage.setItem('cardiosim.game.return.v1', JSON.stringify(payload));
    }, makeBridgePayload('case-02'));

    await page.goto(`${base}/?stage=RESULTS_DASHBOARD`, { waitUntil: 'networkidle' });
    await page.evaluate(async () => { await document.fonts.ready; });
    assert(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      'Mobile Results page has horizontal overflow'
    );
    await page.screenshot({ path: 'screenshots/postgame/mobile-results-case2.png', fullPage: true });

    await page.getByRole('button', { name: /รับใบประกาศนียบัตร/ }).click();
    await page.locator('#certificate-canvas').waitFor();
    await page.waitForTimeout(150);
    assert(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      'Mobile Certificate modal causes document horizontal overflow'
    );

    const fitBox = await page.locator('#certificate-canvas').boundingBox();
    assert(
      fitBox &&
        fitBox.width <= 375 &&
        fitBox.x >= 0 &&
        fitBox.x + fitBox.width <= 390 &&
        fitBox.height >= 160 &&
        fitBox.height <= 290,
      `Mobile certificate must fit full page inside 390px viewport, got ${JSON.stringify(fitBox)}`
    );
    const printBtnBox = await page.getByRole('button', { name: /พิมพ์ใบประกาศนียบัตร/ }).boundingBox();
    assert(
      printBtnBox && printBtnBox.y + printBtnBox.height <= 844,
      `Print/PDF button should fit in mobile viewport, got ${JSON.stringify(printBtnBox)}`
    );
    await page.screenshot({ path: 'screenshots/postgame/mobile-certificate.png' });

    // Zoom in to verify readability of student name on mobile
    await page.getByRole('button', { name: 'ขยายดูชื่อ', exact: true }).click();
    await page.waitForTimeout(100);
    const zoomedBox = await page.locator('#certificate-canvas').boundingBox();
    assert(
      zoomedBox && zoomedBox.width >= fitBox.width * 1.7,
      `Zoomed certificate width (${zoomedBox?.width}) should be >= 1.7x fit width (${fitBox.width})`
    );
    await page.screenshot({ path: 'screenshots/postgame/mobile-certificate-zoomed.png' });

    // Return to fit-to-screen
    await page.getByRole('button', { name: 'พอดีจอ', exact: true }).click();
    await page.waitForTimeout(100);
    const refitBox = await page.locator('#certificate-canvas').boundingBox();
    assert(
      refitBox && Math.abs(refitBox.width - fitBox.width) <= 5,
      `Refit certificate width (${refitBox?.width}) did not return to fit width (${fitBox.width})`
    );
    await page.getByRole('button', { name: 'ปิด', exact: true }).click();

    await page.getByRole('button', { name: /ทำแบบประเมินความพึงพอใจ/ }).click();
    await page.getByText('ด้านที่ 1 ความชัดเจนของเนื้อหาและความเข้าใจ').waitFor();
    assert(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      'Mobile Survey page has horizontal overflow'
    );
    const firstScoreBtn = page.locator('form button[aria-pressed]').first();
    const box = await firstScoreBtn.boundingBox();
    assert(box && box.width >= 44 && box.height >= 44, `Mobile Likert button too small: ${box?.width}x${box?.height}`);
    await page.screenshot({ path: 'screenshots/postgame/mobile-survey.png', fullPage: true });

    assert.deepEqual(errors, [], `Mobile postgame errors: ${errors.join('; ')}`);
    await context.close();
  }

  console.log('PASS: Certificate 1-page A4 PDF, Case 1 & Case 2 Results, 10-item Survey, SPSS CSV download, and 390px mobile responsive checks verified.');
} finally {
  await browser?.close();
  server.kill();
}
