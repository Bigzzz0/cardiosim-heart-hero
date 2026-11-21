import React,{useState} from 'react';
import { Check, ClipboardCheck, X } from 'lucide-react';
import type { ActivityConfig, Decision } from '../types';
import { decisionIcons } from './gameIcons';
import { ActivityFields } from './ActivityFields';

type DecisionBoardProps = {
  decision: Decision;
  selections: readonly string[];
  confirmed: boolean;
  activity?: ActivityConfig;
  responses: Readonly<Record<string,string>>;
  onSetResponse: (id:string,value:string)=>void;
  onStartDrag: (optionId: string, event: React.PointerEvent<HTMLButtonElement>) => void;
  onClickAnswer: (optionId: string) => void;
  onChoose: (optionId: string) => void;
  onRemoveSlot: (slotId: string) => void;
  onAssignSlot: (slotId:string,optionId:string)=>void;
};

export function DecisionBoard({ decision, selections, confirmed, activity, responses, onSetResponse, onStartDrag, onClickAnswer, onChoose, onAssignSlot, onRemoveSlot }: DecisionBoardProps) {
  const [activeSlot,setActiveSlot]=useState<string|null>(null);
  if (!decision.slots) {
    return <div className="decision-list">{decision.options.map(option => {
      const selected = selections.includes(option.id);
      const Icon = option.icon ? decisionIcons[option.icon] : Check;
      return <button key={option.id} className={`decision-option ${selected ? 'chosen' : ''}`} onClick={() => onChoose(option.id)} disabled={confirmed}>
        <span className="choice-dot">{selected ? <Check size={13}/> : <Icon size={14}/>}</span>
        <span><b>{option.label}</b><small>{option.detail}</small></span>
      </button>;
    })}</div>;
  }

  const textOnly = decision.presentation === 'monitor-response';
  return <div className={`matching-board ${decision.rows?.length || activity?.fields?.length ? 'has-order' : ''}`}>
    {Boolean(decision.rows?.length || activity?.fields?.length) && <section className="decision-order" aria-label="คำสั่งแพทย์ช่วงฉุกเฉิน"><dl>{decision.rows?.map(row => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>{activity && <ActivityFields activity={activity} responses={responses} confirmed={confirmed} onSetResponse={onSetResponse}/>}</section>}
    <div className="panel-title">{textOnly ? 'จัดการ์ดข้อความลงกรอบ' : 'จัดบัตรลงแฟ้ม'} <span>{selections.length}/{decision.slots.length}</span></div>
    <div className="answer-slots">{decision.slots.map((slot, index) => {
      const optionId = selections.find(value => value.startsWith(`${slot.id}::`))?.split('::')[1];
      const option = decision.options.find(item => item.id === optionId);
      const Icon = option?.icon ? decisionIcons[option.icon] : ClipboardCheck;
      return <div className="answer-slot-wrap" key={slot.id}><button type="button" onClick={()=>setActiveSlot(slot.id)} aria-pressed={activeSlot===slot.id} aria-label={`เลือกช่อง ${slot.label} เพื่อแก้คำตอบ`} disabled={confirmed} className={`answer-slot ${option ? 'filled' : ''} ${confirmed ? 'locked' : ''}`} data-answer-slot={slot.id}>
        <span><i className="slot-number">{String(index+1).padStart(2, '0')}</i>{slot.label}</span>
        {option ? <b>{!textOnly && <Icon size={15}/>}{option.label}</b> : <small>{textOnly ? 'วางการ์ดที่นี่' : '＋ วางบัตรที่นี่'}</small>}
      </button>{option && !confirmed && <button type="button" className="answer-remove" onClick={()=>onRemoveSlot(slot.id)} aria-label={`นำบัตรออกจาก ${slot.label}`}><X size={16}/></button>}</div>;
    })}</div>
    <div className="answer-options">{decision.options.map(option => {
      const Icon = option.icon ? decisionIcons[option.icon] : ClipboardCheck;
      const destinations = decision.slots?.filter(slot => selections.includes(`${slot.id}::${option.id}`)).map(slot=>slot.label) ?? [];
      return <button key={option.id} className={`answer-card ${destinations.length ? 'assigned' : ''}`} title={option.detail} data-answer-option={option.id} onPointerDown={event => onStartDrag(option.id, event)} onClick={() => {if(activeSlot&&decision.slots?.some(slot=>slot.id===activeSlot)){onAssignSlot(activeSlot,option.id);setActiveSlot(null);}else onClickAnswer(option.id);}} disabled={confirmed}>
        {!textOnly && <Icon size={17}/>}<span><b>{option.label}</b><small>{destinations.length ? `วางแล้ว · ${destinations.join(' / ')}` : option.detail}</small>{destinations.length > 0 && <em className="card-assigned-label">วางแล้ว</em>}</span>{!textOnly && <span className="drag-grip">⠿</span>}
      </button>;
    })}</div>
    <small className="drag-help">ลากบัตร → วางลงช่อง → ยืนยัน · แตะช่องแล้วแตะบัตรได้เช่นกัน</small>
  </div>;
}
