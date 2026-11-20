import { GameResult } from '../types/game';

export type ResultCaseKind = 'case-01' | 'case-02' | 'unknown';

export interface ResultMilestone {
  id: string;
  title: string;
  detail: string;
  requiredFindings: string[];
  completed: boolean;
  badgeText: string;
}

export interface ResultsSummaryViewModel {
  caseKind: ResultCaseKind;
  caseCode: string;
  caseTitle: string;
  clinicalStatusNote: string;
  statusBadgeText: string;
  isUnscored: boolean;
  hasGameResult: boolean;
  durationLabel: string;
  completedStepsCount: number;
  totalStepsCount: number;
  completionPercent: number;
  milestones: ResultMilestone[];
}

export function resolveResultCaseKind(caseId?: string): ResultCaseKind {
  if (!caseId) return 'unknown';
  const normalized = caseId.toLowerCase();
  if (normalized.includes('case-02') || normalized.includes('case2') || normalized.includes('acute-decompensated')) {
    return 'case-02';
  }
  if (normalized.includes('case-01') || normalized.includes('case1') || normalized.includes('vertical-slice')) {
    return 'case-01';
  }
  return 'unknown';
}

export function formatDurationMs(durationMs?: number): string {
  if (typeof durationMs !== 'number' || !Number.isFinite(durationMs) || durationMs < 0) {
    return '—';
  }
  const totalSeconds = Math.round(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} นาที`;
}

interface MilestoneSpec {
  id: string;
  title: string;
  detail: string;
  requiredFindings: string[];
}

const CASE_01_MILESTONES: MilestoneSpec[] = [
  {
    id: 'history',
    title: 'การซักประวัติและรับข้อมูลผู้ป่วย',
    detail: 'รับฟังอาการสำคัญและบันทึกข้อมูลตั้งต้นลง Patient Chart',
    requiredFindings: ['history'],
  },
  {
    id: 'assessment',
    title: 'การตรวจร่างกายและประเมินสัญญาณชีพ',
    detail: 'ฟังเสียงปอด (Fine crackles), วัด BP และวัด SpO₂',
    requiredFindings: ['lungs', 'bp', 'oxygen'],
  },
  {
    id: 'care-plan',
    title: 'การจัดวางข้อวินิจฉัยและแผนการพยาบาล',
    detail: 'จับคู่ปัญหาทางการพยาบาล ข้อมูลสนับสนุน และการดูแลเบื้องต้น',
    requiredFindings: ['diagnosis', 'nursing-care'],
  },
  {
    id: 'medication',
    title: 'การเตรียมและบริหารยา Furosemide (Lasix)',
    detail: 'ตรวจคำสั่งแพทย์ เตรียมยา และบันทึกการเฝ้าระวังผลข้างเคียง',
    requiredFindings: ['medication'],
  },
  {
    id: 'io',
    title: 'การบันทึกสมดุลสารน้ำ Intake / Output',
    detail: 'คำนวณสารน้ำเข้า-ออกและระบุแนวโน้มสมดุลสารน้ำ',
    requiredFindings: ['io'],
  },
  {
    id: 'emergency',
    title: 'การประเมิน ABC, ติด 12-Lead ECG และรับมือภาวะวิกฤต',
    detail: 'ประเมิน A→B→C ติด V1–V6 อ่านผลจังหวะหัวใจ และเลือกการตอบสนองฉุกเฉิน',
    requiredFindings: ['airway', 'breathing', 'circulation', 'ecg', 'emergency-treatment'],
  },
];

const CASE_02_MILESTONES: MilestoneSpec[] = [
  {
    id: 'history',
    title: 'การรับข้อมูลแรกรับ (AF with RVR ร่วมกับ ADHF)',
    detail: 'ซักประวัติผู้ป่วยชาย 68 ปี ประวัติ Heart Failure และ Hypertension',
    requiredFindings: ['history'],
  },
  {
    id: 'assessment',
    title: 'การประเมินอาการและสัญญาณชีพ',
    detail: 'ตรวจเสียงปอด fine crackles, บันทึก BP 148/88 mmHg และ SpO₂ 90% RA',
    requiredFindings: ['lungs', 'bp', 'oxygen'],
  },
  {
    id: 'care-plan',
    title: 'การจัดลำดับข้อวินิจฉัย 4 ข้อและจับคู่การพยาบาล',
    detail: 'เรียงข้อวินิจฉัยพร้อมข้อมูลสนับสนุน และจับคู่การพยาบาลครบ 4 ข้อ',
    requiredFindings: ['diagnosis', 'nursing-care'],
  },
  {
    id: 'medication',
    title: 'การทบทวนความปลอดภัยของยา Amiodarone',
    detail: 'อ่าน Doctor Order และบันทึกผลข้างเคียงพร้อมการพยาบาลที่ต้องเฝ้าระวัง',
    requiredFindings: ['medication'],
  },
  {
    id: 'io',
    title: 'การบันทึกสมดุลสารน้ำ I/O 24 ชั่วโมง (+700 mL)',
    detail: 'จัดกลุ่มสารน้ำเข้า 1,300 mL เทียบปัสสาวะออก 600 mL (Positive fluid balance)',
    requiredFindings: ['io'],
  },
  {
    id: 'emergency',
    title: 'การช่วยชีวิตฉุกเฉิน: เริ่ม CPR ทันที, ติด ECG และเตรียม Defibrillator',
    detail: 'ประเมิน A→B→C เริ่ม CPR เมื่อคลำชีพจรไม่พบ ฝึกติด V1–V6 และจัดการ์ดช่วยชีวิต',
    requiredFindings: ['cpr-started', 'ecg', 'emergency-treatment'],
  },
];

export function buildResultsSummary(gameResult?: GameResult): ResultsSummaryViewModel {
  const caseKind = resolveResultCaseKind(gameResult?.caseId);
  const hasGameResult = Boolean(gameResult);
  const isUnscored = gameResult?.scoreStatus === 'unscored' || caseKind === 'case-02';
  const findingsSet = new Set(gameResult?.findings ?? []);

  const specs = caseKind === 'case-02' ? CASE_02_MILESTONES : CASE_01_MILESTONES;
  const doneBadge = isUnscored ? 'บันทึกการฝึกแล้ว' : 'ครบขั้น (เดโม)';
  const pendingBadge = hasGameResult ? 'ยังไม่พบในบันทึก' : 'รอบบันทึกจากเกม';

  const milestones: ResultMilestone[] = specs.map((spec) => {
    const completed =
      hasGameResult && spec.requiredFindings.every((findingId) => findingsSet.has(findingId));
    return {
      ...spec,
      completed,
      badgeText: completed ? doneBadge : pendingBadge,
    };
  });

  const completedStepsCount = milestones.filter((m) => m.completed).length;
  const totalStepsCount = milestones.length;
  const completionPercent = hasGameResult
    ? Math.round((completedStepsCount / totalStepsCount) * 100)
    : 0;

  if (caseKind === 'case-02') {
    return {
      caseKind,
      caseCode: 'CASE 02',
      caseTitle: 'AF with RVR ร่วมกับภาวะหัวใจล้มเหลวกำเริบ',
      clinicalStatusNote:
        gameResult?.clinicalStatus || 'CASE 02 · รอบฝึกบันทึกคำตอบ · ยังไม่คิดคะแนนทางคลินิก',
      statusBadgeText: 'รอบฝึกบันทึกคำตอบ (ยังไม่คิดคะแนนทางคลินิก)',
      isUnscored: true,
      hasGameResult,
      durationLabel: formatDurationMs(gameResult?.durationMs),
      completedStepsCount,
      totalStepsCount,
      completionPercent,
      milestones,
    };
  }

  if (caseKind === 'case-01') {
    return {
      caseKind,
      caseCode: 'CASE 01',
      caseTitle: 'ภาวะหัวใจล้มเหลวเฉียบพลัน (Acute Heart Failure)',
      clinicalStatusNote:
        gameResult?.clinicalStatus || 'CASE 01 · DEMO DATA · รอผู้เชี่ยวชาญตรวจรับรอง',
      statusBadgeText: 'คะแนนเดโม · รอผู้เชี่ยวชาญตรวจรับรองทางคลินิก',
      isUnscored: false,
      hasGameResult,
      durationLabel: formatDurationMs(gameResult?.durationMs),
      completedStepsCount,
      totalStepsCount,
      completionPercent,
      milestones,
    };
  }

  return {
    caseKind: 'unknown',
    caseCode: 'SIMULATION',
    caseTitle: 'การจำลองสถานการณ์การพยาบาลผู้ป่วยโรคหัวใจ',
    clinicalStatusNote: 'ยังไม่มีข้อมูลการเล่นจากห้องผู้ป่วยในรอบนี้ (โหมดดูตัวอย่างหรือข้ามขั้นตอน)',
    statusBadgeText: 'สรุปผลการทดสอบก่อนและหลังเรียน',
    isUnscored: true,
    hasGameResult: false,
    durationLabel: '—',
    completedStepsCount: 0,
    totalStepsCount,
    completionPercent: 0,
    milestones,
  };
}
