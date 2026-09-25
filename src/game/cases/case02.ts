import type { GameCase } from '../types';
import { verticalSlice } from './verticalSlice';

const case02 = structuredClone(verticalSlice) satisfies GameCase;
case02.id = 'case-02-acute-decompensated-heart-failure';
case02.version = 1;
case02.title = 'ภาวะหัวใจล้มเหลวกำเริบและน้ำคั่งในปอด';
case02.clinicalStatus = 'CASE 02 · STORY-SUMMARY DEMO · ไม่มีค่า vital หรือ answer key';
case02.gradable = false;
case02.sources = ['Stage3ScenarioSelect.tsx · เรื่องย่อ Case 2'];
case02.assets.patient = '/game/patient-case-02.png';
case02.assets.patientCritical = '/game/patient-case-02.png';
case02.initialVitals = { hr: null, bpSystolic: null, bpDiastolic: null, rr: null, spo2: null };
case02.initialPatient = { condition: 'unstable', breathing: 'labored', posture: 'semi_fowler', animation: 'dyspnea' };
case02.monitorTraces = undefined;
case02.scenarios = [{ id: 'case-02', title: case02.title, summary: 'CASE 02', enabled: true, status: case02.clinicalStatus }];
case02.findings = case02.findings.map(finding => {
  switch (finding.id) {
    case 'history': return { ...finding, text: 'เรื่องย่อระบุ: เหนื่อยเมื่อเดินระยะสั้น นอนราบไม่ได้และหนุนหมอน 3 ใบ น้ำหนักเพิ่ม 3 กก. ใน 1 สัปดาห์ · ไม่มีประวัติส่วนอื่นในข้อมูล Case 2', source: case02.sources[0] };
    case 'lungs': return { ...finding, text: 'บันทึกว่าทำการประเมินทรวงอกแล้ว · เรื่องย่อไม่มีผลฟังปอด จึงไม่แสดงเสียงหรือผลวินิจฉัย', source: case02.sources[0] };
    case 'bp': return { ...finding, text: 'ไม่มีค่าความดันในเรื่องย่อ Case 2', source: case02.sources[0] };
    case 'oxygen': return { ...finding, text: 'ไม่มีค่า SpO₂ ในเรื่องย่อ Case 2', source: case02.sources[0] };
    case 'airway': return { ...finding, text: 'บันทึกการประเมิน A · เรื่องย่อไม่มีผลตรวจทางเดินหายใจ', source: case02.sources[0] };
    case 'breathing': return { ...finding, text: 'บันทึกการประเมิน B · เรื่องย่อระบุเหนื่อยเมื่อออกแรงและนอนราบไม่ได้ โดยไม่มีค่า RR หรือ SpO₂', source: case02.sources[0] };
    case 'circulation': return { ...finding, text: 'บันทึกการประเมิน C · ไม่มีผลตรวจการไหลเวียนหรือตัวเลข vital ในเรื่องย่อ', source: case02.sources[0] };
    case 'diagnosis': return { ...finding, text: 'มีการบันทึกคำตอบเพื่อฝึก · Case 2 ไม่มี answer key ทางคลินิก', source: case02.sources[0] };
    case 'nursing-care': return { ...finding, text: 'มีการบันทึกตัวเลือกเพื่อฝึก · Case 2 ไม่มีเฉลย nursing care ทางคลินิก', source: case02.sources[0] };
    case 'medication': return { ...finding, text: 'ไม่มี Doctor Order หรือข้อมูลยาในเรื่องย่อ Case 2 · แบบฟอร์มนี้ไม่ได้ตรวจขนาดยาหรือแนะนำการใช้ยา', source: case02.sources[0] };
    case 'io': return { ...finding, text: 'ไม่มีตัวเลข intake/output ในเรื่องย่อ Case 2 · ไม่คำนวณหรือเฉลยสมดุลสารน้ำ', source: case02.sources[0] };
    case 'ecg': return { ...finding, text: 'ติด lead ครบในผังเพื่อฝึกการลาก · เรื่องย่อไม่มีคลื่น ECG หรือผลอ่าน', source: case02.sources[0] };
    case 'ecg-read': return { ...finding, text: 'บันทึกข้อความที่ผู้เล่นกรอก · Case 2 ไม่มี rhythm strip หรือ answer key', source: case02.sources[0] };
    case 'emergency-treatment': return { ...finding, text: 'บันทึกการตอบสนองใน simulation · ไม่มี protocol หรือผลการรักษาที่ผ่านการรับรองในเรื่องย่อ Case 2', source: case02.sources[0] };
    default: return finding;
  }
});

