import test from 'node:test';
import assert from 'node:assert/strict';
import { verticalSlice } from '../cases/verticalSlice';
import { ECGSystem } from '../systems/ECGSystem';
import { CaseEngine } from '../core/CaseEngine';
import { parseCheckpoint } from '../core/checkpoint';

test('source-drawn ECG targets do not compete for drops and restore with the same lead identity', () => {
  const targets = verticalSlice.ecg.targets;
  const ecg = new ECGSystem(targets);
  for (const target of targets) {
    assert(target.art?.electrode.endsWith(`${target.id.toLowerCase()}.webp`));
    for (const other of targets.filter(item => item !== target)) {
      assert(Math.hypot(target.x - other.x, target.y - other.y) > target.snapRadius + other.snapRadius, `${target.id} overlaps ${other.id}`);
    }
    assert.equal(ecg.place(target.id, target), true);
    assert.equal(ecg.placements[target.id], target.id, 'exact source landmark must select itself');
  }
  const game = new CaseEngine(verticalSlice);
  game.mission.jumpTo('ECG_PLACEMENT');
  for (const target of targets) game.placeLead(target.id, target);
  const checkpoint = parseCheckpoint(JSON.stringify(game.checkpoint()), verticalSlice);
  assert(checkpoint);
  const resumed = new CaseEngine(verticalSlice);
  resumed.restore(checkpoint);
  assert.equal(resumed.confirmECG(), true);
  assert.deepEqual(resumed.ecg.placements, Object.fromEntries(targets.map(target => [target.id, target.id])));
});
