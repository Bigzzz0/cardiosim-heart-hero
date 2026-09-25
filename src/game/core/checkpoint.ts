import type { Checkpoint, GameCase, VitalSigns } from '../types';
const key = (caseId: string) => `cardiosim.phaser.checkpoint.${caseId}.v2`;
const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const nonnegative = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0;
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every(item => typeof item === 'string');
const vitals = (value: unknown): value is VitalSigns => record(value) && ['hr','bpSystolic','bpDiastolic','rr','spo2'].every(field => value[field] === null || nonnegative(value[field]));
export function parseCheckpoint(raw: string, config: GameCase): Checkpoint | null {
  try {
    const data: unknown = JSON.parse(raw);
    if (!record(data) || data.caseId !== config.id || data.version !== config.version || !config.missions.some(m => m.id === data.mission)) return null;
    if (!strings(data.completed) || !strings(data.leads) || !strings(data.decisions) || !record(data.responses) || !Object.values(data.responses).every(value => typeof value === 'string') || !Array.isArray(data.chart) || !record(data.score) || !vitals(data.vitals)) return null;
    if (data.activitySteps !== undefined && !strings(data.activitySteps)) return null;
    if (data.activityPlacements !== undefined && (!record(data.activityPlacements) || !Object.values(data.activityPlacements).every(value => typeof value === 'string'))) return null;
    if (data.activityStepProgress !== undefined && (!record(data.activityStepProgress) || !Object.values(data.activityStepProgress).every(value => record(value) && typeof value.toolPlaced === 'boolean' && nonnegative(value.amount)))) return null;
    if (!['elapsed','phaseElapsed','emergencyElapsed'].every(field => nonnegative(data[field])) || !['mistakeCount','hintCount','attempts'].every(field => nonnegative((data.score as Record<string, unknown>)[field]))) return null;
    if (data.score.completionTime !== null && !nonnegative(data.score.completionTime)) return null;
    if (typeof data.decisionConfirmed !== 'boolean') return null;
    const objectives = config.missions.flatMap(m => (m.objectives ?? []).map(o => o.id));
    if (data.completed.some(id => !objectives.includes(id)) || data.leads.some(id => !config.ecg.targets.some(target => target.id === id))) return null;
    const active = config.missions.find(m => m.id === data.mission)!;
    if (data.decisions.some(value => {
      const [slotId, optionId] = value.split('::');
      if (!active.decision?.slots?.length) return !active.decision?.options.some(option => option.id === value);
      // Accept a legacy single-choice checkpoint so restore() can reset this
      // in-progress answer while retaining already completed missions and chart.
      if (!optionId) return !active.decision.options.some(option => option.id === value);
      return !active.decision.slots.some(slot => slot.id === slotId) || !active.decision.options.some(option => option.id === optionId);
    })) return null;
    let activitySteps = (data.activitySteps as string[] | undefined) ?? [];
    let activityPlacements = (data.activityPlacements as Record<string, string> | undefined) ?? {};
    let activityStepProgress = (data.activityStepProgress as Checkpoint['activityStepProgress'] | undefined) ?? {};
    let responses = data.responses as Record<string, string>;
    const allowedStepIds = new Set(active.activity?.steps?.map(step => step.id) ?? []);
    const interactiveSteps = active.activity?.steps?.filter(step => step.interaction?.kind === 'syringe-withdrawal') ?? [];
    const allowedInteractionStepIds = new Set(interactiveSteps.map(step => step.id));
    const allowedItemIds = new Set(active.activity?.items?.map(item => item.id) ?? []);
    const allowedZoneIds = new Set(active.activity?.zones?.map(zone => zone.id) ?? []);
    const incompatibleActivity = activitySteps.some(id => !allowedStepIds.has(id))
      || Object.entries(activityPlacements).some(([itemId,zoneId]) => !allowedItemIds.has(itemId) || !allowedZoneIds.has(zoneId))
      || Object.entries(activityStepProgress).some(([id,progress]) => !allowedInteractionStepIds.has(id) || progress.amount > (active.activity?.steps?.find(step => step.id === id)?.interaction?.scaleMax ?? 0))
      || (interactiveSteps.length > 0 && data.activityStepProgress === undefined)
      || Boolean(active.activity?.steps?.length && activitySteps.length === 0 && Object.keys(responses).length > 0);
    if (incompatibleActivity) { activitySteps = []; activityPlacements = {}; activityStepProgress = {}; responses = {}; }
    for (const entry of data.chart) if (!record(entry) || !config.findings.some(f => f.id === entry.id) || !nonnegative(entry.at) || !config.missions.some(m => m.id === entry.mission) || (entry.vitals !== undefined && !vitals(entry.vitals))) return null;
    // Replace saved text with trusted configuration text; storage only owns progress.
    const chart = data.chart.map(entry => ({ ...config.findings.find(f => f.id === entry.id)!, at: entry.at as number, mission: entry.mission as Checkpoint['mission'], ...(entry.vitals ? { vitals: entry.vitals as VitalSigns } : {}) }));
    return { ...data, activitySteps, activityPlacements, activityStepProgress, responses, chart } as unknown as Checkpoint;
  } catch { return null; }
}
export function readCheckpoint(config: GameCase): Checkpoint | null { try { const raw = localStorage.getItem(key(config.id)); return raw ? parseCheckpoint(raw, config) : null; } catch { return null; } }
export function saveCheckpoint(value: Checkpoint): boolean { try { localStorage.setItem(key(value.caseId), JSON.stringify(value)); return true; } catch { return false; } }
export function clearCheckpoint(caseId: string) { try { localStorage.removeItem(key(caseId)); } catch { /* Storage is optional; in-memory play remains available. */ } }
