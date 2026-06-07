import { getDecryptedByokKey } from './byok.js';
import { copyLinkedinPost, createLinkedinHistoryEntry, prependLinkedinHistory } from './linkedinActions.js';

const HISTORY_KEY = 'linkedinPostHistory';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_EXTENSIONS = ['.md', '.markdown', '.pdf'];

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
    const res = await fetch('/api/models?includeUnavailable=1');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { models } = await res.json();
    if (!Array.isArray(models) || !models.length) throw new Error('No models available');
    setModelOptions(models);
  } catch (err) {
    setStatus(err.message || 'Failed to load models.', 'error');
  } finally {
    els.model.disabled = false;
  }
}

function renderStyles() {
  els.styleGrid.replaceChildren();
  styles.forEach(style => {
    const isActive = style.id === selectedStyleId;
    const button = document.createElement('button');
    const title = document.createElement('strong');
    const description = document.createElement('span');

    button.type = 'button';
    button.className = `linkedin-style-card${isActive ? ' active' : ''}`;
    button.dataset.styleId = style.id;
    button.setAttribute('aria-pressed', String(isActive));
    title.textContent = style.name || style.id;
    description.textContent = style.description || 'LinkedIn writing style';
    button.append(title, description);
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

function validateFile(file) {
  if (!file) return true;
  const name = file.name.toLowerCase();
  const hasAllowedExtension = ALLOWED_FILE_EXTENSIONS.some(extension => name.endsWith(extension));
  if (!hasAllowedExtension) {
    setStatus('Unsupported file. Upload .md, .markdown, or .pdf only.', 'error');
    els.output.textContent = 'Unsupported file. Upload .md, .markdown, or .pdf only.';
    return false;
  }
  if (file.size > MAX_FILE_SIZE) {
    setStatus('File too large. Upload a document 10 MB or smaller.', 'error');
    els.output.textContent = 'File too large. Upload a document 10 MB or smaller.';
    return false;
  }
  return true;
}

function validateInput() {
  const file = els.docFile.files[0];
  if (!els.brief.value.trim() && !file) {
    setStatus('Add a brief or upload a Markdown/PDF file.', 'error');
    return false;
  }
  if (!validateFile(file)) {
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
    const message = err.message || 'Failed to generate post.';
    els.output.textContent = message;
    setStatus(message, 'error');
  } finally {
    els.generateBtn.disabled = false;
  }
}

async function copyPost() {
  try {
    if (await copyLinkedinPost({ post: generatedPost })) {
      showToast('Copied to clipboard');
    }
  } catch {
    showToast('Copy failed. Select and copy manually.');
  }
}

function saveHistory() {
  if (!generatedPost || !generatedMeta) return;
  try {
    let history = [];
    try {
      history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    } catch {
      history = [];
    }
    const entry = createLinkedinHistoryEntry({ post: generatedPost, meta: generatedMeta });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(prependLinkedinHistory(history, entry)));
    showToast('Saved to history');
  } catch {
    showToast('Save failed. Browser storage unavailable.');
  }
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