case02.missions = case02.missions.map(mission => {
  if (mission.id === 'CASE_INTRO') return { ...mission, title: 'รับช่วงต่อ\nดูแลผู้ป่วย', description: 'หญิงอายุ 65 ปี มีประวัติหัวใจล้มเหลวเรื้อรัง ความดันโลหิตสูง และเบาหวาน · เริ่มจากฟังข้อมูลที่มีในเรื่องย่อ', hint: 'ข้อมูล Case 2 เป็นเรื่องย่อสำหรับเล่นเดโม; vital และเฉลยที่ไม่มีต้นทางจะไม่ถูกเติม', button: 'เริ่มดูแลผู้ป่วย' };
  if (mission.id === 'PATIENT_INFORMATION') return { ...mission, title: 'ฟังผู้ป่วย\nและค้นข้อมูลตั้งต้น', description: 'ลากหรือแตะซักประวัติที่ศีรษะผู้ป่วยเพื่อเปิดเรื่องย่อใน Chart', hint: 'Case 2 ระบุเหนื่อยเมื่อเดินไม่กี่ก้าว นอนราบไม่ได้ และหนุนหมอน 3 ใบ' };
  if (mission.id === 'ASSESSMENT') return { ...mission, title: 'ประเมินผู้ป่วย\nจากข้อมูลที่มี', description: 'ใช้เครื่องมือกับผู้ป่วยเพื่อบันทึกว่าทำการประเมินแล้ว · เรื่องย่อไม่มีค่าความดัน SpO₂ หรือผลฟังปอด', hint: 'ผลที่ไม่ปรากฏใน Case 2 จะถูกบันทึกเป็น “ไม่มีข้อมูล”', dataStatus: 'missing', gradable: false, objectives: mission.objectives?.map(objective => ({ ...objective, feedback: objective.tool === 'stethoscope' ? 'บันทึกการตรวจทรวงอกแล้ว · ไม่มีผลฟังปอดใน Case 2' : `บันทึกการประเมินแล้ว · เรื่องย่อไม่มีค่าที่วัดได้`, })) };
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
    ...mission, dataStatus: 'missing', gradable: false,
    description: 'กรอกแบบฝึกการบันทึกตามช่อง · เรื่องย่อ Case 2 ไม่มี Doctor Order หรือข้อมูลยา',
    hint: 'ไม่มี Doctor Order ในเรื่องย่อ Case 2 · การกรอกจะไม่ถูกตรวจหรือแนะนำการใช้ยา',
    activity: mission.activity ? {
      ...mission.activity, dataStatus: 'missing', source: case02.sources[0], gradable: false, expectedResponses: undefined,
      steps: [], allowMissingDataAcknowledgement: true,
      notice: 'ไม่มี Doctor Order หรือข้อมูลยาในเรื่องย่อ · ช่องด้านล่างเป็นแบบฝึกเปล่า ไม่มีคำแนะนำการใช้ยา',
      rows: [{ label: 'Doctor Order', value: 'ไม่มีข้อมูลในเรื่องย่อ' }, { label: 'ประวัติแพ้ยา', value: 'ไม่มีข้อมูลในเรื่องย่อ' }],
      fields: [],
    } : undefined,
  };
  if (mission.id === 'IO_BALANCE') return {
    ...mission, dataStatus: 'missing', gradable: false,
    description: 'บันทึกลงแบบฝึกโดยใช้ข้อมูลที่มี · เรื่องย่อ Case 2 ไม่มีตัวเลข intake หรือ output',
    hint: 'ไม่มีตัวเลข intake/output ในเรื่องย่อ Case 2 · การเลือกจะไม่ถูกตรวจทางคลินิก',
    activity: mission.activity ? {
      ...mission.activity, dataStatus: 'missing', source: case02.sources[0], gradable: false, expectedResponses: undefined,
      items: [], zones: [], fields: [], allowMissingDataAcknowledgement: true,
      notice: 'ไม่มีตัวเลข intake หรือ output ในเรื่องย่อ · แบบฝึกนี้ไม่คำนวณหรือเฉลยสมดุลสารน้ำ',
      rows: [{ label: 'INTAKE', value: 'ไม่มีข้อมูลในเรื่องย่อ' }, { label: 'OUTPUT', value: 'ไม่มีข้อมูลในเรื่องย่อ' }],
    } : undefined,
    decision: mission.decision ? {
      ...mission.decision, expected: [], options: mission.decision.options.map((option,index) => ({ ...option, label: `ตัวเลือกฝึก ${index + 1}`, detail: 'ไม่มีตัวเลขในเรื่องย่อ · ไม่ระบุแนวโน้ม I/O' })),
      explanation: 'บันทึกการเลือกเพื่อฝึกแล้ว · ไม่มีตัวเลขหรือเฉลย I/O ใน Case 2',
      success: 'บันทึกการเลือกแล้ว · ไม่มีการตัดสินผลสมดุลสารน้ำ',
    } : undefined,
  };
  if (mission.id === 'EMERGENCY_TRANSITION') return { ...mission, description: 'เข้าสู่ช่วงฉุกเฉินของ simulation · เรื่องย่อไม่มีตัวเลข vital ให้แสดง', hint: 'สังเกตสถานะผู้ป่วยและเสียงเตือน โดย Monitor จะแสดง “ไม่มีข้อมูล”', onEnter: { emergency: true, alarm: true, duration: 5000, vitals: {}, patient: { condition: 'critical', breathing: 'severe', animation: 'critical' } } };
  if (mission.id === 'ECG_INTERPRETATION') return {
    ...mission, dataStatus: 'missing', gradable: false,
    description: 'บันทึกข้อความเพื่อฝึก · เรื่องย่อ Case 2 ไม่มีคลื่น ECG หรือผลอ่าน',
    hint: 'ไม่มี rhythm strip หรือ answer key · ข้อความที่กรอกจะไม่ถูกตรวจทางคลินิก',
    activity: mission.activity ? {
      ...mission.activity, dataStatus: 'missing', source: case02.sources[0], gradable: false, expectedResponses: undefined,
      eyebrow: 'ECG NOTES · CASE 02 PRACTICE', title: 'บันทึกข้อความฝึก',
      notice: 'เรื่องย่อ Case 2 ไม่มี ECG rhythm strip หรือ answer key · ข้อความจะถูกบันทึกเพื่อฝึกเท่านั้น',
      fields: (mission.activity.fields ?? []).map(field => ({ ...field, label: 'ข้อความฝึก', placeholder: 'บันทึกข้อความ · ไม่มีข้อมูลคลื่น ECG', type: 'text' as const, options: undefined })),
    } : undefined,
  };
  if (mission.id === 'EMERGENCY_TREATMENT') return {
    ...mission, dataStatus: 'missing', gradable: false,
    description: 'เลือกการตอบสนองทั่วไปเพื่อดู transition ของ simulation · ไม่มี treatment sequence ในเรื่องย่อ Case 2',
    hint: 'ตัวเลือกเป็นกลไกสำหรับจบช่วงฝึก ไม่ใช่แนวทางรักษา',
    decision: mission.decision ? {
      ...mission.decision, expected: [], slots: mission.decision.slots?.map((slot,index) => ({ ...slot, label: `ช่องฝึก ${index + 1}`, expected: '' })),
      options: mission.decision.options.map((option,index) => ({ ...option, label: `การตอบสนองฝึก ${index + 1}`, detail: 'ตัวเลือกทั่วไปสำหรับ simulation · ไม่มี protocol ในข้อมูล Case 2' })),
      explanation: 'Case 2 ไม่มี treatment sequence · เลือกเพื่อฝึกและยืนยันเท่านั้น',
      success: 'บันทึกการตอบสนองเพื่อฝึกแล้ว · simulation จะเข้าสู่ช่วงสรุป',
    } : undefined,
  };
  if (mission.id === 'PATIENT_STABILIZED') return { ...mission, description: 'เล่นภาพตอบสนองของ simulation เพื่อจบภารกิจ · ไม่มีการอ้างผลการรักษาหรือตัวเลข vital', onEnter: { alarm: false, duration: 0, patient: { condition: 'stable', breathing: 'normal', animation: 'recovering' } } };
  if (mission.id === 'CASE_SUMMARY') return { ...mission, description: 'จบ Case 2 demo · สรุปเฉพาะข้อมูลจากเรื่องย่อและการกระทำที่ผู้เล่นทำ โดยไม่มีคะแนนความสามารถทางคลินิก' };
  return mission;
});

export { case02 };
