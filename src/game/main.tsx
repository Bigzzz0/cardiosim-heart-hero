import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import Phaser from 'phaser';
import { Bug, Check, ClipboardList, HeartPulse, Pause, Play, Siren, X } from 'lucide-react';
import { CaseEngine } from './core/CaseEngine';
import { clearCheckpoint, readCheckpoint, saveCheckpoint } from './core/checkpoint';
import { getGameCase } from './cases';
import { readGameReturn, writeGameReturn } from '../types/cardioGameBridge';
import { AudioSystem } from './systems/AudioSystem';
import { PatientRoomScene } from './scenes/PatientRoomScene';
import type { ChartSection, MedicalTool, VitalSigns } from './types';
import type { GameResult } from '../types/game';
import { ECGMobileProcedure } from './components/ECGMobileProcedure';
import { GameHud } from './components/GameHud';
import { MissionPanel } from './components/MissionPanel';
import type { MissionPresentation } from './components/MissionPanel';
import { MedicalToolTray } from './components/MedicalToolTray';
import { PatientHotspotLayer } from './components/PatientHotspotLayer';
import { PatientMonitor } from './components/PatientMonitor';
import { toolIcons } from './components/gameIcons';
import './styles.css';
import './layout.css';
import './gameplay.css';

const activeCase = getGameCase(new URLSearchParams(location.search).get('case'));
const launchedFromWeb = new URLSearchParams(location.search).get('from') === 'web';
const app = new CaseEngine(activeCase);
const sound = new AudioSystem();
const debug = new URLSearchParams(location.search).get('debug') === 'true';
function fmtTime(ms: number) { const seconds = Math.floor(ms / 1000); return `${String(Math.floor(seconds / 60)).padStart(2,'0')}:${String(seconds % 60).padStart(2,'0')}`; }
function fmtVital(value: number | null, unit = '') { return value === null ? '—' : `${Math.round(value)}${unit}`; }
function fmtVitals(value: VitalSigns) { return `BP ${fmtVital(value.bpSystolic)}/${fmtVital(value.bpDiastolic)} · HR ${fmtVital(value.hr)} · RR ${fmtVital(value.rr)} · SpO₂ ${fmtVital(value.spo2, '%')}`; }
function presentationFor(mission: typeof activeCase.missions[number]): MissionPresentation {
  if (mission.kind === 'summary') return 'result';
  if (mission.kind === 'intro') return 'briefing';
  if (mission.kind === 'placement') return 'procedure';
  if (mission.kind === 'interaction' || mission.kind === 'transition') return 'field';
  if (mission.decision?.presentation === 'bedside-clipboard') return 'bedside-clipboard';
  if (mission.decision?.presentation === 'monitor-response') return 'monitor-response';
  if (mission.kind === 'decision' && mission.activity?.presentation) return mission.activity.presentation;
  if (mission.kind === 'decision' && (!mission.activity || mission.activity.kind === 'matching')) return 'decision-board';
  return 'worksheet';
}
function useGame() { useSyncExternalStore(app.subscribe, app.snapshot, app.snapshot); }

function capturePointer(event: React.PointerEvent<HTMLElement>) {
  try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* Synthetic browser-test pointers are not active DOM pointers. */ }
}

