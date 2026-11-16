import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_SURVEY_ITEMS,
  SURVEY_DOMAINS,
  computeSurveySummary,
} from '../../data/surveyData';

test('satisfaction survey defines 3 domains and 10 Likert items matching research form', () => {
  assert.equal(SURVEY_DOMAINS.length, 3);
  assert.equal(SURVEY_DOMAINS[0].items.length, 5);
  assert.equal(SURVEY_DOMAINS[1].items.length, 3);
  assert.equal(SURVEY_DOMAINS[2].items.length, 2);
  assert.equal(ALL_SURVEY_ITEMS.length, 10);
  assert.deepEqual(
    ALL_SURVEY_ITEMS.map((item) => item.id),
    ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10']
  );
});

test('computeSurveySummary calculates domain means, overall mean, and ignores missing or out-of-range scores', () => {
  const empty = computeSurveySummary({});
  assert.equal(empty.answeredCount, 0);
  assert.equal(empty.totalItems, 10);
  assert.equal(empty.overallMean, null);
  assert.equal(empty.domainMeans.domain1, null);

  const partial = computeSurveySummary({
    q1: 5,
    q2: 4,
    q3: 4,
    q4: 5,
    q5: 4,
    q6: 5,
    q7: 4,
    q8: 3,
    q9: 5,
    q10: 5,
    invalid: 99,
  });
  assert.equal(partial.answeredCount, 10);
  assert.equal(partial.domainMeans.domain1, 4.4);
  assert.equal(partial.domainMeans.domain2, 4);
  assert.equal(partial.domainMeans.domain3, 5);
  assert.equal(partial.overallMean, 4.4);
});
