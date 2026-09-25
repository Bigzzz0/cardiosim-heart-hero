import React from 'react';
import { Check, Droplets, MoveRight } from 'lucide-react';
import type { ActivityConfig } from '../types';
import type { Decision } from '../types';
import { ActivityFields } from './ActivityFields';
import { MissingDataCard } from './MissingDataCard';

interface IOBalanceBoardProps {
  activity: ActivityConfig;
  decision?: Decision;
  decisions: readonly string[];
  placements: Readonly<Record<string, string>>;
  selectedItemId: string | null;
  responses: Readonly<Record<string, string>>;
  confirmed: boolean;
  onSetResponse: (id: string, value: string) => void;
  onChoose: (id: string) => void;
  onAcknowledgeMissing: () => void;
  onStartItemDrag: (id: string, event: React.PointerEvent<HTMLButtonElement>) => void;
  onSelectItem: (id: string) => void;
  onPlaceItem: (id: string, zoneId: string) => void;
}

export function IOBalanceBoard({ activity, decision, decisions, placements, selectedItemId, responses, confirmed, onSetResponse, onChoose, onAcknowledgeMissing, onStartItemDrag, onSelectItem, onPlaceItem }: IOBalanceBoardProps) {
  if (activity.dataStatus === 'missing' && activity.allowMissingDataAcknowledgement) return <MissingDataCard activity={activity} acknowledged={responses['missing-data-ack'] === 'recorded'} onAcknowledge={onAcknowledgeMissing}/>;
  return <section className="activity-card io-balance-board">
    <div className="activity-head"><span>{activity.eyebrow}</span><b>{activity.title}</b></div>
    {activity.notice && <div className="activity-notice">{activity.notice}</div>}
    <div className="io-source-tray" aria-label="รายการจากบันทึกเวร">
      <b className="io-module-title">รายการที่พบ</b>
      <div className="io-item-list">{activity.items?.map(item => {
        const placed = placements[item.id] !== undefined;
        return <button key={item.id} type="button" data-activity-item={item.id} className={`io-item-token ${selectedItemId === item.id ? 'selected' : ''} ${placed ? 'placed' : ''}`} onPointerDown={event => onStartItemDrag(item.id,event)} onClick={() => onSelectItem(item.id)} disabled={confirmed} aria-label={`ลาก ${item.label} ไปยัง Intake หรือ Output`}>
          <Droplets size={16}/><b>{item.label}</b>{placed && <Check size={15}/>}<span>⠿</span>
        </button>;
      })}</div>
      <small>ลากรายการไปยังช่อง Intake หรือ Output · แตะเลือกแล้วแตะช่องได้</small>
    </div>
    <div className="io-zones">{activity.zones?.map(zone => {
      const zoneItems = activity.items?.filter(item => placements[item.id] === zone.id) ?? [];
      return <button key={zone.id} type="button" data-activity-zone={zone.id} className={`io-zone ${zoneItems.length ? 'has-items' : ''}`} onClick={() => selectedItemId && onPlaceItem(selectedItemId,zone.id)} disabled={confirmed}>
        <span className="io-zone-heading"><b>{zone.label}</b><MoveRight size={15}/></span>
        {zoneItems.length ? <span className="io-zone-items">{zoneItems.map(item => <i key={item.id}>{item.label}</i>)}</span> : <small>วางรายการที่นี่</small>}
      </button>;
    })}</div>
    <div className="io-calculation-panel">
      <b className="io-module-title">รวมและคำนวณจากข้อมูลใน Case</b>
      <ActivityFields activity={activity} responses={responses} confirmed={confirmed} onSetResponse={onSetResponse}/>
      {decision && <div className="balance-options">{decision.options.map(option => <button key={option.id} className={decisions.includes(option.id) ? 'chosen' : ''} onClick={() => onChoose(option.id)} disabled={confirmed}>
        <Droplets size={16}/><b>{option.label}</b><small>{option.detail}</small>
      </button>)}</div>}
    </div>
  </section>;
}
