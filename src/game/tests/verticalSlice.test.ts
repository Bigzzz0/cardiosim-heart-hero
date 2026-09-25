import test from 'node:test';
import assert from 'node:assert/strict';
import { CaseEngine } from '../core/CaseEngine';
import { parseCheckpoint } from '../core/checkpoint';
import { validateCase } from '../core/validateCase';
import { verticalSlice } from '../cases/verticalSlice';
import { caseRegistry, getGameCase } from '../cases';
import { case02 } from '../cases/case02';

test('interaction preview is side-effect-free and reports the same target and outcome as the real drop', () => {
  const game = new CaseEngine(verticalSlice);
  game.next();
  game.selectTool('interview');
  const feedbackBeforePreview = game.feedback;
  const attemptsBeforePreview = game.score.data.attempts;
  game.beginToolDrag('interview');
  game.endToolDrag(null);
  assert.equal(game.score.data.attempts, attemptsBeforePreview, 'cancelling a drag outside the room is not an attempt');
  assert.equal(game.score.data.mistakeCount, 0, 'cancelling a drag outside the room is not a mistake');
  assert.equal(game.chart.length, 0, 'cancelling a drag does not reveal chart findings');
  game.selectTool('interview');
  const logsBeforePreview = game.bus.logs.length;

  const validPreview = game.previewAt({ x: 550, y: 280 });
  assert.equal(validPreview.outcome, 'valid');
  assert.equal(validPreview.toolId, 'interview');
  assert.equal(validPreview.targetId, 'head');
  assert.equal(validPreview.objectiveId, 'history');
  assert.deepEqual(validPreview.point, { x: 550, y: 280 });
  const wrongPreview = game.previewAt({ x: 550, y: 395 });
  assert.equal(wrongPreview.outcome, 'invalid');
  assert.equal(wrongPreview.targetId, 'chest');
  assert.ok(wrongPreview.reason);
  assert.equal(game.score.data.attempts, attemptsBeforePreview);
  assert.equal(game.bus.logs.length, logsBeforePreview);
  assert.equal(game.feedback, feedbackBeforePreview);

  game.interact('chest');
  const rejected = game.bus.logs.find(event => event.type === 'WRONG_ACTION');
  assert.equal(rejected?.interaction?.toolId, 'interview');
  assert.equal(rejected?.interaction?.targetId, 'chest');
  assert.equal(rejected?.interaction?.phase, 'rejected');
  assert.equal(game.score.data.mistakeCount, 1);

  game.beginToolDrag('interview');
  game.endToolDrag({ x: 550, y: 280 });
  const started = game.bus.logs.find(event => event.type === 'INTERACTION_STARTED');
  assert.equal(started?.interaction?.toolId, 'interview');
  assert.equal(started?.interaction?.targetId, 'head');
  assert.equal(started?.interaction?.phase, 'started');
  assert.equal(started?.interaction?.objectiveId, 'history');
  assert.equal(game.score.data.attempts, attemptsBeforePreview + 2, 'preview did not score; one rejected and one accepted action did');
  game.update(750);
  const completed = game.bus.logs.find(event => event.type === 'ASSESSMENT_RECORDED');
  assert.equal(completed?.interaction?.phase, 'completed');
  assert.equal(completed?.interaction?.message, verticalSlice.missions[1]?.objectives?.[0]?.feedback);
});

