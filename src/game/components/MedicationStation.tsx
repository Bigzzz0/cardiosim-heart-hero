import React from 'react';
import { Activity, BadgeCheck, ClipboardList, FileText, Hand, IdCard, Pill, ShieldCheck, Syringe } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ActivityConfig, ActivityEquipmentIcon, ActivityStepProgress } from '../types';
import type { Decision } from '../types';
import { ActivityFields } from './ActivityFields';
import { MissingDataCard } from './MissingDataCard';
import { SyringeWithdrawalMinigame } from './SyringeWithdrawalMinigame';

interface MedicationStationProps {
  activity: ActivityConfig;
  decision?: Decision;
  decisions: readonly string[];
  responses: Readonly<Record<string, string>>;
  completedSteps: readonly string[];
  stepProgress: Readonly<Record<string, ActivityStepProgress>>;
  confirmed: boolean;
  onSetResponse: (id: string, value: string) => void;
  onChoose: (id: string) => void;
  onAcknowledgeMissing: () => void;
  onStartStepDrag: (id: string, event: React.PointerEvent<HTMLButtonElement>) => void;
  onStartSyringeToolDrag: (id: string, event: React.PointerEvent<HTMLButtonElement>) => void;
  onCompleteStep: (id: string) => void;
  onPlaceSyringeTool: (stepId: string, targetId: string) => void;
  onSetSyringeAmount: (stepId: string, amount: number) => void;
}

const stepIcons: Record<ActivityEquipmentIcon, LucideIcon> = {
  order: FileText,
  ampoule: Pill,
  aseptic: Hand,
  syringe: Syringe,
  'double-check': BadgeCheck,
  'patient-id': IdCard,
  monitor: Activity,
  intake: ClipboardList,
  output: ClipboardList,
  ecg: Activity,
};

export function MedicationStation({ activity, decision, decisions, responses, completedSteps, stepProgress, confirmed, onSetResponse, onChoose, onAcknowledgeMissing, onStartStepDrag, onStartSyringeToolDrag, onCompleteStep, onPlaceSyringeTool, onSetSyringeAmount }: MedicationStationProps) {
  if (activity.dataStatus === 'missing' && activity.allowMissingDataAcknowledgement) return <MissingDataCard activity={activity} acknowledged={responses['missing-data-ack'] === 'recorded'} onAcknowledge={onAcknowledgeMissing}/>;
  const nextStep = activity.steps?.[completedSteps.length];
  const NextEquipment = nextStep ? stepIcons[nextStep.icon] : ShieldCheck;
  return <section className="activity-card medication-station-card">
    <div className="activity-head"><span>{activity.eyebrow}</span><b>{activity.title}</b></div>
    {activity.notice && <div className="activity-notice">{activity.notice}</div>}
    <div className="medication-order-card">
      <div className="order-card-head"><FileText size={17}/><b>Doctor Order · ข้อมูลเดโม</b><span>VERIFY</span></div>
      {activity.rows?.map(row => <div className="activity-rows" key={row.label}><div><span>{row.label}</span><b>{row.value}</b></div></div>)}
    </div>
    <div className={`medication-procedure ${nextStep?.interaction ? 'has-syringe-activity' : ''}`}>
      <div className="medication-step-list" aria-label="ลำดับเตรียมยา">
        {activity.steps?.map((step,index) => {
          const done = completedSteps.includes(step.id);
          const current = index === completedSteps.length;
          const Icon = stepIcons[step.icon];
          return <button key={step.id} type="button" data-activity-step-target={step.id} className={`medication-step ${done ? 'complete' : ''} ${current ? 'current' : ''}`} onClick={() => { if (!step.interaction) onCompleteStep(step.id); }} disabled={confirmed}>
            <span className="step-number">{done ? '✓' : String(index + 1).padStart(2,'0')}</span>
            <span className="step-copy"><b>{step.label}</b>{current && <small>{step.detail}</small>}</span>
            <Icon size={17}/>
          </button>;
        })}
      </div>
      <div className="medication-equipment-tray">
        <span className="equipment-tray-label">อุปกรณ์ถัดไป</span>
        {nextStep?.interaction?.kind === 'syringe-withdrawal' ? <SyringeWithdrawalMinigame stepId={nextStep.id} equipmentLabel={nextStep.equipmentLabel} interaction={nextStep.interaction} progress={stepProgress[nextStep.id]} confirmed={confirmed} onStartDrag={onStartSyringeToolDrag} onPlaceTool={onPlaceSyringeTool} onSetAmount={onSetSyringeAmount} onComplete={onCompleteStep}/> : nextStep ? <button type="button" className="activity-equipment-token" onPointerDown={event => onStartStepDrag(nextStep.id,event)} onClick={() => onCompleteStep(nextStep.id)} disabled={confirmed} aria-label={`ลาก ${nextStep.equipmentLabel} ไปยังขั้นตอนที่กำลังทำ หรือแตะเพื่อใช้`}>
          <span className="equipment-token-art"><NextEquipment size={28}/></span><b>{nextStep.equipmentLabel}</b><small>กดค้างลากไปขั้นปัจจุบัน · หรือแตะ</small>
        </button> : <div className="equipment-ready"><ShieldCheck size={23}/><b>ครบ 7 ขั้น</b><small>ทบทวนรายการก่อนยืนยัน</small></div>}
        <div className="procedure-count"><span>{completedSteps.length}</span> / {activity.steps?.length ?? 0} ขั้นเสร็จ</div>
      </div>
    </div>
    <div className="station-check-fields"><div className="station-subhead"><Syringe size={16}/> ตรวจข้อมูลการเตรียมก่อนบันทึก</div>
      <ActivityFields activity={activity} responses={responses} confirmed={confirmed} onSetResponse={onSetResponse}/>
    </div>
    {activity.kind === 'fluid-balance' && decision && <div className="balance-options">{decision.options.map(option => <button key={option.id} className={decisions.includes(option.id) ? 'chosen' : ''} onClick={() => onChoose(option.id)} disabled={confirmed}>
      <ClipboardList size={15}/><b>{option.label}</b><small>{option.detail}</small>
    </button>)}</div>}
  </section>;
}
