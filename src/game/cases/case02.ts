import type { GameCase } from '../types';
import { verticalSlice } from './verticalSlice';
import { registerSuppliedPatientHotspots, suppliedPatientPresentation } from '../suppliedPatientPresentation';
import { ASSETS } from '../../constants/assets';

const case02 = structuredClone(verticalSlice) satisfies GameCase;
case02.id = 'case-02-acute-decompensated-heart-failure';
case02.version = 1;
case02.title = 'AF with RVR ร่วมกับภาวะหัวใจล้มเหลวกำเริบ';
case02.clinicalStatus = 'CASE 02 · รอบฝึก · อัปเดตการช่วยชีวิตตามคำตอบทีม';
case02.gradable = false;
case02.tools.push({ id: 'cpr', name: 'เริ่ม CPR', icon: 'hand', allowedTargets: ['chest'], duration: 950 });
case02.sources = ['Stage3ScenarioSelect.tsx · เรื่องย่อ Case 2', 'เนื้อหาSim.pdf · หน้า 23 และ 27–30 · คำยืนยันทีมผ่านแชต 18 พฤศจิกายน 2026', 'เนื้อหาSim.pdf · ฉบับ 32 หน้า · หน้า 14–17 · SHA256 c0c6e960c54d50104cd1de548354e7e7b38332ffc076a0978bd408c973951aac'];
case02.sources.push('เนื้อหาSim.pdf · ฉบับ 32 หน้า · หน้า 2–4 · SHA256 c0c6e960c54d50104cd1de548354e7e7b38332ffc076a0978bd408c973951aac');
case02.assets.room = ASSETS.environments.patientRoom;
case02.assets.patient = ASSETS.patients.patientCase02;
case02.assets.patientCritical = case02.assets.patient;
case02.assets.patientSupport = { bed: ASSETS.patients.patientCase02Bed, pillow: ASSETS.patients.patientCase02Pillow };
case02.presentation = suppliedPatientPresentation;
case02.hotspots = registerSuppliedPatientHotspots(case02.hotspots);
case02.initialVitals = { hr: 148, bpSystolic: 156, bpDiastolic: 92, rr: 28, spo2: 90 };
case02.initialPatient = { condition: 'unstable', breathing: 'labored', posture: 'semi_fowler', animation: 'dyspnea' };
case02.monitorTraces = undefined;
case02.scenarios = [{ id: 'case-02', title: case02.title, summary: 'CASE 02', enabled: true, status: case02.clinicalStatus }];
case02.findings.push({ id: 'cpr-started', section: 'Care Plan', title: 'เริ่มช่วยชีวิต', text: 'ผู้เล่นเริ่ม CPR หลังประเมินว่าคลำชีพจรไม่พบ ก่อนเข้าสู่กิจกรรมฝึก EKG', source: case02.sources[1] });
case02.findings = case02.findings.map(finding => {
  switch (finding.id) {
    case 'history': return { ...finding, text: 'ผู้ป่วยชายอายุ 68 ปี เป็น Heart Failure มา 3 ปี และ Hypertension ประมาณ 10 ปี รับประทานยาประจำ มีใจสั่น เหนื่อยหอบ นอนราบไม่ได้ 2 ชั่วโมงก่อนมาโรงพยาบาล แรกรับรู้สึกตัวดี พูดเป็นประโยคสั้น ๆ ได้ ขาบวมสองข้าง pitting edema 2+ เอกสารระบุ EKG เป็น AF with RVR อัตราประมาณ 145 ครั้ง/นาที', source: case02.sources[3] };
    case 'lungs': return { ...finding, text: 'ฟังหน้าอกพบ fine crackles ร่วมกับหายใจเหนื่อยหอบและขาบวมทั้งสองข้าง', source: case02.sources[3] };
    case 'bp': return { ...finding, text: 'ช่วงประเมินผู้ป่วย BP 148/88 mmHg, HR 144 ครั้ง/นาที ตามหน้า 3', source: case02.sources[3] };
    case 'oxygen': return { ...finding, text: 'ช่วงประเมินผู้ป่วย SpO₂ 90% ขณะหายใจ Room air และ RR 26 ครั้ง/นาที ตามหน้า 3', source: case02.sources[3] };
    case 'airway': return { ...finding, text: 'บันทึกการประเมิน A · เรื่องย่อไม่มีผลตรวจทางเดินหายใจ', source: case02.sources[0] };
    case 'breathing': return { ...finding, text: 'บันทึกการประเมิน B · เรื่องย่อระบุเหนื่อยเมื่อออกแรงและนอนราบไม่ได้ โดยไม่มีค่า RR หรือ SpO₂', source: case02.sources[0] };
    case 'circulation': return { ...finding, text: 'คลำชีพจรไม่พบ → เริ่ม CPR ทันที พร้อมเรียกทีมฉุกเฉินและเตรียม Defibrillator', source: case02.sources[1] };
    case 'diagnosis': return { ...finding, text: 'มีการบันทึกคำตอบเพื่อฝึก · Case 2 ไม่มี answer key ทางคลินิก', source: case02.sources[0] };
    case 'nursing-care': return { ...finding, text: 'มีการบันทึกตัวเลือกเพื่อฝึก · Case 2 ไม่มีเฉลย nursing care ทางคลินิก', source: case02.sources[0] };
    case 'medication': return { ...finding, text: 'อ่าน Doctor Order ของเคส 2 และบันทึกคำตอบเรื่องผลข้างเคียงกับการเฝ้าระวังจากแบบฝึก Amiodarone', source: case02.sources[2] };
    case 'io': return { ...finding, text: 'I/O 24 ชั่วโมงตามเอกสารเคส 2: น้ำดื่ม 1,000 mL + IV 300 mL รวมเข้า 1,300 mL ปัสสาวะออก 600 mL ผลต่าง +700 mL (Positive fluid balance)', source: case02.sources[2] };
    case 'ecg': return { ...finding, text: 'ติด lead ครบในผังเพื่อฝึกการลาก · เรื่องย่อไม่มีคลื่น ECG หรือผลอ่าน', source: case02.sources[0] };
    case 'ecg-read': return { ...finding, text: 'บันทึกข้อความที่ผู้เล่นกรอก · Case 2 ไม่มี rhythm strip หรือ answer key', source: case02.sources[0] };
    case 'emergency-treatment': return { ...finding, text: 'ทีมกำหนดให้เน้น CPR การเตรียม Defibrillator และการเรียกทีมฉุกเฉิน โดยติดตาม EKG และสัญญาณชีพ ยาที่ระบุในคำสั่งแพทย์เป็นข้อมูลประกอบของสถานการณ์', source: case02.sources[1] };
    default: return finding;
  }
});

