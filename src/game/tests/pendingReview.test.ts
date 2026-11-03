import test from 'node:test';
import assert from 'node:assert/strict';
import { CaseEngine } from '../core/CaseEngine';
import { validateCase } from '../core/validateCase';
import { verticalSlice } from '../cases/verticalSlice';

const medication = verticalSlice.missions.find(mission => mission.id === 'MEDICATION')!.activity!;
const field = medication.fields!.find(item => item.id === 'side-effect')!;
function prepared() {
  const game = new CaseEngine(verticalSlice);
  game.mission.jumpTo('MEDICATION');
  game.activitySteps = medication.steps!.map(step => step.id);
  for (const [id, answer] of Object.entries(medication.expectedResponses!)) game.setResponse(id, answer);
  return game;
}

test('pending side-effect responses are recorded without choosing a clinical key or rejecting listed alternatives', () => {
  assert.equal(field.assessmentMode, 'record-only');
  assert(!('side-effect' in medication.expectedResponses!));
  for (const answer of field.options!) {
    const game = prepared();
    game.setResponse(field.id, answer);
    assert(game.confirmActivity(), `Listed practice response must be recordable: ${answer}`);
    assert.equal(game.responses[field.id], answer);
    assert.equal(game.score.data.mistakeCount, 0);
    assert.equal(game.mission.decisionConfirmed, true);
  }
  for (const answer of ['', 'not-an-option']) {
    const game = prepared();
    game.setResponse(field.id, answer);
    assert.equal(game.canContinue, false);
    assert.equal(game.confirmActivity(), false);
    assert.equal(game.score.data.attempts, 0, 'Missing/invalid practice input does not add an attempt');
  }
  const incorrect = prepared();
  incorrect.setResponse(field.id, field.options![0]);
  incorrect.setResponse('dose', '999');
  assert.equal(incorrect.confirmActivity(), false, 'Other existing demo checks remain active');
});

test('case validation prevents a pending record-only field from silently acquiring a graded key', () => {
  const conflicting = structuredClone(verticalSlice);
  conflicting.missions.find(mission => mission.id === 'MEDICATION')!.activity!.expectedResponses!['side-effect'] = 'Hypotension';
  assert.throws(() => validateCase(conflicting), /Record-only field has an answer key/);
});
