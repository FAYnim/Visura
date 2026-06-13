import { getDecryptedByokKey } from './byok.js';
import { initSidebar, loadSettings, updateProfileWidget } from './common.js';
import { copyArticleMarkdown, hasGeneratedArticle } from './articleActions.js';
import { SETTINGS_DEFAULTS } from './settingsDefaults.js';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_EXTENSIONS = ['.md', '.markdown', '.pdf'];

const els = {
  brief: document.getElementById('brief'),
  docFile: document.getElementById('doc-file'),
  uploadZone: document.getElementById('upload-zone'),
  uploadLabel: document.getElementById('upload-label'),
  language: document.getElementById('language'),
  length: document.getElementById('length'),
  model: document.getElementById('model'),
  styleGrid: document.getElementById('style-grid'),
  styleStatus: document.getElementById('style-status'),
  generateBtn: document.getElementById('generate-btn'),
  copyBtn: document.getElementById('copy-btn'),
  articleTitleOutput: document.getElementById('article-title-output'),
  articleExcerptOutput: document.getElementById('article-excerpt-output'),
  markdownOutput: document.getElementById('markdown-output'),
  previewOutput: document.getElementById('preview-output'),
  toast: document.getElementById('toast')
};

let styles = [];
let selectedStyleId = '';
let generatedArticle = null;
let toastTimer = null;

function showToast(message) {
  if (!els.toast) return;
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add('show');
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2400);
}

function setGeneratedState(article) {
  generatedArticle = article;
  if (els.copyBtn) els.copyBtn.disabled = !hasGeneratedArticle(article);
}

function inferProvider(model) {
  if (model.provider) return model.provider;
  if (model.id.startsWith('gemini')) return 'gemini';
  if (model.id.startsWith('gpt-oss')) return 'groq';
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
    showToast('Failed to load models');
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
    description.textContent = style.description || 'Article writing style';
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
    const res = await fetch('/api/article/styles');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    styles = Array.isArray(data.styles) ? data.styles : [];
    selectedStyleId = styles[0]?.id || '';
    els.styleStatus.textContent = styles.length ? `${styles.length} styles` : 'No styles';
    renderStyles();
  } catch (err) {
    els.styleStatus.textContent = 'Failed to load styles';
  }
}

function selectedProvider() {
  return els.model.selectedOptions[0]?.dataset.provider || '';
}

function setStatus(message) {
  els.articleTitleOutput.value = message;
  els.articleExcerptOutput.value = '';
  els.markdownOutput.textContent = message;
  els.previewOutput.textContent = message;
}

function validateFile(file) {
  if (!file) return true;
  const name = file.name.toLowerCase();
  const hasAllowedExtension = ALLOWED_FILE_EXTENSIONS.some(extension => name.endsWith(extension));
  if (!hasAllowedExtension) {
    setStatus('Unsupported file. Upload .md, .markdown, or .pdf only.');
    return false;
  }
  if (file.size > MAX_FILE_SIZE) {
    setStatus('File too large. Upload a document 10 MB or smaller.');
    return false;
  }
  return true;
}

function validateInput() {
  const file = els.docFile.files[0];
  if (!els.brief.value.trim() && !file) {
    setStatus('Provide at least a brief or a document file.');
    return false;
  }
  if (!validateFile(file)) return false;
  if (!selectedStyleId) {
    setStatus('Choose an article style.');
    return false;
  }
  if (!els.model.value) {
    setStatus('Choose an AI model.');
    return false;
  }
  if (!els.language.value || !els.length.value) {
    setStatus('Choose language and article length.');
    return false;
  }
  return true;
}

async function generateArticle() {
  if (!validateInput()) return;

  setGeneratedState(null);
  setStatus('Generating...');
  els.generateBtn.disabled = true;

  try {
    const formData = new FormData();
    formData.append('brief', els.brief.value.trim());
    formData.append('styleId', selectedStyleId);
    formData.append('language', els.language.value);
    formData.append('length', els.length.value);
    formData.append('model', els.model.value);

    const file = els.docFile.files[0];
    if (file) formData.append('docFile', file);

    const provider = selectedProvider();
    if (provider) {
      const byokKey = await getDecryptedByokKey(provider);
      if (byokKey) formData.append('byokKey', byokKey);
    }

    const res = await fetch('/api/article/generate', { method: 'POST', body: formData });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

    const article = {
      title: data.title || 'Untitled article',
      excerpt: data.excerpt || '',
      articleMarkdown: data.articleMarkdown || '',
      articleHtml: data.articleHtml || ''
    };

    els.articleTitleOutput.value = article.title;
    els.articleExcerptOutput.value = article.excerpt;
    els.markdownOutput.textContent = article.articleMarkdown || 'No article returned.';
    els.previewOutput.innerHTML = article.articleHtml || 'No preview returned.';
    setGeneratedState(article);
  } catch (err) {
    setGeneratedState(null);
    setStatus(err.message || 'Failed to generate article.');
  } finally {
    els.generateBtn.disabled = false;
  }
}

async function copyArticle() {
  try {
    if (await copyArticleMarkdown({ articleMarkdown: generatedArticle?.articleMarkdown })) {
      showToast('Copied to clipboard');
    }
  } catch {
    showToast('Copy failed. Select and copy manually.');
  }
}

els.docFile.addEventListener('change', () => {
  const file = els.docFile.files[0];
  els.uploadLabel.textContent = file ? file.name : 'Upload MD/PDF';
  els.uploadZone.classList.toggle('has-file', Boolean(file));
});

els.generateBtn.addEventListener('click', generateArticle);
els.copyBtn.addEventListener('click', copyArticle);

initSidebar();
updateProfileWidget(loadSettings(SETTINGS_DEFAULTS));
setGeneratedState(null);
await Promise.all([loadModels(), loadStyles()]);
