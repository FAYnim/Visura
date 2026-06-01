# Auto Caption Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Caption tab to the slide navigation that auto-fills a storytelling Instagram caption alongside the existing AI Auto-Fill feature.

**Architecture:** Backend adds a `caption.TEXT` field to the SCHEMA and prompt instructions. The existing `/api/auto-fill` endpoint returns it alongside slide data. Frontend stores caption as a flat string in state, renders it in a new form panel with textarea, and shows plain text in preview.

**Tech Stack:** Express (backend), vanilla HTML/CSS/JS (frontend), Node.js tests

---

### Task 1: Update Backend Schema

**Files:**
- Modify: `server/ai/schema.js:5-63`

- [ ] **Step 1: Add `caption` to SCHEMA**

```js
const SCHEMA = {
  slide1: { ... },
  slide2: { ... },
  slide3: { ... },
  slide4: { ... },
  slide5: { ... },
  caption: { TEXT: '' }
};
```

Add `caption: { TEXT: '' }` after `slide5` block in `server/ai/schema.js`. This is a nested object so `normalizeOutput` handles it automatically (same iterate-slides loop).

- [ ] **Step 2: Run existing tests to confirm nothing broke**

Run: `npm test`
Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add server/ai/schema.js
git commit -m "feat: add caption field to AI schema"
```

---

### Task 2: Update Prompt Instructions

**Files:**
- Modify: `server/ai/promptBuilder.js:11-26`

- [ ] **Step 1: Add rule 8 to system prompt**

After rule 7, add:
```js
// 8. Generate a storytelling Instagram caption under caption.TEXT.
//    Describe the project in a professional storytelling tone (100-200 words).
//    Use \\n for line breaks. The caption must be a single string.
```

The `SCHEMA` is already printed with `JSON.stringify(SCHEMA, null, 2)` at line 28, so the new `caption: { TEXT: '' }` automatically appears in the prompt. No additional change needed there.

The `normalizeOutput` function iterates `Object.keys(SCHEMA)` and checks `typeof raw[slideKey] === 'object'`. Since `caption` is `{ TEXT: '' }` (an object), no special-case logic is needed — it enters the same loop and processes `caption.TEXT`.

- [ ] **Step 2: Run existing tests**

Run: `npm test`
Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add server/ai/promptBuilder.js
git commit -m "feat: add caption generation instruction to AI prompt"
```

---

### Task 3: Add Caption to Frontend State

**Files:**
- Modify: `public/js/generatorState.js:11-46`

- [ ] **Step 1: Add `caption: ''` to STATE**

```js
export const STATE = {
  activeSlide: 1,
  caption: '',     // flat string for the Instagram caption
  settings: { ...SETTINGS_DEFAULTS },
  ...
};
```

Also update `resetSlides` to clear caption:

```js
export function resetSlides(state = STATE) {
  Object.keys(state.slides).forEach(slide => {
    Object.keys(state.slides[slide]).forEach(key => {
      state.slides[slide][key] = '';
    });
  });
  state.caption = '';  // also reset caption
}
```

- [ ] **Step 2: Commit**

```bash
git add public/js/generatorState.js
git commit -m "feat: add caption field to state with reset"
```

---

### Task 4: Add Caption Tab and Form Panel to HTML

**Files:**
- Modify: `public/app.html`

- [ ] **Step 1: Add Caption tab button after Slide 5**

After the Slide 5 `<button>` in `.slide-nav` (line 96), add:
```html
<button class="slide-tab" role="tab" data-slide="caption" aria-selected="false" tabindex="-1" id="tab-caption">
  Caption
</button>
```

- [ ] **Step 2: Add Caption form panel after Slide 5 form panel**

After the Slide 5 `</div>` closing `.form-panel` (line 522), add:
```html
<!-- -----------------------------------------------
     FORM PANEL: CAPTION
     ----------------------------------------------- -->
<div class="form-panel" data-slide="caption" role="tabpanel" aria-labelledby="tab-caption">
  <div class="form-section-header">
    <div class="form-slide-badge"><i class="fa-solid fa-pen" style="margin-right: 6px;"></i> Instagram Caption</div>
    <h2 class="form-slide-title">Caption</h2>
    <p class="form-slide-desc">Storytelling caption for the Instagram carousel post. Auto-filled by AI when you use Auto-Fill.</p>
  </div>
  <div class="field-group">
    <div class="field">
      <label class="field-label" for="caption-text">
        Caption Text
      </label>
      <textarea
        id="caption-text"
        data-slide="caption"
        placeholder="Auto-filled by AI..."
        rows="8"
      ></textarea>
    </div>
  </div>
</div>
```

