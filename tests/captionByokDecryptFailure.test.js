import assert from 'node:assert/strict';

function createElement(id = '') {
  const listeners = new Map();
  return {
    id,
    value: '',
    textContent: '',
    innerHTML: '',
    disabled: false,
    files: [],
    options: [],
    selectedIndex: 0,
    dataset: {},
    style: {},
    className: '',
    classList: { add() {}, remove() {} },
    attributes: new Set(),
    focus() {},
    appendChild(child) { this.options.push(child); if (!this.value) this.value = child.value; },
    replaceChildren() { this.options = []; this.value = ''; this.selectedIndex = 0; },
    querySelector() { return null; },
    setAttribute(name) { this.attributes.add(name); },
    removeAttribute(name) { this.attributes.delete(name); },
    hasAttribute(name) { return this.attributes.has(name); },
    addEventListener(type, handler) { listeners.set(type, handler); },
    dispatchEvent(event) { listeners.get(event.type)?.(event); },
    click() { listeners.get('click')?.({ type: 'click' }); }
  };
}

const elements = new Map();
for (const id of [
  'btn-generate-caption',
  'caption-modal',
  'caption-backdrop',
  'caption-close',
  'caption-cancel',
  'caption-run',
  'caption-apply',
  'caption-regenerate',
  'caption-brief',
  'caption-doc-file',
  'caption-dropzone',
  'caption-file-name',
  'caption-model',
  'caption-quota',
  'caption-progress',
  'caption-progress-fill',
  'caption-progress-msg',
  'caption-result',
  'caption-result-stats',
  'caption-result-preview',
  'caption-error',
  'caption-error-msg',
  'caption-text'
]) elements.set(id, createElement(id));

globalThis.document = {
  body: { style: {} },
  getElementById(id) { return elements.get(id); },
  createElement() { return createElement(); },
  addEventListener() {}
};

globalThis.localStorage = {
  store: new Map(),
  getItem(key) { return this.store.has(key) ? this.store.get(key) : null; },
  setItem(key, value) { this.store.set(key, String(value)); },
  removeItem(key) { this.store.delete(key); }
};

globalThis.FormData = class {
  constructor() { this.entries = []; }
  append(key, value) { this.entries.push([key, value]); }
};

globalThis.Event = class { constructor(type) { this.type = type; } };

let fetchCalled = false;
globalThis.fetch = async () => {
  fetchCalled = true;
  return { ok: true, json: async () => ({ caption: 'caption' }) };
};

const { initCaptionGenerate } = await import('../public/js/captionGenerate.js');

localStorage.setItem('byokKeys', JSON.stringify({ gemini: { iv: 'saved', ct: 'saved' } }));

const modelSelect = elements.get('caption-model');
const option = createElement();
option.value = 'gemini-2.5-flash';
option.dataset.provider = 'gemini';
modelSelect.appendChild(option);
modelSelect.value = option.value;

const brief = elements.get('caption-brief');
brief.value = 'Project brief';

initCaptionGenerate({ state: {}, renderPreview() {}, showToast() {}, escapeHtml: value => value });

elements.get('caption-run').click();
await new Promise(resolve => setTimeout(resolve, 0));

assert.equal(fetchCalled, false);
assert.equal(localStorage.getItem('visura.aiQuota'), null);
assert.equal(
  elements.get('caption-error-msg').textContent,
  'Unable to use saved API key. Reconnect your API key or choose developer quota.'
);

console.log('\n✅ Caption BYOK decrypt failure test passed!');
