import { GameTelemetry } from '../types/game';
import { ALL_SURVEY_ITEMS, computeSurveySummary } from '../data/surveyData';

function csvEscape(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function calculateHakeGain(preScore: number, postScore: number, maxScore = 10): number {
  if (maxScore - preScore <= 0) return 0;
  const gain = (postScore - preScore) / (maxScore - preScore);
  return Number(Math.max(0, Math.min(1, gain)).toFixed(2));
}

export function exportTelemetryToCSV(telemetry: GameTelemetry) {
  const surveyHeaders = ALL_SURVEY_ITEMS.map((item) => `survey_${item.id}`);
  const headers = [
    'student_id',
    'student_name',
    'pre_test_score',
    'post_test_score',
    'normalized_learning_gain',
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
    'completed_timestamp'
  ];

  const ncjmm = telemetry.ncjmmScores || {
    recognizeCues: 95,
    analyzeCues: 90,
    prioritizeHypotheses: 85,
    generateSolutions: 90,
    takeAction: 95,
    evaluateOutcomes: 90
  };

  const surveySummary = computeSurveySummary(telemetry.surveyScores);
  const surveyValues = ALL_SURVEY_ITEMS.map(
    (item) => telemetry.surveyScores[item.id] ?? ''
  );

  const values = [
    csvEscape(telemetry.student.studentId || 'ANONYMOUS'),
    csvEscape(telemetry.student.name || 'ไม่ระบุ'),
    telemetry.preTestScore,
    telemetry.postTestScore,
    telemetry.learningGain,
    ncjmm.recognizeCues,
    ncjmm.analyzeCues,
    ncjmm.prioritizeHypotheses,
    ncjmm.generateSolutions,
    ncjmm.takeAction,
    ncjmm.evaluateOutcomes,
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
    csvEscape(telemetry.completedAt || new Date().toISOString())
  ];

  const csvContent = '\uFEFF' + headers.join(',') + '\n' + values.join(',');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `cardiosim_research_data_${telemetry.student.studentId || 'export'}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTelemetryToJSON(telemetry: GameTelemetry) {
  const dataToExport = {
    ...telemetry,
    surveySummary: computeSurveySummary(telemetry.surveyScores),
    ncjmmScores: telemetry.ncjmmScores || {
      recognizeCues: 95,
      analyzeCues: 90,
      prioritizeHypotheses: 85,
      generateSolutions: 90,
      takeAction: 95,
      evaluateOutcomes: 90
    }
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', `cardiosim_telemetry_${telemetry.student.studentId || 'export'}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
