/* =========================================================
   Visura — Settings Page Logic (settings.js)
   ========================================================= */

import {
  loadSettings,
  saveSettings,
  updateProfileWidget,
  initSidebar,
  showToast
} from './common.js';

import { SETTINGS_DEFAULTS } from './settingsDefaults.js';

'use strict';



// =========================================================
// STATE
// =========================================================
let currentSettings = { ...SETTINGS_DEFAULTS };

// =========================================================
// POPULATE INPUTS
// =========================================================
function populateInputs(settings) {
  const creatorNameInput   = document.getElementById('setting-creator-name');
  const creatorRoleInput   = document.getElementById('setting-creator-role');

  if (creatorNameInput)  creatorNameInput.value  = settings.CREATOR_NAME  || '';
  if (creatorRoleInput)  creatorRoleInput.value  = settings.CREATOR_ROLE  || '';

}

// =========================================================
// SAVE SETTINGS
// =========================================================
function saveGlobalSettings() {
  const creatorNameInput   = document.getElementById('setting-creator-name');
  const creatorRoleInput   = document.getElementById('setting-creator-role');

  if (creatorNameInput)  currentSettings.CREATOR_NAME  = creatorNameInput.value;
  if (creatorRoleInput)  currentSettings.CREATOR_ROLE  = creatorRoleInput.value;

  saveSettings(currentSettings);
  updateProfileWidget(currentSettings);
  showToast(`<i class="fa-solid fa-check" style="color: var(--accent-primary);"></i> Settings saved!`);
}

// =========================================================
// RESET SETTINGS
// =========================================================
function resetGlobalSettings() {
  const confirmClear = confirm('Are you sure you want to reset all global settings to default?');
  if (confirmClear) {
    currentSettings = { ...SETTINGS_DEFAULTS };

    const creatorNameInput   = document.getElementById('setting-creator-name');
    const creatorRoleInput   = document.getElementById('setting-creator-role');

    if (creatorNameInput)  creatorNameInput.value  = '';
    if (creatorRoleInput)  creatorRoleInput.value  = '';

    saveSettings(currentSettings);
    updateProfileWidget(currentSettings);
    showToast(`<i class="fa-solid fa-rotate-left" style="color: var(--text-secondary);"></i> Settings reset.`);
  }
}

// =========================================================
// INIT
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  // Load settings & apply
  currentSettings = loadSettings(SETTINGS_DEFAULTS);
  updateProfileWidget(currentSettings);
  populateInputs(currentSettings);

  // Init sidebar
  initSidebar();

  // Bind save button
  const saveBtn = document.getElementById('btn-save-settings');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveGlobalSettings);
  }

  // Bind reset button
  const resetBtn = document.getElementById('btn-reset-settings');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetGlobalSettings);
  }
});
