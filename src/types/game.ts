export type GameStage = 
  | 'LANDING'
  | 'PRETEST'
  | 'LEARNING_HUB'
  | 'SCENARIO_SELECT'
  | 'MISSION_BRIEF'
  | 'STAGE1_HANDOVER'
  | 'STAGE2_ASSESSMENT'
  | 'STAGE3_PRIORITIZATION'
  | 'STAGE4_RATIONALE'
  | 'STAGE5_ABC_ACTION'
  | 'STAGE6_MEDICATION'
  | 'STAGE7_IO_RECORD'
  | 'STAGE8_CRISIS_EVENT'
  | 'STAGE9_DEBRIEF'
  | 'POSTTEST'
  | 'RESULTS_DASHBOARD'
  | 'SURVEY';

export interface StudentProfile {
  studentId: string;
  name: string;
  institution?: string;
}

export interface GameResult {
  caseId: string;
  completedAt: string;
  durationMs: number;
  attempts: number;
  mistakes: number;
  hints: number;
  findings: string[];
  clinicalStatus: string;
  demoScore: number | null;
  scoreStatus: 'demo' | 'unscored';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    key: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation: string;
  image?: string;
}

export interface LearningVideo {
  id: number;
  title: string;
  duration: string;
  description: string;
  topics: string[];
  iconKey: 'heart' | 'stethoscope' | 'activity' | 'bed' | 'pill' | 'clipboard';
  watched: boolean;
}

export interface ClinicalHotspot {
  id: string;
  title: string;
  subtitle: string;
  x: number; // % from left
  y: number; // % from top
  type: 'lung' | 'heart' | 'edema' | 'monitor' | 'lab';
  finding: string;
  detail: string;
  audioSound?: 'crepitation' | 's3_gallop' | 'heart_beep';
  discovered: boolean;
}

export interface NursingDiagnosisCard {
  id: string;
  title: string;
  description: string;
  correctRank: number; // 1 = highest priority
  matchedCues: string[];
}

export interface ClinicalCue {
  id: string;
  label: string;
  category: 'subjective' | 'objective' | 'vital' | 'lab';
  belongsToDiagnosisId: string;
}

export interface MedicationStep {
  id: string;
  stepNumber: number;
  text: string;
  category: 'check' | 'prep' | 'administer' | 'monitor';
}

export interface IORecordEntry {
  intakeIV: number;
  intakeOral: number;
  outputUrine: number;
  userBalance?: number;
}

export interface SurveyRating {
  id: string;
  question: string;
  score: number; // 1-5
}

export interface NCJMMCompetencyScore {
  recognizeCues: number;      // 0-100%
  analyzeCues: number;        // 0-100%
  prioritizeHypotheses: number;// 0-100%
  generateSolutions: number;  // 0-100%
  takeAction: number;         // 0-100%
  evaluateOutcomes: number;   // 0-100%
  overallJudgmentScore?: number;
}

export interface ClinicalHint {
  stage: GameStage;
  observationHint: string;
  pathophysiologyHint: string;
}

export interface EHRRecord {
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  bedNumber: string;
  diagnosis: string;
  allergies: string;
  attendingPhysician: string;
  admissionDate: string;
  doctorOrders: {
    id: string;
    orderText: string;
    type: 'stat' | 'routine' | 'prn';
    orderedTime: string;
    signedBy: string;
    status: 'completed' | 'in_progress' | 'pending';
  }[];
  labResults: {
    testName: string;
    value: string;
    unit: string;
    referenceRange: string;
    isAbnormal: boolean;
    clinicalSignificance: string;
  }[];
  imagingReport: {
    modality: string;
    findings: string;
    impression: string;
  };
  marList: {
    drugName: string;
    dosage: string;
    route: string;
    schedule: string;
    lastAdministered: string;
    nurseSignature: string;
  }[];
}

export interface GameTelemetry {
  student: StudentProfile;
  preTestScore: number;
  preTestAnswers: Record<number, string>;
  postTestScore: number;
  postTestAnswers: Record<number, string>;
  learningGain: number; // Hake's gain
  discoveredHotspots: string[];
  prioritizationErrors: number;
  medicationErrors: number;
  ioErrors: number;
  crisisResponseTimeSeconds: number;
  totalTimeSeconds: number;
  ncjmmScores?: NCJMMCompetencyScore;
  hintsUsedCount?: number;
  surveyScores: Record<string, number>;
  feedbackText: string;
  completedAt?: string;
  gameResult?: GameResult;
}
