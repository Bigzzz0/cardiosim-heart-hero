import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const snapshot = JSON.parse(readFileSync('docs/clinical-review/content-snapshot.json', 'utf8'));
assert.equal(snapshot.status, 'pending-expert-review');
assert.equal(snapshot.sourceHashNormalization, 'utf8-lf');
assert.equal(snapshot.questions.length, 20);
assert.equal(snapshot.cases.length, 2);
assert.equal(snapshot.findings.length, 12);
assert.equal(snapshot.knowledgeTopics.length, 6);
assert(snapshot.knowledgeTopics.every(topic => topic.reviewStatus === 'pending'));
for (const { file, sha256 } of snapshot.sourceFiles) {
  assert.equal(createHash('sha256').update(readFileSync(file, 'utf8').replace(/\r\n/g, '\n')).digest('hex'), sha256, `Clinical review snapshot is stale: ${file}`);
}
for (const question of snapshot.questions) {
  assert.equal(question.reviewStatus, 'pending');
  assert(question.options.some(option => option.key === question.correctAnswer), `Missing current key for ${question.reviewId}`);
}
for (const finding of snapshot.findings) {
  assert.equal(finding.status, 'pending');
  assert(finding.locations.length > 0);
  for (const location of finding.locations) assert(readFileSync(location.file, 'utf8').split('\n')[location.line - 1]?.includes(location.anchor), `Review location moved: ${finding.id}`);
}
assert.equal(snapshot.cases[1].gradable, false, 'Case 2 must retain its unscored status');
assert(Object.values(snapshot.cases[1].initialVitals).every(value => value === null));
const csv = readFileSync('docs/clinical-review/review-checklist.csv', 'utf8');
assert(csv.startsWith('\ufeff'), 'Checklist must preserve Thai text in spreadsheet applications');
assert.equal(csv.trim().split(/\r?\n/).length, 41, 'Expected header and 40 review rows');
console.log(`PASS: ${snapshot.sourceFiles.length} source hashes, 2 cases, 20 questions, 6 topics and 40 checklist rows. Snapshot status remains pending expert review.`);
