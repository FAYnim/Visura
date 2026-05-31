import assert from 'node:assert/strict';
import { getModelOrThrow } from '../server/ai/autoFillService.js';

async function testGetModelOrThrow() {
  const model = getModelOrThrow('gemini-2.5-flash');
  assert.equal(model.id, 'gemini-2.5-flash');
  assert.equal(model.label, 'Gemini 2.5 Flash');
  assert.equal(model.provider, 'gemini');
  assert.equal(model.modelName, 'gemini-2.5-flash');
  console.log('✓ getModelOrThrow: valid model ID returns model object');
}

async function testGetModelOrThrowMissingId() {
  assert.throws(
    () => getModelOrThrow(null),
    /No model selected/,
    'Should throw when modelId is null'
  );
  assert.throws(
    () => getModelOrThrow(''),
    /No model selected/,
    'Should throw when modelId is empty'
  );
  console.log('✓ getModelOrThrow: missing model ID throws');
}

async function testGetModelOrThrowUnknownId() {
  assert.throws(
    () => getModelOrThrow('nonexistent-model'),
    /Unknown model ID/,
    'Should throw for unknown model ID'
  );
  console.log('✓ getModelOrThrow: unknown model ID throws');
}

async function main() {
  try {
    await testGetModelOrThrow();
    await testGetModelOrThrowMissingId();
    await testGetModelOrThrowUnknownId();
    console.log('\n✅ All model selection tests passed!');
  } catch (err) {
    console.error('\n❌ Test failed:', err.message);
    process.exit(1);
  }
}

main();
