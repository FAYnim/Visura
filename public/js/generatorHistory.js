/* =========================================================
  Visura - Generator History (generatorHistory.js)
  ========================================================= */

'use strict';

export function addToHistory({ state, saveHistory }, promptText) {
  const slideNames = {
    1: 'Slide 1 — Cover',
    2: 'Slide 2 — Project Overview',
    3: 'Slide 3 — Features',
    4: 'Slide 4 — UI Showcase',
    5: 'Slide 5 — Closing Outro'
  };

  const historyItem = {
    id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    timestamp: new Date().toISOString(),
    slideNum: state.activeSlide,
    slideName: slideNames[state.activeSlide] || `Slide ${state.activeSlide}`,
    creator: state.settings.CREATOR_NAME ? state.settings.CREATOR_NAME.trim() : 'Anonymous',
    promptText: promptText
  };

  state.history.unshift(historyItem);

  if (state.history.length > 50) {
    state.history.pop();
  }

  saveHistory(state.history);
}
