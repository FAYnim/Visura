---
goal: Auto Caption — Instagram storytelling caption yang auto-fill bersama AI Auto-Fill
version: 1.0
date_created: 2026-06-01
last_updated: 2026-06-01
status: 'Planned'
tags: feature, frontend, backend, caption, ai
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

Add a **Caption** tab to the slide navigation bar (after Slide 5). When the user runs AI Auto-Fill, the response includes a `caption` field — a storytelling Instagram caption describing the project. The caption is displayed in a textarea within the new Caption panel and can be edited, copied, or regenerated.

**Architecture:** Backend adds `caption.TEXT` to SCHEMA. Existing `/api/auto-fill` endpoint returns it alongside slide data. Frontend stores caption as flat string in state, renders it in a new form panel, shows plain text in preview.

---

## 1. Requirements & Constraints

- **REQ-001**: Add `caption: { TEXT: '' }` to backend SCHEMA in `server/ai/schema.js`
- **REQ-002**: Add rule 8 to system prompt in `server/ai/promptBuilder.js` instructing AI to generate caption under `caption.TEXT` (100-200 words, professional storytelling tone, \n for line breaks)
- **REQ-003**: `normalizeOutput` must handle `caption.TEXT` without special-case logic (nested object already compatible with existing loop)
- **REQ-004**: Response JSON from `POST /api/auto-fill` must include `caption: { TEXT: "..." }` alongside slide data
- **REQ-005**: Frontend state `generatorState.js` must have `caption: ''` (flat string) at top level
- **REQ-006**: Frontend state `resetSlides()` must reset `caption` to `''`
- **REQ-007**: HTML must have Caption tab button after Slide 5 in `.slide-nav`
- **REQ-008**: HTML must have Caption form panel after Slide 5 `.form-panel`
- **REQ-009**: Caption textarea must have `id="caption-text"` and `data-slide="caption"` but no `data-key`
- **REQ-010**: `switchSlide` must use `String(slideNum) === tab.dataset.slide` (not `parseInt`) to support `"caption"` string
- **REQ-011**: `bindInputs` must bind caption textarea by `id` to `state.caption`
- **REQ-012**: `generator.js` click handlers must convert numeric slide strings to `parseInt` but pass `"caption"` as-is
- **REQ-013**: `renderPreview` must render `state.caption` as plain text with `<br>` for `\n` when `activeSlide === 'caption'`
- **REQ-014**: Preview title must show "Caption" when caption tab is active
- **REQ-015**: `handleCopy` must copy `state.caption` directly (not `compilePlainText`) when caption tab is active
- **REQ-016**: `handleCopy` toast must say "Caption copied!" when caption tab is active
- **REQ-017**: `handleReset` must clear `caption` textarea value
- **REQ-018**: `applyAutoFill` must unwrap `_lastAutoFillData.caption?.TEXT || ''` into `state.caption`
- **REQ-019**: Schema test must validate `caption` and `caption.TEXT` exist
- **REQ-020**: Schema test must verify `normalizeOutput` trims `caption.TEXT`
- **CON-001**: Caption is part of existing `/api/auto-fill` response — no separate endpoint
- **CON-002**: No `data-key` attribute on caption textarea — bound by `id` instead
- **CON-003**: `state.activeSlide` must remain numeric (1-5) for slides and `'caption'` for caption tab
- **PAT-001**: Follow existing ES module pattern (`'use strict'`, `export function`)
- **PAT-002**: Follow existing file structure: server logic in `server/ai/`, frontend in `public/js/`, tests in `tests/`
- **PAT-003**: Follow existing commit message convention: `"feat: ..."` for features, `"test: ..."` for tests

## 2. Implementation Steps

### Implementation Phase 1: Backend

- GOAL-001: Add caption field to AI schema and prompt instructions so the LLM generates caption alongside slide fields

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Add `caption: { TEXT: '' }` to SCHEMA in `server/ai/schema.js:55` after `slide5` block | | |
| TASK-002 | Run `npm test` to confirm existing tests pass | | |
| TASK-003 | Commit: `git add server/ai/schema.js && git commit -m "feat: add caption field to AI schema"` | | |
| TASK-004 | Add rule 8 to system prompt in `server/ai/promptBuilder.js:11-26` after rule 7: `// 8. Generate a storytelling Instagram caption under caption.TEXT. Describe the project in a professional storytelling tone (100-200 words). Use \\n for line breaks. The caption must be a single string.` | | |
| TASK-005 | Run `npm test` to confirm tests pass | | |
| TASK-006 | Commit: `git add server/ai/promptBuilder.js && git commit -m "feat: add caption generation instruction to AI prompt"` | | |

