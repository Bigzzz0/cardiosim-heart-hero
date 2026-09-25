export const MISSION_STATES = ['CASE_INTRO', 'PATIENT_INFORMATION', 'ASSESSMENT', 'DIAGNOSIS', 'NURSING_INTERVENTION', 'MEDICATION', 'IO_BALANCE', 'EMERGENCY_TRANSITION', 'ABC_ASSESSMENT', 'ECG_PLACEMENT', 'ECG_INTERPRETATION', 'EMERGENCY_TREATMENT', 'PATIENT_STABILIZED', 'CASE_SUMMARY'] as const;
export type MissionState = typeof MISSION_STATES[number];
export interface VitalSigns { hr: number | null; bpSystolic: number | null; bpDiastolic: number | null; rr: number | null; spo2: number | null }
export type ClinicalDataStatus = 'demo-derived' | 'missing';
export interface PatientState {
  condition: 'stable' | 'unstable' | 'critical';
  breathing: 'normal' | 'labored' | 'severe';
  posture: 'supine' | 'semi_fowler' | 'fowler';
  animation: 'idle' | 'dyspnea' | 'critical' | 'recovering';
}
export interface Point { x: number; y: number }
export interface Hotspot extends Point { id: string; label: string; radius: number }
export interface ToolVisual {
  heldSize: Point;
  heldOffset: Point;
  contactSize: Point;
  contactOffset: Point;
  contactAngle: number;
  contactEffect: 'listen' | 'pressure' | 'sensor' | 'inspect';
}
export interface MedicalTool { id: string; name: string; icon: 'interview' | 'stethoscope' | 'bp' | 'spo2' | 'hand'; sprite?: string; visual?: ToolVisual; allowedTargets: string[]; duration: number }
export type ChartSection = 'History' | 'Vital Signs' | 'Respiratory Assessment' | 'Perfusion Assessment' | 'Care Plan' | 'Medication' | 'Intake / Output' | 'ECG';
export interface Finding { id: string; section: ChartSection; title: string; text: string; source: string; captureVitals?: boolean }
export interface ChartEntry extends Finding { at: number; mission: MissionState; vitals?: VitalSigns }
export interface Objective { id: string; label: string; tool: string; target: string; finding: string; feedback: string; sound?: 'auscultation' | 'success' }
export interface MissionEffect { patient?: Partial<PatientState>; vitals?: Partial<VitalSigns>; duration?: number; alarm?: boolean; emergency?: boolean }
export interface DecisionSlot { id: string; label: string; expected: string }
export type DecisionPresentation = 'bedside-clipboard' | 'monitor-response';
export type ActivityPresentation = 'medication-station' | 'io-board' | 'ecg-console';
export type ActivityEquipmentIcon = 'order' | 'ampoule' | 'aseptic' | 'syringe' | 'double-check' | 'patient-id' | 'monitor' | 'intake' | 'output' | 'ecg';
export interface ActivityStepInteraction { kind: 'syringe-withdrawal'; targetId: string; targetAmount: number; scaleMax: number; accuracyWindow: number; unit: 'mL' }
export interface ActivityStepProgress { toolPlaced: boolean; amount: number }
export interface ActivityStep { id: string; label: string; detail: string; equipmentLabel: string; icon: ActivityEquipmentIcon; interaction?: ActivityStepInteraction }
export interface ActivityItem { id: string; label: string; zoneId: string }
export interface ActivityZone { id: string; label: string }
export interface Decision { options: { id: string; label: string; detail: string; icon?: 'assessment' | 'position' | 'monitor' | 'medication' | 'care' | 'device' }[]; expected: string[]; ordered: boolean; explanation: string; success: string; slots?: DecisionSlot[]; answerMode?: 'select' | 'drag-slot'; presentation?: DecisionPresentation }
export interface ActivityConfig {
  kind: 'matching' | 'fluid-balance' | 'medication' | 'text-response';
  presentation?: ActivityPresentation;
  steps?: ActivityStep[];
  items?: ActivityItem[];
  zones?: ActivityZone[];
  allowMissingDataAcknowledgement?: boolean;
  eyebrow: string;
  title: string;
  dataStatus?: ClinicalDataStatus;
  source?: string;
  gradable?: boolean;
  expectedResponses?: Record<string, string>;
  success?: string;
  explanation?: string;
  notice?: string;
  rows?: { label: string; value: string }[];
  fields?: { id: string; label: string; placeholder: string; type: 'text' | 'number' | 'select'; options?: string[] }[];
  responseKey?: string;
}
export interface MissionDefinition {
  id: MissionState;
  title: string;
  phase: string;
  description: string;
  hint: string;
  kind: 'intro' | 'interaction' | 'transition' | 'placement' | 'decision' | 'summary';
  objectives?: Objective[];
  ordered?: boolean;
  decision?: Decision;
  activity?: ActivityConfig;
  chartFinding?: string;
  onEnter?: MissionEffect;
  autoAfter?: number;
  minDuration?: number;
  button?: string;
  dataStatus?: ClinicalDataStatus;
  gradable?: boolean;
}
export interface ECGTarget extends Point { id: string; label: string; snapRadius: number; hint: string; mobileLabel: Point }
export interface ECGBoardLayout {
  board: { x: number; y: number; width: number; height: number };
  image: { x: number; y: number; width: number; height: number };
  tray: { x: number; y: number; spacing: number };
}
export interface GameCase {
  id: string;
  version: number;
  title: string;
  clinicalStatus: string;
  gradable: boolean;
  sources: string[];
  assets: { room: string; patient: string; patientCritical: string; ecgLeads: string; ecgChest: string };
  initialVitals: VitalSigns;
  initialPatient: PatientState;
  monitorTraces?: Partial<Record<PatientState['condition'], { rhythm: 'NORMAL' | 'SINUS_TACHY' | 'SVT' | 'VT'; heartRate: number }>>;
  tools: MedicalTool[];
  hotspots: Hotspot[];
  findings: Finding[];
  ecg: { targets: ECGTarget[]; finding: string; label: string; layout: ECGBoardLayout };
  missions: MissionDefinition[];
  scoring: { initial: number; mistakePenalty: number; hintPenalty: number };
  scenarios: { id: string; title: string; summary: string; enabled: boolean; status: string }[];
}
export interface Feedback { kind: 'info' | 'success' | 'error'; text: string }
export interface ScoreData { mistakeCount: number; hintCount: number; attempts: number; completionTime: number | null }
export interface InteractionEventData {
  toolId: string | null;
  targetId: string | null;
  point: Point | null;
  phase: 'started' | 'rejected' | 'completed';
  objectiveId?: string;
  reason?: string;
  message?: string;
}
export interface InteractionPreview {
  toolId: string | null;
  targetId: string | null;
  point: Point;
  outcome: 'valid' | 'invalid' | 'duplicate';
  objectiveId?: string;
  reason?: string;
  objective?: Objective;
}
export interface GameEvent { type: string; at: number; detail: string; interaction?: InteractionEventData }
export interface Checkpoint {
  version: number; caseId: string; mission: MissionState; completed: string[]; chart: ChartEntry[];
  leads: string[]; score: ScoreData; elapsed: number; phaseElapsed: number; emergencyElapsed: number;
  vitals: VitalSigns; decisions: string[]; decisionConfirmed: boolean; responses: Record<string, string>;
  activitySteps: string[]; activityPlacements: Record<string, string>; activityStepProgress: Record<string, ActivityStepProgress>;
}

export type { GameResult } from '../types/game';
