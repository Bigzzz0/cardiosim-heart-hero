import test from 'node:test';
import assert from 'node:assert/strict';
import { CaseEngine } from '../core/CaseEngine';
import { parseCheckpoint } from '../core/checkpoint';
import { verticalSlice } from '../cases/verticalSlice';

test('object workbench cannot skip inspection; draft actions and removals do not score',()=>{
 const game=new CaseEngine(verticalSlice);game.mission.jumpTo('MEDICATION');
 assert.equal(game.completeActivityStep('step_order_check'),false);
 const before={...game.score.data};
 assert.equal(game.performActivityStepAction('step_label_check','ampoule','label-reader'),false,'future steps are inaccessible');
 assert.equal(game.performActivityStepAction('step_order_check','invented'),false);
 game.performActivityStepAction('step_order_check','order');
 assert.equal(game.activitySteps.length,0,'review is a draft until the step is confirmed');
 assert.deepEqual(game.score.data,before);
 game.performActivityStepAction('step_order_check','allergy');
 assert.equal(game.completeActivityStep('step_order_check'),true);
 assert.equal(game.chart.length,0,'preparation does not prematurely record the clinical finding');
});

test('workbench save resumes reviewed objects; legacy and edited current steps retain completed steps',()=>{
 const game=new CaseEngine(verticalSlice);game.mission.jumpTo('MEDICATION');
 game.activitySteps=['step_order_check'];
 game.performActivityStepAction('step_label_check','ampoule','label-reader');
 const save=game.checkpoint();
 const parsed=parseCheckpoint(JSON.stringify(save),verticalSlice)!;
 const resumed=new CaseEngine(verticalSlice);resumed.restore(parsed);
 assert.equal(resumed.activityStepProgress.step_label_check.actions?.ampoule,'label-reader');
 save.activityStepProgress.step_label_check.actions!.ampoule='bad-target';
 assert.equal(game.activityStepProgress.step_label_check.actions?.ampoule,'label-reader','checkpoint is a deep copy');
 const cleaned=parseCheckpoint(JSON.stringify(save),verticalSlice)!;
 assert.deepEqual(cleaned.activityStepProgress,{});
 assert.deepEqual(cleaned.activitySteps,['step_order_check']);
 const legacy=parseCheckpoint(JSON.stringify({...save,activityStepProgress:undefined}),verticalSlice)!;
 assert.deepEqual(legacy.activitySteps,['step_order_check']);
 assert.deepEqual(legacy.activityStepProgress,{});
});

test('removing a decision card preserves score, supports reassignment and locks after Confirm',()=>{
 const game=new CaseEngine(verticalSlice);game.mission.jumpTo('DIAGNOSIS');
 game.chooseForSlot('problem','other-problem');const score={...game.score.data};
 assert.equal(game.removeDecisionSlot('problem'),true);
 assert.deepEqual(game.score.data,score);
 game.chooseForSlot('problem','breathing-problem');game.chooseForSlot('support','respiratory-evidence');
 assert.equal(game.confirmDecision(),true);
 assert.equal(game.removeDecisionSlot('problem'),false);
});
