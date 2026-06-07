const HISTORY_LIMIT = 50;

function createLinkedinHistoryEntry({ post, meta, now = () => new Date(), idFactory } = {}) {
  if (!post || !meta) return null;
  const createId = idFactory || (() => (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`));
  return {
    id: createId(),
    timestamp: now().toISOString(),
    post,
    ...meta
  };
}

function prependLinkedinHistory(history, entry, limit = HISTORY_LIMIT) {
  if (!entry) return history;
  return [entry, ...(Array.isArray(history) ? history : [])].slice(0, limit);
}

async function copyLinkedinPost({ post, clipboard = globalThis.navigator?.clipboard } = {}) {
  if (!post) return false;
  await clipboard.writeText(post);
  return true;
}

export { HISTORY_LIMIT, createLinkedinHistoryEntry, prependLinkedinHistory, copyLinkedinPost };
