/* =========================================================
   Visura — History Page Logic (history.js)
   ========================================================= */

import {
  escapeHtml,
  loadSettings,
  loadHistory,
  saveHistory,
  updateProfileWidget,
  initSidebar,
  showToast
} from './common.js';

import { SETTINGS_DEFAULTS } from './settingsDefaults.js';

'use strict';



// =========================================================
// STATE
// =========================================================
let history = [];

// =========================================================
// HELPER: Regex Escape
// =========================================================
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// =========================================================
// HELPER: Relative Time
// =========================================================
function formatRelativeTime(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 15) return 'just now';
  if (diffSec < 60) return `${diffSec} seconds ago`;
  if (diffMin < 60) return `${diffMin} minutes ago`;
  if (diffHr < 24) return `${diffHr} hours ago`;
  if (diffDays === 1) return 'yesterday';
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

// =========================================================
// RENDER HISTORY
// =========================================================
function renderHistory(searchQuery = '') {
  const historyListContainer = document.getElementById('history-list');
  if (!historyListContainer) return;

  historyListContainer.removeAttribute('aria-busy');

  const query = searchQuery.trim().toLowerCase();

  const filtered = history.filter(item => {
    if (!query) return true;
    return item.slideName.toLowerCase().includes(query) ||
           item.creator.toLowerCase().includes(query) ||
           item.promptText.toLowerCase().includes(query);
  });

  if (filtered.length === 0) {
    if (history.length === 0) {
      historyListContainer.innerHTML = `
        <div class="history-empty-state">
          <div class="empty-icon-wrap" aria-hidden="true">
            <i class="fa-solid fa-clock-rotate-left"></i>
          </div>
          <h3 class="empty-title">No prompt history yet</h3>
          <p class="empty-desc">Whenever you copy a prompt in the Generator menu, it will be automatically and securely recorded here.</p>
          <a href="index.html" class="btn btn-primary btn-empty-cta">
            <span class="btn-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></span>
            Open Generator
          </a>
        </div>
      `;
    } else {
      historyListContainer.innerHTML = `
        <div class="history-empty-state">
          <div class="empty-icon-wrap" aria-hidden="true">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <h3 class="empty-title">No search results</h3>
          <p class="empty-desc">No history found for keyword "${escapeHtml(searchQuery)}". Please try a different keyword.</p>
          <button class="btn btn-secondary btn-empty-cta" id="btn-clear-search">
            Clear Search
          </button>
        </div>
      `;
      const clearSearchBtn = document.getElementById('btn-clear-search');
      if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', clearHistorySearch);
      }
    }
    return;
  }

  let cardsHtml = '';
  filtered.forEach(item => {
    const timeString = formatRelativeTime(new Date(item.timestamp));

    let highlightedText = escapeHtml(item.promptText);
    let highlightedTitle = escapeHtml(item.slideName);
    let highlightedCreator = escapeHtml(item.creator);

    if (query) {
      const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
      highlightedText    = highlightedText.replace(regex, '<span class="search-match-hl">$1</span>');
      highlightedTitle   = highlightedTitle.replace(regex, '<span class="search-match-hl">$1</span>');
      highlightedCreator = highlightedCreator.replace(regex, '<span class="search-match-hl">$1</span>');
    }

    cardsHtml += `
      <div class="history-card" data-id="${item.id}" id="card-${item.id}">
        <div class="history-card-header">
          <div class="history-card-meta">
            <h3 class="history-card-title">${highlightedTitle}</h3>
            <span class="history-card-time" title="${escapeHtml(new Date(item.timestamp).toLocaleString())}">
              <i class="fa-regular fa-clock" style="margin-right: 4px;"></i>${timeString}
            </span>
          </div>
          <button class="history-card-delete" data-id="${item.id}" aria-label="Delete history item" title="Remove from history">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>

        <div class="history-card-body">
          <pre class="history-card-text">${highlightedText}</pre>
        </div>

        <div class="history-card-footer">
          <div class="history-card-creator">
            <i class="fa-regular fa-user"></i>
            <span class="creator-name">${highlightedCreator}</span>
          </div>
          <button class="btn-history-copy" data-id="${item.id}" aria-label="Copy this prompt again">
            <span class="btn-icon"><i class="fa-regular fa-copy"></i></span>
            Copy Again
          </button>
        </div>
      </div>
    `;
  });

  historyListContainer.innerHTML = cardsHtml;

  // Bind delete buttons
  historyListContainer.querySelectorAll('.history-card-delete').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      deleteHistoryItem(btn.dataset.id);
    });
  });

  // Bind copy buttons
  historyListContainer.querySelectorAll('.btn-history-copy').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      handleHistoryCopy(btn.dataset.id, btn);
    });
  });
}

