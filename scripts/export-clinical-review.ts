import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { CASE_1_DETAILS } from '../src/data/case1Data';
import { CASE_1_EHR } from '../src/data/ehrCase1Data';
import { PRETEST_QUESTIONS } from '../src/data/preTestData';
import { POSTTEST_QUESTIONS } from '../src/data/postTestData';
import { MEDICATION_CHOICES, MEDICATION_PREPARATION_STEPS } from '../src/data/medicationStepsData';
import { LEARNING_VIDEOS } from '../src/data/learningVideosData';
import { caseRegistry } from '../src/game/cases';

const directory = 'docs/clinical-review';
mkdirSync(directory, { recursive: true });
const inputs = ['src/data/case1Data.ts', 'src/data/ehrCase1Data.ts', 'src/data/medicationStepsData.ts', 'src/data/preTestData.ts', 'src/data/postTestData.ts', 'src/data/learningVideosData.ts', 'src/game/cases/verticalSlice.ts', 'src/game/cases/case02.ts', 'src/game/cases/medicationWorkbench.ts', 'src/game/core/CaseEngine.ts', 'src/components/stages/Stage11IORecord.tsx', 'src/components/stages/Stage12CrisisEvent.tsx'];
inputs.push('src/game/types.ts', 'src/game/core/validateCase.ts', 'src/game/components/ActivityFields.tsx', 'src/game/suppliedECGArt.json', 'src/game/suppliedECGLayout.ts', 'src/data/nursingDiagnosesData.ts', 'src/components/stages/Stage1PreTest.tsx', 'src/components/stages/Stage14PostTest.tsx');
const sourceFiles = inputs.map(file => ({ file, sha256: createHash('sha256').update(readFileSync(file, 'utf8').replace(/\r\n/g, '\n')).digest('hex') }));
const questions = [
  ...PRETEST_QUESTIONS.map(question => ({ reviewId: `PRE-${String(question.id).padStart(2, '0')}`, stage: 'PRETEST', ...question, reviewStatus: 'pending' })),
  ...POSTTEST_QUESTIONS.map(question => ({ reviewId: `POST-${String(question.id).padStart(2, '0')}`, stage: 'POSTTEST', ...question, reviewStatus: 'pending' })),
];
const findings = JSON.parse(readFileSync(`${directory}/findings.json`, 'utf8')) as { id: string; title: string; question: string; reviewerRole: string; locations: { file: string; anchor: string }[]; referenceIds: string[]; status: string }[];
const locatedFindings = findings.map(finding => ({ ...finding, locations: finding.locations.map(location => {
  const text = readFileSync(location.file, 'utf8');
  const index = text.indexOf(location.anchor);
  if (index < 0) throw new Error(`Missing review anchor: ${finding.id}: ${location.file}`);
  return { ...location, line: text.slice(0, index).split('\n').length };
}) }));
const snapshot = {
  reviewDate: '2026-11-03', baseCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  status: 'pending-expert-review', sourceHashNormalization: 'utf8-lf', sourceFiles,
  originalCase1: CASE_1_DETAILS, ehrCase1: CASE_1_EHR,
  medicationChoices: MEDICATION_CHOICES, medicationSteps: MEDICATION_PREPARATION_STEPS,
  cases: caseRegistry.map(config => ({ id: config.id, title: config.title, gradable: config.gradable, clinicalStatus: config.clinicalStatus, initialVitals: config.initialVitals, monitorTraces: config.monitorTraces, findings: config.findings, missions: config.missions })),
  questions, knowledgeTopics: LEARNING_VIDEOS.map(topic => ({ ...topic, reviewStatus: 'pending' })), findings: locatedFindings,
};
const rows = [
  ...locatedFindings.map(finding => [finding.id, 'clinical-finding', finding.title, finding.reviewerRole]),
  ...caseRegistry.map((config, index) => [`CASE-${index + 1}`, 'complete-scenario', config.title, 'อาจารย์พยาบาล/แพทย์ผู้รับผิดชอบเคส']),
  ...questions.map(question => [question.reviewId, 'quiz-item', question.question, 'ผู้เชี่ยวชาญเนื้อหาและการวัดผล']),
  ...LEARNING_VIDEOS.map(topic => [`KNOW-${String(topic.id).padStart(2, '0')}`, 'knowledge-topic', topic.title, 'อาจารย์ผู้รับผิดชอบเนื้อหา']),
];
const csv = (values: string[]) => values.map(value => `"${value.replaceAll('"', '""')}"`).join(',');
const checklist = '\ufeff' + [csv(['review_id', 'type', 'item', 'reviewer_role', 'status', 'reviewer_name', 'reviewer_credentials', 'review_date', 'decision', 'approved_wording_or_key', 'evidence_or_local_protocol', 'notes']), ...rows.map(row => csv([...row, 'pending', '', '', '', '', '', '', '']))].join('\r\n') + '\r\n';
const checklistPath = `${directory}/review-checklist.csv`;
if (existsSync(checklistPath)) {
  const existing = readFileSync(checklistPath, 'utf8');
  if (existing !== checklist) throw new Error('Checklist contains edits. Save a versioned review copy and move the edited CSV before exporting a new review packet.');
}
writeFileSync(`${directory}/content-snapshot.json`, JSON.stringify(snapshot, null, 2) + '\n');
writeFileSync(checklistPath, checklist);
writeFileSync(`${directory}/knowledge-topics.md`, ['# ตรวจสรุปใบความรู้ 6 หัวข้อ', '', 'ทุกหัวข้อรอผู้เชี่ยวชาญรับรอง เนื้อหานี้เป็นข้อความเดิมในโครงการ', '', ...LEARNING_VIDEOS.flatMap(topic => [`## KNOW-${String(topic.id).padStart(2, '0')} · ${topic.title}`, '', topic.description, '', ...topic.topics.map(item => `- ${item}`), ''])].join('\n'));
const quizText = ['# ตรวจข้อสอบก่อนเรียนและหลังเรียน', '', 'สถานะทุกข้อ: รอผู้เชี่ยวชาญตรวจ คำตอบด้านล่างเป็น key ที่มีอยู่ในโค้ด ไม่ใช่ผลรับรอง', '', ...questions.flatMap(question => [
  `## ${question.reviewId}`, '', question.question, '', ...question.options.map(option => `- ${option.key}. ${option.text}`), '', `**Key เดิม:** ${question.correctAnswer}`, '', `**คำอธิบายเดิม:** ${question.explanation}`, '', 'ผู้ตรวจต้องระบุ: ความถูกต้องของโจทย์/ตัวเลือก/เฉลย ความกำกวม หลักฐาน และข้อความที่อนุมัติ ลงใน review-checklist.csv', '',
])].join('\n');
writeFileSync(`${directory}/questions.md`, quizText);
const findingsText = ['# จุดที่ต้องให้ผู้เชี่ยวชาญตัดสิน', '', 'การตรวจเบื้องต้นนี้ยังไม่อนุมัติคำสั่งยา เฉลย หรือ protocol ใด ๆ', '', ...locatedFindings.flatMap(finding => [
  `## ${finding.id} · ${finding.title}`, '', finding.question, '', `**ผู้ตรวจ:** ${finding.reviewerRole} · **สถานะ:** ${finding.status}`, '', ...finding.locations.map(location => `- [${location.file}:${location.line}](../../${location.file}#L${location.line})`), '', `**อ้างอิง:** ${finding.referenceIds.length ? finding.referenceIds.join(', ') + ' — ดู references.md' : 'ข้อมูลภายในโครงการ/รอเอกสารของทีม'}`, '',
])].join('\n');
writeFileSync(`${directory}/findings.md`, findingsText);
console.log(`Exported ${questions.length} questions, ${caseRegistry.length} cases, ${findings.length} findings and ${rows.length} pending checklist rows.`);