### Implementation Phase 2: Frontend State & HTML

- GOAL-002: Add caption to frontend state and create Caption tab UI

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-007 | Add `caption: ''` to STATE object in `public/js/generatorState.js:14` | | |
| TASK-008 | Update `resetSlides()` in `public/js/generatorState.js:48-53` to set `state.caption = ''` | | |
| TASK-009 | Commit: `git add public/js/generatorState.js && git commit -m "feat: add caption field to state with reset"` | | |
| TASK-010 | Add Caption tab `<button class="slide-tab" role="tab" data-slide="caption" aria-selected="false" tabindex="-1" id="tab-caption">Caption</button>` after Slide 5 button in `public/app.html:96` | | |
| TASK-011 | Add Caption form panel `<div class="form-panel" data-slide="caption" role="tabpanel" aria-labelledby="tab-caption">` with section header, badge, h2, p, textarea `id="caption-text" data-slide="caption" rows="8" placeholder="Auto-filled by AI..."` after Slide 5 form panel at `public/app.html:522` | | |
| TASK-012 | Commit: `git add public/app.html && git commit -m "feat: add Caption tab and form panel to HTML"` | | |

### Implementation Phase 3: Slide Switching & Bindings

- GOAL-003: Update slide switching logic and input bindings to support Caption tab

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-013 | Update `switchSlide()` in `public/js/generatorBindings.js:7-22`: replace `parseInt(tab.dataset.slide) === slideNum` with `String(slideNum) === tab.dataset.slide` and same for panel | | |
| TASK-014 | Update `bindInputs()` in `public/js/generatorBindings.js:24-41`: add special case for `document.getElementById('caption-text')` to bind `state.caption` and trigger `renderPreview()` when `state.activeSlide === 'caption'` | | |
| TASK-015 | Update `generator.js:98-114` click/keydown handlers: replace `parseInt(tab.dataset.slide)` with `raw === 'caption' ? 'caption' : parseInt(raw)` | | |
| TASK-016 | Commit: `git add public/js/generatorBindings.js public/js/generator.js && git commit -m "feat: handle caption tab in slide switching and bindings"` | | |

### Implementation Phase 4: Preview, Copy & Reset

- GOAL-004: Update preview rendering, clipboard copy, and reset to handle caption mode

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-017 | Update `renderPreview()` in `public/js/generatorRender.js:9-17`: add `if (state.activeSlide === 'caption')` block that renders `state.caption` with `<br>` for `\n`, shows char count, sets title to "Caption", and returns early | | |
| TASK-018 | Update `handleCopy()` in `public/js/generatorClipboard.js:7-26`: add `if (state.activeSlide === 'caption')` to copy `state.caption` directly, show "Caption copied!" toast, add `'caption'` to history | | |
| TASK-019 | Update `handleReset()` in `public/js/generatorClipboard.js:28-42`: add code to clear `document.getElementById('caption-text').value` | | |
| TASK-020 | Commit: `git add public/js/generatorRender.js public/js/generatorClipboard.js && git commit -m "feat: render caption as plain text in preview and handle clipboard"` | | |

### Implementation Phase 5: Auto-Fill Wiring

- GOAL-005: Wire the AI Auto-Fill response to populate the caption textarea

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-021 | Update `applyAutoFill()` in `public/js/autoFill.js:230-252`: after the slide loop, add `state.caption = _lastAutoFillData.caption?.TEXT || '';` and `document.getElementById('caption-text').value = state.caption;` | | |
| TASK-022 | Update toast message to say "AI Auto-Fill applied to all 5 slides + caption!" | | |
| TASK-023 | Commit: `git add public/js/autoFill.js && git commit -m "feat: wire auto-fill to populate caption field"` | | |

### Implementation Phase 6: Tests

