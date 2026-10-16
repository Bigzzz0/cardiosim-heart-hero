import React,{useState} from 'react';
import { Check, ClipboardCheck } from 'lucide-react';
import type { Decision } from '../types';
import { decisionIcons } from './gameIcons';

type DecisionBoardProps = {
  decision: Decision;
  selections: readonly string[];
  confirmed: boolean;
  onStartDrag: (optionId: string, event: React.PointerEvent<HTMLButtonElement>) => void;
  onClickAnswer: (optionId: string) => void;
  onChoose: (optionId: string) => void;
  onAssignSlot: (slotId:string,optionId:string)=>void;
};

export function DecisionBoard({ decision, selections, confirmed, onStartDrag, onClickAnswer, onChoose, onAssignSlot }: DecisionBoardProps) {
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

  return <div className="matching-board">
    <div className="panel-title">จัดบัตรลงแฟ้ม <span>{selections.length}/{decision.slots.length}</span></div>
    <div className="answer-slots">{decision.slots.map((slot, index) => {
      const optionId = selections.find(value => value.startsWith(`${slot.id}::`))?.split('::')[1];
      const option = decision.options.find(item => item.id === optionId);
      const Icon = option?.icon ? decisionIcons[option.icon] : ClipboardCheck;
      return <button type="button" key={slot.id} onClick={()=>setActiveSlot(slot.id)} aria-pressed={activeSlot===slot.id} aria-label={`เลือกช่อง ${slot.label} เพื่อแก้คำตอบ`} disabled={confirmed} className={`answer-slot ${option ? 'filled' : ''} ${confirmed ? 'locked' : ''}`} data-answer-slot={slot.id}>
        <span><i className="slot-number">{String(index+1).padStart(2, '0')}</i>{slot.label}</span>
        {option ? <b><Icon size={15}/>{option.label}</b> : <small>＋ วางบัตรที่นี่</small>}
      </button>;
    })}</div>
    <div className="answer-options">{decision.options.map(option => {
      const Icon = option.icon ? decisionIcons[option.icon] : ClipboardCheck;
      return <button key={option.id} className="answer-card" data-answer-option={option.id} onPointerDown={event => onStartDrag(option.id, event)} onClick={() => {if(activeSlot&&decision.slots?.some(slot=>slot.id===activeSlot)){onAssignSlot(activeSlot,option.id);setActiveSlot(null);}else onClickAnswer(option.id);}} disabled={confirmed}>
        <Icon size={17}/><span><b>{option.label}</b><small>{option.detail}</small></span><span className="drag-grip">⠿</span>
      </button>;
    })}</div>
    <small className="drag-help">ลากบัตร → วางลงช่อง → ยืนยัน · แตะช่องแล้วแตะบัตรได้เช่นกัน</small>
  </div>;
}