function App() {
  useGame();
  const host = useRef<HTMLDivElement>(null);
  const game = useRef<Phaser.Game | null>(null);
  const drag = useRef<{ id: string; x: number; y: number; pointerId: number } | null>(null);
  const answerDrag = useRef<{ id: string; x: number; y: number; pointerId: number } | null>(null);
  const leadDrag = useRef<{ id: string; x: number; y: number; pointerId: number } | null>(null);
  const stationDrag = useRef<{ kind: 'medication-step' | 'io-item' | 'syringe-tool'; id: string; x: number; y: number; pointerId: number } | null>(null);
  const skipAnswerClick = useRef(false);
  const skipLeadClick = useRef(false);
  const skipStationClick = useRef(false);
  const activityProgressSaveTimer = useRef<number | null>(null);
  const [chartOpen, setChartOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [audio, setAudio] = useState(false);
  const [volume, setVolume] = useState(.22);
  const [resumeAvailable, setResumeAvailable] = useState(false);
  const [answerGhost, setAnswerGhost] = useState<{ label: string; x: number; y: number } | null>(null);
  const [leadGhost, setLeadGhost] = useState<{ label: string; x: number; y: number } | null>(null);
  const [stationGhost, setStationGhost] = useState<{ label: string; x: number; y: number } | null>(null);
  const [selectedActivityItemId, setSelectedActivityItemId] = useState<string | null>(null);
  const [missionPanelPreference, setMissionPanelPreference] = useState<{ missionId: string; open: boolean } | null>(null);
  const [interactionToast, setInteractionToast] = useState<{ id: number; success: boolean; text: string } | null>(null);

  useEffect(() => {
    setResumeAvailable(Boolean(readCheckpoint(activeCase)));
    let dragMoveHandler: ((event: PointerEvent) => void) | null = null;
    let dragUpHandler: ((event: PointerEvent) => void) | null = null;
    let dragDownHandler: ((event: PointerEvent) => void) | null = null;
    let interactionToastTimer: number | undefined;
    let interactionToastSequence = 0;
    const captureDragDown = (event: PointerEvent) => dragDownHandler?.(event);
    const captureDragMove = (event: PointerEvent) => dragMoveHandler?.(event);
    const captureDragUp = (event: PointerEvent) => dragUpHandler?.(event);
    // Register before Phaser so its canvas-level pointer handling cannot swallow a drag release.
    window.addEventListener('pointerdown', captureDragDown, true);
    window.addEventListener('pointermove', captureDragMove, true);
    window.addEventListener('pointerup', captureDragUp, true);
    const instance = new Phaser.Game({ type: Phaser.AUTO, parent: host.current!, width: 1000, height: 720, backgroundColor: '#e0e7df', scene: [new PatientRoomScene(app, sound, debug)], scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.NO_CENTER }, audio: { noAudio: true }, render: { antialias: true, pixelArt: false, roundPixels: true } });
    game.current = instance;
    const scene = () => instance.scene.getScene('PatientRoomScene') as unknown as PatientRoomScene;
    const onMove = (event: PointerEvent) => {
      const heldLead = leadDrag.current;
      if (heldLead && heldLead.pointerId === event.pointerId) {
        if (Math.hypot(event.clientX - heldLead.x, event.clientY - heldLead.y) > 8) {
          const lead = activeCase.ecg.targets.find(item => item.id === heldLead.id);
          if (lead) { setLeadGhost({ label: lead.label, x: event.clientX, y: event.clientY }); document.body.classList.add('dragging'); }
        }
        return;
      }
      const heldAnswer = answerDrag.current;
      if (heldAnswer && heldAnswer.pointerId === event.pointerId) {
        if (Math.hypot(event.clientX - heldAnswer.x, event.clientY - heldAnswer.y) > 8) {
          const option = app.mission.current.decision?.options.find(item => item.id === heldAnswer.id);
          if (option) { setAnswerGhost({ label: option.label, x: event.clientX, y: event.clientY }); document.body.classList.add('dragging'); }
        }
        return;
      }
      const heldStationItem = stationDrag.current;
      if (heldStationItem && heldStationItem.pointerId === event.pointerId) {
        if (Math.hypot(event.clientX - heldStationItem.x, event.clientY - heldStationItem.y) > 8) {
          const activity = app.mission.current.activity;
          const label = heldStationItem.kind === 'medication-step'
            ? activity?.steps?.find(step => step.id === heldStationItem.id)?.equipmentLabel
            : heldStationItem.kind === 'io-item' ? activity?.items?.find(item => item.id === heldStationItem.id)?.label : 'Syringe';
          if (label) { setStationGhost({ label, x: event.clientX, y: event.clientY }); document.body.classList.add('dragging'); }
        }
        return;
      }
      const start = drag.current;
      if (!start || start.pointerId !== event.pointerId) return;
      if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8) document.body.classList.add('dragging');
      scene().setToolDragPoint(scene().screenPoint(event.clientX, event.clientY));
    };
    const onUp = (event: PointerEvent) => {
      const heldLead = leadDrag.current;
      if (heldLead && heldLead.pointerId === event.pointerId) {
        const didDrag = Math.hypot(event.clientX - heldLead.x, event.clientY - heldLead.y) > 8;
        leadDrag.current = null; setLeadGhost(null); document.body.classList.remove('dragging');
        if (didDrag) {
          skipLeadClick.current = true;
          window.setTimeout(() => { skipLeadClick.current = false; }, 120);
          const element = document.elementFromPoint(event.clientX, event.clientY);
          const board = element?.closest<HTMLElement>('.ecg-mobile-map');
          const imageElement = board?.querySelector('img');
          const imageBounds = imageElement?.getBoundingClientRect();
          if (imageBounds && event.clientX >= imageBounds.left && event.clientY >= imageBounds.top && event.clientX <= imageBounds.right && event.clientY <= imageBounds.bottom) {
            const layout = activeCase.ecg.layout.image;
            app.placeLead(heldLead.id, {
              x: layout.x + (event.clientX - imageBounds.left) / imageBounds.width * layout.width,
              y: layout.y + (event.clientY - imageBounds.top) / imageBounds.height * layout.height,
            });
          } else { app.ecg.selected = null; app.refresh(); }
        }
        return;
      }
      const heldAnswer = answerDrag.current;
      if (heldAnswer && heldAnswer.pointerId === event.pointerId) {
        const didDrag = Math.hypot(event.clientX - heldAnswer.x, event.clientY - heldAnswer.y) > 8;
        answerDrag.current = null; setAnswerGhost(null); document.body.classList.remove('dragging');
        if (didDrag) {
          skipAnswerClick.current = true;
          const slot = [...document.querySelectorAll<HTMLElement>('[data-answer-slot]')].find(candidate => {
            const bounds = candidate.getBoundingClientRect();
            return event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
          });
          if (slot?.dataset.answerSlot) app.chooseForSlot(slot.dataset.answerSlot, heldAnswer.id);
        }
        return;
      }
      const heldStationItem = stationDrag.current;
      if (heldStationItem && heldStationItem.pointerId === event.pointerId) {
        const didDrag = Math.hypot(event.clientX - heldStationItem.x, event.clientY - heldStationItem.y) > 8;
        stationDrag.current = null; setStationGhost(null); document.body.classList.remove('dragging');
        if (didDrag) {
          skipStationClick.current = true;
          window.setTimeout(() => { skipStationClick.current = false; }, 120);
          const element = document.elementFromPoint(event.clientX,event.clientY);
          if (heldStationItem.kind === 'medication-step') {
            const target = element?.closest<HTMLElement>('[data-activity-step-target]')?.dataset.activityStepTarget;
            if (target) app.completeActivityStep(target);
          } else if (heldStationItem.kind === 'syringe-tool') {
            const target = element?.closest<HTMLElement>('[data-syringe-ampoule-target]')?.dataset.syringeAmpouleTarget;
            if (target) app.placeActivityStepTool(heldStationItem.id,target);
          } else {
            const zone = element?.closest<HTMLElement>('[data-activity-zone]')?.dataset.activityZone;
            if (zone) app.placeActivityItem(heldStationItem.id,zone);
          }
        }
        return;
      }
      const start = drag.current;
      if (!start || start.pointerId !== event.pointerId) return;
      drag.current = null; document.body.classList.remove('dragging');
      const didDrag = Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8;
      const room = scene();
      room.setToolDragPoint(null);
      if (didDrag) app.endToolDrag(room.screenPoint(event.clientX, event.clientY));
      else {
        app.cancelToolDrag();
        if (event.pointerType === 'touch') app.selectTool(start.id);
      }
    };
    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 || app.mission.current.kind !== 'decision' || app.mission.decisionConfirmed) return;
      const option = [...document.querySelectorAll<HTMLButtonElement>('[data-answer-option]')].find(candidate => {
        const bounds = candidate.getBoundingClientRect();
        return event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
      });
      const id = option?.dataset.answerOption;
      if (!option || !id) return;
      event.preventDefault();
      try { option.setPointerCapture(event.pointerId); } catch { /* Synthetic browser-test pointers are not active DOM pointers. */ }
      // A previous Phaser-owned pointer may have left a lead/tool drag ref behind after a scene transition.
      leadDrag.current = null; setLeadGhost(null);
      if (drag.current) { drag.current = null; scene().setToolDragPoint(null); app.cancelToolDrag(); }
      skipAnswerClick.current = false;
      answerDrag.current = { id, x: event.clientX, y: event.clientY, pointerId: event.pointerId };
    };
    const onCancel = () => { drag.current = null; answerDrag.current = null; leadDrag.current = null; stationDrag.current = null; setAnswerGhost(null); setLeadGhost(null); setStationGhost(null); document.body.classList.remove('dragging'); scene().setToolDragPoint(null); app.cancelToolDrag(); };
    dragDownHandler = onDown; dragMoveHandler = onMove; dragUpHandler = onUp;
    window.addEventListener('pointercancel', onCancel); window.addEventListener('blur', onCancel);
    const unsubscribe = app.bus.subscribe(event => {
      if (['MISSION_CHANGED','ASSESSMENT_RECORDED','ECG_LEAD_PLACED','DECISION_SELECTED','DECISION_CORRECT','WRONG_ACTION','HINT_REVEALED','ACTIVITY_STEP_TOOL_PLACED','ACTIVITY_STEP_COMPLETED','ACTIVITY_ITEM_PLACED','ACTIVITY_CONFIRMED','ACTIVITY_DRAFT_SAVED'].includes(event.type)) { saveCheckpoint(app.checkpoint()); setResumeAvailable(true); }
      if (event.type === 'MISSION_CHANGED') {
        if (interactionToastTimer !== undefined) window.clearTimeout(interactionToastTimer);
        setInteractionToast(null);
        setSelectedActivityItemId(null);
      }
      if (event.interaction && event.interaction.phase !== 'started') {
        const success = event.interaction.phase === 'completed';
        if (navigator.vibrate) navigator.vibrate(success ? 18 : [14, 34, 14]);
        const id = ++interactionToastSequence;
        const text = success ? event.interaction.message ?? 'บันทึกผลการประเมินแล้ว' : event.interaction.reason ?? 'ตรวจตำแหน่งนี้ไม่ได้ ลองใหม่ได้';
        const room = host.current?.parentElement;
        const bounds = room?.getBoundingClientRect();
        const screenPoint = event.interaction.point ? scene().worldToClient(event.interaction.point) : null;
        const anchor = bounds && screenPoint ? {
          left: Phaser.Math.Clamp(screenPoint.x - bounds.left, window.innerWidth <= 760
            ? (room?.querySelector<HTMLElement>('.monitor')?.getBoundingClientRect().right ?? bounds.left) - bounds.left + Math.min(136, bounds.width * .4)
            : 190, bounds.width - (window.innerWidth <= 760 ? 124 : 190)),
          top: Phaser.Math.Clamp(screenPoint.y - bounds.top - 18, 72, bounds.height - 146),
        } : undefined;
        if (room && anchor) {
          room.style.setProperty('--interaction-toast-left', `${anchor.left}px`);
          room.style.setProperty('--interaction-toast-top', `${anchor.top}px`);
        }
        setInteractionToast({ id, success, text });
        if (interactionToastTimer !== undefined) window.clearTimeout(interactionToastTimer);
        interactionToastTimer = window.setTimeout(() => setInteractionToast(current => current?.id === id ? null : current), success ? 1850 : 2450);
      }
      if (event.type === 'TOOL_DRAG_STARTED') sound.cue('tool-pickup');
      if (event.type === 'INTERACTION_STARTED') sound.cue('tool-contact');
      if (event.type === 'ASSESSMENT_RECORDED') sound.cue(event.detail === 'lungs' ? 'auscultation' : 'success');
      if (event.type === 'ACTIVITY_STEP_TOOL_PLACED') sound.cue('tool-contact');
      if (event.type === 'ACTIVITY_STEP_COMPLETED' || event.type === 'ACTIVITY_CONFIRMED' || event.type === 'ACTIVITY_DRAFT_SAVED') sound.cue('success');
      if (event.type === 'WRONG_ACTION') sound.cue('error');
      if (event.type === 'ECG_LEAD_PLACED' || event.type === 'DECISION_CORRECT') sound.cue('success');
      if (event.type === 'MISSION_CHANGED' && event.detail === 'EMERGENCY_TRANSITION') {
        scene().playEmergencyImpact();
        if (navigator.vibrate) navigator.vibrate([160,100,160]);
      }
    });
    const ticker = window.setInterval(() => saveCheckpoint(app.checkpoint()), 5000);
    const onKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { onCancel(); app.selectTool(null); setChartOpen(false); setPaused(false); }
      if (event.target instanceof HTMLInputElement) return;
      const currentMission = app.mission.current;
      const activeToolIds = new Set(currentMission.kind === 'interaction'
        ? currentMission.objectives?.filter(objective => !app.mission.completed.has(objective.id)).map(objective => objective.tool) ?? []
        : []);
      const activeTools = activeCase.tools.filter(tool => activeToolIds.has(tool.id));
      const index = Number(event.key)-1; if (index >= 0 && index < activeTools.length) app.selectTool(activeTools[index].id);
    };
    window.addEventListener('keydown', onKeys);
    return () => { unsubscribe(); window.clearInterval(ticker); if (activityProgressSaveTimer.current !== null) window.clearTimeout(activityProgressSaveTimer.current); if (interactionToastTimer !== undefined) window.clearTimeout(interactionToastTimer); window.removeEventListener('keydown', onKeys); dragDownHandler = null; dragMoveHandler = null; dragUpHandler = null; window.removeEventListener('pointerdown', captureDragDown, true); window.removeEventListener('pointermove', captureDragMove, true); window.removeEventListener('pointerup', captureDragUp, true); window.removeEventListener('pointercancel', onCancel); window.removeEventListener('blur', onCancel); instance.destroy(true); sound.dispose(); };
  }, []);
  useEffect(() => { app.paused = chartOpen || paused; }, [chartOpen, paused]);
  useEffect(() => {
    if (!chartOpen) return;
    const dialog = document.querySelector<HTMLElement>('.chart-modal');
    if (!dialog) return;
    const restoreTarget = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const closeButton = dialog.querySelector<HTMLButtonElement>('.chart-header button');
    closeButton?.focus();
    const containFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const focusable = [...dialog.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])')];
      if (focusable.length === 0) { event.preventDefault(); dialog.focus(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    dialog.addEventListener('keydown', containFocus);
    return () => {
      dialog.removeEventListener('keydown', containFocus);
      if (restoreTarget?.isConnected) restoreTarget.focus();
    };
  }, [chartOpen]);

  const mission = app.mission.current;
  const presentation = presentationFor(mission);
  const defaultPanelOpen = presentation !== 'field' && presentation !== 'procedure';
  const missionPanelOpen = missionPanelPreference?.missionId === mission.id ? missionPanelPreference.open : defaultPanelOpen;
  const nextObjective = mission.objectives?.find(objective => !app.mission.completed.has(objective.id));
  const nextTool = nextObjective ? activeCase.tools.find(tool => tool.id === nextObjective.tool) : undefined;
  const nextHotspot = nextObjective ? activeCase.hotspots.find(hotspot => hotspot.id === nextObjective.target) : undefined;
  const emergency = app.emergency.alarm;
  const monitorTrace = activeCase.monitorTraces?.[app.patient.state.condition];
  const availableToolIds = new Set(mission.kind === 'interaction'
    ? mission.objectives?.filter(objective => !app.mission.completed.has(objective.id)).map(objective => objective.tool) ?? []
    : []);
  const availableTools = activeCase.tools.filter(tool => availableToolIds.has(tool.id));
  const firstInteractionMission = activeCase.missions.find(candidate => candidate.kind === 'interaction' && candidate.objectives?.length);
  const onboardingObjective = firstInteractionMission?.objectives?.[0];
  const onboardingActive = firstInteractionMission?.id === mission.id
    && Boolean(onboardingObjective && !app.mission.completed.has(onboardingObjective.id));
  const onboardingTool = onboardingActive && onboardingObjective
    ? activeCase.tools.find(tool => tool.id === onboardingObjective.tool)
    : undefined;
  const onboardingTarget = onboardingActive && onboardingObjective
    ? activeCase.hotspots.find(hotspot => hotspot.id === onboardingObjective.target)
    : undefined;
  const tutorial = onboardingTool && onboardingTarget
    ? { toolId: onboardingTool.id, toolName: onboardingTool.name, targetName: onboardingTarget.label }
    : undefined;
  const startDrag = (tool: MedicalTool, event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || mission.kind !== 'interaction') return;
    event.preventDefault();
    capturePointer(event);
    if (!app.beginToolDrag(tool.id)) return;
    drag.current = { id: tool.id, x: event.clientX, y: event.clientY, pointerId: event.pointerId };
    const room = game.current?.scene.getScene('PatientRoomScene') as unknown as PatientRoomScene | undefined;
    room?.setToolDragPoint(null);
  };
  const mainAction = () => {
    if (mission.kind === 'decision' && app.mission.decisionConfirmed) { app.next(); return; }
    if (mission.kind === 'decision' && mission.activity?.allowMissingDataAcknowledgement) { app.confirmActivity(); return; }
    if (mission.kind === 'decision' && (mission.activity?.kind === 'medication' || mission.activity?.kind === 'text-response')) { app.confirmActivity(); return; }
    if (mission.kind === 'decision') { app.confirmDecision(); return; }
    app.next();
  };
  const primaryLabel = mission.kind === 'decision'
    ? app.mission.decisionConfirmed ? 'Next' : mission.activity?.allowMissingDataAcknowledgement ? 'Confirm · บันทึกข้อมูลที่ไม่มี' : mission.activity?.presentation === 'medication-station' ? 'Confirm · บันทึกการเตรียมยา' : mission.activity?.presentation === 'ecg-console' ? 'Confirm · บันทึกการอ่าน' : mission.activity?.kind === 'medication' || mission.activity?.kind === 'text-response' ? 'Confirm · ตรวจและบันทึก' : 'Confirm · ตรวจคำตอบ'
    : mission.button ?? 'ต่อไป';
  const startAnswerDrag = (id: string, event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || mission.kind !== 'decision' || app.mission.decisionConfirmed) return;
    event.preventDefault(); capturePointer(event); skipAnswerClick.current = false; answerDrag.current = { id, x: event.clientX, y: event.clientY, pointerId: event.pointerId };
  };
  const startActivityStepDrag = (id: string, event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || mission.kind !== 'decision' || app.mission.decisionConfirmed) return;
    event.preventDefault(); capturePointer(event); skipStationClick.current = false;
    stationDrag.current = { kind: 'medication-step', id, x: event.clientX, y: event.clientY, pointerId: event.pointerId };
  };
  const startActivityItemDrag = (id: string, event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || mission.kind !== 'decision' || app.mission.decisionConfirmed) return;
    event.preventDefault(); capturePointer(event); skipStationClick.current = false;
    stationDrag.current = { kind: 'io-item', id, x: event.clientX, y: event.clientY, pointerId: event.pointerId };
  };
  const startSyringeToolDrag = (id: string, event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || mission.kind !== 'decision' || app.mission.decisionConfirmed) return;
    event.preventDefault(); capturePointer(event); skipStationClick.current = false;
    stationDrag.current = { kind: 'syringe-tool', id, x: event.clientX, y: event.clientY, pointerId: event.pointerId };
  };
  const placeSyringeTool = (stepId: string, targetId: string) => {
    if (skipStationClick.current) { skipStationClick.current = false; return; }
    app.placeActivityStepTool(stepId,targetId);
  };
  const setSyringeAmount = (stepId: string, amount: number) => {
    app.setActivityStepAmount(stepId,amount);
    if (activityProgressSaveTimer.current !== null) window.clearTimeout(activityProgressSaveTimer.current);
    activityProgressSaveTimer.current = window.setTimeout(() => { saveCheckpoint(app.checkpoint()); setResumeAvailable(true); activityProgressSaveTimer.current = null; },250);
  };
  const completeActivityStep = (id: string) => {
    if (skipStationClick.current) { skipStationClick.current = false; return; }
    app.completeActivityStep(id);
  };
  const selectActivityItem = (id: string) => {
    if (skipStationClick.current) { skipStationClick.current = false; return; }
    setSelectedActivityItemId(id);
  };
  const placeActivityItem = (id: string, zoneId: string) => {
    if (app.placeActivityItem(id,zoneId)) setSelectedActivityItemId(null);
  };
  const acknowledgeMissingActivity = () => app.acknowledgeMissingActivity();
  const clickAnswer = (optionId: string) => {
    if (skipAnswerClick.current) { skipAnswerClick.current = false; return; }
    const slots = mission.decision?.slots ?? [];
    const assigned = new Set(app.mission.decisions.map(value => value.split('::', 1)[0]));
    const firstOpen = slots.find(slot => !assigned.has(slot.id)) ?? slots[0];
    if (firstOpen) app.chooseForSlot(firstOpen.id, optionId);
  };
  const startLeadDrag = (id: string, event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || mission.kind !== 'placement' || app.ecg.placed.has(id)) return;
    event.preventDefault(); capturePointer(event); skipLeadClick.current = false; app.ecg.selected = id; app.refresh();
    leadDrag.current = { id, x: event.clientX, y: event.clientY, pointerId: event.pointerId };
  };
  const clickLead = (id: string) => {
    if (skipLeadClick.current) { skipLeadClick.current = false; return; }
    if (app.ecg.placed.has(id)) return;
    app.ecg.selected = id; app.refresh();
  };
  const clickLeadTarget = (id: string) => {
    const lead = app.ecg.selected;
    const target = activeCase.ecg.targets.find(item => item.id === id);
    if (lead && target) app.placeLead(lead, { x: target.x, y: target.y });
  };
  const toggleAudio = async () => { await sound.toggle(); setAudio(!sound.muted); };
  const restart = () => { clearCheckpoint(activeCase.id); window.location.reload(); };
  const resume = () => { const checkpoint = readCheckpoint(activeCase); if (checkpoint) app.restore(checkpoint); setResumeAvailable(false); };
  const returnToPostTest = () => {
    const result: GameResult = {
      caseId: activeCase.scenarios[0]?.id ?? activeCase.id,
      completedAt: new Date().toISOString(),
      durationMs: app.score.data.completionTime ?? app.elapsed,
      attempts: app.score.data.attempts,
      mistakes: app.score.data.mistakeCount,
      hints: app.score.data.hintCount,
      findings: app.chart.map(entry => entry.id),
      clinicalStatus: activeCase.clinicalStatus,
      demoScore: activeCase.gradable ? app.score.total : null,
      scoreStatus: activeCase.gradable ? 'demo' : 'unscored',
    };
    const bridge = readGameReturn();
    if (bridge) writeGameReturn({ ...bridge, telemetry: { ...bridge.telemetry, gameResult: result } });
    try { sessionStorage.setItem('cardiosim.game.result.v1', JSON.stringify(result)); } catch { /* Result remains visible in this scene if session storage is unavailable. */ }
    if (launchedFromWeb) window.location.assign('/?stage=POSTTEST');
  };

  return <div className="app-shell">
    <GameHud caseId={activeCase.scenarios[0]?.id.toUpperCase() ?? activeCase.id.toUpperCase()} missions={activeCase.missions} missionIndex={app.mission.index} missionPhase={mission.phase} emergency={emergency} elapsedLabel={fmtTime(app.elapsed)} mistakeCount={app.score.data.mistakeCount} audioEnabled={audio} paused={paused} debug={debug} volume={volume} onToggleAudio={()=>void toggleAudio()} onVolumeChange={next=>{setVolume(next);sound.setVolume(next);}} onTogglePause={()=>setPaused(value=>!value)} onFullscreen={()=>void document.documentElement.requestFullscreen?.()}/>
    <div className="case-bar"><div><span className="eyebrow">PATIENT CARE / {activeCase.scenarios[0]?.id.toUpperCase()}</span><h1>{activeCase.title}</h1></div><div className="case-progress"><span>CASE PROGRESS <b>{app.progress}%</b></span><div className="progress-track"><i style={{width:`${Math.max(4,app.progress)}%`}}/></div></div><span className="demo-tag">{activeCase.clinicalStatus}</span></div>
    {resumeAvailable&&mission.id==='CASE_INTRO'&&<div className="resume-banner"><span>พบ checkpoint · {readCheckpoint(activeCase)?.mission.replace(/_/g,' ')}</span><button onClick={resume}>เล่นต่อ</button><button className="start-fresh" onClick={restart}>เริ่มใหม่</button></div>}
    <main className={`presentation-${presentation}`} data-game-paused={app.paused} data-interaction-pending={Boolean(app.interaction.pending)} data-decision-confirmed={app.mission.decisionConfirmed} data-decision-count={app.mission.decisions.length} data-ecg-layout={mission.kind==='placement'?JSON.stringify(activeCase.ecg.layout):undefined} data-ecg-targets={mission.kind==='placement'?JSON.stringify(activeCase.ecg.targets):undefined}><section className={`simulation ${mission.kind==='placement'?'ecg-placement':''}`}><div className="room-topline"><span><span className="live-dot"/> PATIENT ROOM <b>01</b></span><span>OBSERVE · ASSESS · RESPOND</span></div><div className={`room-stage ${emergency?'emergency-room':''} ${app.patient.state.animation==='recovering'?'recovery-room':''} ${mission.kind==='placement'?'ecg-room':''}`}><div className="phaser-host" ref={host}/><PatientHotspotLayer hotspots={activeCase.hotspots} active={mission.kind==='interaction'} dragging={app.tools.dragging} debug={debug} tutorialTargetId={onboardingActive ? onboardingTarget?.id : undefined} selectedTool={app.tools.selected ? app.tools.get(app.tools.selected) : undefined} onActivate={point=>app.useAt(point)}/>{interactionToast&&<div key={interactionToast.id} className={`interaction-toast ${interactionToast.success?'success':'error'}`} role="status" aria-live="polite">{interactionToast.success?<Check size={18}/>:<X size={18}/>}<span>{interactionToast.text}</span></div>}<PatientMonitor emergency={emergency} gradable={activeCase.gradable} trace={monitorTrace} vitals={app.vitals.current}/>{mission.kind==='intro'&&<div className="room-caption"><span className="caption-icon"><HeartPulse size={18}/></span><div><b>{app.patient.state.condition==='critical'?'ผู้ป่วยมีอาการทรุดลง':app.patient.state.condition==='stable'?'ผู้ป่วยตอบสนองต่อการดูแล':'ผู้ป่วยพร้อมรับการประเมิน'}</b><span>ดูข้อมูลภารกิจเพื่อเริ่มดูแล</span></div></div>}<span className="room-watermark">CARDIOSIM / ORIGINAL SIMULATION ART</span>{mission.kind==='transition'&&<div className="room-alert"><Siren size={26}/><span>ผู้ป่วยทรุดลง · กำลังเปลี่ยนเข้าสู่ภารกิจ</span></div>}{debug&&<div className="debug-panel"><b><Bug size={12}/> LIVE DEBUG</b><span>MISSION · {mission.id}</span><span>PATIENT · {app.patient.state.condition} / {app.patient.state.breathing}</span><span>TOOL · {app.tools.selected??'none'}</span><span>VITAL · HR {fmtVital(app.vitals.current.hr)} · SpO₂ {fmtVital(app.vitals.current.spo2, '%')}</span>{app.bus.logs.slice(0,4).map((event,index)=><small key={`${event.at}-${index}`}>{event.type} · {event.detail}</small>)}</div>}</div>
    {availableTools.length>0&&<MedicalToolTray tools={availableTools} selectedId={app.tools.selected} dragging={app.tools.dragging} interactive={mission.kind==='interaction'} tutorial={tutorial} onPointerDown={startDrag} onClick={(tool,event)=>{if(event.detail===0&&mission.kind==='interaction')app.selectTool(tool.id);}}/>}</section>
    {mission.kind==='placement'&&<ECGMobileProcedure targets={activeCase.ecg.targets} image={activeCase.ecg.layout.image} imageSrc={activeCase.assets.ecgChest} placed={app.ecg.placed} selected={app.ecg.selected} feedback={app.feedback} canContinue={app.canContinue} onDragStart={startLeadDrag} onSelect={clickLead} onTarget={clickLeadTarget} onHint={()=>app.hint()} onChart={()=>setChartOpen(true)} onConfirm={mainAction}/>}
    <MissionPanel
      engine={app}
      presentation={presentation}
      isOpen={missionPanelOpen}
      interactionToastActive={Boolean(interactionToast)}
      emergency={emergency}
      elapsedLabel={fmtTime(app.score.data.completionTime ?? app.elapsed)}
      emergencyElapsedLabel={fmtTime(app.emergency.elapsed)}
      primaryLabel={primaryLabel}
      nextObjective={nextObjective}
      nextTool={nextTool}
      nextHotspot={nextHotspot}
      nextToolIcon={nextTool ? toolIcons[nextTool.icon] : undefined}
      onToggle={() => setMissionPanelPreference({ missionId: mission.id, open: !missionPanelOpen })}
      onMainAction={mainAction}
      onHint={() => app.hint()}
      onOpenChart={() => setChartOpen(true)}
      onRestart={restart}
      onPostTest={launchedFromWeb ? returnToPostTest : undefined}
      onStartNormal={() => app.next()}
      onStartEmergency={() => app.startEmergencyStage()}
      onStartAnswerDrag={startAnswerDrag}
      onClickAnswer={clickAnswer}
      activitySteps={app.activitySteps}
      activityStepProgress={app.activityStepProgress}
      activityPlacements={app.activityPlacements}
      selectedActivityItemId={selectedActivityItemId}
      onAcknowledgeMissing={acknowledgeMissingActivity}
      onStartActivityStepDrag={startActivityStepDrag}
      onCompleteActivityStep={completeActivityStep}
      onPlaceSyringeTool={placeSyringeTool}
      onStartSyringeToolDrag={startSyringeToolDrag}
      onSetSyringeAmount={setSyringeAmount}
      onStartActivityItemDrag={startActivityItemDrag}
      onSelectActivityItem={selectActivityItem}
      onPlaceActivityItem={placeActivityItem}
    />{paused&&!chartOpen&&<div className="pause-overlay"><section className="pause-card"><Pause size={28}/><span className="eyebrow">SIMULATION PAUSED</span><h2>พักภารกิจชั่วคราว</h2><p>ผู้ป่วยและเวลาในภารกิจหยุดไว้แล้ว</p><button className="primary" onClick={()=>setPaused(false)}><Play size={16}/> กลับไปเล่น</button></section></div>}</main>
    <footer><span><span className="live-dot"/> ห้องจำลองพร้อมใช้งาน</span><span>PHASER 3 <i/> MOUSE & TOUCH <i/> {debug?'DEBUG ENABLED':'DEMO BUILD 0.1'}</span></footer>
    {leadGhost&&<div className="lead-ghost" style={{left:leadGhost.x,top:leadGhost.y}}>{leadGhost.label}</div>}{answerGhost&&<div className="answer-ghost" style={{left:answerGhost.x,top:answerGhost.y}}>{answerGhost.label}</div>}{stationGhost&&<div className="answer-ghost station-ghost" style={{left:stationGhost.x,top:stationGhost.y}}>{stationGhost.label}</div>}
    {chartOpen&&<div className="modal-backdrop" role="presentation" onPointerDown={event=>{if(event.target===event.currentTarget)setChartOpen(false);}}><section className="chart-modal" role="dialog" aria-modal="true" aria-labelledby="chart-title"><div className="chart-header"><span><ClipboardList size={19}/> PATIENT CHART</span><button onClick={()=>setChartOpen(false)} aria-label="ปิด Chart"><X size={18}/></button></div><h2 id="chart-title">ข้อมูลที่ค้นพบ</h2><p>ข้อมูลที่ยังไม่ได้ตรวจจะแสดงเป็น ???</p>{(['History','Vital Signs','Respiratory Assessment','Perfusion Assessment','Care Plan','Medication','Intake / Output','ECG'] as ChartSection[]).map(section=><div className="chart-section" key={section}><b>{section.toUpperCase()}</b>{app.chart.filter(entry=>entry.section===section).length===0?<div className="unknown">??? <span>ยังไม่ได้ตรวจ</span></div>:app.chart.filter(entry=>entry.section===section).map(entry=><div className="chart-entry" key={entry.id}><b>{entry.title}</b><span>{entry.captureVitals&&entry.vitals?fmtVitals(entry.vitals):entry.text}</span><small>พบระหว่าง {entry.mission.replace(/_/g,' ')}</small></div>)}</div>)}<div className="chart-source">แหล่งข้อมูล: {activeCase.sources.join(' · ')} · ค่าทั้งหมดเป็นตัวอย่างสำหรับสาธิต</div></section></div>}
  </div>;
}
createRoot(document.getElementById('root')!).render(<App/>);
