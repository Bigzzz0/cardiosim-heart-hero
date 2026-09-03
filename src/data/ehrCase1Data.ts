import { EHRRecord } from '../types/game';

export const CASE_1_EHR: EHRRecord = {
  patientId: 'HN-67092144',
  patientName: 'นางสมศรี ใจมั่น',
  age: 39,
  gender: 'หญิง',
  bedNumber: 'CCU-Bed 03',
  diagnosis: 'Acute Decompensated Heart Failure from Hypertensive Crisis',
  allergies: 'NKDA (No Known Drug Allergies)',
  attendingPhysician: 'นพ.วิชัย เกียรติวานิช (อายุรแพทย์โรคหัวใจ)',
  admissionDate: '03 ก.ย. 2569 เวลา 08:30 น.',
  doctorOrders: [
    {
      id: 'ord_1',
      orderText: 'O2 nasal cannula 3 L/min keep SpO2 >= 95%',
      type: 'stat',
      orderedTime: '08:45 น.',
      signedBy: 'นพ.วิชัย เกียรติวานิช',
      status: 'in_progress'
    },
    {
      id: 'ord_2',
      orderText: 'Furosemide (Lasix) 40 mg IV slow push stat over 2 minutes',
      type: 'stat',
      orderedTime: '08:45 น.',
      signedBy: 'นพ.วิชัย เกียรติวานิช',
      status: 'pending'
    },
    {
      id: 'ord_3',
      orderText: 'Record Intake/Output (I/O) ทุก 1 ชั่วโมง รายงานแพทย์ถ้า Urine < 30 mL/hr',
      type: 'routine',
      orderedTime: '08:50 น.',
      signedBy: 'นพ.วิชัย เกียรติวานิช',
      status: 'in_progress'
    },
    {
      id: 'ord_4',
      orderText: 'Monitor EKG Lead II & NIBP ทุก 15 นาที',
      type: 'stat',
      orderedTime: '08:50 น.',
      signedBy: 'นพ.วิชัย เกียรติวานิช',
      status: 'in_progress'
    },
    {
      id: 'ord_5',
      orderText: 'DTX q 4 hr (Keep DTX 140 - 180 mg/dL)',
      type: 'routine',
      orderedTime: '08:50 น.',
      signedBy: 'นพ.วิชัย เกียรติวานิช',
      status: 'pending'
    },
    {
      id: 'ord_6',
      orderText: 'จำกัดน้ำดื่ม 1,000 mL/วัน, อาหาร Low Sodium Diet (เกลือ < 2 กรัม/วัน)',
      type: 'routine',
      orderedTime: '08:55 น.',
      signedBy: 'นพ.วิชัย เกียรติวานิช',
      status: 'pending'
    }
  ],
  labResults: [
    {
      testName: 'DTX (Dextrostix)',
      value: '286',
      unit: 'mg/dL',
      referenceRange: '70 - 140',
      isAbnormal: true,
      clinicalSignificance: 'ภาวะน้ำตาลในเลือดสูงจากเบาหวานร่วมกับความเครียดจากวิกฤตความดัน'
    },
    {
      testName: 'NT-proBNP',
      value: '2,450',
      unit: 'pg/mL',
      referenceRange: '< 125',
      isAbnormal: true,
      clinicalSignificance: 'ค่าสูงมาก บ่งชี้ภาวะกล้ามเนื้อหัวใจห้องล่างซ้ายยืดขยายตัวจากน้ำคั่ง (Ventricular Stretch)'
    },
    {
      testName: 'Troponin-I',
      value: '< 0.01',
      unit: 'ng/mL',
      referenceRange: '< 0.04',
      isAbnormal: false,
      clinicalSignificance: 'ผลลบ ไม่พบรอยโรคกล้ามเนื้อหัวใจตายเฉียบพลัน (Non-STEMI/STEMI ruled out)'
    },
    {
      testName: 'Serum Potassium (K+)',
      value: '3.8',
      unit: 'mEq/L',
      referenceRange: '3.5 - 5.0',
      isAbnormal: false,
      clinicalSignificance: 'อยู่ในเกณฑ์ปกติช่วงต่ำ ต้องเฝ้าระวังอย่างใกล้ชิดเมื่อให้ยาขับปัสสาวะ Furosemide'
    },
    {
      testName: 'Serum Sodium (Na+)',
      value: '136',
      unit: 'mEq/L',
      referenceRange: '135 - 145',
      isAbnormal: false,
      clinicalSignificance: 'เกณฑ์ปกติ'
    },
    {
      testName: 'Serum Creatinine',
      value: '1.0',
      unit: 'mg/dL',
      referenceRange: '0.6 - 1.2',
      isAbnormal: false,
      clinicalSignificance: 'การทำงานของไตยังปกติ (eGFR 78 mL/min/1.73m²)'
    },
    {
      testName: 'WBC Count',
      value: '12,800',
      unit: 'cells/mm³',
      referenceRange: '4,500 - 10,000',
      isAbnormal: true,
      clinicalSignificance: 'สูงขึ้นเล็กน้อยจากความเครียดทางสรีรวิทยา (Leukocytosis from physiological stress)'
    }
  ],
  imagingReport: {
    modality: 'Portable Chest X-Ray (AP View)',
    findings: 'พบ Cardiomegaly (Cardiothoracic ratio 0.62) ร่วมกับ Prominence of upper lobe pulmonary vessels, Blunting of both costophrenic angles เล็กน้อย, Kerley B-lines บริเวณชายปอดทั้งสองข้าง',
    impression: 'Acute Pulmonary Venous Congestion with Cardiomegaly (ภาวะน้ำคั่งในหลอดเลือดปอดและหัวใจโต)'
  },
  marList: [
    {
      drugName: 'Furosemide (Lasix)',
      dosage: '40 mg',
      route: 'IV push (slowly 2 min)',
      schedule: 'Stat',
      lastAdministered: 'กำลังเตรียมยา',
      nurseSignature: 'พว. ณภัทร (RN)'
    },
    {
      drugName: 'Oxygen',
      dosage: '3 L/min',
      route: 'Nasal Cannula',
      schedule: 'Continuous',
      lastAdministered: '08:45 น.',
      nurseSignature: 'พว. ณภัทร (RN)'
    }
  ]
};
