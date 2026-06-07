import assert from 'assert';
import { handleCopy, handleSave } from '../public/js/generatorClipboard.js';

function createButton(label) {
  const classes = new Set();

  return {
    innerHTML: label,
    classList: {
      add(name) {
        classes.add(name);
      },
      remove(name) {
        classes.delete(name);
      },
      contains(name) {
        return classes.has(name);
      }
    }
  };
}

async function flushPromises() {
  await Promise.resolve();
  await Promise.resolve();
}

async function withClipboard(callback) {
  const previousNavigator = globalThis.navigator;
  const previousSetTimeout = globalThis.setTimeout;
  const writes = [];

  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: {
      clipboard: {
        writeText(text) {
          writes.push(text);
          return Promise.resolve();
        }
      }
    }
  });

  globalThis.setTimeout = (fn) => {
    fn();
    return 1;
  };

  try {
    await callback(writes);
  } finally {
    globalThis.setTimeout = previousSetTimeout;

    if (previousNavigator === undefined) {
      delete globalThis.navigator;
    } else {
      Object.defineProperty(globalThis, 'navigator', {
        configurable: true,
        value: previousNavigator
      });
    }
  }
}

await withClipboard(async (writes) => {
  const copyBtn = createButton('Copy');
  const toasts = [];
  let historyWrites = 0;

  handleCopy({
    state: { activeSlide: 1 },
    compilePlainText: () => 'Slide prompt text',
    showToast: (message) => toasts.push(message),
    copyBtn
  });

  await flushPromises();

  assert.deepStrictEqual(writes, ['Slide prompt text'], 'copy should write active prompt to clipboard');
  assert.strictEqual(historyWrites, 0, 'copy should not save to history');
  assert.ok(toasts.some((message) => message.includes('Prompt copied to clipboard')), 'copy should show copy success toast');
});

{
  const state = {
    activeSlide: 2,
    history: [],
    settings: { CREATOR_NAME: 'Maya' }
  };
  const saveBtn = createButton('Save');
  const toasts = [];
  let savedHistory = null;

  handleSave({
    state,
    compilePlainText: () => 'Saved prompt text',
    addToHistory: (promptText) => {
      state.history.unshift({ promptText });
      savedHistory = state.history;
    },
    showToast: (message) => toasts.push(message),
    saveBtn
  });

  assert.strictEqual(savedHistory, state.history, 'save should persist through addToHistory');
  assert.strictEqual(state.history[0].promptText, 'Saved prompt text', 'save should store active prompt text');
  assert.ok(toasts.some((message) => message.includes('Prompt saved to history')), 'save should show save success toast');
}

{
  const state = {
    activeSlide: 'caption',
    caption: 'Caption text',
    history: [],
    settings: { CREATOR_NAME: 'Maya' }
  };
  const saveBtn = createButton('Save');

  handleSave({
    state,
    compilePlainText: () => 'unused',
    addToHistory: (promptText) => state.history.unshift({ promptText }),
    showToast: () => {},
    saveBtn
  });

  assert.strictEqual(state.history[0].promptText, 'Caption text', 'save should store caption text when caption tab is active');
}

console.log('✓ Copy does not save to history');
console.log('✓ Save stores active prompt in history');
console.log('✓ Save stores active caption in history');
console.log('\n✅ Generator clipboard action tests passed!');
