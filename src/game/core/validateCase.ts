import { MISSION_STATES, type GameCase } from '../types';
export function validateCase(config: GameCase) {
  const require = (condition: boolean, message: string) => { if (!condition) throw new Error(`Invalid case "${config.id}": ${message}`); };
  const unique = (ids: string[], label: string) => require(new Set(ids).size === ids.length, `Duplicate ${label}`);
  require(config.missions.length >= 2, 'Missing missions');
  require(config.scenarios.some(scenario => scenario.enabled), 'Missing playable scenario');
  require(config.missions[0].id === 'CASE_INTRO' && config.missions[config.missions.length - 1]?.id === 'CASE_SUMMARY', 'Case must begin with CASE_INTRO and end with CASE_SUMMARY');
  unique(config.missions.map(m => m.id), 'mission'); unique(config.tools.map(t => t.id), 'tool'); unique(config.hotspots.map(h => h.id), 'hotspot'); unique(config.findings.map(f => f.id), 'finding');
  const tools = new Set(config.tools.map(t => t.id)); const targets = new Set(config.hotspots.map(t => t.id)); const findings = new Set(config.findings.map(t => t.id));
  for (const value of Object.values(config.initialVitals)) require(value === null || Number.isFinite(value) && value >= 0, 'Invalid initial vital');
  for (const tool of config.tools) { require(tool.duration >= 0 && Number.isFinite(tool.duration), 'Invalid tool duration'); for (const target of tool.allowedTargets) require(targets.has(target), `Unknown hotspot ${target}`); }
  for (const mission of config.missions) {
    require(MISSION_STATES.includes(mission.id), `Unknown state ${mission.id}`);
    if (mission.kind === 'interaction') require(!!mission.objectives?.length, `Missing mission success condition: ${mission.id}`);
    for (const objective of mission.objectives ?? []) { require(tools.has(objective.tool), `Unknown tool ${objective.tool}`); require(targets.has(objective.target), `Unknown hotspot ${objective.target}`); require(findings.has(objective.finding), `Unknown finding ${objective.finding}`); }
    if (mission.kind === 'decision') {
      require(mission.gradable === false || !!mission.decision?.expected.length || !!mission.activity?.fields?.length, `Missing decision answer: ${mission.id}`);
      if (mission.gradable !== false) {
        for (const id of mission.decision?.expected ?? []) require(!!mission.decision?.options.some(o => o.id === id), `Unknown answer ${id}`);
        for (const slot of mission.decision?.slots ?? []) { require(!!mission.decision?.options.some(option => option.id === slot.expected), `Unknown slot answer ${slot.expected}`); }
        if (mission.decision?.slots) require(mission.decision.slots.length === mission.decision.expected.length, `Decision slot mismatch: ${mission.id}`);
      }
    }
    if (mission.chartFinding) require(findings.has(mission.chartFinding), `Unknown chart finding ${mission.chartFinding}`);
    if (mission.activity?.fields) {
      unique(mission.activity.fields.map(field => field.id), `activity field in ${mission.id}`);
      for (const field of mission.activity.fields) if (field.type === 'select') require(!!field.options?.length, `Missing field options ${field.id}`);
    }
    for (const step of mission.activity?.steps ?? []) if (step.interaction?.kind === 'syringe-withdrawal') {
      require(Number.isFinite(step.interaction.targetAmount) && step.interaction.targetAmount > 0, `Invalid syringe target ${step.id}`);
      require(Number.isFinite(step.interaction.scaleMax) && step.interaction.scaleMax >= step.interaction.targetAmount, `Invalid syringe scale ${step.id}`);
      require(Number.isFinite(step.interaction.accuracyWindow) && step.interaction.accuracyWindow >= 0, `Invalid syringe tolerance ${step.id}`);
      require(step.interaction.targetId.length > 0 && step.interaction.unit === 'mL', `Invalid syringe interaction ${step.id}`);
    }
    for (const value of Object.values(mission.onEnter?.vitals ?? {})) require(value === null || Number.isFinite(value) && value >= 0, 'Invalid target vital');
  }
  unique(config.missions.flatMap(m => (m.objectives ?? []).map(o => o.id)), 'objective');
  unique(config.ecg.targets.map(t => t.id), 'ECG lead');
  for (const id of ['V1','V2','V3','V4','V5','V6']) require(config.ecg.targets.some(t => t.id === id), `Missing ECG lead ${id}`);
  require(config.ecg.targets.length === 6, 'Unexpected ECG lead configuration');
  for (const value of [...Object.values(config.ecg.layout.board), ...Object.values(config.ecg.layout.image)]) require(Number.isFinite(value), 'Invalid ECG diagram layout');
  require(config.ecg.layout.board.width > 0 && config.ecg.layout.board.height > 0 && config.ecg.layout.image.width > 0 && config.ecg.layout.image.height > 0, 'Invalid ECG diagram dimensions');
  for (const target of config.ecg.targets) require(Number.isFinite(target.x) && Number.isFinite(target.y) && target.snapRadius > 0, 'Invalid ECG target');
  for (const target of config.ecg.targets) require(target.x >= config.ecg.layout.image.x && target.x <= config.ecg.layout.image.x + config.ecg.layout.image.width && target.y >= config.ecg.layout.image.y && target.y <= config.ecg.layout.image.y + config.ecg.layout.image.height, `ECG target ${target.id} is outside the placement diagram`);
  require(findings.has(config.ecg.finding), 'Unknown ECG finding');
  require(typeof config.gradable === 'boolean', 'Missing case grading status');
}
