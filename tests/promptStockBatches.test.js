import assert from 'node:assert/strict';

import {
  REQUIRED_PLACEHOLDERS,
  STOCK_PROMPT_BATCHES,
  normalizePromptBatches
} from '../public/js/promptStore.js';

import { getActivePromptBatch } from '../public/js/common.js';

function assertSlidePlaceholders(batch, slideNum) {
  const template = batch.slides[slideNum];
  assert.equal(typeof template, 'string', `${batch.id} slide ${slideNum} must be a string`);

  for (const placeholder of REQUIRED_PLACEHOLDERS[slideNum]) {
    assert.ok(
      template.includes(`{{${placeholder}}}`),
      `${batch.id} slide ${slideNum} missing {{${placeholder}}}`
    );
  }
}

assert.equal(STOCK_PROMPT_BATCHES.length, 5, 'must expose five stock prompt batches');

for (const batch of STOCK_PROMPT_BATCHES) {
  assert.equal(batch.isStock, true, `${batch.id} must be marked as stock`);
  assert.equal(batch.isDefault, false, `${batch.id} must not be default`);
  assert.equal(batch.createdAt, null, `${batch.id} should not look like user-created content`);

  for (let slideNum = 1; slideNum <= 5; slideNum++) {
    assertSlidePlaceholders(batch, slideNum);
  }

  assert.equal(
    getActivePromptBatch(STOCK_PROMPT_BATCHES, batch.id),
    batch,
    `${batch.id} must resolve through active batch lookup`
  );
}

const normalized = normalizePromptBatches([
  {
    id: 'user_batch',
    name: 'User Batch',
    description: 'Editable user batch',
    createdAt: '2026-06-08T00:00:00.000Z',
    slides: STOCK_PROMPT_BATCHES[0].slides
  }
]);

assert.equal(normalized.length, 1);
assert.equal(normalized[0].isDefault, false);
assert.equal(normalized[0].isStock, false);
assert.equal(normalized[0].id, 'user_batch');
