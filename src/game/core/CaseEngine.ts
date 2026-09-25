import type { ActivityConfig, ActivityStepProgress, ChartEntry, Checkpoint, Feedback, GameCase, InteractionEventData, InteractionPreview, Point } from '../types';
import { EventBus } from './EventBus';
import { MissionEngine } from './MissionEngine';
import { validateCase } from './validateCase';
import { PatientSystem } from '../systems/PatientSystem';
import { VitalSystem } from '../systems/VitalSystem';
import { ToolSystem } from '../systems/ToolSystem';
import { HotspotSystem } from '../systems/HotspotSystem';
import { InteractionSystem } from '../systems/InteractionSystem';
import { ECGSystem } from '../systems/ECGSystem';
import { EmergencySystem } from '../systems/EmergencySystem';
import { ScoreSystem } from '../systems/ScoreSystem';
import { HintSystem } from '../systems/HintSystem';
import { MonitorSystem } from '../systems/MonitorSystem';

export class CaseEngine {
  readonly bus = new EventBus();
  readonly mission: MissionEngine;
  readonly patient: PatientSystem;
  readonly vitals: VitalSystem;
  readonly tools: ToolSystem;
  readonly hotspots: HotspotSystem;
  readonly interaction = new InteractionSystem();
  readonly ecg: ECGSystem;
  readonly emergency = new EmergencySystem();
  readonly score: ScoreSystem;
  readonly hints = new HintSystem();
  readonly monitor = new MonitorSystem();
  chart: ChartEntry[] = [];
  responses: Record<string, string> = {};
  activitySteps: string[] = [];
  activityPlacements: Record<string, string> = {};
  activityStepProgress: Record<string, ActivityStepProgress> = {};
  elapsed = 0;
  feedback: Feedback = { kind: 'info', text: 'เลือกเริ่มดูแลผู้ป่วย เพื่อเข้าสู่ภารกิจ' };
  paused = false;
  private version = 0;
  private subscribers = new Set<() => void>();
  private uiElapsed = 0;
  private pendingInteraction: InteractionEventData | null = null;
  constructor(readonly config: GameCase) {
    validateCase(config);
    this.mission = new MissionEngine(config.missions); this.patient = new PatientSystem(config.initialPatient);
    this.vitals = new VitalSystem(config.initialVitals); this.tools = new ToolSystem(config.tools);
    this.hotspots = new HotspotSystem(config.hotspots); this.ecg = new ECGSystem(config.ecg.targets); this.score = new ScoreSystem(config.scoring);
    this.enter();
  }
  subscribe = (callback: () => void) => { this.subscribers.add(callback); return () => { this.subscribers.delete(callback); }; };
  snapshot = () => this.version;
  refresh() { this.version++; for (const notify of this.subscribers) notify(); }
  private emit(type: string, detail: string, interaction?: InteractionEventData) { this.bus.emit({ type, detail, at: this.elapsed, ...(interaction ? { interaction } : {}) }); this.refresh(); }
  private enter() {
    this.tools.endDrag(); this.hints.reset(); this.feedback = { kind: 'info', text: this.mission.current.description };
    const effect = this.mission.current.onEnter;
    if (effect) {
      if (effect.patient) this.patient.apply(effect.patient);
      if (effect.vitals) this.vitals.transition(effect.vitals, effect.duration ?? 0);
      this.emergency.apply(effect);
    }
    if (this.mission.current.kind === 'summary') { this.score.data.completionTime = this.elapsed; }
    this.emit('MISSION_CHANGED', this.mission.current.id);
  }
  get canContinue() {
    if (this.paused || this.interaction.pending) return false;
    const current = this.mission.current;
    if (current.kind === 'interaction') return this.mission.interactionComplete();
    if (current.kind === 'placement') return this.ecg.complete;
    if (current.kind === 'decision') {
      if (current.activity?.allowMissingDataAcknowledgement) return this.mission.decisionConfirmed || this.activityReady(current.activity);
      if (current.activity?.kind === 'medication' || current.activity?.kind === 'text-response') return this.mission.decisionConfirmed || this.activityReady(current.activity);
      if (current.activity?.kind === 'fluid-balance') return this.mission.decisionConfirmed || (this.mission.decisions.length > 0 && this.activityReady(current.activity));
      return this.mission.decisionConfirmed || this.mission.decisions.length > 0;
    }
    if (current.kind === 'transition') return !current.autoAfter && this.mission.phaseElapsed >= (current.minDuration ?? 0);
    return current.kind === 'intro';
  }
  get progress() { return Math.round(this.mission.index / (this.config.missions.length - 1) * 100); }
  next() {
    if (!this.canContinue) return false;
    if (this.mission.current.kind === 'decision') {
      if (!this.mission.decisionConfirmed) return this.mission.current.activity?.allowMissingDataAcknowledgement || this.mission.current.activity?.kind === 'medication' || this.mission.current.activity?.kind === 'text-response' ? this.confirmActivity() : this.confirmDecision();
      if (this.mission.current.chartFinding) this.record(this.mission.current.chartFinding);
    }
    if (this.mission.current.kind === 'placement') this.record(this.config.ecg.finding);
    if (this.mission.current.activity) { this.responses = {}; this.activitySteps = []; this.activityPlacements = {}; this.activityStepProgress = {}; }
    if (!this.mission.advance()) return false;
    this.enter(); return true;
  }
  selectTool(id: string | null) {
    if (this.paused || this.interaction.pending) return;
    if (this.tools.select(id)) this.emit('TOOL_SELECTED', this.tools.selected ?? 'none');
  }
  beginToolDrag(id: string) {
    if (this.paused || this.interaction.pending || this.mission.current.kind !== 'interaction' || !this.tools.beginDrag(id)) return false;
    this.emit('TOOL_DRAG_STARTED', id);
    return true;
  }
  endToolDrag(point: Point | null) {
    if (!this.tools.dragging) return;
    if (point && !this.paused) this.useAt(point);
    this.tools.endDrag();
    this.emit('TOOL_DRAG_ENDED', point ? `${Math.round(point.x)},${Math.round(point.y)}` : 'cancelled');
  }
  cancelToolDrag() {
    if (!this.tools.dragging) return;
    const id = this.tools.selected ?? 'unknown';
    this.tools.endDrag();
    this.emit('TOOL_DRAG_CANCELLED', id);
  }
  useAt(point: Point) {
    const hotspot = this.hotspots.at(point);
    this.interact(hotspot?.id ?? 'outside', point);
  }
  previewAt(point: Point): InteractionPreview {
    const hotspot = this.hotspots.at(point);
    const targetId = hotspot?.id ?? null;
    const toolId = this.tools.selected;
    const resolution = this.interaction.resolver.preview(toolId ? this.tools.get(toolId) : undefined, targetId ?? 'outside', this.mission.current, this.mission.completed);
    if (resolution.valid) return { toolId, targetId, point: { ...point }, outcome: 'valid', objectiveId: resolution.objective.id, objective: resolution.objective };
    return {
      toolId,
      targetId,
      point: { ...point },
      outcome: resolution.duplicate ? 'duplicate' : 'invalid',
      reason: resolution.feedback,
    };
  }
  interact(target: string, point?: Point) {
    if (this.paused || this.interaction.pending || this.mission.current.kind !== 'interaction') return;
    const targetId = target === 'outside' ? null : target;
    const dropPoint = point ?? this.hotspots.definitions.find(item => item.id === targetId) ?? null;
    const previewPoint = dropPoint ?? { x: 0, y: 0 };
    const result = this.previewAt(previewPoint);
    if (!this.tools.selected) { this.feedback = { kind: 'info', text: result.reason ?? 'เลือกเครื่องมือจาก Toolbar ก่อนเริ่มตรวจ' }; this.refresh(); return; }
    if (result.outcome !== 'valid' || !result.objective) {
      if (result.outcome !== 'duplicate') this.score.attempt(false);
      this.feedback = { kind: result.outcome === 'duplicate' ? 'info' : 'error', text: result.reason ?? 'ตรวจรายการนี้ไม่ได้ในภารกิจปัจจุบัน' };
      const interaction: InteractionEventData = { toolId: this.tools.selected, targetId: targetId ?? result.targetId, point: dropPoint ? { ...dropPoint } : null, phase: 'rejected', reason: result.reason ?? this.feedback.text };
      this.emit(result.outcome === 'duplicate' ? 'ALREADY_RECORDED' : 'WRONG_ACTION', target, interaction); return;
    }
    const tool = this.tools.get(result.toolId ?? '');
    const interaction: InteractionEventData = { toolId: result.toolId, targetId: result.targetId, point: result.point, phase: 'started', objectiveId: result.objective.id, message: 'กำลังประเมิน…' };
    this.pendingInteraction = interaction;
    this.score.attempt(true); this.interaction.start(result.objective, tool?.duration ?? 0);
    this.tools.selected = null;
    this.feedback = { kind: 'info', text: 'กำลังประเมิน…' }; this.emit('INTERACTION_STARTED', result.objective.sound ?? 'success', interaction);
  }
  private record(id: string) {
    if (this.chart.some(entry => entry.id === id)) return;
    const finding = this.config.findings.find(item => item.id === id);
    if (!finding) return;
    this.chart.push({ ...finding, at: this.elapsed, mission: this.mission.current.id, ...(finding.captureVitals ? { vitals: { ...this.vitals.current } } : {}) });
  }
  choose(id: string) {
    if (this.paused || this.mission.current.kind !== 'decision' || this.mission.decisionConfirmed) return;
    const definition = this.mission.current.decision;
    if (!definition?.options.some(option => option.id === id)) return;
    if (definition.slots?.length) return;
    if (definition.expected.length === 1) this.mission.decisions = [id];
    else if (this.mission.decisions.includes(id)) this.mission.decisions = this.mission.decisions.filter(value => value !== id);
    else this.mission.decisions = [...this.mission.decisions, id];
    this.feedback = { kind: 'info', text: 'เลือกแล้ว · กด Confirm เพื่อตรวจคำตอบ' }; this.emit('DECISION_SELECTED', id);
  }
  chooseForSlot(slotId: string, optionId: string) {
    if (this.paused || this.mission.current.kind !== 'decision' || this.mission.decisionConfirmed) return;
    const definition = this.mission.current.decision;
    if (!definition?.slots?.some(slot => slot.id === slotId) || !definition.options.some(option => option.id === optionId)) return;
    this.mission.decisions = [...this.mission.decisions.filter(value => !value.startsWith(`${slotId}::`)), `${slotId}::${optionId}`];
    this.feedback = { kind: 'info', text: 'วางคำตอบแล้ว · กด Confirm เพื่อตรวจคำตอบ' }; this.emit('DECISION_SELECTED', `${slotId}:${optionId}`);
  }
  setResponse(id: string, value: string) {
    if (this.paused || this.mission.current.kind !== 'decision' || this.mission.decisionConfirmed) return;
    if (!this.mission.current.activity?.fields?.some(field => field.id === id)) return;
    this.responses = { ...this.responses, [id]: value }; this.refresh();
  }
  completeActivityStep(id: string) {
    const activity = this.mission.current.activity;
    if (this.paused || this.mission.current.kind !== 'decision' || this.mission.decisionConfirmed || !activity?.steps?.length) return false;
    const next = activity.steps[this.activitySteps.length];
    if (!activity.steps.some(step => step.id === id)) return false;
    if (next?.id !== id) {
      this.score.attempt(false);
      this.feedback = { kind: 'error', text: `ลำดับยังไม่ตรง · ทำ “${next?.label ?? 'ขั้นถัดไป'}” ก่อน แล้วลองอีกครั้ง` };
      this.emit('WRONG_ACTION', id);
      return false;
    }
    if (next.interaction?.kind === 'syringe-withdrawal') {
      const progress = this.activityStepProgress[id];
      if (!progress?.toolPlaced) {
        this.score.attempt(false);
        this.feedback = { kind: 'error', text: 'วาง Syringe ที่แอมพูลก่อน แล้วลากแกนดึงยา' };
        this.emit('WRONG_ACTION', this.feedback.text);
        return false;
      }
      if (Math.abs(progress.amount - next.interaction.targetAmount) > next.interaction.accuracyWindow) {
        this.score.attempt(false);
        this.feedback = { kind: 'error', text: `ปริมาณยังไม่ตรง Order · ปรับแกนให้อยู่ที่ ${next.interaction.targetAmount.toFixed(1)} ${next.interaction.unit} แล้วลองยืนยันอีกครั้ง` };
        this.emit('WRONG_ACTION', this.feedback.text);
        return false;
      }
    }
    this.activitySteps = [...this.activitySteps, id];
    delete this.activityStepProgress[id];
    this.score.attempt(true);
    this.feedback = { kind: 'success', text: `บันทึกขั้น ${this.activitySteps.length}/${activity.steps.length} แล้ว · ${next.label}` };
    this.emit('ACTIVITY_STEP_COMPLETED', id);
    return true;
  }
  placeActivityStepTool(stepId: string, targetId: string) {
    const activity = this.mission.current.activity;
    if (this.paused || this.mission.current.kind !== 'decision' || this.mission.decisionConfirmed) return false;
    const step = activity?.steps?.[this.activitySteps.length];
    if (step?.id !== stepId || step.interaction?.kind !== 'syringe-withdrawal') return false;
    if (targetId !== step.interaction.targetId) {
      this.score.attempt(false);
      this.feedback = { kind: 'error', text: 'จุดวางไม่ตรง · วางปลายเข็มที่ ampoule แล้วลองใหม่' };
      this.emit('WRONG_ACTION', this.feedback.text);
      return false;
    }
    const progress = this.activityStepProgress[stepId];
    if (progress?.toolPlaced) return true;
    this.activityStepProgress = { ...this.activityStepProgress, [stepId]: { toolPlaced: true, amount: progress?.amount ?? 0 } };
    this.score.attempt(true);
    this.feedback = { kind: 'info', text: `Syringe แตะ ampoule แล้ว · ลากแกนดึงถึง ${step.interaction.targetAmount.toFixed(1)} ${step.interaction.unit}` };
    this.emit('ACTIVITY_STEP_TOOL_PLACED', `${stepId}:${targetId}`);
    return true;
  }
  setActivityStepAmount(stepId: string, amount: number) {
    const activity = this.mission.current.activity;
    const step = activity?.steps?.[this.activitySteps.length];
    if (this.paused || this.mission.current.kind !== 'decision' || this.mission.decisionConfirmed || step?.id !== stepId || step.interaction?.kind !== 'syringe-withdrawal' || !this.activityStepProgress[stepId]?.toolPlaced || !Number.isFinite(amount)) return;
    const safeAmount = Math.round(Math.min(step.interaction.scaleMax, Math.max(0, amount)) * 10) / 10;
    this.activityStepProgress = { ...this.activityStepProgress, [stepId]: { toolPlaced: true, amount: safeAmount } };
    this.refresh();
  }
  placeActivityItem(itemId: string, zoneId: string) {
    const activity = this.mission.current.activity;
    if (this.paused || this.mission.current.kind !== 'decision' || this.mission.decisionConfirmed) return false;
    if (!activity?.items?.some(item => item.id === itemId) || !activity.zones?.some(zone => zone.id === zoneId)) return false;
    this.activityPlacements = { ...this.activityPlacements, [itemId]: zoneId };
    this.feedback = { kind: 'info', text: 'รายการจัดวางแล้ว · กด Confirm เพื่อตรวจทั้งบอร์ด' };
    this.emit('ACTIVITY_ITEM_PLACED', `${itemId}:${zoneId}`);
    return true;
  }
  acknowledgeMissingActivity() {
    const activity = this.mission.current.activity;
    if (this.paused || this.mission.current.kind !== 'decision' || this.mission.decisionConfirmed || !activity?.allowMissingDataAcknowledgement) return false;
    this.responses = { ...this.responses, 'missing-data-ack': 'recorded' };
    this.feedback = { kind: 'info', text: 'ทำเครื่องหมายว่าข้อมูลไม่มีในเรื่องย่อแล้ว · กด Confirm เพื่อบันทึกการฝึก' };
    this.refresh();
    return true;
  }
  private activityReady(activity: ActivityConfig) {
    const fieldsReady = (activity.fields ?? []).every(field => (this.responses[field.id] ?? '').trim().length > 0);
    const stepsReady = (activity.steps ?? []).every((step,index) => this.activitySteps[index] === step.id);
    const itemsReady = (activity.items ?? []).every(item => this.activityPlacements[item.id] !== undefined);
    const missingDataReady = !activity.allowMissingDataAcknowledgement || this.responses['missing-data-ack'] === 'recorded';
    return fieldsReady && stepsReady && itemsReady && missingDataReady;
  }
  private activityPlacementsValid(activity?: ActivityConfig) {
    return (activity?.items ?? []).every(item => this.activityPlacements[item.id] === item.zoneId);
  }
  confirmActivity() {
    const activity = this.mission.current.activity;
    if (this.paused || this.mission.current.kind !== 'decision' || !activity || this.mission.decisionConfirmed || !this.activityReady(activity)) return false;
    const gradable = this.mission.current.gradable !== false && activity.gradable !== false;
    const responsesValid = Object.entries(activity.expectedResponses ?? {}).every(([id, expected]) => {
      const field = activity.fields?.find(item => item.id === id);
      const actual = (this.responses[id] ?? '').trim();
      return field?.type === 'number' ? Number(actual) === Number(expected) : actual.toLocaleLowerCase() === expected.toLocaleLowerCase();
    });
    const valid = !gradable || (responsesValid && this.activityPlacementsValid(activity));
    if (gradable) this.score.attempt(valid);
    this.mission.decisionConfirmed = valid;
    const fallback = activity.kind === 'medication' ? 'บันทึกแบบฟอร์มตัวอย่างแล้ว · ข้อมูลนี้เป็นเดโม' : 'บันทึกคำตอบแล้ว · ตรวจตามข้อมูลใน Case configuration';
    this.feedback = { kind: valid ? (gradable ? 'success' : 'info') : 'error', text: valid ? activity.success ?? fallback : activity.explanation ?? 'คำตอบยังไม่ตรงกับข้อมูลเดโม · แก้แล้วกด Confirm อีกครั้ง' };
    this.emit(valid ? (gradable ? 'ACTIVITY_CONFIRMED' : 'ACTIVITY_DRAFT_SAVED') : 'WRONG_ACTION', this.feedback.text); return valid;
  }
  startEmergencyStage() {
    if (this.paused || this.mission.current.id !== 'CASE_INTRO' || !this.mission.jumpTo('EMERGENCY_TRANSITION')) return false;
    this.responses = {}; this.activitySteps = []; this.activityPlacements = {}; this.activityStepProgress = {}; this.enter(); return true;
  }
  confirmDecision() {
    if (this.paused || this.mission.current.kind !== 'decision' || this.mission.decisionConfirmed || this.mission.decisions.length === 0) return false;
    const activity = this.mission.current.activity;
    if (activity && !this.activityReady(activity)) return false;
    if (this.mission.current.gradable === false) {
      this.mission.decisionConfirmed = true;
      this.feedback = { kind: 'info', text: 'บันทึกคำตอบเพื่อฝึกแล้ว · Case นี้ยังไม่มีข้อมูลทางคลินิกสำหรับตรวจถูกหรือผิด' };
      this.emit('DECISION_RECORDED_UNSCORED', this.mission.current.id);
      return true;
    }
    const fieldsValid = Object.entries(activity?.expectedResponses ?? {}).every(([id, expected]) => {
      const field = activity?.fields?.find(item => item.id === id);
      const actual = (this.responses[id] ?? '').trim();
      return field?.type === 'number' ? Number(actual) === Number(expected) : actual.toLocaleLowerCase() === expected.toLocaleLowerCase();
    });
    const valid = this.mission.validateDecision() && fieldsValid && this.activityPlacementsValid(activity); this.score.attempt(valid);
    const decision = this.mission.current.decision!;
    this.feedback = { kind: valid ? 'success' : 'error', text: valid ? decision.success : decision.explanation };
    this.mission.decisionConfirmed = valid;
    this.emit(valid ? 'DECISION_CORRECT' : 'WRONG_ACTION', this.feedback.text);
    return valid;
  }
  placeLead(id: string, point: Point) {
    if (this.paused || this.mission.current.kind !== 'placement') return false;
    const result = this.ecg.place(id, point);
    if (result === null) return false;
    this.score.attempt(result);
    this.feedback = { kind: result ? 'success' : 'error', text: result ? `✓ ${id} ติดแล้ว · ${this.ecg.placed.size}/6` : `✕ ${id} ยังไม่ตรงตำแหน่ง ลองใหม่ได้ · ใช้ Hint ดูคำแนะนำ` };
    this.emit(result ? 'ECG_LEAD_PLACED' : 'WRONG_ACTION', id); return result;
  }
  hint() {
    if (this.paused) return;
    if (!this.hints.visible) this.score.hint();
    this.feedback = { kind: 'info', text: this.hints.reveal(this.mission.current) }; this.emit('HINT_REVEALED', this.mission.current.id);
  }
  update(delta: number) {
    if (this.paused) return;
    if (this.mission.current.kind !== 'summary' && this.mission.current.id !== 'CASE_INTRO') { this.elapsed += delta; this.mission.phaseElapsed += delta; this.emergency.update(delta); }
    this.vitals.update(delta); this.monitor.update(delta, this.vitals.current.hr);
    const completed = this.interaction.update(delta);
    if (completed) {
      this.mission.completed.add(completed.id); this.record(completed.finding); this.feedback = { kind: 'success', text: completed.feedback };
      const context = this.pendingInteraction;
      this.pendingInteraction = null;
      this.emit('ASSESSMENT_RECORDED', completed.id, context ? { ...context, phase: 'completed', message: completed.feedback } : undefined);
    }
    const advanceAt = this.mission.current.autoAfter;
    if (advanceAt && this.mission.phaseElapsed >= advanceAt && this.mission.advance()) this.enter();
    this.uiElapsed += delta;
    if (this.uiElapsed > 80) { this.uiElapsed = 0; this.refresh(); }
  }
  checkpoint(): Checkpoint {
    return { version: this.config.version, caseId: this.config.id, mission: this.mission.current.id, completed: [...this.mission.completed], chart: this.chart, leads: [...this.ecg.placed], score: { ...this.score.data }, elapsed: this.elapsed, phaseElapsed: this.mission.phaseElapsed, emergencyElapsed: this.emergency.elapsed, vitals: { ...this.vitals.current }, decisions: this.mission.decisions, decisionConfirmed: this.mission.decisionConfirmed, responses: { ...this.responses }, activitySteps: [...this.activitySteps], activityPlacements: { ...this.activityPlacements }, activityStepProgress: { ...this.activityStepProgress } };
  }
  restore(checkpoint: Checkpoint) {
    const index = this.config.missions.findIndex(mission => mission.id === checkpoint.mission);
    if (checkpoint.caseId !== this.config.id || checkpoint.version !== this.config.version || index < 0) throw new Error('Checkpoint does not match case');
    const activeDecision = this.config.missions[index]?.decision;
    const resetIncompatibleDecision = Boolean(activeDecision?.slots?.length && checkpoint.decisions.some(value => !value.includes('::')));
    const activeActivity = this.config.missions[index]?.activity;
    const validStepIds = new Set(activeActivity?.steps?.map(step => step.id) ?? []);
    const validItemIds = new Set(activeActivity?.items?.map(item => item.id) ?? []);
    const validZoneIds = new Set(activeActivity?.zones?.map(zone => zone.id) ?? []);
    const validInteractionStepIds = new Set(activeActivity?.steps?.filter(step => step.interaction).map(step => step.id) ?? []);
    const resetIncompatibleActivity = Boolean(activeActivity && (
      checkpoint.activitySteps.some(id => !validStepIds.has(id))
      || Object.entries(checkpoint.activityPlacements).some(([itemId,zoneId]) => !validItemIds.has(itemId) || !validZoneIds.has(zoneId))
      || Object.keys(checkpoint.activityStepProgress).some(id => !validInteractionStepIds.has(id))
      || (activeActivity.steps?.length && checkpoint.activitySteps.length === 0 && Object.keys(checkpoint.responses).length > 0)
    ));
    this.mission.index = index; this.mission.completed = new Set(checkpoint.completed); this.mission.decisions = resetIncompatibleDecision ? [] : checkpoint.decisions; this.mission.decisionConfirmed = resetIncompatibleDecision ? false : checkpoint.decisionConfirmed; this.mission.phaseElapsed = checkpoint.phaseElapsed; this.responses = resetIncompatibleActivity ? {} : { ...checkpoint.responses }; this.activitySteps = resetIncompatibleActivity ? [] : [...checkpoint.activitySteps]; this.activityPlacements = resetIncompatibleActivity ? {} : { ...checkpoint.activityPlacements }; this.activityStepProgress = resetIncompatibleActivity ? {} : { ...checkpoint.activityStepProgress };
    this.chart = checkpoint.chart; this.ecg.placed = new Set(checkpoint.leads); this.score.data = { ...checkpoint.score }; this.elapsed = checkpoint.elapsed;
    for (const mission of this.config.missions.slice(0, index + 1)) { if (mission.onEnter?.patient) this.patient.apply(mission.onEnter.patient); if (mission.onEnter) this.emergency.apply(mission.onEnter); }
    this.emergency.elapsed = checkpoint.emergencyElapsed;
    this.vitals.current = { ...checkpoint.vitals };
    const effect = this.mission.current.onEnter;
    if (effect?.vitals) this.vitals.transition(effect.vitals, Math.max(0, (effect.duration ?? 0) - checkpoint.phaseElapsed));
    this.feedback = { kind: 'info', text: resetIncompatibleDecision || resetIncompatibleActivity ? 'มีการปรับรูปแบบกิจกรรม · เริ่มช่วงนี้ใหม่ โดยเก็บ Chart และภารกิจที่จบแล้วไว้' : 'เล่นต่อจากข้อมูลที่บันทึกไว้แล้ว' }; this.emit('CHECKPOINT_RESTORED', checkpoint.mission);
  }
}