test('the storyboard missions share one room and support retry, confirm, emergency response and a full checkpoint round trip', () => {
  validateCase(verticalSlice);
  const game = new CaseEngine(verticalSlice);
  assert.equal(game.mission.current.id, 'CASE_INTRO');
  game.next();
  assert.equal(game.mission.current.id, 'PATIENT_INFORMATION');

  game.selectTool('interview'); game.interact('chest');
  assert.equal(game.score.data.mistakeCount, 1, 'wrong locations teach and allow retry');
  game.interact('head'); game.update(750);
  assert.equal(game.chart[0]?.id, 'history');
  game.next(); assert.equal(game.mission.current.id, 'ASSESSMENT');
  for (const [tool, target, duration] of [['stethoscope','chest',1550],['bp','arm',1150],['spo2','finger',950]] as const) {
    game.selectTool(tool); game.interact(target); game.update(duration);
  }
  assert.equal(game.chart.length, 4);
  game.next(); assert.equal(game.mission.current.id, 'DIAGNOSIS');
  game.chooseForSlot('problem','other-problem'); game.chooseForSlot('support','unrelated-evidence');
  assert.equal(game.confirmDecision(),false,'diagnosis feedback waits for Confirm and can be retried');
  game.chooseForSlot('problem','breathing-problem'); game.chooseForSlot('support','respiratory-evidence');
  assert.equal(game.confirmDecision(),true); game.next(); assert.equal(game.mission.current.id,'NURSING_INTERVENTION');
  game.chooseForSlot('intervention-1','position-care'); game.chooseForSlot('intervention-2','skip-monitoring');
  assert.equal(game.confirmDecision(),false);
  game.chooseForSlot('intervention-2','monitor-care'); assert.equal(game.confirmDecision(),true); game.next();
  assert.equal(game.mission.current.id,'MEDICATION');
  const attemptsBeforeMedication = game.score.data.attempts;
  game.setResponse('drug','Furosemide (Lasix)'); game.setResponse('dose','10'); game.setResponse('route','IV slow push'); game.setResponse('side-effect','Hypotension'); game.setResponse('monitoring','BP, urine output, K⁺/Mg²⁺');
  assert.equal(game.completeActivityStep('step_label_check'),false,'equipment steps must be completed in the configured order');
  assert.equal(game.confirmActivity(),false,'confirmation waits for all seven preparation steps');
  const prepSteps = verticalSlice.missions.find(mission=>mission.id==='MEDICATION')?.activity?.steps ?? [];
  for (const step of prepSteps.slice(0,3)) assert.equal(game.completeActivityStep(step.id),true);
  const syringeStep = prepSteps[3];
  assert.equal(game.completeActivityStep(syringeStep.id),false,'the syringe action cannot be skipped by clicking its checklist row');
  assert.equal(game.placeActivityStepTool(syringeStep.id,'wrong-target'),false,'syringe must contact the configured ampoule target');
  assert.equal(game.placeActivityStepTool(syringeStep.id,'ampoule'),true);
  game.setActivityStepAmount(syringeStep.id,2);
  const syringeCheckpoint = parseCheckpoint(JSON.stringify(game.checkpoint()),verticalSlice);
  assert.equal(syringeCheckpoint?.activityStepProgress[syringeStep.id]?.amount,2,'withdrawal amount is preserved by checkpoints');
  const syringeResume = new CaseEngine(verticalSlice); syringeResume.restore(syringeCheckpoint!);
  assert.equal(syringeResume.activityStepProgress[syringeStep.id]?.toolPlaced,true,'placed syringe state resumes in the station');
  const legacySyringeCheckpoint = parseCheckpoint(JSON.stringify({ ...game.checkpoint(), activityStepProgress: undefined }),verticalSlice);
  assert.deepEqual(legacySyringeCheckpoint?.activitySteps,[],'an older medication checkpoint restarts the changed active activity safely');
  assert.deepEqual(legacySyringeCheckpoint?.activityStepProgress,{});
  assert.equal(game.completeActivityStep(syringeStep.id),false,'an incorrect drawn volume can be rejected and retried');
  game.setActivityStepAmount(syringeStep.id,4);
  assert.equal(game.completeActivityStep(syringeStep.id),true,'the configured volume completes the syringe action');
  for (const step of prepSteps.slice(4)) assert.equal(game.completeActivityStep(step.id),true);
  assert.equal(game.confirmActivity(),false,'incorrect medication data can be retried after preparation');
  game.setResponse('dose','40');
  assert.equal(game.canContinue,true); assert.equal(game.confirmActivity(),true,'the configured medication demo data can be confirmed');
  assert.equal(game.mission.current.id,'MEDICATION'); assert.equal(game.mission.decisionConfirmed,true);
  assert.equal(game.score.data.attempts,attemptsBeforeMedication+14,'tool placement, withdrawal retries, preparation actions, and both confirmations are recorded');
  game.next(); assert.equal(game.mission.current.id,'IO_BALANCE');
  game.setResponse('intake-total','150'); game.setResponse('output-total','350'); game.setResponse('balance-total','-200');
  game.placeActivityItem('iv-intake','output'); game.placeActivityItem('oral-intake','intake'); game.placeActivityItem('urine-output','output'); game.choose('positive'); assert.equal(game.confirmDecision(),false,'I/O placement and totals are checked on Confirm');
  game.placeActivityItem('iv-intake','intake');
  game.choose('negative'); game.setResponse('balance-total','200'); assert.equal(game.confirmDecision(),false);
  game.setResponse('balance-total','-200'); assert.equal(game.confirmDecision(),true); game.next();
  assert.equal(game.mission.current.id,'EMERGENCY_TRANSITION');
  assert.equal(game.emergency.alarm, true);
  game.update(5000);
  assert.equal(game.mission.current.id, 'ABC_ASSESSMENT');
  assert.equal(game.vitals.current.bpSystolic, 220);
  assert.equal(game.vitals.current.bpDiastolic, 130);
  assert.equal(game.vitals.current.spo2, 82);
  assert.equal(game.vitals.current.hr, 148);
  assert.equal(game.vitals.current.rr, 36);
  assert.equal(game.patient.state.condition, 'critical');

  game.selectTool('hand'); game.interact('chest');
  assert.equal(game.score.data.mistakeCount, 11, 'ordered ABC actions can be retried after earlier practice errors');
  game.selectTool(null);
  for (const [target, duration] of [['head',950],['chest',950],['wrist',950]] as const) { game.selectTool('hand'); game.interact(target); game.update(duration); }
  game.next(); assert.equal(game.mission.current.id, 'ECG_PLACEMENT');
  assert.equal(game.placeLead('V1',{x:0,y:0}),false);
  assert.equal(game.ecg.placed.has('V1'),false);
  for (const lead of verticalSlice.ecg.targets) assert.equal(game.placeLead(lead.id,lead),true);
  assert.equal(game.ecg.complete,true);
  game.next(); assert.equal(game.mission.current.id, 'ECG_INTERPRETATION');
  game.setResponse('rhythm-answer','not a rhythm'); assert.equal(game.confirmActivity(),false,'ECG interpretation checks the Case 1 demo key');
  game.setResponse('rhythm-answer','SVT'); assert.equal(game.confirmActivity(),true); game.next();
  assert.equal(game.mission.current.id, 'EMERGENCY_TREATMENT');
  game.chooseForSlot('response','supine-water'); assert.equal(game.confirmDecision(),false);
  game.chooseForSlot('response','priority-response'); assert.equal(game.confirmDecision(),true); game.next();
  assert.equal(game.mission.current.id, 'PATIENT_STABILIZED');
  game.update(6500);
  assert.equal(game.vitals.current.spo2,94);
  assert.equal(game.vitals.current.hr,96);
  assert.equal(game.vitals.current.bpSystolic,145);
  assert.equal(game.vitals.current.rr,22);
  assert.equal(game.emergency.alarm,false);
  game.next(); assert.equal(game.mission.current.id, 'CASE_SUMMARY');
  assert.ok(game.score.data.completionTime);

  const serialized = JSON.stringify(game.checkpoint());
  const parsed = parseCheckpoint(serialized, verticalSlice);
  assert.equal(parsed?.mission,'CASE_SUMMARY');
  const resumed = new CaseEngine(verticalSlice); resumed.restore(parsed!);
  assert.equal(resumed.chart.length,14);
  assert.equal(resumed.ecg.placed.size,6);
  assert.equal(resumed.score.data.mistakeCount,game.score.data.mistakeCount);
});

