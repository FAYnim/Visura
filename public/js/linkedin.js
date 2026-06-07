import { getDecryptedByokKey } from './byok.js';

const HISTORY_KEY = 'linkedinPostHistory';
const FALLBACK_MODELS = [
  { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', provider: 'gemini' },
  { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant', provider: 'groq' }
];

const els = {
  brief: document.getElementById('brief'),
  docFile: document.getElementById('doc-file'),
  uploadZone: document.getElementById('upload-zone'),
  uploadLabel: document.getElementById('upload-label'),
  language: document.getElementById('language'),
  model: document.getElementById('model'),
  styleGrid: document.getElementById('style-grid'),
  styleStatus: document.getElementById('style-status'),
  generateBtn: document.getElementById('generate-btn'),
  status: document.getElementById('status'),
  output: document.getElementById('output'),
  copyBtn: document.getElementById('copy-btn'),
  saveBtn: document.getElementById('save-btn'),
  toast: document.getElementById('toast')
};

let styles = [];
let selectedStyleId = '';
let generatedPost = '';
let generatedMeta = null;
let toastTimer = null;

function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add('show');
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2400);
}

function setStatus(message, type = '') {
  els.status.textContent = message;
  els.status.className = `linkedin-status${type ? ` ${type}` : ''}`;
}

function setGeneratedState(enabled) {
  els.copyBtn.disabled = !enabled;
  els.saveBtn.disabled = !enabled;
}

function inferProvider(model) {
  if (model.provider) return model.provider;
  if (model.id.startsWith('gemini')) return 'gemini';
  if (model.id.startsWith('llama')) return 'groq';
  return '';
}

function setModelOptions(models) {
  els.model.replaceChildren();
  models.forEach(model => {
    const option = document.createElement('option');
    option.value = model.id;
    option.dataset.provider = inferProvider(model);
    option.textContent = model.label || model.id;
    els.model.appendChild(option);
  });
}

async function loadModels() {
  els.model.disabled = true;
  try {
    const res = await fetch('/api/models');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { models } = await res.json();
    if (!Array.isArray(models) || !models.length) throw new Error('No models available');
    setModelOptions(models);
  } catch {
    setModelOptions(FALLBACK_MODELS);
  } finally {
    els.model.disabled = false;
  }
}

function renderStyles() {
  els.styleGrid.replaceChildren();
  styles.forEach(style => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `linkedin-style-card${style.id === selectedStyleId ? ' active' : ''}`;
    button.dataset.styleId = style.id;
    button.innerHTML = `<strong>${style.name || style.id}</strong><span>${style.description || 'LinkedIn writing style'}</span>`;
    button.addEventListener('click', () => {
      selectedStyleId = style.id;
      renderStyles();
    });
    els.styleGrid.appendChild(button);
  });
}

async function loadStyles() {
  try {
    const res = await fetch('/api/linkedin/styles');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    styles = Array.isArray(data.styles) ? data.styles : [];
    selectedStyleId = styles[0]?.id || '';
    els.styleStatus.textContent = styles.length ? `${styles.length} styles` : 'No styles';
    renderStyles();
  } catch (err) {
    els.styleStatus.textContent = 'Failed to load styles';
    setStatus(err.message || 'Failed to load LinkedIn styles.', 'error');
  }
}

function selectedStyle() {
  return styles.find(style => style.id === selectedStyleId) || null;
}

function selectedProvider() {
  return els.model.selectedOptions[0]?.dataset.provider || '';
}

function validateInput() {
  if (!els.brief.value.trim() && !els.docFile.files[0]) {
    setStatus('Add a brief or upload a Markdown/PDF file.', 'error');
    return false;
  }
  if (!selectedStyleId) {
    setStatus('Choose a LinkedIn style.', 'error');
    return false;
  }
  if (!els.model.value) {
    setStatus('Choose a model.', 'error');
    return false;
  }
  return true;
}

async function generatePost() {
  if (!validateInput()) return;

  generatedPost = '';
  generatedMeta = null;
  setGeneratedState(false);
  setStatus('Generating LinkedIn post...', 'loading');
  els.output.textContent = 'Generating...';
  els.generateBtn.disabled = true;

  try {
    const formData = new FormData();
    formData.append('brief', els.brief.value.trim());
    formData.append('styleId', selectedStyleId);
    formData.append('language', els.language.value);
    formData.append('model', els.model.value);

    const file = els.docFile.files[0];
    if (file) formData.append('docFile', file);

    const provider = selectedProvider();
    if (provider) {
      const byokKey = await getDecryptedByokKey(provider);
      if (byokKey) formData.append('byokKey', byokKey);
    }

    const res = await fetch('/api/linkedin/generate', { method: 'POST', body: formData });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

    generatedPost = data.post || '';
    generatedMeta = {
      styleId: data.style?.id || selectedStyleId,
      styleName: data.style?.name || selectedStyle()?.name || selectedStyleId,
      language: data.language || els.language.value,
      sourceName: file?.name || 'Brief'
    };

    els.output.textContent = generatedPost || 'No post returned.';
    setGeneratedState(Boolean(generatedPost));
    setStatus('Generated successfully.', 'success');
  } catch (err) {
    els.output.textContent = 'Generation failed.';
    setStatus(err.message || 'Failed to generate post.', 'error');
  } finally {
    els.generateBtn.disabled = false;
  }
}

async function copyPost() {
  if (!generatedPost) return;
  await navigator.clipboard.writeText(generatedPost);
  showToast('Copied to clipboard');
}

function saveHistory() {
  if (!generatedPost || !generatedMeta) return;
  let history = [];
  try {
    history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    history = [];
  }
  history.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    timestamp: new Date().toISOString(),
    post: generatedPost,
    ...generatedMeta
  });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
  showToast('Saved to history');
}

els.docFile.addEventListener('change', () => {
  const file = els.docFile.files[0];
  els.uploadLabel.textContent = file ? file.name : 'Upload MD/PDF';
  els.uploadZone.classList.toggle('has-file', Boolean(file));
});

els.generateBtn.addEventListener('click', generatePost);
els.copyBtn.addEventListener('click', copyPost);
els.saveBtn.addEventListener('click', saveHistory);

loadModels();
loadStyles();
