import { MedicationStep } from '../types/game';

export const MEDICATION_CHOICES = [
  {
    id: 'furosemide',
    name: 'Furosemide (Lasix) 40 mg IV stat',
    indication: 'ยาขับปัสสาวะกลุ่ม Loop Diuretic ลด Preload และลดน้ำคั่งในปอดอย่างรวดเร็ว',
    isCorrect: true,
    sideEffectsToWatch: [
      'ความดันโลหิตต่ำเฉียบพลัน (Hypotension)',
      'ระดับโพแทสเซียมในเลือดต่ำ (Hypokalemia)',
      'ระดับแมกนีเซียมในเลือดต่ำ (Hypomagnesemia)',
      'ปริมาณปัสสาวะออกอย่างรวดเร็ว (Diuresis)'
    ]
  },
  {
    id: 'dopamine',
    name: 'Dopamine 1:1 IV drip 10 mcg/kg/min',
    indication: 'ยากระตุ้นการบีบตัวของหัวใจและเพิ่มความดัน',
    isCorrect: false,
    reason: 'ผู้ป่วยมีความดันโลหิตสูงมากอยู่แล้ว (168/98 mmHg) การให้ Inotropes/Vasopressors จะทำให้ความดันและ Afterload พุ่งสูงขึ้นจนเกิดอันตราย'
  },
  {
    id: 'morphine',
    name: 'Morphine 10 mg IV push stat',
    indication: 'ยาลดอาการปวดและคลายกังวล',
    isCorrect: false,
    reason: 'แม้ในอดีตเคยใช้บรรเทาหอบเหนื่อย แต่ปัจจุบันจำกัดการใช้เฉพาะกรณีจำเป็นเนื่องจากกดการหายใจและเพิ่มอัตราการเสียชีวิตในผู้ป่วย Acute HF'
  }
];

export const MEDICATION_PREPARATION_STEPS: MedicationStep[] = [
  {
    id: 'step_order_check',
    stepNumber: 1,
    text: '1. ตรวจสอบคำสั่งการรักษาของแพทย์ (Doctor\'s Order Sheet) ความถูกต้องของตัวยา ขนาด และประวัติการแพ้ยาของผู้ป่วย',
    category: 'check'
  },
  {
    id: 'step_label_check',
    stepNumber: 2,
    text: '2. ตรวจสอบฉลากยา Furosemide แอมพูล ชื่อยา ขนาดยา ความบริสุทธิ์ และวันหมดอายุ (Check 1)',
    category: 'check'
  },
  {
    id: 'step_handwash_prep',
    stepNumber: 3,
    text: '3. ล้างมือ 6 ขั้นตอนตามหลัก Aseptic Technique และเตรียมอุปกรณ์ปราศจากเชื้อ (Syringe, Needle, Alcohol Pad)',
    category: 'prep'
  },
  {
    id: 'step_draw_med',
    stepNumber: 4,
    text: '4. เช็ดคอแอมพูลด้วยแอลกอฮอล์ 70% หักหลอดยา และดูดยาตามขนาดที่สั่ง 40 mg (4 mL) พร้อมไล่ฟองอากาศอย่างระมัดระวัง',
    category: 'prep'
  },
  {
    id: 'step_recheck_label',
    stepNumber: 5,
    text: '5. ตรวจสอบยาซ้ำกับใบนำส่งยา (Check 2) ติดฉลากระบุชื่อผู้ป่วย ชื่อยา ขนาดยาบนกระบอกฉีดยาอย่างชัดเจน',
    category: 'check'
  },
  {
    id: 'step_patient_id',
    stepNumber: 6,
    text: '6. ไปที่เตียงผู้ป่วย ชี้บ่งตัวผู้ป่วยด้วย 2 ตัวระบุ (ชื่อ-นามสกุล และวันเดือนปีเกิด/HN) พร้อมอธิบายวัตถุประสงค์ของการให้ยา',
    category: 'administer'
  },
  {
    id: 'step_administer_record',
    stepNumber: 7,
    text: '7. ตรวจสอบสัญญาณชีพก่อนให้ยา ฉีดเข้าหลอดเลือดดำช้าๆ (Slow IV push นาน 1-2 นาที) และลงบันทึกในใบ MAR ทันที (Check 3)',
    category: 'monitor'
  }
];