test('Case 2 loads from the registry with qualitative-only data and logs choices without clinical grading', () => {
  assert.equal(caseRegistry.find(item => item.scenarios[0]?.id === 'case-02'), case02);
  assert.equal(getGameCase('case-02'), case02,'case ids must resolve to the configured case, not the first case with stale scenario metadata');
  validateCase(case02);
  const game = new CaseEngine(case02);
  assert.deepEqual(Object.values(game.vitals.current), [null,null,null,null,null]);
  assert.equal(case02.monitorTraces, undefined);
  game.next(); game.selectTool('interview'); game.interact('head'); game.update(750);
  assert.match(game.chart[0]?.text ?? '', /หนุนหมอน 3 ใบ/);
  game.next();
  for (const [tool,target,duration] of [['stethoscope','chest',1550],['bp','arm',1150],['spo2','finger',950]] as const) { game.selectTool(tool); game.interact(target); game.update(duration); }
  assert.equal(game.chart.some(entry => /ไม่มีค่า SpO₂/.test(entry.text)), true);
  game.next(); game.chooseForSlot('problem','other-problem'); game.chooseForSlot('support','unrelated-evidence');
  const mistakesBefore = game.score.data.mistakeCount;
  assert.equal(game.confirmDecision(), true, 'Case 2 choices are logged but not marked clinically right or wrong');
  assert.equal(game.score.data.mistakeCount, mistakesBefore);
  assert.match(game.feedback.text, /ไม่มีข้อมูลทางคลินิก/);
});

