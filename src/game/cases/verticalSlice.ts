import type { GameCase } from '../types';
import { medicationInteractions } from './medicationWorkbench';
import { MEDICATION_PREPARATION_STEPS } from '../../data/medicationStepsData';
import { registerSuppliedPatientHotspots, suppliedPatientPresentation } from '../suppliedPatientPresentation';
import { ASSETS } from '../../constants/assets';
import { suppliedECGLayout, suppliedECGTargets } from '../suppliedECGLayout';

const spec = 'Case1 draft sources in src/data/case1Data.ts, ehrCase1Data.ts, medicationStepsData.ts, nursingDiagnosesData.ts, Stage11IORecord.tsx, Stage12CrisisEvent.tsx (demo only; clinician review pending)';
const storyboard = '6 Panel Storyboard.pdf pp.3-7';
const suppliedCase = 'เนื้อหาSim.pdf · ฉบับ 32 หน้า · เคส 1 หน้า 2–4 และ 22–31 · SHA256 c0c6e960c54d50104cd1de548354e7e7b38332ffc076a0978bd408c973951aac';
const medicationEquipment = [
  { label: 'ตรวจ Doctor Order', equipmentLabel: 'แฟ้มคำสั่งยา', icon: 'order' as const },
  { label: 'ตรวจฉลากแอมพูล', equipmentLabel: 'แอมพูล / ฉลาก', icon: 'ampoule' as const },
  { label: 'เตรียมอุปกรณ์ปลอดเชื้อ', equipmentLabel: 'อุปกรณ์เตรียมยา', icon: 'aseptic' as const },
  { label: 'ดูดยาตาม Order ด้วย Syringe', equipmentLabel: 'Syringe', icon: 'syringe' as const },
  { label: 'ตรวจซ้ำและติดฉลาก', equipmentLabel: 'ป้ายตรวจซ้ำ', icon: 'double-check' as const },
  { label: 'ยืนยันตัวผู้ป่วย', equipmentLabel: 'สายรัดข้อมือ', icon: 'patient-id' as const },
  { label: 'ตรวจ Monitor และบันทึก MAR', equipmentLabel: 'Monitor / MAR', icon: 'monitor' as const },
];
export const verticalSlice: GameCase = {
  id: 'cardiosim-vertical-slice', version: 3,
  title: 'หัวใจล้มเหลวกำเริบร่วมกับภาวะน้ำเกิน',
  clinicalStatus: 'CASE 01 · DEMO DATA · รอผู้เชี่ยวชาญตรวจรับรอง',
  gradable: true,
  sources: [storyboard, spec, suppliedCase],
  assets: { room: ASSETS.environments.patientRoom, patient: ASSETS.patients.patientCase02, patientCritical: ASSETS.patients.patientCase02, patientSupport: {bed:ASSETS.patients.patientCase02Bed,pillow:ASSETS.patients.patientCase02Pillow}, ecgLeads: ASSETS.ecg.chestLeads[0].electrode, ecgChest: ASSETS.ecg.playTorso },
  presentation: suppliedPatientPresentation,
  initialVitals: { hr: 108, bpSystolic: 165, bpDiastolic: 95, rr: 24, spo2: 92 },
  initialPatient: { condition: 'unstable', breathing: 'labored', posture: 'semi_fowler', animation: 'dyspnea' },
  monitorTraces: {
    unstable: { rhythm: 'SINUS_TACHY', heartRate: 108 },
    critical: { rhythm: 'SINUS_TACHY', heartRate: 125 },
    stable: { rhythm: 'NORMAL', heartRate: 92 },
  },
  scoring: { initial: 100, mistakePenalty: 3, hintPenalty: 2 },
  scenarios: [
    { id: 'case-01', title: 'Acute Decompensated Heart Failure with Fluid Overload and Pulmonary Congestion', summary: 'NORMAL STAGE · CASE 01', enabled: true, status: 'DEMO · เนื้อหาคลินิกรอตรวจรับรอง' },
  ],
  hotspots: registerSuppliedPatientHotspots([
    { id: 'head', label: 'ศีรษะ / ทางเดินหายใจ', x: 550, y: 280, radius: 53 },
    { id: 'chest', label: 'ทรวงอก', x: 550, y: 395, radius: 62 },
    { id: 'arm', label: 'ต้นแขน', x: 455, y: 470, radius: 34 },
    { id: 'wrist', label: 'ข้อมือ / การไหลเวียน', x: 655, y: 553, radius: 30 },
    { id: 'finger', label: 'ปลายนิ้ว', x: 445, y: 584, radius: 30 },
  ]),
  tools: [
    { id: 'interview', name: 'ซักประวัติ', icon: 'interview', allowedTargets: ['head'], duration: 700 },
    { id: 'stethoscope', name: 'Stethoscope', icon: 'stethoscope', sprite: ASSETS.handover.playStethoscope, visual: { heldSize: { x: 68, y: 68 }, heldOffset: { x: 18, y: -20 }, contactSize: { x: 100, y: 100 }, contactOffset: { x: 0, y: 0 }, contactAngle: -12, contactAnchor: {x:.915,y:.4}, contactEffect: 'listen' }, allowedTargets: ['chest'], duration: 1500 },
    { id: 'bp', name: 'BP cuff', icon: 'bp', visual: { heldSize: { x: 72, y: 64 }, heldOffset: { x: 16, y: -16 }, contactSize: { x: 64, y: 56 }, contactOffset: { x: 0, y: 0 }, contactAngle: 8, contactEffect: 'pressure' }, allowedTargets: ['arm'], duration: 1100 },
    { id: 'spo2', name: 'SpO₂', icon: 'spo2', visual: { heldSize: { x: 58, y: 58 }, heldOffset: { x: 15, y: -18 }, contactSize: { x: 46, y: 46 }, contactOffset: { x: 0, y: 0 }, contactAngle: 0, contactEffect: 'sensor' }, allowedTargets: ['finger'], duration: 900 },
    { id: 'hand', name: 'ประเมิน ABC', icon: 'hand', sprite: ASSETS.handover.examMagnifier, visual:{heldSize:{x:70,y:70},heldOffset:{x:15,y:-15},contactSize:{x:65,y:65},contactOffset:{x:0,y:0},contactAngle:0,contactAnchor:{x:.5,y:.45},contactEffect:'inspect'}, allowedTargets: ['head', 'chest', 'wrist'], duration: 900 },
  ],
  findings: [
    { id: 'history', section: 'History', title: 'อาการที่ผู้ป่วยบอก', text: 'ผู้ป่วยหญิงอายุ 65 ปี มี Chronic Heart Failure และ Hypertension หนึ่งสัปดาห์ก่อนมาโรงพยาบาลน้ำหนักเพิ่ม 3 กก. ขาบวมและปัสสาวะลดลง สองวันก่อนมาโรงพยาบาลเหนื่อยมากขึ้น นอนราบไม่ได้ และตื่นกลางดึกจากหายใจหอบเหนื่อย ตรวจพบ pitting edema 2+, JVP โป่ง และ capillary refill time 3 วินาที', source: suppliedCase },
    { id: 'lungs', section: 'Respiratory Assessment', title: 'Auscultation', text: 'Bibasal fine crackles ตามข้อมูลประเมินเคส 1 หน้า 2–4', source: suppliedCase },
    { id: 'bp', section: 'Vital Signs', title: 'วัดความดันโลหิต', text: 'บันทึกสัญญาณชีพ ณ เวลาที่ตรวจ', source: suppliedCase, captureVitals: true },
    { id: 'oxygen', section: 'Vital Signs', title: 'วัด SpO₂', text: 'บันทึกสัญญาณชีพ ณ เวลาที่ตรวจ', source: suppliedCase, captureVitals: true },
    { id: 'airway', section: 'Respiratory Assessment', title: 'A · Airway', text: 'ผู้ป่วยยังรู้สึกตัว พูดเป็นประโยคยาวไม่ได้ ไอมีเสมหะเป็นฟองสีชมพู ต้องประเมินความโล่งของทางเดินหายใจ', source: suppliedCase },
    { id: 'breathing', section: 'Respiratory Assessment', title: 'B · Breathing', text: 'RR 34 ครั้ง/นาที, SpO₂ 82% ขณะ On O₂ Cannula 3 LPM ใช้กล้ามเนื้อช่วยหายใจ และมี fine crackles ทั้งสองข้าง', source: suppliedCase },
    { id: 'circulation', section: 'Perfusion Assessment', title: 'C · Circulation', text: 'HR 125 ครั้ง/นาที และ BP 180/105 mmHg ในช่วงฉุกเฉิน', source: suppliedCase },
    { id: 'diagnosis', section: 'Care Plan', title: 'Nursing Diagnosis · demo', text: 'ตัวเลือกและเฉลยเป็นชุดทดสอบ interaction จากข้อมูลตัวอย่าง ยังไม่ใช่คำวินิจฉัยที่ผ่านการรับรอง', source: spec },
    { id: 'nursing-care', section: 'Care Plan', title: 'Nursing Care · demo', text: 'บันทึกการเลือกการพยาบาลตัวอย่างเพื่อทดสอบ flow; clinical key รอผู้เชี่ยวชาญตรวจ', source: storyboard },
    { id: 'medication', section: 'Medication', title: 'Medication worksheet · draft', text: 'Storyboard ไม่ระบุ Doctor Order, ชื่อยา, ขนาดยา, ผลข้างเคียง หรือการติดตาม; แบบฟอร์มนี้ยังไม่ใช่คำสั่งรักษา', source: storyboard },
    { id: 'io', section: 'Intake / Output', title: 'Fluid-balance decision · example', text: 'Storyboard ระบุเฉลยตัวอย่าง NEGATIVE แต่ไม่แสดงตัวเลข intake/output จึงยังใช้คำนวณสมดุลจริงไม่ได้', source: storyboard },
    { id: 'ecg', section: 'ECG', title: 'Chest leads V1–V6', text: 'ติดครบทั้ง 6 ตำแหน่งในผังจำลอง คลื่นบน Monitor เป็นภาพประกอบ ยังไม่มีคลื่นและเฉลย ECG ที่รับรอง', source: storyboard },
    { id: 'ecg-read', section: 'ECG', title: 'ECG interpretation · draft', text: 'เอกสารเคส 1 หน้า 26 ระบุ Sinus tachycardia คลื่นบน Monitor เป็นภาพประกอบสำหรับสถานการณ์ฝึก', source: suppliedCase },
    { id: 'emergency-treatment', section: 'Care Plan', title: 'การพยาบาลฉุกเฉิน', text: 'คำตอบตามเอกสารเคส 1 หน้า 27–29 ประกอบด้วยจัดท่า High Fowler’s ติดตาม EKG และสัญญาณชีพ เตรียม/เพิ่มระดับออกซิเจนตามอาการ และให้ Furosemide ตามแผนการรักษา', source: suppliedCase },
  ],
  ecg: {
    finding: 'ecg', label: 'CHEST LEAD PLACEMENT · ผังจากเวชนิทัศน์ รอตรวจตำแหน่งโดยผู้เชี่ยวชาญ',
    layout: suppliedECGLayout,
    targets: suppliedECGTargets,
  },
  missions: [
    { id: 'CASE_INTRO', kind: 'intro', phase: 'เริ่มต้นการดูแล', title: 'รับช่วงต่อ\nการดูแลผู้ป่วย', description: 'หญิงอายุ 65 ปี มี Chronic Heart Failure และ Hypertension เหนื่อยหอบ นอนราบไม่ได้ น้ำหนักเพิ่มและขาบวม', hint: 'ข้อมูลแรกรับ HR 108, BP 165/95 mmHg, RR 24 และ SpO₂ 92% Room air ตามเอกสารหน้า 2', button: 'เริ่มดูแลผู้ป่วย' },
    { id: 'PATIENT_INFORMATION', kind: 'interaction', phase: '01 · PATIENT INFORMATION', title: 'ฟังผู้ป่วย\nก่อนเริ่มประเมิน', description: 'เลือกซักประวัติ แล้วแตะบริเวณศีรษะเพื่อรับข้อมูล ข้อมูลที่ค้นพบจะบันทึกลง Patient chart', hint: 'เลือก “ซักประวัติ” แล้วแตะศีรษะผู้ป่วย', button: 'เริ่มประเมิน', objectives: [
      { id: 'history', label: 'รับข้อมูลจากผู้ป่วย', tool: 'interview', target: 'head', finding: 'history', feedback: 'บันทึกประวัติเหนื่อยหอบ นอนราบไม่ได้ และภาวะน้ำเกินแล้ว' },
    ] },
    { id: 'ASSESSMENT', kind: 'interaction', phase: '02 · PATIENT ASSESSMENT', title: 'ค้นหาข้อมูล\nจากการตรวจ', description: 'ตรวจการหายใจ ความดัน และออกซิเจนด้วยเครื่องมือใน Toolbar เลือกแล้วแตะ หรือลากไปยังผู้ป่วย', hint: 'Stethoscope → ทรวงอก · BP cuff → ต้นแขน · SpO₂ → ปลายนิ้ว', button: 'บันทึกการประเมิน', objectives: [
      { id: 'lungs', label: 'Respiratory assessment', tool: 'stethoscope', target: 'chest', finding: 'lungs', feedback: 'พบ fine crackles · บันทึกผลฟังปอดแล้ว', sound: 'auscultation' },
      { id: 'bp', label: 'Blood pressure', tool: 'bp', target: 'arm', finding: 'bp', feedback: 'บันทึกความดันและสัญญาณชีพแล้ว' },
      { id: 'oxygen', label: 'Oxygen saturation', tool: 'spo2', target: 'finger', finding: 'oxygen', feedback: 'บันทึก SpO₂ แล้ว' },
    ] },
    { id: 'DIAGNOSIS', kind: 'decision', phase: '03 · NURSING DIAGNOSIS', title: 'จัดวางปัญหาและ\nข้อมูลสนับสนุน', description: 'ลากตัวเลือกจากคลังคำตอบลงช่อง Nursing Problem และ Supporting Data แล้วกด Confirm', hint: 'ตัวเลือกและเฉลยเป็น demo key จากข้อมูลตัวอย่าง ยังรอผู้เชี่ยวชาญรับรอง', chartFinding: 'diagnosis', decision: {
      options: [
        { id: 'breathing-problem', label: 'ประเด็นด้านการหายใจ · ตัวอย่าง', detail: 'candidate answer · ต้องให้ผู้เชี่ยวชาญรับรอง', icon: 'assessment' },
        { id: 'other-problem', label: 'ประเด็นด้านอื่น · ตัวอย่าง', detail: 'ตัวเลือกสำหรับทดสอบการลองใหม่', icon: 'assessment' },
        { id: 'respiratory-evidence', label: 'ข้อมูลระบบหายใจที่ค้นพบ', detail: 'เชื่อมโยงกับผลประเมินใน Chart', icon: 'monitor' },
        { id: 'unrelated-evidence', label: 'ข้อมูลที่ไม่เกี่ยวกับการประเมิน', detail: 'ตัวเลือกสำหรับทดสอบ feedback', icon: 'care' },
      ], expected: ['breathing-problem', 'respiratory-evidence'], ordered: false, answerMode: 'drag-slot', presentation: 'bedside-clipboard',
      slots: [{ id: 'problem', label: 'Nursing Problem', expected: 'breathing-problem' }, { id: 'support', label: 'Supporting Data', expected: 'respiratory-evidence' }],
      explanation: '✕ ลองจับคู่ประเด็นกับข้อมูลที่ค้นพบใหม่ · demo key ยังไม่ผ่านการรับรอง', success: '✓ จับคู่ครบ · บันทึกเป็นผล demo ที่รอ clinical review',
    } },
    { id: 'NURSING_INTERVENTION', kind: 'decision', phase: '04 · NURSING CARE', title: 'เลือกการพยาบาล\nให้สัมพันธ์กับปัญหา', description: 'ใช้ nursing diagnosis จากขั้นก่อน แล้วลากการพยาบาลไปใส่ในช่องคำตอบ กด Confirm เพื่อตรวจ', hint: 'ตัวเลือกเป็น demo interaction เท่านั้น · แผนการพยาบาลรอผู้เชี่ยวชาญกำหนด', chartFinding: 'nursing-care', decision: {
      options: [
        { id: 'position-care', label: 'จัดท่าผู้ป่วยตามแผน', detail: 'เครื่องมือปรับเตียงตามที่ storyboard ระบุ', icon: 'position' },
        { id: 'monitor-care', label: 'ติดตามผลประเมินซ้ำ', detail: 'ใช้ข้อมูล vital signs ที่ตรวจพบ', icon: 'monitor' },
        { id: 'skip-monitoring', label: 'ไม่บันทึกการติดตาม', detail: 'ตัวเลือกสำหรับลองผิดและดูคำอธิบาย', icon: 'care' },
      ], expected: ['position-care', 'monitor-care'], ordered: false, answerMode: 'drag-slot', presentation: 'bedside-clipboard',
      slots: [{ id: 'intervention-1', label: 'การพยาบาล · 1', expected: 'position-care' }, { id: 'intervention-2', label: 'การพยาบาล · 2', expected: 'monitor-care' }],
      explanation: '✕ เลือกการพยาบาลให้สัมพันธ์กับข้อมูลผู้ป่วยอีกครั้ง · key นี้เป็น demo เท่านั้น', success: '✓ บันทึกการพยาบาลตัวอย่างแล้ว · ยังไม่ใช่แผนทางคลินิก',
    } },
    { id: 'MEDICATION', kind: 'decision', phase: '05 · MEDICATION', title: 'ตรวจคำสั่งยา\nและบันทึกการเตรียม', description: 'อ่าน Doctor Order ใน Case แล้วกรอกยา ขนาด วิธีให้ และสิ่งที่ต้องเฝ้าระวัง ก่อน Confirm', hint: 'ตรวจ order ที่แสดง แล้วเทียบกับข้อมูลยาในแบบฝึก', chartFinding: 'medication', gradable: true, activity: {
      kind: 'medication', presentation: 'medication-station', gradable: true, source: 'ehrCase1Data.ts + medicationStepsData.ts', eyebrow: 'MEDICATION PREP STATION · CASE 01 DEMO', title: 'สถานีเตรียมยา',
      steps: MEDICATION_PREPARATION_STEPS.map((step,index) => ({ id: step.id, label: medicationEquipment[index]?.label ?? `เตรียมยา · ขั้น ${step.stepNumber}`, detail: step.text.replace(/^\d+\.\s*/, ''), equipmentLabel: medicationEquipment[index]?.equipmentLabel ?? 'อุปกรณ์เตรียมยา', icon: medicationEquipment[index]?.icon ?? 'order', interaction: medicationInteractions[step.id] })),
      notice: 'ข้อมูลยาเป็นเนื้อหาเดโมจากเว็บเดิม รอผู้เชี่ยวชาญตรวจรับรอง',
      rows: [{ label: 'Doctor Order', value: 'Furosemide 40 mg IV slow push stat over 2 minutes' }, { label: 'แพ้ยา', value: 'NKDA · ตาม EHR draft' }],
      fields: [
        { id: 'drug', label: 'ยา', placeholder: 'เลือกยา', type: 'select', options: ['Furosemide (Lasix)', 'Dopamine', 'Morphine'] },
        { id: 'dose', label: 'ขนาดยาตาม order · mg', placeholder: '40', type: 'number' },
        { id: 'route', label: 'วิธีให้ยา', placeholder: 'เลือกวิธีให้', type: 'select', options: ['IV slow push', 'IV drip', 'รับประทาน'] },
        { id: 'side-effect', label: 'ผลข้างเคียงตัวอย่างที่ต้องเฝ้าระวัง', placeholder: 'เลือกคำตอบเพื่อบันทึกการฝึก', type: 'select', options: ['Hypotension', 'Hypokalemia', 'Hypomagnesemia', 'Increased urine output'], assessmentMode: 'record-only' },
        { id: 'monitoring', label: 'การติดตามตามข้อมูลเคส', placeholder: 'เลือกการติดตาม', type: 'select', options: ['BP, urine output, K⁺/Mg²⁺', 'ติดตามเฉพาะอุณหภูมิ', 'ไม่ต้องติดตาม'] },
      ],
      expectedResponses: { drug: 'Furosemide (Lasix)', dose: '40', route: 'IV slow push', monitoring: 'BP, urine output, K⁺/Mg²⁺' },
      success: 'บันทึกแบบฝึกแล้ว · ช่องผลข้างเคียงเก็บคำตอบเพื่อทบทวนโดยยังไม่ตัดสินถูกผิด',
      explanation: 'ตรวจช่องยา ขนาด วิธีให้ และการติดตามกับข้อมูลเดโมอีกครั้ง',
    } },
    { id: 'IO_BALANCE', kind: 'decision', phase: '06 · INTAKE / OUTPUT', title: 'คำนวณสมดุล\nสารน้ำเข้าและออก', description: 'รวมสารน้ำเข้าและออกในเวรตัวอย่าง กรอกผลคำนวณ เลือกแนวโน้ม แล้ว Confirm', hint: 'Intake: IV 100 mL + oral 50 mL · Output: urine 350 mL', chartFinding: 'io', gradable: true, activity: {
      kind: 'fluid-balance', presentation: 'io-board', gradable: true, source: 'Stage11IORecord.tsx', eyebrow: 'BEDSIDE I/O BOARD · CASE 01 DEMO', title: 'บันทึกสารน้ำข้างเตียง',
      items: [{ visual:'iv', id: 'iv-intake', label: 'IV · 100 mL', zoneId: 'intake' }, { visual:'drink', id: 'oral-intake', label: 'Oral · 50 mL', zoneId: 'intake' }, { visual:'urine', id: 'urine-output', label: 'Urine · 350 mL', zoneId: 'output' }],
      zones: [{ id: 'intake', label: 'INTAKE · สารน้ำเข้า' }, { id: 'output', label: 'OUTPUT · สารน้ำออก' }],
      notice: 'ตัวเลขนี้เป็นแบบฝึกเดโมจากเว็บเดิม ไม่ใช่คำแนะนำการรักษา',
      rows: [{ label: 'IV intake', value: '100 mL' }, { label: 'Oral intake', value: '50 mL' }, { label: 'Urine output', value: '350 mL' }],
      fields: [
        { id: 'intake-total', label: 'สารน้ำเข้ารวม · mL', placeholder: '150', type: 'number' },
        { id: 'output-total', label: 'สารน้ำออกรวม · mL', placeholder: '350', type: 'number' },
        { id: 'balance-total', label: 'สมดุลสุทธิ · mL', placeholder: '-200', type: 'number' },
      ],
      expectedResponses: { 'intake-total': '150', 'output-total': '350', 'balance-total': '-200' },
      success: 'คำนวณตรงกับข้อมูล I/O เดโม · บันทึกผลแล้ว',
      explanation: 'รวม IV 100 mL กับ oral 50 mL แล้วหัก urine output 350 mL · ตรวจตัวเลขอีกครั้ง',
    }, decision: {
      options: [
        { id: 'positive', label: 'POSITIVE', detail: 'สารน้ำเข้ามากกว่าสารน้ำออก', icon: 'assessment' },
        { id: 'negative', label: 'NEGATIVE · −200 mL', detail: 'สารน้ำออกมากกว่าสารน้ำเข้า', icon: 'assessment' },
      ], expected: ['negative'], ordered: false, explanation: 'ตัวเลขหรือผลรวมยังไม่ตรงกับข้อมูล I/O เดโม · ตรวจคำตอบแล้วลองใหม่', success: 'ผลคำนวณตรงกับข้อมูล I/O เดโม',
    } },
    { id: 'EMERGENCY_TRANSITION', kind: 'transition', phase: 'EMERGENCY', title: 'อาการผู้ป่วย\nกำลังเปลี่ยนไป', description: 'สังเกตการหายใจและ Monitor เตรียมประเมิน ABC ในห้องผู้ป่วยเดิม', hint: 'ดู BP, HR, RR และ SpO₂ ที่กำลังเปลี่ยนแปลง · ระบบเข้าสู่ ABC อัตโนมัติ', autoAfter: 5000, onEnter: { emergency: true, alarm: true, duration: 5000, vitals: { bpSystolic: 180, bpDiastolic: 105, hr: 125, rr: 34, spo2: 82 }, patient: { condition: 'critical', breathing: 'severe', animation: 'critical' } } },
    { id: 'ABC_ASSESSMENT', kind: 'interaction', ordered: true, phase: '07 · EMERGENCY / ABC', title: 'ประเมิน ABC\nอย่างเป็นลำดับ', description: 'ใช้เครื่องมือ “ประเมิน ABC” ตรวจผู้ป่วยตามลำดับ A → B → C ไม่ต้องเปลี่ยนออกจากห้อง', hint: 'A → ศีรษะ · B → ทรวงอก · C → ข้อมือ เลือกเครื่องมือประเมิน ABC', button: 'เตรียมติด ECG', objectives: [
      { id: 'a', label: 'A · Airway', tool: 'hand', target: 'head', finding: 'airway', feedback: 'A ประเมินทางเดินหายใจแล้ว' },
      { id: 'b', label: 'B · Breathing', tool: 'hand', target: 'chest', finding: 'breathing', feedback: 'B ประเมินการหายใจแล้ว' },
      { id: 'c', label: 'C · Circulation', tool: 'hand', target: 'wrist', finding: 'circulation', feedback: 'C ประเมินการไหลเวียนแล้ว' },
    ] },
    { id: 'ECG_PLACEMENT', kind: 'placement', phase: '08 · ECG / CHEST LEADS', title: 'เชื่อมต่อ\nสัญญาณหัวใจ', description: 'ลาก V1–V6 จากถาดไปวางบนผังทรวงอกให้ครบ หรือเลือก lead แล้วแตะตำแหน่ง กด Confirm เมื่อติดครบ', hint: 'ขวาของผู้ป่วยอยู่ซ้ายของภาพ ใช้ปุ่ม Hint เพื่อแสดงชื่อและตำแหน่งของแต่ละ lead', button: 'Confirm · บันทึก ECG' },
    { id: 'ECG_INTERPRETATION', kind: 'decision', phase: '09 · ECG REVIEW', title: 'อ่านผล ECG\nและบันทึกคำตอบ', description: 'อ่านจังหวะที่ระบุใน Case 1 demo แล้วกรอกคำตอบก่อน Confirm', hint: 'ใช้จังหวะที่เอกสารเคส 1 หน้า 26 ระบุ คลื่นบน Monitor เป็นภาพประกอบ', chartFinding: 'ecg-read', gradable: true, activity: {
      kind: 'text-response', presentation: 'ecg-console', gradable: true, source: suppliedCase, eyebrow: 'ECG REVIEW CONSOLE · CASE 01 DEMO', title: 'ทบทวนจังหวะจาก Monitor',
      notice: 'คลื่นเป็นภาพประกอบเดโม · คำตอบตรวจเทียบกับ Case 1 draft เท่านั้น',
      rows: [{ label: 'Crisis event · ECG rhythm', value: 'Sinus tachycardia · 125 ครั้ง/นาที ตามเอกสารหน้า 26' }],
      fields: [{ id: 'rhythm-answer', label: 'จังหวะที่บันทึกใน Case', placeholder: 'เลือกคำตอบจากข้อมูลเดโม', type: 'select', options: ['Atrial fibrillation', 'Sinus tachycardia', 'Ventricular tachycardia'] }],
      expectedResponses: { 'rhythm-answer': 'Sinus tachycardia' },
      success: 'อ่านตรงกับคำตอบใน Case 1 demo · บันทึกลง Chart แล้ว',
      explanation: 'ลองตรวจ rhythm ที่ระบุใน Case 1 demo อีกครั้ง',
    } },
    { id: 'EMERGENCY_TREATMENT', kind: 'decision', phase: '10 · EMERGENCY TREATMENT', title: 'เลือกการตอบสนอง\nแล้วดูผลที่ผู้ป่วย', description: 'อ่านคำสั่งแพทย์ เลือกยา แล้วลากการพยาบาลไปจับคู่กับทั้ง 4 กรอบก่อนยืนยัน', hint: 'เลือกการดูแลเรื่องท่า การติดตาม ออกซิเจน และยาตามข้อมูลเคส 1 หน้า 27–29', button: 'Confirm · ตรวจคำตอบ', chartFinding: 'emergency-treatment', gradable: true, activity: {
      kind: 'matching', eyebrow: 'Doctor Order', title: 'เลือกยาตามคำสั่งแพทย์',
      source: suppliedCase, gradable: true,
      fields: [{ id: 'emergency-medication', label: 'เลือกยาตาม Doctor Order', placeholder: 'เลือกยา', type: 'select', options: ['Furosemide (Lasix)', 'Dobutamine', 'Amiodarone'] }],
      expectedResponses: { 'emergency-medication': 'Furosemide (Lasix)' },
    }, decision: {
      rows: [
        { label: 'Doctor Order', value: 'Furosemide 40 mg IV stat' },
        { label: 'O₂', value: 'Cannula 5 L/min เป้าหมาย SpO₂ ≥ 94%' },
      ],
      options: [
        { id: 'position-high-fowler', label: 'จัดท่า High Fowler’s position', detail: 'เลือกการพยาบาลให้สัมพันธ์กับกรอบ' },
        { id: 'rapid-iv-fluid', label: 'เพิ่มสารน้ำ IV อย่างรวดเร็ว', detail: 'เลือกการพยาบาลให้สัมพันธ์กับกรอบ' },
        { id: 'monitor-ecg-vitals', label: 'Monitor EKG และ Vital signs อย่างต่อเนื่อง', detail: 'เลือกการพยาบาลให้สัมพันธ์กับกรอบ' },
        { id: 'patient-walking', label: 'ให้ผู้ป่วยลุกเดินเพื่อประเมินอาการ', detail: 'เลือกการพยาบาลให้สัมพันธ์กับกรอบ' },
        { id: 'oxygen-support', label: 'เตรียม/เพิ่มระดับการให้ออกซิเจนตามอาการ', detail: 'เลือกการพยาบาลให้สัมพันธ์กับกรอบ' },
        { id: 'ordered-furosemide', label: 'ให้ Furosemide ตามแผนการรักษา', detail: 'เลือกการพยาบาลให้สัมพันธ์กับกรอบ' },
      ], expected: ['position-high-fowler','monitor-ecg-vitals','oxygen-support','ordered-furosemide'], ordered: false, answerMode: 'drag-slot', presentation: 'monitor-response',
      slots: [
        { id: 'response', label: 'การจัดท่า', expected: 'position-high-fowler' },
        { id: 'monitoring', label: 'การติดตามผู้ป่วย', expected: 'monitor-ecg-vitals' },
        { id: 'oxygen', label: 'การให้ออกซิเจน', expected: 'oxygen-support' },
        { id: 'medication', label: 'ยาตามคำสั่งแพทย์', expected: 'ordered-furosemide' },
      ],
      explanation: 'ทบทวนการพยาบาลทั้ง 4 กรอบตามเอกสารเคส 1 หน้า 29 แล้วลองใหม่',
      success: 'จับคู่ตรงกับคำตอบในเอกสารเคส 1 แล้ว · ดูผลตอบสนองจำลองของผู้ป่วย',
    } },
    { id: 'PATIENT_STABILIZED', kind: 'transition', phase: '11 · PATIENT RESPONSE', title: 'ผู้ป่วยตอบสนอง\nต่อการดูแล', description: 'สัญญาณชีพเปลี่ยนตามผลลัพธ์จำลองที่เอกสารเคส 1 หน้า 30–31 กำหนด', hint: 'สังเกตการหายใจ สีหน้าและเสียงเตือน · ตัวเลขยังเป็นเนื้อหาเดโม', minDuration: 6500, button: 'ดูผลภารกิจ', onEnter: { alarm: false, duration: 6000, vitals: { bpSystolic: 150, bpDiastolic: 90, hr: 92, rr: 24, spo2: 94 }, patient: { condition: 'stable', breathing: 'normal', animation: 'recovering' } } },
    { id: 'CASE_SUMMARY', kind: 'summary', phase: '12 · MISSION RESULT', title: 'ดูแลครบ\nจบภารกิจจำลอง', description: 'ผลนี้สรุปเส้นทางในห้องผู้ป่วยเดียว ตั้งแต่ Normal Stage ไป Emergency Stage · คะแนนยังไม่ใช่สมรรถนะทางคลินิก', hint: 'ทบทวน Chart หรือเริ่มใหม่ได้' },
  ],
};
