/* =========================================================
  Visura - Generator Templates (generatorTemplates.js)
  ========================================================= */

'use strict';

import { escapeHtml, getActivePromptBatch } from './common.js';
import { DEFAULT_PROMPTS } from './promptStore.js';

/**
 * Returns the prompt template string for a given slide number.
 * If an active prompt batch is set in state, uses that batch's slide template.
 * Falls back to DEFAULT_PROMPTS (single source of truth) if no batch active.
 */
export function getTemplateForSlide(slide, state) {
  // Try active batch first
  if (state.activePromptBatchId && state.promptBatches) {
    const activeBatch = getActivePromptBatch(state.promptBatches, state.activePromptBatchId);
    if (activeBatch && activeBatch.slides && activeBatch.slides[slide]) {
      return activeBatch.slides[slide];
    }
  }
  // Fallback: default templates from promptStore.js
  return DEFAULT_PROMPTS[slide] || DEFAULT_PROMPTS[1];
}

export function compileTemplate(slideNum, state) {
  const template = getTemplateForSlide(slideNum, state);
  const slideData = state.slides[slideNum] || {};
  const allData = { ...slideData, ...state.settings };

  let compiled = template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, key) => {
    const value = allData[key];
    if (value && value.trim() !== '') {
      return `<span class="ph-filled">${escapeHtml(value)}</span>`;
    } else {
      return `<span class="ph-empty">[${key}]</span>`;
    }
  });

  return compiled;
}

export function compilePlainText(slideNum, state) {
  const template = getTemplateForSlide(slideNum, state);
  const slideData = state.slides[slideNum] || {};
  const allData = { ...slideData, ...state.settings };

  let compiled = template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, key) => {
    const value = allData[key];
    return (value && value.trim() !== '') ? value : `[${key}]`;
  });

  return compiled;
}