test('Case 2 can be completed from briefing to result without inventing numeric vitals or grading missing clinical answers', () => {
  const game = new CaseEngine(case02);
  const clinicalScore = game.score.total;
  game.next(); game.selectTool('interview'); game.interact('head'); game.update(750); game.next();
  for (const [tool,target,duration] of [['stethoscope','chest',1550],['bp','arm',1150],['spo2','finger',950]] as const) { game.selectTool(tool); game.interact(target); game.update(duration); }
  game.next();
  for (const [slot,option] of [['problem','other-problem'],['support','unrelated-evidence']] as const) game.chooseForSlot(slot,option);
  assert.equal(game.confirmDecision(),true); game.next();
  for (const [slot,option] of [['intervention-1','position-care'],['intervention-2','skip-monitoring']] as const) game.chooseForSlot(slot,option);
  assert.equal(game.confirmDecision(),true); game.next();
  assert.equal(case02.missions.find(mission=>mission.id==='MEDICATION')?.activity?.fields?.length,0,'Case 2 must not expose medication fields without an order');
  assert.equal(game.acknowledgeMissingActivity(),true);
  assert.equal(game.confirmActivity(),true); game.next();
  assert.equal(case02.missions.find(mission=>mission.id==='IO_BALANCE')?.activity?.items?.length,0,'Case 2 must not invent intake/output items');
  assert.equal(game.canContinue,false,'Case 2 requires an explicit acknowledgement that the source data is missing');
  game.acknowledgeMissingActivity();
  const beforeUnscoredAnswers = game.score.data.attempts;
  assert.equal(game.confirmActivity(),true); assert.equal(game.score.data.attempts,beforeUnscoredAnswers); game.next();
  game.update(5000);
  for (const target of ['head','chest','wrist']) { game.selectTool('hand'); game.interact(target); game.update(950); }
  game.next();
  for (const lead of case02.ecg.targets) assert.equal(game.placeLead(lead.id,lead),true);
  game.next(); game.setResponse('rhythm-answer','unavailable source'); assert.equal(game.confirmActivity(),true); game.next();
  game.chooseForSlot('response',case02.missions.find(mission=>mission.id==='EMERGENCY_TREATMENT')?.decision?.options[0]?.id ?? '');
  assert.equal(game.confirmDecision(),true); game.next(); game.update(6500); game.next();
  assert.equal(game.mission.current.id,'CASE_SUMMARY');
  assert.deepEqual(Object.values(game.vitals.current),[null,null,null,null,null]);
  assert.equal(game.score.total,clinicalScore,'ungraded Case 2 does not produce a clinical score');
  assert.equal(game.score.data.mistakeCount,0,'ungraded Case 2 answer choices are practice, not mistakes');
  assert.ok(game.chart.some(entry=>entry.id==='history'));
  assert.ok(game.chart.some(entry=>entry.id==='ecg-read'));
});

test('case validation rejects missing ECG leads and checkpoint validation rejects edited data', () => {
  const invalid = structuredClone(verticalSlice);
  invalid.ecg.targets = invalid.ecg.targets.filter(lead => lead.id !== 'V6');
  assert.throws(() => validateCase(invalid), /Missing ECG lead V6/);
  assert.equal(parseCheckpoint('{broken',verticalSlice),null);
  const game = new CaseEngine(verticalSlice);
  game.next(); game.selectTool('interview'); game.interact('head'); game.update(750);
  const edited = JSON.parse(JSON.stringify(game.checkpoint())) as Record<string, unknown>;
  edited.chart = [{ id:'history', title:'changed', section:'History', text:'tampered', source:'user input', at:100, mission:'PATIENT_INFORMATION' }];
  const restored = parseCheckpoint(JSON.stringify(edited),verticalSlice);
  assert.equal(restored?.chart[0]?.text,verticalSlice.findings.find(f=>f.id==='history')?.text);

  const activeTreatment = new CaseEngine(verticalSlice).checkpoint();
  const legacyTreatment = {
    ...activeTreatment,
    mission: 'EMERGENCY_TREATMENT' as const,
    completed: ['history','lungs','bp','oxygen','a','b','c'],
    chart: [{ ...verticalSlice.findings.find(finding => finding.id === 'history')!, at: 1200, mission: 'PATIENT_INFORMATION' as const }],
    decisions: ['priority-response'],
    decisionConfirmed: true,
    emergencyElapsed: 12000,
  };
  const migrated = parseCheckpoint(JSON.stringify(legacyTreatment), verticalSlice);
  assert.ok(migrated, 'old single-choice treatment checkpoint is accepted for safe activity reset');
  const treatmentResume = new CaseEngine(verticalSlice);
  treatmentResume.restore(migrated);
  assert.equal(treatmentResume.mission.current.id, 'EMERGENCY_TREATMENT');
  assert.deepEqual(treatmentResume.mission.decisions, [], 'incompatible active answer is cleared');
  assert.equal(treatmentResume.mission.decisionConfirmed, false);
  assert.equal(treatmentResume.chart[0]?.id, 'history', 'previously discovered chart data is preserved');
  assert.equal(treatmentResume.mission.completed.has('history'), true, 'completed mission objectives are preserved');
});