case02.missions = case02.missions.map(mission => {
  if (mission.id === 'CASE_INTRO') return { ...mission, title: 'รับช่วงต่อ\nดูแลผู้ป่วย', description: 'ชายอายุ 68 ปี มีประวัติ Heart Failure และ Hypertension ใจสั่น เหนื่อยหอบ นอนราบไม่ได้ 2 ชั่วโมงก่อนมาโรงพยาบาล เอกสารระบุ AF with RVR', hint: 'แรกรับ PR 148 ครั้ง/นาที, BP 156/92 mmHg, RR 28 ครั้ง/นาที, SpO₂ 90% Room air ตามหน้า 2', button: 'เริ่มดูแลผู้ป่วย' };
  if (mission.id === 'PATIENT_INFORMATION') return { ...mission, title: 'ฟังผู้ป่วย\nและค้นข้อมูลตั้งต้น', description: 'ลากหรือแตะซักประวัติที่ศีรษะผู้ป่วยเพื่อเปิดข้อมูลประวัติใน Chart', hint: 'Heart Failure 3 ปี และ Hypertension ประมาณ 10 ปี มีใจสั่น เหนื่อยหอบ นอนราบไม่ได้และขาบวม' };
  if (mission.id === 'ASSESSMENT') return {
    ...mission, title: 'ประเมินผู้ป่วย\nจากข้อมูลที่มี',
    description: 'ตรวจหน้าอก ความดัน และ SpO₂ โดยใช้ข้อมูลช่วงประเมินผู้ป่วยตามเอกสารหน้า 3–4',
    hint: 'BP 148/88 mmHg, HR 144 ครั้ง/นาที, RR 26 ครั้ง/นาที, SpO₂ 90% Room air และ fine crackles',
    dataStatus: 'demo-derived', gradable: false,
    onEnter: { duration: 0, vitals: { hr: 144, bpSystolic: 148, bpDiastolic: 88, rr: 26, spo2: 90 } },
    objectives: mission.objectives?.map(objective => ({ ...objective, sound: undefined, feedback: objective.tool === 'stethoscope' ? 'ตรวจหน้าอกพบ fine crackles' : objective.tool === 'bp' ? 'บันทึก BP 148/88 mmHg แล้ว' : 'บันทึก SpO₂ 90% Room air แล้ว' })),
  };
  if (mission.id === 'DIAGNOSIS' || mission.id === 'NURSING_INTERVENTION') return {
    ...mission, dataStatus: 'missing', gradable: false,
    description: 'วางตัวเลือกทั่วไปลงในแฟ้มฝึก · เรื่องย่อ Case 2 ไม่มีเฉลยการวินิจฉัยหรือแผนการพยาบาล',
    hint: 'ตัวเลือกนี้ใช้ฝึกการลากและยืนยันเท่านั้น · ไม่มีการตัดสินทางคลินิก',
    decision: mission.decision ? {
      ...mission.decision,
      options: mission.decision.options.map((option,index) => ({ ...option, label: `ตัวเลือกฝึก ${index + 1}`, detail: 'การ์ดสำหรับฝึกจัดวาง · ไม่มีคำตอบทางคลินิกในข้อมูล Case 2' })),
      expected: [], slots: mission.decision.slots?.map((slot,index) => ({ ...slot, label: `ช่องฝึก ${index + 1}`, expected: '' })),
      explanation: 'Case 2 ไม่มี answer key · ใช้ฝึกการจัดวางและยืนยันเท่านั้น',
      success: 'บันทึกคำตอบเพื่อฝึกแล้ว · ไม่มีการตัดสินถูกหรือผิดทางคลินิก',
    } : undefined,
  };
  if (mission.id === 'MEDICATION') return {
    ...mission, dataStatus: 'demo-derived', gradable: false,
    description: 'อ่าน Doctor Order จากเอกสารเคส 2 แล้วเลือกผลข้างเคียงและการพยาบาลที่ต้องเฝ้าระวัง',
    hint: 'เปิดใบคำสั่งแพทย์และเลือกคำตอบทั้งสองช่องก่อนบันทึก',
    activity: mission.activity ? {
      ...mission.activity, dataStatus: 'demo-derived', source: case02.sources[2], gradable: false, expectedResponses: undefined,
      steps: [], allowMissingDataAcknowledgement: false,
      title: 'ทบทวนความปลอดภัยของยา',
      notice: 'คำสั่งจากเอกสารสถานการณ์ที่ 2 หน้า 14–16 · รอบฝึกบันทึกคำตอบ',
      rows: [
        { label: 'O₂', value: 'Cannula 3 L/min เป้าหมาย SpO₂ ≥ 94%' },
        { label: 'Doctor Order', value: 'Amiodarone 150 mg + D5W 100 mL IV drip over 1 hr then Amiodarone 900 mg + D5W 500 mL IV drip in 24 hr' },
        { label: 'การติดตาม', value: 'Monitor V/S และ SpO₂ ทุก 2 ชั่วโมง · Strict I/O · Electrolyte TMR' },
      ],
      fields: [
        { id: 'side-effect', label: 'ผลข้างเคียงที่ต้องเฝ้าระวัง', placeholder: 'เลือกคำตอบ', type: 'select', assessmentMode: 'record-only', options: ['หัวใจเต้นช้าและความดันโลหิตตก', 'หัวใจเต้นเร็วและความดันโลหิตตก', 'ความดันโลหิตสูง', 'ปัสสาวะออกมากผิดปกติ'] },
        { id: 'monitoring', label: 'การพยาบาลที่ต้องเฝ้าระวัง', placeholder: 'เลือกคำตอบ', type: 'select', assessmentMode: 'record-only', options: ['Monitor EKG และเฝ้าระวัง Phlebitis', 'ประเมิน bowel sound', 'ติดตามระดับน้ำตาลในเลือดและเฝ้าระวัง Infiltrate', 'เฝ้าระวัง K⁺ ต่ำ'] },
      ],
      success: 'บันทึกคำตอบรอบฝึกเรื่องความปลอดภัยของยาแล้ว',
    } : undefined,
  };
  if (mission.id === 'IO_BALANCE') return {
    ...mission, dataStatus: 'demo-derived', gradable: false,
    description: 'จัดรายการสารน้ำเข้าและออกใน 24 ชั่วโมง แล้วเลือกว่าสมดุลเป็นบวกหรือลบ',
    hint: 'รวมน้ำดื่ม 1,000 mL กับ IV 300 mL แล้วเทียบกับปัสสาวะ 600 mL',
    activity: mission.activity ? {
      ...mission.activity, dataStatus: 'demo-derived', source: case02.sources[2], gradable: false, expectedResponses: undefined,
      items: [
        { id: 'oral-intake', label: 'น้ำดื่ม · 1,000 mL', zoneId: 'intake' },
        { id: 'iv-intake', label: 'IV Fluid · 300 mL', zoneId: 'intake' },
        { id: 'urine-output', label: 'ปัสสาวะ · 600 mL', zoneId: 'output' },
      ],
      fields: [], allowMissingDataAcknowledgement: false,
      notice: 'ข้อมูล I/O 24 ชั่วโมงจากเอกสารสถานการณ์ที่ 2 หน้า 17 · รอบฝึกบันทึกคำตอบ',
      rows: [{ label: 'INTAKE', value: 'น้ำดื่ม 1,000 mL + IV 300 mL' }, { label: 'OUTPUT', value: 'ปัสสาวะ 600 mL' }],
      success: 'บันทึกคำตอบแล้ว · ตามเอกสาร สารน้ำเข้า 1,300 − ออก 600 = +700 mL เป็น Positive fluid balance',
    } : undefined,
    decision: mission.decision ? {
      ...mission.decision, expected: [],
      options: [
        { id: 'positive', label: 'POSITIVE', detail: 'สารน้ำเข้ามากกว่าสารน้ำออก' },
        { id: 'negative', label: 'NEGATIVE', detail: 'สารน้ำออกมากกว่าสารน้ำเข้า' },
      ],
      explanation: 'จัดรายการและเลือกแนวโน้มก่อนบันทึก',
      success: 'บันทึกคำตอบแล้ว · ตามเอกสาร สารน้ำเข้า 1,300 − ออก 600 = +700 mL เป็น Positive fluid balance',
    } : undefined,
  };
  if (mission.id === 'EMERGENCY_TRANSITION') return { ...mission, description: 'ผู้ป่วยเข้าสู่ช่วงฉุกเฉิน ประเมินผู้ป่วยและคลำชีพจร หากคลำชีพจรไม่ได้ให้เริ่ม CPR ทันที', hint: 'คลื่นบน Monitor อาจยังปรากฏแม้คลำชีพจรไม่ได้ ให้ยึดผลประเมินผู้ป่วย', onEnter: { emergency: true, alarm: true, duration: 0, vitals: { hr: null, bpSystolic: null, bpDiastolic: null, rr: null, spo2: null }, patient: { condition: 'critical', breathing: 'severe', animation: 'critical' } } };
  if (mission.id === 'ABC_ASSESSMENT') return {
    ...mission,
    description: 'ประเมิน A → B → C เมื่อคลำชีพจรไม่พบให้เริ่ม CPR ทันที พร้อมเรียกทีมฉุกเฉินและเตรียม Defibrillator',
    hint: 'ทีมคงขั้นฝึกติด EKG เพื่อวัตถุประสงค์การเรียนรู้ การช่วยชีวิตต้องเริ่มทันทีเมื่อคลำชีพจรไม่ได้',
    objectives: [
      ...(mission.objectives ?? []).map(objective => objective.finding === 'circulation' ? { ...objective, feedback: 'คลำชีพจรไม่พบ → เริ่ม CPR ทันที เรียกทีมฉุกเฉินและเตรียม Defibrillator' } : objective),
      { id: 'case2-start-cpr', label: 'เริ่ม CPR ทันทีเมื่อคลำชีพจรไม่พบ', tool: 'cpr', target: 'chest', finding: 'cpr-started', feedback: 'บันทึกการเริ่ม CPR แล้ว กิจกรรมถัดไปเป็นขั้นฝึกติด EKG ตามวัตถุประสงค์การเรียนรู้' },
    ],
  };
  if (mission.id === 'ECG_PLACEMENT') return {
    ...mission,
    description: 'ฝึกติด EKG ตามวัตถุประสงค์การเรียนรู้ ระหว่างสถานการณ์ที่ต้องเริ่ม CPR แล้วเมื่อคลำชีพจรไม่ได้',
    hint: 'ขั้น EKG นี้เป็นกิจกรรมฝึกที่ทีมกำหนด ให้เริ่ม CPR ทันทีเมื่อคลำชีพจรไม่ได้',
  };
  if (mission.id === 'ECG_INTERPRETATION') return {
    ...mission, dataStatus: 'missing', gradable: false,
    description: 'บันทึกการอ่าน EKG ระหว่างการฝึก คลื่นไฟฟ้าหัวใจอาจยังปรากฏแม้คลำชีพจรไม่ได้',
    hint: 'เมื่อคลำชีพจรไม่ได้ให้เริ่ม CPR ทันที ขั้นฝึก EKG นี้คงไว้ตามวัตถุประสงค์การเรียนรู้',
    activity: mission.activity ? {
      ...mission.activity, dataStatus: 'missing', source: case02.sources[0], gradable: false, expectedResponses: undefined,
      eyebrow: 'ECG NOTES · CASE 02 PRACTICE', title: 'บันทึกข้อความฝึก',
      notice: 'คลำชีพจรไม่พบ → เริ่ม CPR ทันที ทีมคงกิจกรรม EKG เพื่อฝึกการติดและบันทึกผล',
      fields: (mission.activity.fields ?? []).map(field => ({ ...field, label: 'ข้อความฝึก', placeholder: 'บันทึกข้อความ · ไม่มีข้อมูลคลื่น ECG', type: 'text' as const, options: undefined })),
    } : undefined,
  };
  if (mission.id === 'EMERGENCY_TREATMENT') return {
    ...mission, gradable: false,
    description: 'จัดการ์ดการพยาบาลลงกรอบ โดยเริ่ม CPR ทันทีเมื่อคลำชีพจรไม่ได้ เน้นการเตรียม Defibrillator และเรียกทีมฉุกเฉิน',
    hint: 'ยาที่ระบุในคำสั่งแพทย์เป็นข้อมูลประกอบ ให้เน้นการช่วยชีวิตตามที่ทีมกำหนด',
    decision: mission.decision ? {
      ...mission.decision, expected: [],
      slots: [
        { id: 'response', label: 'การช่วยชีวิตทันที', expected: '' },
        { id: 'equipment', label: 'การเตรียมอุปกรณ์', expected: '' },
        { id: 'team', label: 'การเรียกทีมช่วยเหลือ', expected: '' },
        { id: 'monitor', label: 'การติดตามผู้ป่วย', expected: '' },
      ],
      options: [
        { id: 'priority-response', label: 'เริ่ม CPR ทันที', detail: 'เมื่อประเมินแล้วคลำชีพจรไม่พบ' },
        { id: 'defibrillator', label: 'เตรียม Defibrillator และ Emergency Trolley', detail: 'เตรียมอุปกรณ์สำหรับทีมช่วยชีวิต' },
        { id: 'emergency-team', label: 'เรียกทีมฉุกเฉินและรายงานแพทย์ทันที', detail: 'ขอความช่วยเหลือเมื่อพบผู้ป่วยไม่มีชีพจร' },
        { id: 'monitor-patient', label: 'ติดตาม EKG และสัญญาณชีพอย่างต่อเนื่อง', detail: 'ติดตามระหว่างการช่วยชีวิต' },
      ],
      explanation: 'จัดการ์ดการช่วยชีวิตให้ครบก่อนยืนยัน',
      success: 'บันทึกการฝึกช่วยชีวิตตามคำตอบทีมแล้ว',
    } : undefined,
  };
  if (mission.id === 'PATIENT_STABILIZED') return { ...mission, description: 'เล่นภาพตอบสนองของ simulation เพื่อจบภารกิจ · ไม่มีการอ้างผลการรักษาหรือตัวเลข vital', onEnter: { alarm: false, duration: 0, patient: { condition: 'stable', breathing: 'normal', animation: 'recovering' } } };
  if (mission.id === 'CASE_SUMMARY') return { ...mission, description: 'จบ Case 2 demo · สรุปเฉพาะข้อมูลจากเรื่องย่อและการกระทำที่ผู้เล่นทำ โดยไม่มีคะแนนความสามารถทางคลินิก' };
  return mission;
});

export { case02 };