// =========================================================
// DELETE ITEM
// =========================================================
function deleteHistoryItem(id) {
  const card = document.getElementById(`card-${id}`);
  if (card) {
    card.style.transform = 'scale(0.95)';
    card.style.opacity = '0';
    card.style.transition = 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)';

    setTimeout(() => {
      history = history.filter(item => item.id !== id);
      saveHistory(history);
      renderHistory(document.getElementById('history-search')?.value || '');
      showToast(`<i class="fa-solid fa-trash-can" style="color: var(--text-secondary);"></i> History item deleted.`);
    }, 250);
  }
}

// =========================================================
// COPY ITEM
// =========================================================
function handleHistoryCopy(id, btn) {
  const item = history.find(x => x.id === id);
  if (!item) return;

  navigator.clipboard.writeText(item.promptText).then(() => {
    const originalContent = btn.innerHTML;
    btn.classList.add('copied');
    btn.innerHTML = `<span class="btn-icon"><i class="fa-solid fa-check"></i></span> Copied!`;

    showToast(`<i class="fa-solid fa-check" style="color: var(--text-primary);"></i> Prompt copied again!`);

    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = originalContent;
    }, 2000);
  }).catch(() => {
    showToast(`<i class="fa-solid fa-triangle-exclamation" style="color: #ff6b6b;"></i> Failed to copy. Please try again.`);
  });
}

// =========================================================
// CLEAR ALL HISTORY
// =========================================================
function clearAllHistory() {
  if (history.length === 0) {
    showToast(`<i class="fa-solid fa-circle-info" style="color: var(--text-secondary);"></i> No history to clear.`);
    return;
  }

  const confirmClear = confirm('Are you sure you want to clear the entire prompt history? This action cannot be undone.');
  if (confirmClear) {
    history = [];
    saveHistory(history);
    renderHistory();
    showToast(`<i class="fa-solid fa-trash-can" style="color: var(--text-secondary);"></i> Entire history cleared.`);
  }
}

// =========================================================
// CLEAR SEARCH
// =========================================================
function clearHistorySearch() {
  const searchInput = document.getElementById('history-search');
  if (searchInput) {
    searchInput.value = '';
    renderHistory();
  }
}

// =========================================================
// INITIAL RENDER DELAY
// =========================================================
function renderInitialHistory() {
  setTimeout(() => renderHistory(), 300);
}

// =========================================================
// INIT
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  // Load settings & apply theme
  const settings = loadSettings(SETTINGS_DEFAULTS);
  updateProfileWidget(settings);
  // Load history
  history = loadHistory();

  // Init sidebar
  initSidebar();

  // Bind clear-all history button
  const clearHistoryBtn = document.getElementById('btn-clear-history');
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', clearAllHistory);
  }

  // Bind search input
  const searchInput = document.getElementById('history-search');
  if (searchInput) {
    searchInput.value = '';
    searchInput.addEventListener('input', e => renderHistory(e.target.value));
  }

  // Initial render
  renderInitialHistory();
});
