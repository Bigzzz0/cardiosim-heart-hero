import React from 'react';
import { Check, ChevronRight, Circle, ClipboardList, Clock3, Lightbulb, Radio, ShieldAlert, Siren, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CaseEngine } from '../core/CaseEngine';
import type { ActivityStepProgress, Hotspot, MedicalTool, Objective } from '../types';
import { DecisionBoard } from './DecisionBoard';
import { MissionResultCard } from './MissionResultCard';
import { MissionWorksheet } from './MissionWorksheet';
import { InRoomDecisionSurface } from './InRoomDecisionSurface';
import { InRoomActivitySurface } from './InRoomActivitySurface';

export type MissionPresentation = 'briefing' | 'field' | 'decision-board' | 'bedside-clipboard' | 'monitor-response' | 'medication-station' | 'io-board' | 'ecg-console' | 'worksheet' | 'procedure' | 'result';

type MissionPanelProps = {
  engine: CaseEngine;
  presentation: MissionPresentation;
  isOpen: boolean;
  interactionToastActive: boolean;
  emergency: boolean;
  elapsedLabel: string;
  emergencyElapsedLabel: string;
  primaryLabel: string;
  nextObjective?: Objective;
  nextTool?: MedicalTool;
  nextHotspot?: Hotspot;
  nextToolIcon?: LucideIcon;
  onToggle: () => void;
  onMainAction: () => void;
  onHint: () => void;
  onOpenChart: () => void;
  onRestart: () => void;
  onPostTest?: () => void;
  onStartNormal: () => void;
  onStartEmergency: () => void;
  onStartAnswerDrag: (optionId: string, event: React.PointerEvent<HTMLButtonElement>) => void;
  onClickAnswer: (optionId: string) => void;
  activitySteps: readonly string[];
  activityStepProgress: Readonly<Record<string, ActivityStepProgress>>;
  activityPlacements: Readonly<Record<string, string>>;
  selectedActivityItemId: string | null;
  onAcknowledgeMissing: () => void;
  onStartActivityStepDrag: (id: string, event: React.PointerEvent<HTMLButtonElement>) => void;
  onStartSyringeToolDrag: (id: string, event: React.PointerEvent<HTMLButtonElement>) => void;
  onCompleteActivityStep: (id: string) => void;
  onPlaceSyringeTool: (stepId: string, targetId: string) => void;
  onSetSyringeAmount: (stepId: string, amount: number) => void;
  onStartActivityItemDrag: (id: string, event: React.PointerEvent<HTMLButtonElement>) => void;
  onSelectActivityItem: (id: string) => void;
  onPlaceActivityItem: (id: string, zoneId: string) => void;
};

