import { GameTelemetry } from '../types/game';

export function calculateHakeGain(preScore: number, postScore: number, maxScore = 10): number {
  if (maxScore - preScore <= 0) return 0;
  const gain = (postScore - preScore) / (maxScore - preScore);
  return Number(Math.max(0, Math.min(1, gain)).toFixed(2));
}

export function exportTelemetryToCSV(telemetry: GameTelemetry) {
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
    'sus_q1',
    'sus_q2',
    'sus_q3',
    'sus_q4',
    'sus_q5',
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

  const values = [
    `"${telemetry.student.studentId || 'ANONYMOUS'}"`,
    `"${telemetry.student.name || 'ไม่ระบุ'}"`,
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
    telemetry.surveyScores['sus_1'] || 5,
    telemetry.surveyScores['sus_2'] || 1,
    telemetry.surveyScores['sus_3'] || 5,
    telemetry.surveyScores['sus_4'] || 1,
    telemetry.surveyScores['sus_5'] || 5,
    `"${telemetry.completedAt || new Date().toISOString()}"`
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
