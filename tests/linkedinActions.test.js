import assert from 'node:assert/strict';
import { copyLinkedinPost, createLinkedinHistoryEntry, prependLinkedinHistory } from '../public/js/linkedinActions.js';

const meta = {
  styleId: 'builder-story',
  styleName: 'Build in Public',
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
assert.equal(createLinkedinHistoryEntry({ post: 'text', meta: null }), null);
assert.deepEqual(prependLinkedinHistory([{ id: 'old' }], entry).map(item => item.id), ['entry-1', 'old']);
assert.equal(prependLinkedinHistory(null, entry).length, 1);
assert.equal(prependLinkedinHistory(Array.from({ length: 55 }, (_, index) => ({ id: index })), entry).length, 50);

const writes = [];
assert.equal(
  await copyLinkedinPost({ post: 'Launch post', clipboard: { writeText: async text => writes.push(text) } }),
  true
);
assert.deepEqual(writes, ['Launch post']);
assert.equal(await copyLinkedinPost({ post: '', clipboard: { writeText: async () => {} } }), false);

const history1 = [];
const saved1 = prependLinkedinHistory(history1, createLinkedinHistoryEntry({ post: 'Post A', meta: { styleId: 's1', styleName: 'S1', language: 'EN', sourceName: 'Test' } }));
assert.equal(saved1.length, 1);
assert.equal(saved1[0].post, 'Post A');
const saved2 = prependLinkedinHistory(saved1, createLinkedinHistoryEntry({ post: 'Post B', meta: { styleId: 's2', styleName: 'S2', language: 'EN', sourceName: 'Test' } }));
assert.equal(saved2.length, 2);
assert.equal(saved2[0].post, 'Post B');
assert.equal(saved2[1].post, 'Post A');

console.log('\n✅ LinkedIn copy/history action tests passed!');
