import { ClinicalHint } from '../types/game';

export const CLINICAL_HINTS: Record<string, ClinicalHint> = {
  STAGE3_PRIORITIZATION: {
    stage: 'STAGE3_PRIORITIZATION',
    observationHint: 'ให้นึกถึงหลักการช่วยชีวิต A-B-C: ผู้ป่วยกำลังขาดออกซิเจนและมีน้ำท่วมในถุงลมปอด (Fine Crepitation) ปัญหาใดเกี่ยวกับระบบแลกเปลี่ยนก๊าซที่ต้องแก้ก่อนหัวใจวาย?',
    pathophysiologyHint: 'ภาวะ Hypoxemia จาก Impaired Gas Exchange จะทำให้เซลล์กล้ามเนื้อหัวใจและสมองขาดออกซิเจนฉับพลัน ต้องมาก่อน Decreased Cardiac Output และ Excess Fluid Volume เสมอ'
  },
  STAGE5_ABC_ACTION: {
    stage: 'STAGE5_ABC_ACTION',
    observationHint: 'การจัดท่ามีผลต่อการไหลเวียนเลือดกลับสู่หัวใจ (Venous Return) ท่าใดช่วยให้ปอดขยายตัวได้มากที่สุดและลดภาระหัวใจ?',
    pathophysiologyHint: 'ท่า High Fowler\'s 90 องศา จะทำให้กระบังลมหย่อนตัวลง ปอดขยายได้เต็มที่ และลดปริมาณเลือดดำไหลกลับหัวใจห้องขวา (Reduce Preload) ช่วยลดน้ำท่วมปอดได้ทันที'
  },
  STAGE6_MEDICATION: {
    stage: 'STAGE6_MEDICATION',
    observationHint: 'ยา Furosemide เป็นยาขับปัสสาวะกลุ่ม Loop Diuretics ออกฤทธิ์ขับเกลือแร่ชนิดใดออกทางปัสสาวะมากที่สุดที่ต้องระวังหัวใจเต้นผิดจังหวะ?',
    pathophysiologyHint: 'Furosemide ยับยั้ง Na+/K+/2Cl- cotransporter ที่ Henle\'s loop ทำให้ขับ K+ และ Mg2+ ออกมามาก นำไปสู่ภาวะ Hypokalemia ซึ่งเพิ่มความไวต่อการเกิด Arrhythmia'
  },
  STAGE7_IO_RECORD: {
    stage: 'STAGE7_IO_RECORD',
    observationHint: 'สูตร Fluid Balance คือ สารน้ำเข้า (Intake) ลบด้วย สารน้ำออก (Output) หากขับน้ำออกได้มากกว่าน้ำที่ได้รับ ค่าจะติดลบหรือไม่?',
    pathophysiologyHint: 'ในผู้ป่วย Acute Heart Failure เป้าหมายคือขับน้ำส่วนเกินออกจากระบบไหลเวียนโลหิต (Negative Balance) จึงเป็นผลการตอบสนองที่ต้องการ'
  },
  STAGE8_CRISIS_EVENT: {
    stage: 'STAGE8_CRISIS_EVENT',
    observationHint: 'ผู้ป่วยมีภาวะฉุกเฉิน SpO2 ตกเหลือ 82% ไอเป็นฟองสีชมพู และ EKG เป็น SVT อุปกรณ์ออกซิเจนชนิดใดให้ความเข้มข้นสูงที่สุด (FiO2 80-100%)?',
    pathophysiologyHint: 'Oxygen Non-rebreather mask with reservoir bag 10-15 L/min ให้ FiO2 สูงถึง 90-100% จำเป็นอย่างยิ่งในการกู้ชีพฉุกเฉินก่อนเกิด Respiratory Arrest'
  }
};
