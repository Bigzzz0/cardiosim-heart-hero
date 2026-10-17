import { WorkbenchObjectArt } from './WorkbenchObjectArt';
import React, { useRef, useState } from 'react';
import { Check, ClipboardList, Hand, IdCard, Monitor, Pill, Syringe } from 'lucide-react';
import type { ActivityConfig, ActivityStep, ActivityStepProgress, ObjectWorkbenchInteraction, VitalSigns, WorkbenchObject } from '../types';

interface Props {
 step: ActivityStep;
 interaction: ObjectWorkbenchInteraction;
 activity: ActivityConfig;
 progress?: ActivityStepProgress;
 readings?: VitalSigns;
 onAction: (stepId:string,objectId:string,targetId?:string)=>void;
 onComplete: (id:string)=>void;
}

function ObjectGraphic({object}:{object:WorkbenchObject}) {
 const Icon=object.icon==='syringe'?Syringe:object.icon==='patient-id'?IdCard:object.icon==='monitor'?Monitor:object.icon==='aseptic'?Hand:object.icon==='ampoule'?Pill:ClipboardList;
 if(object.visual)return <WorkbenchObjectArt visual={object.visual}/>;
 if(object.icon==='ampoule')return <img src="/game/bedside/ampoule.webp" alt="" draggable="false"/>;
 if(object.icon==='syringe')return <img src="/game/bedside/syringe-body.webp" alt="" draggable="false"/>;
 return <Icon size={27}/>;
}

export function ObjectWorkbench({step,interaction,activity,progress,readings,onAction,onComplete}:Props) {
 const [selected,setSelected]=useState<string|null>(null);
 const [ghost,setGhost]=useState<{x:number;y:number;label:string}|null>(null);
 const held=useRef<{id:string;pointer:number;x:number;y:number}|null>(null);
 const skipClick=useRef<string|null>(null);
 const actions=progress?.actions ?? {};
 const reviewed=interaction.objects.filter(object=>actions[object.id]!==undefined).length;
 const cancel=()=>{held.current=null;setGhost(null);};
 const displayVital=(value:number|null)=>value===null?'ไม่มีข้อมูล':String(Math.round(value));
 return <section className={`object-workbench workbench-${interaction.kind}`} data-workbench-step={step.id}>
  <div className="workbench-caption"><b>{step.label}</b><span>{reviewed}/{interaction.objects.length}</span></div>
  {interaction.notice && <p className="workbench-notice">{interaction.notice}</p>}
  <div className="workbench-object-tray" aria-label="วัตถุสำหรับขั้นปัจจุบัน">{interaction.objects.map(object=>{
   const placed=actions[object.id]!==undefined;
   const detail=object.rowLabel?activity.rows?.find(row=>row.label===object.rowLabel)?.value ?? 'ไม่มีข้อมูล':object.detail;
   return <button type="button" key={object.id} data-workbench-object={object.id} data-workbench-movable={Boolean(object.targetId)} className={`workbench-object ${placed?'reviewed':''} ${selected===object.id?'selected':''}`} aria-pressed={selected===object.id || placed}
    onPointerDown={event=>{if(event.button!==0||!object.targetId)return;event.preventDefault();event.currentTarget.setPointerCapture(event.pointerId);skipClick.current=null;held.current={id:object.id,pointer:event.pointerId,x:event.clientX,y:event.clientY};}}
    onPointerMove={event=>{const start=held.current;if(start?.pointer!==event.pointerId)return;if(Math.hypot(event.clientX-start.x,event.clientY-start.y)>8)setGhost({x:event.clientX,y:event.clientY,label:object.label});}}
    onPointerUp={event=>{const start=held.current;if(!start||start.pointer!==event.pointerId)return;const moved=Math.hypot(event.clientX-start.x,event.clientY-start.y)>8;cancel();if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);if(moved){skipClick.current=object.id;const target=document.elementFromPoint(event.clientX,event.clientY)?.closest<HTMLElement>('[data-workbench-target]');if(target)onAction(step.id,object.id,target.dataset.workbenchTarget);setSelected(null);}else setSelected(object.id);}}
    onPointerCancel={cancel} onLostPointerCapture={cancel}
    onClick={()=>{if(skipClick.current===object.id){skipClick.current=null;return;}if(object.targetId)setSelected(object.id);else onAction(step.id,object.id);}}>
    <ObjectGraphic object={object}/>
    <b>{object.label}</b><small>{placed?'ตรวจ/จัดวางแล้ว':object.targetId?'หยิบแล้ววางที่อุปกรณ์':object.acknowledgement?'เปิดอ่านและรับทราบ':'แตะเพื่อเปิดตรวจ'}</small>
    {placed && <Check size={16} className="object-check"/>}
    {placed && detail && <span className="object-detail">{detail}</span>}
    {placed && object.icon==='monitor' && readings && <span className="object-detail">HR {displayVital(readings.hr)} · BP {displayVital(readings.bpSystolic)}/{displayVital(readings.bpDiastolic)} · RR {displayVital(readings.rr)} · SpO₂ {displayVital(readings.spo2)}</span>}
   </button>;
  })}</div>
  {interaction.targets.length>0 && <div className="workbench-target-tray">{interaction.targets.map(target=><button type="button" key={target.id} data-workbench-target={target.id} className={`workbench-target ${interaction.kind==='label'?'syringe-label-target':''}`} onClick={()=>{if(selected){onAction(step.id,selected,target.id);setSelected(null);}}}>
   {interaction.kind==='label'&&<img src="/game/bedside/syringe-body.webp" alt="" draggable="false"/>}<b>{target.label}</b>
   <span>{interaction.objects.filter(object=>actions[object.id]===target.id).map(object=><i key={object.id}><ObjectGraphic object={object}/><span>{object.label}</span></i>)}</span>
   <small>{selected?'แตะเพื่อวางชิ้นที่เลือก':'ลากอุปกรณ์มาวาง · หรือแตะเลือกแล้วแตะช่อง'}</small>
  </button>)}</div>}
  <button type="button" className="workbench-confirm" onClick={()=>onComplete(step.id)}>ยืนยันขั้นตอน</button>
  {ghost&&<div className="workbench-ghost" style={{left:ghost.x,top:ghost.y}}>{ghost.label}</div>}
 </section>;
}
