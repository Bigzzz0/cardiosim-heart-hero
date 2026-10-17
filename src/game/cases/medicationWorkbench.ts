import type { ActivityStepInteraction } from '../types';

// Mechanical actions reference the existing order/steps; missing label and ID
// fields remain explicit acknowledgements, never fabricated clinical answers.
export const medicationInteractions: Record<string, ActivityStepInteraction> = {
 step_order_check: {kind:'inspect',targets:[],objects:[
  {id:'order',label:'เปิด Doctor Order',icon:'order',rowLabel:'Doctor Order'},
  {id:'allergy',label:'ตรวจประวัติแพ้ยา',icon:'patient-id',rowLabel:'แพ้ยา'},
 ]},
 step_label_check: {kind:'inspect',targets:[{id:'label-reader',label:'แท่นตรวจฉลาก'}],objects:[
  {id:'ampoule',label:'แอมพูล / ฉลากยา',icon:'ampoule',rowLabel:'Doctor Order',targetId:'label-reader'},
  {id:'missing-label',label:'รับทราบข้อมูลฉลากที่ขาด',icon:'order',detail:'ไม่มีภาพฉลาก ความเข้มข้น หรือวันหมดอายุที่รับรอง · ไม่ตรวจความถูกต้องของข้อมูลเหล่านี้',acknowledgement:true},
 ]},
 step_handwash_prep: {kind:'collect',targets:[{id:'sterile-tray',label:'ถาดเตรียมอุปกรณ์'}],objects:[
  {id:'syringe',label:'Syringe',icon:'syringe',targetId:'sterile-tray'},
  {id:'needle',label:'Needle',icon:'syringe',visual:'needle',targetId:'sterile-tray'},
  {id:'pad',label:'Alcohol Pad',icon:'aseptic',visual:'pad',targetId:'sterile-tray'},
  {id:'aseptic-review',label:'ทบทวนขั้นปลอดเชื้อ',icon:'aseptic',detail:'รับทราบการล้างมือและเตรียมอุปกรณ์ตามข้อความต้นทาง · กิจกรรมนี้ไม่ประเมินเทคนิคปลอดเชื้อ',acknowledgement:true},
 ]},
 step_draw_med: {kind:'syringe-withdrawal',targetId:'ampoule',targetAmount:4,scaleMax:5,accuracyWindow:.1,unit:'mL'},
 step_recheck_label: {kind:'label',targets:[{id:'syringe-label',label:'พื้นที่ฉลากบนกระบอก'}],objects:[
  {id:'recheck',label:'เปิด Order เพื่อตรวจซ้ำ',icon:'double-check',rowLabel:'Doctor Order'},
  {id:'label',label:'ฉลากจาก Order เดิม',icon:'order',visual:'label',rowLabel:'Doctor Order',targetId:'syringe-label'},
 ]},
 step_patient_id: {kind:'identity',targets:[],objects:[
  {id:'wristband',label:'เปิดสายรัดข้อมือ',icon:'patient-id',visual:'wristband',detail:'ไม่มีชื่อ–นามสกุล HN หรือวันเกิดที่ใช้เทียบกับสายรัดในข้อมูลเกม · ไม่สร้างตัวระบุเพิ่ม'},
  {id:'patient-file',label:'เปิดแฟ้มเพื่อเทียบตัวระบุ',icon:'order',detail:'บันทึกการตรวจข้อมูลที่มี · ยังไม่ยืนยันตัวผู้ป่วยด้วยตัวระบุทางคลินิก',acknowledgement:true},
 ]},
 step_administer_record: {kind:'record',targets:[],notice:'บันทึกการฝึกตรวจ Monitor และ MAR · ไม่จำลองแทงเข็มหรืออัตราการให้ยา',objects:[
  {id:'monitor',label:'เปิด Monitor',icon:'monitor'},
  {id:'mar',label:'ลงบันทึก MAR ตาม Order',icon:'order',rowLabel:'Doctor Order'},
 ]},
};
