import assert from 'node:assert/strict';
import { copyLinkedinPost, createLinkedinHistoryEntry, prependLinkedinHistory } from '../public/js/linkedinActions.js';

const meta = {
  styleId: 'builder-story',
  styleName: 'Builder Story',
  language: 'English',
  sourceName: 'Brief'
};

const entry = createLinkedinHistoryEntry({
  post: 'Launch post',
  meta,
  now: () => new Date('2026-06-07T00:00:00.000Z'),
  idFactory: () => 'entry-1'
});

assert.deepEqual(entry, {
  id: 'entry-1',
  timestamp: '2026-06-07T00:00:00.000Z',
  post: 'Launch post',
  ...meta
});

assert.equal(createLinkedinHistoryEntry({ post: '', meta }), null);
assert.deepEqual(prependLinkedinHistory([{ id: 'old' }], entry).map(item => item.id), ['entry-1', 'old']);
assert.equal(prependLinkedinHistory(Array.from({ length: 55 }, (_, index) => ({ id: index })), entry).length, 50);

const writes = [];
assert.equal(
  await copyLinkedinPost({ post: 'Launch post', clipboard: { writeText: async text => writes.push(text) } }),
  true
);
assert.deepEqual(writes, ['Launch post']);
assert.equal(await copyLinkedinPost({ post: '', clipboard: { writeText: async () => {} } }), false);

console.log('\n✅ LinkedIn copy/history action tests passed!');
