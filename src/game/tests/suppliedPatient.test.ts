import test from 'node:test';
import assert from 'node:assert/strict';
import { CaseEngine } from '../core/CaseEngine';
import { case02 } from '../cases/case02';
import { verticalSlice } from '../cases/verticalSlice';
import { HotspotSystem } from '../systems/HotspotSystem';
import { parseCheckpoint } from '../core/checkpoint';

test('supplied patient targets are distinct, reachable and preserve ungraded Case 2 assessment and resume', () => {
  assert(case02.assets.patientSupport, 'bed and pillow must be separate from breathing patient');
  assert.equal(case02.assets.room, verticalSlice.assets.room);
  assert(verticalSlice.assets.patientSupport, 'Both cases must use the supplied layered patient');
  const hitTest = new HotspotSystem(case02.hotspots);
  const bounds = case02.presentation.patient;
  for (const target of case02.hotspots) {
    assert.equal(hitTest.at(target)?.id, target.id, `${target.id} must not resolve to another body region`);
    assert(target.x >= bounds.x - bounds.width / 2 && target.x <= bounds.x + bounds.width / 2);
    assert(target.y >= bounds.y - bounds.height / 2 && target.y <= bounds.y + bounds.height / 2);
    for (const other of case02.hotspots.filter(item => item.id !== target.id)) {
      assert(Math.hypot(target.x - other.x, target.y - other.y) > target.radius + other.radius, `${target.id} and ${other.id} must not overlap`);
    }
  }
  const game = new CaseEngine(case02);
  game.next();
  game.selectTool('interview');
  game.useAt(case02.hotspots.find(target => target.id === 'head')!);
  game.update(1000);
  game.next();
  for (const [tool, id] of [['stethoscope', 'chest'], ['bp', 'arm'], ['spo2', 'finger']]) {
    game.selectTool(tool);
    game.useAt(case02.hotspots.find(target => target.id === id)!);
    game.update(2000);
  }
  assert.equal(game.mission.completed.size, 4, 'history and all three assessment actions are retained');
  assert.equal(game.score.data.mistakeCount, 0);
  assert(Object.values(game.vitals.current).every(value => value === null));
  assert(game.chart.every(finding => !finding.vitals || Object.values(finding.vitals).every(value => value === null)));
  const restored = new CaseEngine(case02);
  const checkpoint = parseCheckpoint(JSON.stringify(game.checkpoint()), case02);
  assert(checkpoint);
  restored.restore(checkpoint);
  assert.equal(restored.mission.completed.size, 4);
  assert.deepEqual(restored.hotspots.definitions, case02.hotspots);
});
