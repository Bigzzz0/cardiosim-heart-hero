import { LearningVideo } from '../types/game';

export const LEARNING_VIDEOS: LearningVideo[] = [
  {
    id: 1,
    title: '1. พยาธิสรีรวิทยาของภาวะหัวใจล้มเหลวเฉียบพลัน (Pathophysiology of Acute Heart Failure)',
    duration: '2:45 นาที',
    description: 'เรียนรู้กลไกการเกิดน้ำท่วมปอด (Pulmonary Edema), การคั่งของน้ำในหลอดเลือดดำ, และการลดลงของ Cardiac Output',
    topics: ['Preload & Afterload', 'Pulmonary Capillary Wedge Pressure', 'Orthopnea Mechanism'],
    iconKey: 'heart',
    watched: false
  },
  {
    id: 2,
    title: '2. การประเมินสัญญาณเตือนวิกฤตและการตรวจร่างกาย (Clinical Assessment & Physical Exam)',
    duration: '3:10 นาที',
    description: 'เทคนิคการฟังเสียงปอด Crepitation, การประเมิน Pitting Edema, การวัด Jugular Venous Pulse (JVP) และการสังเกตเสมหะฟองสีชมพู',
    topics: ['Auscultation of Crackles', 'S3 Gallop Sound', 'Edema Staging 1+ to 4+'],
    iconKey: 'stethoscope',
    watched: false
  },
  {
    id: 3,
    title: '3. การแปลผลคลื่นไฟฟ้าหัวใจและภาพรังสีทรวงอก (EKG & CXR Interpretation)',
    duration: '2:55 นาที',
    description: 'การอ่านคลื่นไฟฟ้าหัวใจ Sinus Tachycardia, SVT, VT และการดูภาวะน้ำคั่งในปอด (Bat-wing appearance / Cardiomegaly)',
    topics: ['12-Lead EKG Precordial Placement', 'Tachyarrhythmia Recognition', 'CXR Vascular Congestion'],
    iconKey: 'activity',
    watched: false
  },
  {
    id: 4,
    title: '4. การพยาบาลตามลำดับความสำคัญตามหลัก ABC (Nursing Priority & ABC Principle)',
    duration: '2:30 นาที',
    description: 'ลำดับการพยาบาลเมื่อผู้ป่วยวิกฤต: จัดท่า High Fowler\'s 90 องศา, การเลือกใช้อุปกรณ์ออกซิเจน และการเปิดทางเดินหายใจ',
    topics: ['Airway & Breathing Support', 'High Fowler\'s Hemodynamics', 'Oxygen Cannula vs Non-rebreather'],
    iconKey: 'bed',
    watched: false
  },
  {
    id: 5,
    title: '5. การบริหารยาขับปัสสาวะและการเฝ้าระวังผลข้างเคียง (Loop Diuretics Administration)',
    duration: '3:05 นาที',
    description: 'การบริหารยา Furosemide (Lasix) 40 mg IV, หลัก 6 Rights, การเฝ้าระวังความดันโลหิตตก, และการติดตามระดับเกลือแร่ K+, Mg2+',
    topics: ['6 Rights of Medication', 'Furosemide IV Push Rate', 'Hypokalemia & Arrhythmia Risk'],
    iconKey: 'pill',
    watched: false
  },
  {
    id: 6,
    title: '6. การบันทึกสารน้ำเข้า-ออกและการรายงานแพทย์ ISBAR (I/O Record & ISBAR Handover)',
    duration: '2:40 นาที',
    description: 'การคำนวณ Fluid Balance อย่างแม่นยำ, การประเมินปัสสาวะ และโครงสร้างการรายงานแพทย์ ISBAR เมื่อผู้ป่วยมีอาการทรุดลง',
    topics: ['Intake & Output Charting', 'Positive vs Negative Balance', 'ISBAR Emergency Reporting'],
    iconKey: 'clipboard',
    watched: false
  }
];
