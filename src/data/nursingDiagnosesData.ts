import { NursingDiagnosisCard, ClinicalCue } from '../types/game';

export const NURSING_DIAGNOSES: NursingDiagnosisCard[] = [
  {
    id: 'diag_1',
    title: 'การแลกเปลี่ยนก๊าซบกพร่อง (Impaired Gas Exchange)',
    description: 'เนื่องจากมีภาวะคั่งของสารน้ำในถุงลมปอดจากภาวะหัวใจล้มเหลวเฉียบพลัน',
    correctRank: 1,
    matchedCues: ['cue_crepitation', 'cue_dyspnea', 'cue_cxr']
  },
  {
    id: 'diag_2',
    title: 'ปริมาณเลือดที่ออกจากหัวใจลดลง (Decreased Cardiac Output)',
    description: 'เนื่องจากการบีบตัวของกล้ามเนื้อหัวใจลดลงและความดันโลหิตสูงวิกฤต',
    correctRank: 2,
    matchedCues: ['cue_tachycardia', 'cue_bp', 'cue_s3']
  },
  {
    id: 'diag_3',
    title: 'ภาวะสารน้ำเกินในร่างกาย (Excess Fluid Volume)',
    description: 'เนื่องจากประสิทธิภาพการทำงานของหัวใจลดลง ส่งผลต่อการกำจัดน้ำของไต',
    correctRank: 3,
    matchedCues: ['cue_edema', 'cue_weight']
  },
  {
    id: 'diag_4',
    title: 'ความไม่ทนต่อกิจกรรม (Activity Intolerance)',
    description: 'เนื่องจากความไม่สมดุลระหว่างความต้องการออกซิเจนกับการได้รับออกซิเจนของเนื้อเยื่อ',
    correctRank: 4,
    matchedCues: ['cue_fatigue']
  }
];

export const CLINICAL_CUES: ClinicalCue[] = [
  {
    id: 'cue_crepitation',
    label: 'ฟังปอดพบเสียง Fine Crepitation ชายปอดทั้ง 2 ข้าง',
    category: 'objective',
    belongsToDiagnosisId: 'diag_1'
  },
  {
    id: 'cue_dyspnea',
    label: 'หายใจหอบเหนื่อย RR 24 ครั้ง/นาที ต้องหนุนหมอนสูง',
    category: 'vital',
    belongsToDiagnosisId: 'diag_1'
  },
  {
    id: 'cue_cxr',
    label: 'CXR พบรอยคั่งของสารน้ำในหลอดเลือดปอด (Pulmonary congestion)',
    category: 'lab',
    belongsToDiagnosisId: 'diag_1'
  },
  {
    id: 'cue_tachycardia',
    label: 'หัวใจเต้นเร็วผิดปกติ PR 112 ครั้ง/นาที (Sinus Tachycardia)',
    category: 'vital',
    belongsToDiagnosisId: 'diag_2'
  },
  {
    id: 'cue_bp',
    label: 'ความดันโลหิตสูงมาก BP 168/98 mmHg (Afterload สูง)',
    category: 'vital',
    belongsToDiagnosisId: 'diag_2'
  },
  {
    id: 'cue_s3',
    label: 'ฟังเสียงหัวใจพบ S3 Gallop sound บ่งชี้เวนตริเคิลซ้ายตึงตัว',
    category: 'objective',
    belongsToDiagnosisId: 'diag_2'
  },
  {
    id: 'cue_edema',
    label: 'มีอาการบวมกดบุ๋มที่หน้าแข้งทั้งสองข้าง (Pitting edema 1+)',
    category: 'objective',
    belongsToDiagnosisId: 'diag_3'
  },
  {
    id: 'cue_weight',
    label: 'ประวัติน้ำหนักตัวเพิ่มขึ้นอย่างรวดเร็ว บ่งชี้การคั่งของน้ำ',
    category: 'subjective',
    belongsToDiagnosisId: 'diag_3'
  },
  {
    id: 'cue_fatigue',
    label: 'รู้สึกอ่อนเพลีย เหนื่อยหอบเมื่อขยับตัวหรือเปลี่ยนอิริยาบถ',
    category: 'subjective',
    belongsToDiagnosisId: 'diag_4'
  }
];
