import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const revision = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const dirty = Boolean(execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim());
const name = `cardiosim-trial-${revision.slice(0, 7)}${dirty ? '-working' : ''}`;
const staging = resolve('tmp', name);
const archive = resolve('tmp', `${name}.zip`);
const art = new Map(JSON.parse(readFileSync('docs/supplied-runtime-assets.json', 'utf8')).map(record => [record.file, record.sha256]));
const digest = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const files = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(join(directory, entry.name)) : [join(directory, entry.name)]);
for (const file of files('dist')) {
  if (!/\.(webp|png|jpe?g|svg|ico)$/i.test(file)) continue;
  const key = '/' + file.slice('dist'.length + 1).replaceAll('\\', '/');
  assert.equal(digest(file), art.get(key), `Unreviewed illustration in trial bundle: ${key}`);
}
assert(readFileSync('dist/game.html', 'utf8').includes('type="module"'));
// A unique staging directory avoids carrying stale files into a later package.
const stage = join(staging, String(Date.now()));
mkdirSync(stage, { recursive: true });
cpSync('dist', stage, { recursive: true });
writeFileSync(join(stage, 'TRIAL_README.md'), `# CardioSim — ชุดเว็บสำหรับทดลอง\n\nเวอร์ชัน ${revision}${dirty ? ' (มีการแก้ไขที่ยังไม่ commit)' : ''}\n\nสถานะเนื้อหา: รอผู้เชี่ยวชาญรับรอง คะแนน Case 1 เป็นเดโม ส่วน Case 2 เป็นรอบฝึกไม่ให้คะแนนทางคลินิก ช่องผลข้างเคียงของ Case 1 บันทึกคำตอบโดยยังไม่ตัดสินถูกผิด\n\n## เปิดทดลอง\n\nแตก ZIP แล้วเปิดผ่าน HTTP server หรือ static hosting ที่รากโดเมน เช่น ใช้ Python ในโฟลเดอร์ที่แตกไฟล์: python -m http.server 8080 แล้วเปิด http://localhost:8080/\n\n- หน้าแรก: /\n- Case 1: /game.html?case=case-01\n- Case 2: /game.html?case=case-02\n\nต้องอัปโหลด index.html, game.html, assets, icons, manifest และไฟล์อื่นทั้งหมดร่วมกัน การเปิดไฟล์ HTML โดยตรงผ่าน file:// ไม่ใช่วิธีทดสอบชุดนี้ การติดตั้งใต้ subfolder ต้องปรับเส้นทางก่อน\n\nชุดนี้ใช้รูปเวชนิทัศน์และ favicon ที่ผู้ใช้ให้มา ไม่รวมภาพ AI ที่เก็บไว้ใน archive ของ repository\n\nเอกสารตรวจเนื้อหา: https://github.com/Bigzzz0/cardiosim-heart-hero/tree/${revision}/docs/clinical-review\n\nการเผยแพร่ชุด ZIP นี้ยังไม่ใช่การ deploy เว็บไซต์สาธารณะ และยังไม่มี clinical sign-off\n`);
const manifest = {
  revision, worktreeDirty: dirty, builtAt: new Date().toISOString(), clinicalApproval: 'pending',
  intendedUse: 'trial-and-review', hostingBase: '/',
  hashes: Object.fromEntries(files(stage).map(file => [file.slice(stage.length + 1).replaceAll('\\', '/'), digest(file)])),
};
writeFileSync(join(stage, 'trial-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
execFileSync('tar', ['-a', '-cf', archive, '-C', stage, '.']);
const contents = execFileSync('tar', ['-tf', archive], { encoding: 'utf8' });
for (const expected of ['index.html', 'game.html', 'TRIAL_README.md', 'trial-manifest.json']) assert(contents.includes(expected), `Missing trial file: ${expected}`);
const checksum = digest(archive);
writeFileSync(`${archive}.sha256`, `${checksum}  ${name}.zip\n`);
console.log(JSON.stringify({ archive, sha256: checksum, files: Object.keys(manifest.hashes).length + 1, clinicalApproval: manifest.clinicalApproval }, null, 2));
