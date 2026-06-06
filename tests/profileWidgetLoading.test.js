/**
 * profileWidgetLoading.test.js
 * Verifies sidebar profile name loading state is cleared by updateProfileWidget().
 */

import assert from 'assert';
import { updateProfileWidget } from '../public/js/common.js';

function createMockElement(className) {
  const classSet = new Set(className.split(' ').filter(Boolean));

  return {
    textContent: '',
    classList: {
      remove(name) {
        classSet.delete(name);
      },
      contains(name) {
        return classSet.has(name);
      }
    }
  };
}

function withMockDocument(elements, callback) {
  const previousDocument = globalThis.document;

  globalThis.document = {
    querySelector(selector) {
      return elements[selector] || null;
    }
  };

  try {
    callback();
  } finally {
    if (previousDocument === undefined) {
      delete globalThis.document;
    } else {
      globalThis.document = previousDocument;
    }
  }
}

withMockDocument({
  '.profile-name': createMockElement('profile-name profile-name-loading'),
  '.profile-title': createMockElement('profile-title')
}, () => {
  const profileName = document.querySelector('.profile-name');
  const profileTitle = document.querySelector('.profile-title');

  updateProfileWidget({ CREATOR_NAME: '  Maya Creator  ', CREATOR_ROLE: 'Designer' });

  assert.strictEqual(profileName.textContent, 'Maya Creator', 'profile name should use trimmed creator name');
  assert.strictEqual(profileName.classList.contains('profile-name-loading'), false, 'profile name loading class should be removed');
  assert.strictEqual(profileTitle.textContent, 'Designer', 'profile title should keep existing role behavior');
});

withMockDocument({
  '.profile-name': createMockElement('profile-name profile-name-loading')
}, () => {
  const profileName = document.querySelector('.profile-name');

  updateProfileWidget({ CREATOR_NAME: '   ' });

  assert.strictEqual(profileName.textContent, 'John Doe', 'empty creator name should fall back to John Doe');
  assert.strictEqual(profileName.classList.contains('profile-name-loading'), false, 'fallback should also clear loading class');
});

console.log('✓ updateProfileWidget clears profile name loading state');
console.log('✓ updateProfileWidget preserves creator name and fallback behavior');
console.log('\n✅ Profile widget loading tests passed!');
