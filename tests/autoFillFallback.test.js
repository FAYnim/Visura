import assert from 'node:assert/strict';

async function testGetModelOrThrow() {
  const { getModelOrThrow } = await import('../server/ai/autoFillService.js');
  const model = getModelOrThrow('gemini-2.5-flash');
  assert.equal(model.id, 'gemini-2.5-flash');
  assert.equal(model.label, 'Gemini 2.5 Flash');
  assert.equal(model.provider, 'gemini');
  assert.equal(model.modelName, 'gemini-2.5-flash');
  console.log('✓ getModelOrThrow: valid model ID returns model object');
}

async function testGetModelOrThrowMissingId() {
  const { getModelOrThrow } = await import('../server/ai/autoFillService.js');
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
  const { getModelOrThrow } = await import('../server/ai/autoFillService.js');
  assert.throws(
    () => getModelOrThrow('nonexistent-model'),
    /Unknown model ID/,
    'Should throw for unknown model ID'
  );
  console.log('✓ getModelOrThrow: unknown model ID throws');
}

async function main() {
  const hadKey = !!process.env.GEMINI_API_KEY;
  if (!hadKey) process.env.GEMINI_API_KEY = 'test-key-for-test';

  try {
    await testGetModelOrThrow();
    await testGetModelOrThrowMissingId();
    await testGetModelOrThrowUnknownId();
    console.log('\n✅ All model selection tests passed!');
  } catch (err) {
    console.error('\n❌ Test failed:', err.message);
    process.exit(1);
  } finally {
    if (!hadKey) delete process.env.GEMINI_API_KEY;
  }
}

main();