Note: no `data-key` attribute on the caption textarea. It will be bound by `id` as a special case in `bindInputs`.

- [ ] **Step 3: Commit**

```bash
git add public/app.html
git commit -m "feat: add Caption tab and form panel to HTML"
```

---

### Task 5: Update Slide Switching to Handle Caption Tab

**Files:**
- Modify: `public/js/generatorBindings.js:7-22`
- Modify: `public/js/generator.js:98-114`

- [ ] **Step 1: Update `switchSlide` to accept string slide IDs**

Change `parseInt` to `String` comparison so `data-slide="caption"` works:

```js
export function switchSlide({ state, renderPreview, slideNum }) {
  state.activeSlide = slideNum;

  document.querySelectorAll('.slide-tab').forEach(tab => {
    const isActive = String(slideNum) === tab.dataset.slide;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  document.querySelectorAll('.form-panel').forEach(panel => {
    const isActive = String(slideNum) === panel.dataset.slide;
    panel.classList.toggle('active', isActive);
  });

  renderPreview();
}
```

- [ ] **Step 2: Update `bindInputs` to handle caption textarea**

```js
export function bindInputs({ state, renderPreview }) {
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.dataset.key;
    const slide = parseInt(el.dataset.slide);

    if (state.slides[slide] && state.slides[slide][key] !== undefined) {
      el.value = state.slides[slide][key];
    }

    el.addEventListener('input', e => {
      if (state.slides[slide] && state.slides[slide][key] !== undefined) {
        state.slides[slide][key] = e.target.value;
        if (state.activeSlide === slide) {
          renderPreview();
        }
      }
    });
  });

  // Caption textarea — bound by id, uses state.caption
  const captionArea = document.getElementById('caption-text');
  if (captionArea) {
    captionArea.value = state.caption;
    captionArea.addEventListener('input', e => {
      state.caption = e.target.value;
      if (state.activeSlide === 'caption') {
        renderPreview();
      }
    });
  }
}
```

- [ ] **Step 3: Update `generator.js` slide tab click handlers**

Convert numeric slide strings to numbers (so `state.activeSlide` stays numeric for slides 1-5, preserving existing comparison logic in `bindInputs`):

```js
document.querySelectorAll('.slide-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const raw = tab.dataset.slide;
    switchSlideBase({
      state: STATE,
      renderPreview,
      slideNum: raw === 'caption' ? 'caption' : parseInt(raw)
    });
  });
  tab.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const raw = tab.dataset.slide;
      switchSlideBase({
        state: STATE,
        renderPreview,
        slideNum: raw === 'caption' ? 'caption' : parseInt(raw)
      });
    }
  });
});
```

- [ ] **Step 4: Commit**

```bash
git add public/js/generatorBindings.js public/js/generator.js
git commit -m "feat: handle caption tab in slide switching and bindings"
```

---

### Task 6: Render Caption Plain Text in Preview

**Files:**
- Modify: `public/js/generatorRender.js:9-17`
- Modify: `public/js/generatorTemplates.js:27-55`

- [ ] **Step 1: Update `renderPreview` to handle caption mode**

When the active slide is `'caption'`, render the caption text directly instead of compiling a template:

```js
export function renderPreview({ state, previewOutput, previewTitle, previewCharCount }) {
  if (state.activeSlide === 'caption') {
    const text = state.caption || '';
    previewOutput.innerHTML = text.replace(/\n/g, '<br>');
    previewCharCount.textContent = `${text.length.toLocaleString()} chars`;
    previewTitle.textContent = 'Caption';
    return;
  }

  const compiled = compileTemplate(state.activeSlide, state);
  previewOutput.innerHTML = compiled;

  const plain = compilePlainText(state.activeSlide, state);
  previewCharCount.textContent = `${plain.length.toLocaleString()} chars`;

  const slideNames = { 1: 'Slide 1', 2: 'Slide 2', 3: 'Slide 3', 4: 'Slide 4', 5: 'Slide 5' };
  previewTitle.textContent = `${slideNames[state.activeSlide]} Prompt`;
}
```

- [ ] **Step 2: Update `handleCopy` in `generatorClipboard.js` to handle caption**

When the active slide is `'caption'`, copy `state.caption` directly instead of calling `compilePlainText`:

