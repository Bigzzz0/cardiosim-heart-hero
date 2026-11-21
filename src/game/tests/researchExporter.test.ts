import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildResearchCSV,
  buildResearchExportPayload,
  calculateHakeGain,
} from '../../services/researchExporter';
import type { GameTelemetry } from '../../types/game';

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      cells.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  cells.push(current);
  return cells;
}

test('calculateHakeGain clamps between 0 and 1 and guards max preScore', () => {
  assert.equal(calculateHakeGain(4, 10), 1);
  assert.equal(calculateHakeGain(4, 7), 0.5);
  assert.equal(calculateHakeGain(10, 10), 0);
  assert.equal(calculateHakeGain(8, 5), 0);
});

test('buildResearchCSV exports Case 2 unscored gameResult, 10-item survey, escaped feedback, and no fabricated NCJMM scores', () => {
  const telemetry: GameTelemetry = {
    student: {
      studentId: '66010999',
      name: 'นศ.พ. ทดสอบ ระบบ',
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
    totalTimeSeconds: 300,
    surveyScores: {
      q1: 5,
      q2: 4,
      q3: 5,
      q4: 5,
      q5: 4,
      q6: 5,
      q7: 4,
      q8: 5,
      q9: 5,
      q10: 5,
    },
    feedbackText: 'ดีมาก "เข้าใจง่าย"\nอยากให้เพิ่มเสียงบรรยาย',
    completedAt: '2026-11-21T02:30:00.000Z',
    gameResult: {
      caseId: 'case-02',
      completedAt: '2026-11-21T02:25:00.000Z',
      durationMs: 180_000,
      attempts: 12,
      mistakes: 0,
      hints: 2,
      findings: ['history', 'lungs', 'cpr-started', 'ecg'],
      clinicalStatus: 'CASE 02 · รอบฝึก',
      demoScore: null,
      scoreStatus: 'unscored',
    },
  };

  const csv = buildResearchCSV(telemetry);
  assert(csv.startsWith('\uFEFF'), 'CSV must start with UTF-8 BOM for Thai Excel/SPSS support');
  const lines = csv.slice(1).split('\n');
  assert.equal(lines.length, 2, 'CSV must stay strictly 2 lines (header + 1 student row)');

  const headers = parseCsvLine(lines[0]);
  const values = parseCsvLine(lines[1]);
  assert.equal(values.length, headers.length);

  const row = Object.fromEntries(headers.map((h, i) => [h, values[i]]));
  assert.equal(row.student_id, '66010999');
  assert.equal(row.student_institution, 'คณะพยาบาลศาสตร์ มหาวิทยาลัยขอนแก่น');
  assert.equal(row.case_id, 'case-02');
  assert.equal(row.game_score_status, 'unscored');
  assert.equal(row.game_demo_score, '');
  assert.equal(row.game_duration_minutes, '3.00');
  assert.equal(row.game_attempts, '12');
  assert.equal(row.game_mistakes, '0');
  assert.equal(row.game_hints, '2');
  assert.equal(row.game_findings_count, '4');
  assert.equal(row.ncjmm_recognize_cues, '', 'Must not fabricate hardcoded 95/90 NCJMM scores');
  assert.equal(row.survey_q1, '5');
  assert.equal(row.survey_q10, '5');
  assert.equal(row.survey_domain1_mean, '4.6');
  assert.equal(row.survey_domain2_mean, '4.67');
  assert.equal(row.survey_domain3_mean, '5');
  assert.equal(row.survey_overall_mean, '4.7');
  assert.equal(row.feedback_text, 'ดีมาก "เข้าใจง่าย" อยากให้เพิ่มเสียงบรรยาย');

  const payload = buildResearchExportPayload(telemetry);
  assert.equal(payload.ncjmmScores, undefined);
  assert.equal(payload.surveySummary.overallMean, 4.7);
});