- GOAL-006: Add test coverage for caption field in schema tests

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-024 | Add Test 9 in `tests/autoFillSchema.test.js` (after line 74): assert `SCHEMA.caption` and `SCHEMA.caption.TEXT` exist | | |
| TASK-025 | Add Test 10: create `mockWithCaption` with `caption: { TEXT: '  A great storytelling caption...  ' }`, call `normalizeOutput`, assert `caption.TEXT` equals trimmed value | | |
| TASK-026 | Run `npm test` — expected: all tests pass | | |
| TASK-027 | Commit: `git add tests/autoFillSchema.test.js && git commit -m "test: add caption field validation to schema tests"` | | |

## 3. Alternatives

- **ALT-001**: Separate `/api/auto-caption` endpoint — rejected because it adds backend complexity and the caption is semantically part of the same extraction task
- **ALT-002**: Caption displayed inside existing Auto-Fill modal result panel — rejected because user requested a dedicated tab in slide navigation
- **ALT-003**: Store caption as `caption: { TEXT: '' }` in frontend state (same shape as backend) — rejected because a flat string is simpler for textarea binding

## 4. Dependencies

- **DEP-001**: Existing `server/ai/promptBuilder.js` normalizeOutput must remain backward-compatible
- **DEP-002**: Existing `tests/autoFillSchema.test.js` must continue passing after changes
- **DEP-003**: Existing `POST /api/auto-fill` response shape must not break frontend `autoFill.js`

## 5. Files

| File | Change | Phase |
|------|--------|-------|
| `server/ai/schema.js` | Add `caption: { TEXT: '' }` to SCHEMA | Phase 1 |
| `server/ai/promptBuilder.js` | Add rule 8 to system prompt | Phase 1 |
| `public/js/generatorState.js` | Add `caption: ''` to STATE, update `resetSlides()` | Phase 2 |
| `public/app.html` | Add Caption tab button + Caption form panel | Phase 2 |
| `public/js/generatorBindings.js` | Update `switchSlide()`, `bindInputs()` | Phase 3 |
| `public/js/generator.js` | Update click/keydown handlers | Phase 3 |
| `public/js/generatorRender.js` | Add caption mode to `renderPreview()` | Phase 4 |
| `public/js/generatorClipboard.js` | Update `handleCopy()`, `handleReset()` | Phase 4 |
| `public/js/autoFill.js` | Update `applyAutoFill()` to populate caption | Phase 5 |
| `tests/autoFillSchema.test.js` | Add caption field validation tests | Phase 6 |

## 6. Testing

- **TEST-001**: `autoFillSchema.test.js` — verify SCHEMA has `caption.TEXT` key
- **TEST-002**: `autoFillSchema.test.js` — verify `normalizeOutput` preserves and trims `caption.TEXT`
- **TEST-003**: Manual — open app, navigate to Caption tab, verify UI renders
- **TEST-004**: Manual — run AI Auto-Fill with a brief, verify caption appears in Caption tab textarea
- **TEST-005**: Manual — verify Copy button copies caption text when Caption tab is active
- **TEST-006**: Manual — verify Reset clears caption textarea
- **TEST-007**: Manual — verify slide tabs 1-5 still work normally

## 7. Risks & Assumptions

- **RISK-001**: If the LLM returns an empty `caption.TEXT`, the caption will be empty string — handled gracefully but user may expect content
- **RISK-002**: Changing `switchSlide` from `parseInt` to `String` comparison may affect other code relying on `state.activeSlide` being strictly a number — mitigated by ensuring click handlers still pass numbers for slides 1-5
- **ASSUMPTION-001**: The LLM (Gemini/Groq) will follow the caption instruction and return valid `caption.TEXT` in the JSON response
- **ASSUMPTION-002**: Existing `normalizeOutput` loop with `typeof raw[slideKey] === 'object'` correctly handles `{ TEXT: '' }` objects
- **ASSUMPTION-003**: Coverage calculation in `server/routes/autoFill.js` works correctly with `caption.TEXT` treated as one field

## 8. Related Specifications / Further Reading

- [Design Spec: Auto Caption](plan/2026-06-01-auto-caption-design.md)
- [Existing PRD](PRD.md)
- [AI Auto-Fill Flow Report](report/ai-generate-flow-report.md)
