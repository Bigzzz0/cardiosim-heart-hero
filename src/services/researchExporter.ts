import { GameTelemetry } from '../types/game';
import { ALL_SURVEY_ITEMS, computeSurveySummary } from '../data/surveyData';

function csvEscape(value: string): string {
  const singleLine = value.replace(/\r?\n/g, ' ');
  return `"${singleLine.replace(/"/g, '""')}"`;
}

export function calculateHakeGain(preScore: number, postScore: number, maxScore = 10): number {
  if (maxScore - preScore <= 0) return 0;
  const gain = (postScore - preScore) / (maxScore - preScore);
  return Number(Math.max(0, Math.min(1, gain)).toFixed(2));
}

export function buildResearchCSV(telemetry: GameTelemetry): string {
  const surveyHeaders = ALL_SURVEY_ITEMS.map((item) => `survey_${item.id}`);
  const headers = [
    'student_id',
    'student_name',
    'student_institution',
    'pre_test_score',
    'post_test_score',
    'normalized_learning_gain',
    'case_id',
    'game_score_status',
    'game_demo_score',
    'game_duration_minutes',
    'game_attempts',
    'game_mistakes',
    'game_hints',
    'game_findings_count',
    'game_clinical_status',
    'ncjmm_recognize_cues',
    'ncjmm_analyze_cues',
    'ncjmm_prioritize_hypotheses',
    'ncjmm_generate_solutions',
    'ncjmm_take_action',
    'ncjmm_evaluate_outcomes',
    'total_time_minutes',
    'hotspots_discovered',
    'prioritization_errors',
    'medication_errors',
    'io_errors',
    ...surveyHeaders,
    'survey_domain1_mean',
    'survey_domain2_mean',
    'survey_domain3_mean',
    'survey_overall_mean',
    'feedback_text',
    'completed_timestamp',
  ];

  const game = telemetry.gameResult;
  const ncjmm = telemetry.ncjmmScores;
  const surveySummary = computeSurveySummary(telemetry.surveyScores);
  const surveyValues = ALL_SURVEY_ITEMS.map(
    (item) => telemetry.surveyScores[item.id] ?? ''
  );

  const values = [
    csvEscape(telemetry.student.studentId || 'ANONYMOUS'),
    csvEscape(telemetry.student.name || 'ไม่ระบุ'),
    csvEscape(telemetry.student.institution || ''),
    telemetry.preTestScore,
    telemetry.postTestScore,
    telemetry.learningGain,
    csvEscape(game?.caseId || ''),
    csvEscape(game?.scoreStatus || ''),
    game?.demoScore ?? '',
    game ? (game.durationMs / 60000).toFixed(2) : '',
    game?.attempts ?? '',
    game?.mistakes ?? '',
    game?.hints ?? '',
    game?.findings.length ?? '',
    csvEscape(game?.clinicalStatus || ''),
    ncjmm?.recognizeCues ?? '',
    ncjmm?.analyzeCues ?? '',
    ncjmm?.prioritizeHypotheses ?? '',
    ncjmm?.generateSolutions ?? '',
    ncjmm?.takeAction ?? '',
    ncjmm?.evaluateOutcomes ?? '',
    (telemetry.totalTimeSeconds / 60).toFixed(1),
    telemetry.discoveredHotspots.length,
    telemetry.prioritizationErrors,
    telemetry.medicationErrors,
    telemetry.ioErrors,
    ...surveyValues,
    surveySummary.domainMeans.domain1 ?? '',
    surveySummary.domainMeans.domain2 ?? '',
    surveySummary.domainMeans.domain3 ?? '',
    surveySummary.overallMean ?? '',
    csvEscape(telemetry.feedbackText || ''),
    csvEscape(telemetry.completedAt || new Date().toISOString()),
  ];

  return '\uFEFF' + headers.join(',') + '\n' + values.join(',');
}

export function buildResearchExportPayload(telemetry: GameTelemetry) {
  return {
    ...telemetry,
    surveySummary: computeSurveySummary(telemetry.surveyScores),
  };
}

export function exportTelemetryToCSV(telemetry: GameTelemetry) {
  const csvContent = buildResearchCSV(telemetry);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `cardiosim_research_data_${telemetry.student.studentId || 'export'}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportTelemetryToJSON(telemetry: GameTelemetry) {
  const dataToExport = buildResearchExportPayload(telemetry);
  const dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(dataToExport, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute(
    'download',
    `cardiosim_telemetry_${telemetry.student.studentId || 'export'}.json`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
