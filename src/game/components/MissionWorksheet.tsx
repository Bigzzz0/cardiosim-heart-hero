import { Check, Droplets, ShieldAlert } from 'lucide-react';
import type { ActivityConfig, ActivityStepProgress, Decision } from '../types';
import { MedicationStation } from './MedicationStation';
import { IOBalanceBoard } from './IOBalanceBoard';
import { ECGReviewConsole } from './ECGReviewConsole';

type MissionWorksheetProps = {
  activity: ActivityConfig;
  decision?: Decision;
  decisions: readonly string[];
  responses: Readonly<Record<string, string>>;
  confirmed: boolean;
  activitySteps: readonly string[];
  activityStepProgress: Readonly<Record<string, ActivityStepProgress>>;
  activityPlacements: Readonly<Record<string, string>>;
  selectedItemId: string | null;
  onSetResponse: (id: string, value: string) => void;
  onChoose: (optionId: string) => void;
  onAcknowledgeMissing: () => void;
  onStartStepDrag: (id: string, event: React.PointerEvent<HTMLButtonElement>) => void;
  onStartSyringeToolDrag: (id: string, event: React.PointerEvent<HTMLButtonElement>) => void;
  onCompleteStep: (id: string) => void;
  onPlaceSyringeTool: (stepId: string, targetId: string) => void;
  onSetSyringeAmount: (stepId: string, amount: number) => void;
  onStartItemDrag: (id: string, event: React.PointerEvent<HTMLButtonElement>) => void;
  onSelectItem: (id: string) => void;
  onPlaceItem: (id: string, zoneId: string) => void;
};

export function MissionWorksheet({ activity, decision, decisions, responses, confirmed, activitySteps, activityStepProgress, activityPlacements, selectedItemId, onSetResponse, onChoose, onAcknowledgeMissing, onStartStepDrag, onStartSyringeToolDrag, onCompleteStep, onPlaceSyringeTool, onSetSyringeAmount, onStartItemDrag, onSelectItem, onPlaceItem }: MissionWorksheetProps) {
  if (activity.presentation === 'medication-station') return <MedicationStation activity={activity} decision={decision} decisions={decisions} responses={responses} completedSteps={activitySteps} stepProgress={activityStepProgress} confirmed={confirmed} onSetResponse={onSetResponse} onChoose={onChoose} onAcknowledgeMissing={onAcknowledgeMissing} onStartStepDrag={onStartStepDrag} onStartSyringeToolDrag={onStartSyringeToolDrag} onCompleteStep={onCompleteStep} onPlaceSyringeTool={onPlaceSyringeTool} onSetSyringeAmount={onSetSyringeAmount}/>;
  if (activity.presentation === 'io-board') return <IOBalanceBoard activity={activity} decision={decision} decisions={decisions} placements={activityPlacements} selectedItemId={selectedItemId} responses={responses} confirmed={confirmed} onSetResponse={onSetResponse} onChoose={onChoose} onAcknowledgeMissing={onAcknowledgeMissing} onStartItemDrag={onStartItemDrag} onSelectItem={onSelectItem} onPlaceItem={onPlaceItem}/>;
  if (activity.presentation === 'ecg-console') return <ECGReviewConsole activity={activity} responses={responses} confirmed={confirmed} onSetResponse={onSetResponse}/>;
  return <section className={`activity-card activity-${activity.kind}`}>
    <div className="activity-head"><span>{activity.eyebrow}</span><b>{activity.title}</b></div>
    {activity.notice && <div className="activity-notice"><ShieldAlert size={14}/>{activity.notice}</div>}
    {activity.rows && <div className="activity-rows">{activity.rows.map(row => <div key={row.label}><span>{row.label}</span><b>{row.value}</b></div>)}</div>}
    {activity.fields?.map(field => <label className="activity-field" key={field.id}>
      <span>{field.label}</span>
      {field.type === 'select'
        ? <select value={responses[field.id] ?? ''} onChange={event => onSetResponse(field.id, event.target.value)} disabled={confirmed}>
            <option value="">{field.placeholder}</option>
            {field.options?.map(option => <option value={option} key={option}>{option}</option>)}
          </select>
        : <input type={field.type} value={responses[field.id] ?? ''} placeholder={field.placeholder} onChange={event => onSetResponse(field.id, event.target.value)} disabled={confirmed}/>}
    </label>)}
    {activity.kind === 'fluid-balance' && decision && <div className="balance-options">{decision.options.map(option => <button key={option.id} className={decisions.includes(option.id) ? 'chosen' : ''} onClick={() => onChoose(option.id)} disabled={confirmed}>
      <Droplets size={15}/><b>{option.label}</b><small>{option.detail}</small>
    </button>)}</div>}
    {confirmed && <div className="activity-confirmed"><Check size={14}/> คำตอบถูกบันทึก · Next เพื่อไปต่อ</div>}
  </section>;
}