export function MissionPanel({
  engine, presentation, isOpen, interactionToastActive, emergency, elapsedLabel, emergencyElapsedLabel,
  primaryLabel, nextObjective, nextTool, nextHotspot, nextToolIcon: NextToolIcon, onToggle, onMainAction,
  onHint, onOpenChart, onRestart, onPostTest, onStartNormal, onStartEmergency, onStartAnswerDrag, onClickAnswer,
  activitySteps, activityStepProgress, activityPlacements, selectedActivityItemId, onAcknowledgeMissing, onStartActivityStepDrag,
  onCompleteActivityStep, onPlaceSyringeTool, onStartSyringeToolDrag, onSetSyringeAmount, onStartActivityItemDrag, onSelectActivityItem, onPlaceActivityItem,
}: MissionPanelProps) {
  const mission = engine.mission.current;
  const decision = mission.decision;
  const objectiveCount = mission.objectives?.length ?? 0;
  const objectiveDone = mission.objectives?.filter(item => engine.mission.completed.has(item.id)).length ?? 0;
  const compactProgress = mission.objectives
    ? `${objectiveDone}/${mission.objectives.length} จุดตรวจ · ${mission.objectives.find(item => !engine.mission.completed.has(item.id))?.label ?? 'ครบแล้ว'}`
    : mission.kind === 'placement'
      ? `${engine.ecg.placed.size}/6 leads · ${engine.ecg.complete ? 'ครบแล้ว · พร้อมยืนยัน' : engine.ecg.selected ? `กำลังวาง ${engine.ecg.selected}` : 'ลาก lead จากถาดไปยังผังทรวงอก'}`
      : mission.kind === 'transition'
        ? 'สังเกตผู้ป่วยและ Monitor ในห้องเดิม'
        : mission.activity?.title ?? 'ดูเป้าหมายปัจจุบัน';
  const worksheet = mission.activity ? <MissionWorksheet
    activity={mission.activity}
    decision={decision}
    decisions={engine.mission.decisions}
    responses={engine.responses}
    confirmed={engine.mission.decisionConfirmed}
    activitySteps={activitySteps}
    activityStepProgress={activityStepProgress}
    activityPlacements={activityPlacements}
    selectedItemId={selectedActivityItemId}
    onSetResponse={(id, value) => engine.setResponse(id, value)}
    onChoose={optionId => engine.choose(optionId)}
    onAcknowledgeMissing={onAcknowledgeMissing}
    onStartStepDrag={onStartActivityStepDrag}
    onStartSyringeToolDrag={onStartSyringeToolDrag}
    onCompleteStep={onCompleteActivityStep}
    onPlaceSyringeTool={onPlaceSyringeTool}
    onSetSyringeAmount={onSetSyringeAmount}
    onStartItemDrag={onStartActivityItemDrag}
    onSelectItem={onSelectActivityItem}
    onPlaceItem={onPlaceActivityItem}
  /> : null;

  return <aside
    data-presentation={presentation}
    data-initial-feedback={engine.feedback.text === mission.description}
    data-toast-active={interactionToastActive}
    className={`mission-panel mode-${presentation} ${isOpen ? '' : 'mission-collapsed'}`}
  >
    <div className="mission-heading">
      <span className={`eyebrow ${presentation === 'field' ? 'comms-eyebrow' : ''}`}>{presentation === 'field' && <Radio size={13}/>}<span>{presentation === 'field' ? 'CARE TEAM RADIO' : presentation === 'procedure' ? 'PROCEDURE' : presentation === 'briefing' ? 'CASE BRIEF' : 'MISSION'}</span>{presentation === 'field' && <i>LIVE</i>}</span>
      <span className="mission-step">{String(engine.mission.index + 1).padStart(2, '0')} / {String(engine.config.missions.length).padStart(2, '0')}</span>
      <button type="button" className="mission-toggle" onClick={onToggle} aria-label={isOpen ? 'ย่อภารกิจ' : 'แสดงภารกิจ'} aria-expanded={isOpen} title={isOpen ? 'ย่อภารกิจ' : 'แสดงภารกิจ'}>
        <ChevronRight size={16}/>
      </button>
    </div>
    <span className="phase-label">{mission.phase}</span>
    <h2>{mission.title.split('\n').map((part, index) => <React.Fragment key={`${index}-${part}`}>{index > 0 && <br/>}{part}</React.Fragment>)}</h2>
    {presentation === 'field' && nextObjective && nextTool && nextHotspot && NextToolIcon && <div className="action-brief">
      <span className="action-tool-icon"><NextToolIcon size={17}/></span>
      <span><small>NEXT MOVE</small><b>{nextTool.name}<ChevronRight size={14}/>{nextHotspot.label}</b></span>
    </div>}
    <div className="mission-compact">
      <p>{compactProgress}</p>
      {mission.objectives && <div className="objective-pips" role="progressbar" aria-label="ความคืบหน้าจุดตรวจ" aria-valuemin={0} aria-valuemax={objectiveCount} aria-valuenow={objectiveDone}>
        {mission.objectives.map(objective => <i key={objective.id} className={engine.mission.completed.has(objective.id) ? 'done' : objective.id === nextObjective?.id ? 'current' : ''}/>)}
      </div>}
      {mission.kind !== 'summary' && !(mission.kind === 'interaction' && !engine.canContinue) && <button className="primary compact-primary" onClick={onMainAction} disabled={!engine.canContinue}>{primaryLabel}<ChevronRight size={18}/></button>}
    </div>
    <p>{mission.description}</p>
    {mission.objectives && <div className="objectives">
      <div className="panel-title">CHECKLIST <span>{objectiveDone}/{mission.objectives.length}</span></div>
      {mission.objectives.map(item => {
        const done = engine.mission.completed.has(item.id);
        const active = engine.interaction.pending?.objective.id === item.id;
        return <div key={item.id} className={`objective ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
          <span className="objective-icon">{done ? <Check size={14}/> : <Circle size={14}/>}</span>
          <span>{item.label}</span>
          {active && <span className="checking">กำลังตรวจ</span>}
        </div>;
      })}
    </div>}
    {mission.kind === 'placement' && <div className="objectives">
      <div className="panel-title">ECG LEADS <span>{engine.ecg.placed.size}/6</span></div>
      <div className="lead-status">{engine.config.ecg.targets.map(lead => <button key={lead.id} className={engine.ecg.placed.has(lead.id) ? 'lead-done' : ''} onClick={() => { engine.ecg.selected = lead.id; engine.refresh(); }} title={lead.hint}>
        {engine.ecg.placed.has(lead.id) ? <Check size={12}/> : lead.id}
      </button>)}</div>
      <small className="support-copy">{engine.config.ecg.label}</small>
    </div>}
    {mission.kind === 'summary' && <MissionResultCard
      gradable={engine.config.gradable}
      clinicalStatus={engine.config.clinicalStatus}
      vitals={engine.vitals.current}
      findings={engine.chart}
      patientCondition={engine.patient.state.condition}
      score={engine.score.total}
      timeLabel={elapsedLabel}
      attempts={engine.score.data.attempts}
      mistakes={engine.score.data.mistakeCount}
      hints={engine.score.data.hintCount}
      onRestart={onRestart}
      onPostTest={onPostTest}
    />}
    <div className={`feedback ${engine.feedback.kind}`} role="status" aria-live="polite">
      <span className="feedback-symbol">{engine.feedback.kind === 'success' ? <Check size={16}/> : engine.feedback.kind === 'error' ? <X size={16}/> : <Lightbulb size={16}/>}</span>
      <span>{engine.feedback.text}</span>
    </div>
    {mission.kind !== 'summary' && <div className="mission-actions">
      <button className="hint-button" onClick={onHint}><Lightbulb size={16}/> Hint</button>
      <button className="chart-button" onClick={onOpenChart}><ClipboardList size={17}/> Patient chart <span>{engine.chart.length}</span></button>
    </div>}
    {mission.kind === 'intro' && mission.id === 'CASE_INTRO' && <div className="scenario-select">
      <div className="panel-title">CURRENT CASE <span>{engine.config.scenarios[0]?.id.toUpperCase()}</span></div>
      <article className="scenario-card playable"><span className="scenario-number">{engine.config.scenarios[0]?.id.toUpperCase()}</span><b>{engine.config.title}</b><small>{engine.config.clinicalStatus}</small></article>
      <a className="stage-change-link" href="/?stage=SCENARIO_SELECT">เปลี่ยนเคส</a>
      <div className="stage-select"><span>เลือก Stage</span>
        <button className="stage-option selected" onClick={onStartNormal}><Check size={13}/> Normal Stage</button>
        <button className="stage-option" onClick={onStartEmergency}><Siren size={13}/> Emergency Stage</button>
      </div>
    </div>}
    {mission.kind === 'decision' && decision && (decision.slots || !mission.activity) && (decision.presentation
      ? <InRoomDecisionSurface presentation={decision.presentation} missionTitle={mission.title} instruction={mission.description}><DecisionBoard
          decision={decision}
          selections={engine.mission.decisions}
          confirmed={engine.mission.decisionConfirmed}
          onStartDrag={onStartAnswerDrag}
          onClickAnswer={onClickAnswer}
          onChoose={optionId => engine.choose(optionId)}
        /></InRoomDecisionSurface>
      : <DecisionBoard
          decision={decision}
          selections={engine.mission.decisions}
          confirmed={engine.mission.decisionConfirmed}
          onStartDrag={onStartAnswerDrag}
          onClickAnswer={onClickAnswer}
          onChoose={optionId => engine.choose(optionId)}
        />)}
    {mission.kind === 'decision' && mission.activity && (mission.activity.presentation
      ? <InRoomActivitySurface presentation={mission.activity.presentation} missionTitle={mission.title} instruction={mission.description}>{worksheet}</InRoomActivitySurface>
      : worksheet)}
    {mission.kind !== 'summary' && <button className="primary full-primary" onClick={onMainAction} disabled={!engine.canContinue}>{primaryLabel} <ChevronRight size={18}/></button>}
    {mission.id === 'ECG_INTERPRETATION' && <span className="clinical-pending"><ShieldAlert size={13}/> รอ ECG ต้นฉบับและเฉลยจากผู้เชี่ยวชาญ</span>}
    {mission.id === 'EMERGENCY_TREATMENT' && <span className="clinical-pending">⚑ แผนตอบสนองเพื่อแสดง visual demo · ยังไม่ใช่ protocol การรักษา</span>}
    {emergency && <div className="response-timer"><Clock3 size={14}/> EMERGENCY RESPONSE <b>{emergencyElapsedLabel}</b></div>}
    <div className="aside-footer"><span>LEARN BY DOING</span><p>ค่าตัวอย่างจากเอกสารที่แนบ<br/>รอผู้เชี่ยวชาญตรวจเนื้อหาทางคลินิก</p></div>
  </aside>;
}