```js
export function handleCopy({ state, compilePlainText, addToHistory, showToast, copyBtn }) {
  let plain;
  if (state.activeSlide === 'caption') {
    plain = state.caption || '';
  } else {
    plain = compilePlainText(state.activeSlide, state);
  }

  navigator.clipboard.writeText(plain).then(() => {
    const originalContent = copyBtn.innerHTML;
    copyBtn.classList.add('copied');
    copyBtn.innerHTML = `<span class="btn-icon"><i class="fa-solid fa-check"></i></span> Copied!`;

    const label = state.activeSlide === 'caption' ? 'Caption' : 'Prompt';
    showToast(`<i class="fa-solid fa-check" style="color: var(--text-primary);"></i> ${label} copied to clipboard!`);

    addToHistory(plain);

    setTimeout(() => {
      copyBtn.classList.remove('copied');
      copyBtn.innerHTML = originalContent;
    }, 2000);
  }).catch(() => {
    showToast(`<i class="fa-solid fa-triangle-exclamation" style="color: #ff6b6b;"></i> Failed to copy. Please try again.`);
  });
}
```

- [ ] **Step 3: Update `handleReset` to clear caption**

```js
export function handleReset({ state, renderPreview, showToast, resetSlides }) {
  resetSlides(state);

  document.querySelectorAll('[data-key]').forEach(el => {
    el.value = '';
  });

  // Clear caption textarea
  const captionArea = document.getElementById('caption-text');
  if (captionArea) captionArea.value = '';

  renderPreview();

  showToast(`<i class="fa-solid fa-rotate-left" style="color: var(--text-secondary);"></i> All generator inputs have been reset.`);
}
```

- [ ] **Step 4: Commit**

```bash
git add public/js/generatorRender.js public/js/generatorClipboard.js
git commit -m "feat: render caption as plain text in preview and handle clipboard"
```

---

### Task 7: Wire Auto-Fill to Populate Caption

**Files:**
- Modify: `public/js/autoFill.js:230-252`

- [ ] **Step 1: Update `applyAutoFill` to populate caption**

After the slide loop, add caption handling:

```js
function applyAutoFill() {
  if (!_lastAutoFillData) return;

  Object.keys(SLIDE_KEY_MAP).forEach(slideKey => {
    const slideNum = SLIDE_KEY_MAP[slideKey];
    const slideData = _lastAutoFillData[slideKey];
    if (!slideData || !state.slides[slideNum]) return;
    Object.keys(slideData).forEach(field => {
      if (state.slides[slideNum][field] !== undefined) {
        state.slides[slideNum][field] = slideData[field] || '';
      }
    });
  });

  // Apply caption
  state.caption = _lastAutoFillData.caption?.TEXT || '';
  const captionArea = document.getElementById('caption-text');
  if (captionArea) captionArea.value = state.caption;

  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.dataset.key;
    const slide = parseInt(el.dataset.slide);
    if (state.slides[slide] && state.slides[slide][key] !== undefined) {
      el.value = state.slides[slide][key];
    }
  });

  renderPreview();
  closeModal();
  showToast(`<i class="fa-solid fa-wand-magic-sparkles" style="color: var(--accent-primary);"></i> AI Auto-Fill applied to all 5 slides + caption!`);
}
```

- [ ] **Step 2: Commit**

```bash
git add public/js/autoFill.js
git commit -m "feat: wire auto-fill to populate caption field"
```

---

### Task 8: Update Tests

**Files:**
- Modify: `tests/autoFillSchema.test.js:11-20`

- [ ] **Step 1: Add caption validation to schema test**

After the slide5 test block, add:
```js
// ── Test 9: SCHEMA has caption field ─────────────────────────────────────────
assert(SCHEMA.caption !== undefined, 'SCHEMA missing key: caption');
assert(SCHEMA.caption.TEXT !== undefined, 'SCHEMA.caption missing key: TEXT');
console.log('✓ SCHEMA has caption.TEXT field');

// ── Test 10: normalizeOutput handles caption ─────────────────────────────────
const mockWithCaption = {
  ...mockRaw,
  caption: { TEXT: '  A great storytelling caption for this project.  ' }
};
const normWithCaption = normalizeOutput(mockWithCaption);
assert(normWithCaption.caption !== undefined, 'normalizeOutput should include caption');
assert(normWithCaption.caption.TEXT === 'A great storytelling caption for this project.', 'normalizeOutput should trim caption.TEXT');
console.log('✓ normalizeOutput handles caption correctly');
```

This goes before the `validateSchema` helper and the final `console.log`.

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add tests/autoFillSchema.test.js
git commit -m "test: add caption field validation to schema tests"
```
