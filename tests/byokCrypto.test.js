/**
 * byokCrypto.test.js
 *
 * Tests for BYOK prefix validation and AES-GCM encrypt/decrypt helpers.
 * Uses Node.js built-in crypto.subtle (Node 19+) via globalThis.crypto.
 *
 * Run: node tests/byokCrypto.test.js
 */

import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';

/* ---- Polyfill Web Crypto for Node < 19 ---- */
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

/* =========================================================
   Inline the pure-logic helpers from byok.js
   (byok.js uses DOM APIs, so we replicate the crypto-only
    parts here for isolated unit testing)
   ========================================================= */

const PROVIDER_PREFIXES = { gemini: 'AIza', groq: 'gsk_' };
const MIN_KEY_LENGTH = 10;

function validateKeyPrefix(provider, key) {
  const prefix = PROVIDER_PREFIXES[provider];
  if (!prefix) return false;
  return typeof key === 'string' && key.startsWith(prefix) && key.length >= MIN_KEY_LENGTH;
}

async function generateAesKey() {
  return globalThis.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

async function encryptText(plaintext, cryptoKey) {
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const cipherBuffer = await globalThis.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encoded
  );
  return {
    iv: btoa(String.fromCharCode(...iv)),
    ct: btoa(String.fromCharCode(...new Uint8Array(cipherBuffer))),
  };
}

async function decryptText(payload, cryptoKey) {
  const iv = Uint8Array.from(atob(payload.iv), c => c.charCodeAt(0));
  const ct = Uint8Array.from(atob(payload.ct), c => c.charCodeAt(0));
  const plainBuffer = await globalThis.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    ct
  );
  return new TextDecoder().decode(plainBuffer);
}

/* =========================================================
   TEST CASES
   ========================================================= */

async function testPrefixValidation() {
  /* Valid keys */
  assert.ok(validateKeyPrefix('gemini', 'AIzaSyDummyKey12345'), 'Gemini valid key accepted');
  assert.ok(validateKeyPrefix('groq',   'gsk_dummykey1234567'), 'Groq valid key accepted');

  /* Invalid prefix */
  assert.ok(!validateKeyPrefix('gemini', 'sk-not-gemini-key'), 'Wrong prefix rejected for Gemini');
  assert.ok(!validateKeyPrefix('groq',   'AIzaSyWrongProvider'), 'Wrong prefix rejected for Groq');

  /* Too short */
  assert.ok(!validateKeyPrefix('gemini', 'AIza'), 'Too-short Gemini key rejected');
  assert.ok(!validateKeyPrefix('groq',   'gsk_'), 'Too-short Groq key rejected');

  /* Unknown provider */
  assert.ok(!validateKeyPrefix('openai', 'sk-validopenaikey'), 'Unknown provider rejected');

  /* Empty / non-string */
  assert.ok(!validateKeyPrefix('gemini', ''),    'Empty string rejected');
  assert.ok(!validateKeyPrefix('gemini', null),  'null rejected');

  console.log('✓ validateKeyPrefix: all prefix validation cases pass');
}

async function testEncryptDecryptRoundtrip() {
  const key = await generateAesKey();
  const plaintext = 'AIzaSyTestKey_Super_Secret_12345';

  const payload = await encryptText(plaintext, key);

  /* Payload shape */
  assert.ok(typeof payload.iv === 'string', 'IV is string');
  assert.ok(typeof payload.ct === 'string', 'Ciphertext is string');
  assert.notEqual(payload.ct, btoa(plaintext), 'Ciphertext differs from plaintext base64');

  /* Decrypt back */
  const recovered = await decryptText(payload, key);
  assert.equal(recovered, plaintext, 'Decrypted text matches original');

  console.log('✓ encryptText/decryptText: AES-GCM roundtrip successful');
}

async function testRandomIvUniquePerCall() {
  const key = await generateAesKey();
  const plaintext = 'AIzaSyDuplicateTest';

  const payload1 = await encryptText(plaintext, key);
  const payload2 = await encryptText(plaintext, key);

  /* IVs should differ (random per call) */
  assert.notEqual(payload1.iv, payload2.iv, 'IVs are unique per encryption call');
  /* But both should decrypt to same plaintext */
  assert.equal(await decryptText(payload1, key), plaintext, 'Payload 1 decrypts correctly');
  assert.equal(await decryptText(payload2, key), plaintext, 'Payload 2 decrypts correctly');

  console.log('✓ encryptText: random IV is unique per call');
}

async function testDecryptWithWrongKeyThrows() {
  const key1 = await generateAesKey();
  const key2 = await generateAesKey();
  const plaintext = 'AIzaSyWrongKeyTest12345';

  const payload = await encryptText(plaintext, key1);

  await assert.rejects(
    () => decryptText(payload, key2),
    'Decryption with wrong key throws'
  );

  console.log('✓ decryptText: wrong key throws (authentication tag mismatch)');
}

async function testEncryptDecryptUnicode() {
  const key = await generateAesKey();
  /* Non-ASCII chars can appear in some keys or test edge cases */
  const plaintext = 'gsk_TestUnicodeKey_αβγ_1234567890';

  const payload = await encryptText(plaintext, key);
  const recovered = await decryptText(payload, key);
  assert.equal(recovered, plaintext, 'Unicode plaintext roundtrips correctly');

  console.log('✓ encryptText/decryptText: unicode content handled correctly');
}

/* =========================================================
   MAIN
   ========================================================= */

async function main() {
  console.log('\n🔐 Running BYOK Crypto Tests\n');
  try {
    await testPrefixValidation();
    await testEncryptDecryptRoundtrip();
    await testRandomIvUniquePerCall();
    await testDecryptWithWrongKeyThrows();
    await testEncryptDecryptUnicode();
    console.log('\n✅ All BYOK crypto tests passed!\n');
  } catch (err) {
    console.error('\n❌ Test failed:', err.message);
    process.exit(1);
  }
}

main();
