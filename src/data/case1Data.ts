import { ClinicalHotspot } from '../types/game';

export const CASE_1_DETAILS = {
  id: 1,
  title: 'เคสที่ 1: ภาวะหัวใจล้มเหลวจากความดันโลหิตสูงวิกฤต',
  subtitle: 'Hypertensive Crisis with Acute Heart Failure & Respiratory Distress',
  patient: {
    name: 'นางสมศรี ใจมั่น',
    age: 39,
    gender: 'หญิง',
    underlying: 'เบาหวาน (DM), ความดันโลหิตสูง (HT), ไขมันในเลือดสูง (Dyslipidemia)',
    chiefComplaint: 'หอบเหนื่อย แน่นหน้าอก หายใจเร็วผิดปกติ และใจสั่น เริ่มมีอาการรุนแรงขึ้น 6 ชั่วโมงก่อนมาโรงพยาบาล',
    presentIllness: 'มีปัญหาหายใจลำบาก ความดันโลหิตสูงรุนแรง ระดับน้ำตาลในเลือดสูง และหัวใจเต้นเร็วผิดปกติ แพทย์ประเมินเบื้องต้นสงสัยภาวะ Acute Heart Failure ได้รับการใส่ท่อช่วยหายใจ/ให้ออกซิเจน และยาขับปัสสาวะ พร้อมส่งต่อมายังศูนย์หัวใจวิกฤต',
    admissionVitals: {
      bp: '168/98 mmHg',
      hr: 112,
      rr: 24,
      bt: '37.2 °C',
      spo2: '95% (ขณะได้รับ O2 Cannula 3 L/min)',
      general: 'รู้สึกตัวดี พูดคุยรู้เรื่อง เหนื่อยเล็กน้อยขณะพัก หนุนหมอนสูง 2 ใบ'
    }
  },
  doctorOrders: [
    'O2 nasal cannula 3 L/min keep SpO2 >= 95%',
    'Furosemide 40 mg IV stat then assess response',
    'DTX q 4 hr (ติดตามระดับน้ำตาลปลายนิ้ว)',
    'Record Intake / Output (I/O) ทุก 1 ชั่วโมง',
    'EKG 12 leads stat',
    'Send blood for: CBC, BUN, Creatinine, Electrolyte, Troponin-I',
    'จำกัดน้ำ 1,000 mL/day',
    'Low sodium diet (จำกัดเกลือ)'
  ],
  labResults: {
    dtx: '286 mg/dL (สูง)',
    wbc: '12,800 cell/mm³ (สูงเล็กน้อย)',
    creatinine: '1.0 mg/dL',
    egfr: '78 mL/min/1.73 m²',
    k: '3.8 mmol/L (เกณฑ์ปกติช่วงต่ำ)',
    troponinI: 'Negative (ยังไม่พบรอยโรคกล้ามเนื้อหัวใจตายเฉียบพลัน)',
    cxr: 'Cardiomegaly with mild pulmonary vascular congestion'
  },
  crisisEvent: {
    triggerText: 'ผู้ป่วยมีอาการทรุดลงเฉียบพลัน! มีเสียงเตือนดังจากเครื่อง Monitor ผู้ป่วยนั่งพิงหัวเตียง หายใจหอบเหนื่อยรุนแรง กระสับกระส่าย เหงื่อออกท่วมตัว ไอมีเสมหะฟองสีชมพู (Pink frothy sputum)',
    vitals: {
      bp: '220/130 mmHg (วิกฤต)',
      hr: 148,
      rr: 36,
      spo2: '82% (ภาวะพร่องออกซิเจนรุนแรง)'
    },
    ekgRhythm: 'Supraventricular Tachycardia (SVT) อัตราเต้น 148 bpm'
  }
};

export const CASE_1_HOTSPOTS: ClinicalHotspot[] = [
  {
    id: 'lung_auscultation',
    title: 'การฟังเสียงปอด (Lung Auscultation)',
    subtitle: 'ตรวจประเมินเสียงหายใจบริเวณชายปอดทั้ง 2 ข้าง',
    x: 48,
    y: 38,
    type: 'lung',
    finding: 'Fine Crepitation (Crackles) บริเวณชายปอดทั้งสองข้าง',
    detail: 'ได้ยินเสียงแตกเปรี๊ยะคล้ายขยี้เส้นผมเบาๆ ในช่วงปลายของการหายใจเข้า บ่งชี้ว่ามีของเหลวหรือน้ำคั่งในถุงลมปอด (Alveolar fluid transudation)',
    audioSound: 'crepitation',
    discovered: false
  },
  {
    id: 'heart_auscultation',
    title: 'การฟังเสียงหัวใจ (Cardiac Auscultation)',
    subtitle: 'ตรวจฟังบริเวณ Apex และจังหวะการเต้น',
    x: 54,
    y: 42,
    type: 'heart',
    finding: 'Tachycardia with S3 Gallop sound (Ventricular Gallop)',
    detail: 'อัตราการเต้นของหัวใจเร็ว 112 bpm ได้ยินเสียงที่สาม (S3) ชัดเจน แสดงถึงภาวะหัวใจห้องล่างซ้ายสูบฉีดเลือดไม่ทัน มีเลือดคั่งในเวนตริเคิล',
    audioSound: 's3_gallop',
    discovered: false
  },
  {
    id: 'pitting_edema',
    title: 'การตรวจอาการบวมที่ขา (Pitting Edema)',
    subtitle: 'กดบริเวณหน้าแข้ง (Pretibial area) ค้างไว้ 5 วินาที',
    x: 52,
    y: 78,
    type: 'edema',
    finding: 'Pretibial Pitting Edema 1+ ทั้งสองข้าง',
    detail: 'เมื่อใช้นิ้วหัวแม่มือกด รอยบุ๋มลึกประมาณ 2 มม. และคืนตัวกลับทันที แสดงถึงการเริ่มคั่งของสารน้ำในระบบหลอดเลือดดำและเนื้อเยื่อส่วนล่าง',
    discovered: false
  },
  {
    id: 'bedside_monitor',
    title: 'จอมอนิเตอร์ข้างเตียง (Bedside Monitor)',
    subtitle: 'ตรวจติดตามคลื่นไฟฟ้าหัวใจและสัญญาณชีพต่อเนื่อง',
    x: 22,
    y: 28,
    type: 'monitor',
    finding: 'BP 168/98 mmHg, PR 112 bpm, RR 24/min, SpO2 95%',
    detail: 'กราฟ EKG แสดง Sinus Tachycardia อัตรา 112 bpm ความดันโลหิตอยู่ในเกณฑ์สูงมาก (Hypertension stage 2)',
    audioSound: 'heart_beep',
    discovered: false
  },
  {
    id: 'lab_and_cxr',
    title: 'ผลแล็บและภาพถ่ายรังสีปอด (Lab & CXR)',
    subtitle: 'ดูผลการตรวจเลือด CBC, Electrolytes, DTX และฟิล์ม X-ray',
    x: 78,
    y: 28,
    type: 'lab',
    finding: 'DTX 286 mg/dL, K+ 3.8, CXR: Mild pulmonary congestion',
    detail: 'CXR พบเงาหัวใจโต (Cardiomegaly) และมีรอยหลอดเลือดปอดกระจายชัดเจน แต่ยังไม่พบรอยโรคกล้ามเนื้อหัวใจตาย (Trop-I เป็นลบ)',
    discovered: false
  }
];
