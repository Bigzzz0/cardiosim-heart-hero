import React from 'react';
import { Check, ChevronRight, ClipboardList, Lightbulb } from 'lucide-react';
import type { ECGTarget, Feedback } from '../types';

type ECGMobileProcedureProps = {
  targets: readonly ECGTarget[];
  image: { x: number; y: number; width: number; height: number };
  imageSrc: string;
  placed: ReadonlySet<string>;
  placements: Readonly<Record<string,string>>;
  validated: ReadonlySet<string>;
  confirmed: boolean;
  onRemove: (id:string)=>void;
  selected: string | null;
  feedback: Feedback;
  canContinue: boolean;
  hintsVisible: boolean;
  onDragStart: (id: string, event: React.PointerEvent<HTMLButtonElement>) => void;
  onSelect: (id: string) => void;
  onTarget: (id: string) => void;
  onHint: () => void;
  onChart: () => void;
  onConfirm: () => void;
};

export function ECGMobileProcedure(props: ECGMobileProcedureProps) {
  const { targets, image, imageSrc, placed, placements, validated, confirmed, onRemove, selected, feedback, canContinue, hintsVisible, onDragStart, onSelect, onTarget, onHint, onChart, onConfirm } = props;
  return <div className={`ecg-mobile-procedure ${hintsVisible ? 'show-hints' : ''}`} aria-label="ECG lead placement mini-game">
    <div className="ecg-mobile-heading"><div><span className="eyebrow">PROCEDURE · ECG</span><b>เชื่อมต่อ Leads <span>{placed.size}/6</span></b></div><small>ผังตำแหน่ง ECG · DEMO — ไม่ใช่ภาพผู้ป่วย</small></div>
    <div className="ecg-mobile-map">
      <img src={imageSrc} alt="ผังแสดงตำแหน่ง ECG V1 ถึง V6 สำหรับสาธิต" draggable="false"/>
      <svg className="ecg-mobile-leaders" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
        {targets.map(target=>{
          const x=((target.x-image.x)/image.width)*1000;
          const y=((target.y-image.y)/image.height)*1000;
          return <line key={target.id} x1={x} y1={y} x2={target.mobileLabel.x*1000} y2={target.mobileLabel.y*1000} className={placed.has(target.id)?'complete':''}/>;
        })}
      </svg>
      {Object.entries(placements).map(([id,targetId])=>{const at=targets.find(t=>t.id===targetId);if(!at)return null;return <button key={id} type="button" className={`ecg-attached-lead ${validated.has(id)?'validated':''}`} data-ecg-attached={id} style={{left:`${(at.x-image.x)/image.width*100}%`,top:`${(at.y-image.y)/image.height*100}%`}} onPointerDown={event=>onDragStart(id,event)} onClick={()=>onSelect(id)} disabled={validated.has(id)} aria-label={`ย้าย ${id} ที่วางแล้ว`}>{id}</button>;})}
      <div className="ecg-mobile-targets">{targets.map((target,index)=>{
        const complete=validated.has(target.id);
        const left=((target.x-image.x)/image.width)*100;
        const top=((target.y-image.y)/image.height)*100;
        return <React.Fragment key={target.id}>
          <span className={`ecg-target-anchor ${complete?'complete':''}`} style={{left:`${left}%`,top:`${top}%`}} aria-hidden="true"/>
          <button type="button" data-mobile-ecg-target={target.id} className={`ecg-mobile-target ${complete?'complete':''}`} style={{left:`${target.mobileLabel.x*100}%`,top:`${target.mobileLabel.y*100}%`}} onClick={()=>onTarget(target.id)} aria-label={`ตำแหน่ง ${String.fromCharCode(65+index)}${complete?' · วางแล้ว':''}`} title={hintsVisible?target.hint:'เลือกตำแหน่งนี้เพื่อวางชิ้นที่ถือ'}>{complete?<Check size={17}/>:String.fromCharCode(65+index)}</button>
        </React.Fragment>;
      })}</div>
    </div>
    <div className="ecg-mobile-tray" aria-label="ถาด ECG leads">{targets.map(target=><button key={target.id} type="button" className={`ecg-mobile-lead ${selected===target.id?'selected':''} ${placed.has(target.id)?'placed':''}`} onPointerDown={event=>onDragStart(target.id,event)} onClick={()=>onSelect(target.id)} disabled={validated.has(target.id)} aria-pressed={selected===target.id} aria-label={`กดค้างแล้วลาก ${target.id} ไปยังตำแหน่งบนผัง`}>{validated.has(target.id)?<Check size={17}/>:target.id}<small>{validated.has(target.id)?'ผ่านแล้ว':placed.has(target.id)?'วางแล้ว':'หยิบ'}</small></button>)}</div>
    {selected&&placed.has(selected)&&!validated.has(selected)&&<button className="ecg-return-lead" type="button" onClick={()=>onRemove(selected)}>คืน {selected} เข้าถาด</button>}
    <div className={`ecg-mobile-feedback ${feedback.kind}`} role="status" aria-live="polite">{feedback.text}</div>
    <div className="ecg-mobile-actions"><button onClick={onHint}><Lightbulb size={17}/> Hint</button><button onClick={onChart}><ClipboardList size={17}/> Chart</button><button className="primary" onClick={onConfirm} disabled={!canContinue}>{confirmed?'บันทึก ECG':'ยืนยัน ECG'} <ChevronRight size={17}/></button></div>
  </div>;
}
