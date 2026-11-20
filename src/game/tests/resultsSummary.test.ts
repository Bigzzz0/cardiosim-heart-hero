import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildResultsSummary,
  formatDurationMs,
  resolveResultCaseKind,
} from '../../data/resultsSummary';

test('resolveResultCaseKind classifies Case 1, Case 2, and missing ids accurately', () => {
  assert.equal(resolveResultCaseKind('case-01'), 'case-01');
  assert.equal(resolveResultCaseKind('cardiosim-vertical-slice'), 'case-01');
  assert.equal(resolveResultCaseKind('case-02'), 'case-02');
  assert.equal(resolveResultCaseKind('case-02-acute-decompensated-heart-failure'), 'case-02');
  assert.equal(resolveResultCaseKind(undefined), 'unknown');
});

test('formatDurationMs formats milliseconds as MM:SS and handles invalid input', () => {
  assert.equal(formatDurationMs(0), '00:00 นาที');
  assert.equal(formatDurationMs(125_000), '02:05 นาที');
  assert.equal(formatDurationMs(undefined), '—');
  assert.equal(formatDurationMs(-10), '—');
});

test('buildResultsSummary adapts milestones and unscored status for Case 2 without Case 1 leaks', () => {
  const summary = buildResultsSummary({
    caseId: 'case-02',
    completedAt: '2026-11-21T02:00:00.000Z',
    durationMs: 245_000,
    attempts: 14,
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
  });

  assert.equal(summary.caseKind, 'case-02');
  assert.equal(summary.caseCode, 'CASE 02');
  assert.equal(summary.isUnscored, true);
  assert.equal(summary.completedStepsCount, 6);
  assert.equal(summary.totalStepsCount, 6);
  assert.equal(summary.durationLabel, '04:05 นาที');
  assert(summary.milestones.some((m) => m.title.includes('Amiodarone')));
  assert(summary.milestones.some((m) => m.title.includes('+700 mL')));
  assert(summary.milestones.some((m) => m.title.includes('CPR')));
  assert(summary.milestones.every((m) => !m.title.includes('-200 mL') && !m.title.includes('SVT')));
  assert(summary.milestones.every((m) => m.badgeText === 'บันทึกการฝึกแล้ว'));
});

test('buildResultsSummary tracks partial Case 1 completion and avoids fabricating findings when absent', () => {
  const partialCase1 = buildResultsSummary({
    caseId: 'case-01',
    completedAt: '2026-11-21T02:00:00.000Z',
    durationMs: 90_000,
    attempts: 5,
    mistakes: 2,
    hints: 0,
    findings: ['history', 'lungs', 'bp', 'oxygen'],
    clinicalStatus: 'CASE 01 · DEMO DATA',
    demoScore: 94,
    scoreStatus: 'demo',
  });

  assert.equal(partialCase1.caseKind, 'case-01');
  assert.equal(partialCase1.isUnscored, false);
  assert.equal(partialCase1.completedStepsCount, 2);
  assert.equal(partialCase1.milestones[0].completed, true);
  assert.equal(partialCase1.milestones[1].completed, true);
  assert.equal(partialCase1.milestones[2].completed, false);

  const absent = buildResultsSummary(undefined);
  assert.equal(absent.hasGameResult, false);
  assert.equal(absent.completedStepsCount, 0);
  assert(absent.milestones.every((m) => m.completed === false));
});
