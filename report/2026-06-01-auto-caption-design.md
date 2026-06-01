# Auto Caption — Design Spec

## Overview

Add a **Caption** tab to the slide navigation bar (after Slide 5). When the user runs AI Auto-Fill, the response includes a `caption` field — a storytelling Instagram caption describing the project. The caption is displayed in a textarea within the new Caption panel and can be edited, copied, or regenerated.

## Approach

**Approach 1 (chosen):** Caption is part of the existing `/api/auto-fill` response. No separate endpoint. The backend adds a `caption` field to the response schema; `promptBuilder` instructs the AI to generate a caption; the frontend stores it in state and binds it to a new Caption form panel.

## Data Model

### Backend `schema.js`
```js
const SCHEMA = {
  slide1: { ... },
  slide2: { ... },
  slide3: { ... },
  slide4: { ... },
  slide5: { ... },
  caption: { TEXT: '' }    // NEW — nested object for compatibility with existing iterate-slides logic
};
```

### Backend response (`POST /api/auto-fill`)
```json
{
  "data": {
    "slide1": { ... },
    "slide5": { ... },
    "caption": { "TEXT": "Storytelling Instagram caption..." }
  },
  "coverage": 85,
  "emptyFields": [...]
}
```

### Frontend state (`generatorState.js`)
```js
export const STATE = {
  activeSlide: 1,
  caption: '',    // NEW — top-level alongside slides
  slides: { ... }
};
```

## normalizeOutput Changes

`normalizeOutput()` in `promptBuilder.js` iterates `Object.keys(SCHEMA)` and checks `typeof raw[slideKey] === 'object'`. Since `caption` is now `{ TEXT: '' }` (an object), it's handled by the same loop — no special-case logic needed.

## Prompt Changes

In `promptBuilder.js`, update the JSON SCHEMA print to reflect the new `caption.TEXT` field. Add to the system prompt (rule 8):
> "8. In addition to filling the slide fields, write a compelling storytelling Instagram caption under `caption.TEXT`. The caption should describe the project in a professional storytelling tone (100–200 words). Use \\n for line breaks."

## UI Changes

### Slide navigation (`app.html`)
Add a new tab after Slide 5:
```html
<button class="slide-tab" role="tab" data-slide="caption" ...>Caption</button>
```

### Form panel (`app.html`)
New form panel for the caption:
```html
<div class="form-panel" data-slide="caption" role="tabpanel">
  <div class="form-section-header">
    <div class="form-slide-badge">Instagram Caption</div>
    <h2>Caption</h2>
    <p>Storytelling caption for the Instagram carousel post.</p>
  </div>
  <div class="field">
    <label class="field-label">Caption Text</label>
    <textarea id="caption-text" data-key="CAPTION" rows="8"
      placeholder="Auto-filled by AI..."></textarea>
  </div>
</div>
```

### Preview column
When the Caption tab is active, the preview panel displays the caption text directly (not a compiled prompt template). The preview header shows "Caption" instead of "Slide N Prompt".

## State & Binding

- `generatorState.js`: add `caption: ''` (string) to state.

- `generatorBindings.js`:
  - `switchSlide()` — `state.activeSlide` becomes `string | number` (e.g., `'caption'`). Compare tab/panel `dataset.slide` directly (do NOT `parseInt`), since `'caption'` would become `NaN`. Use `String(slideNum) === panel.dataset.slide`.
  - `bindInputs()` — add special handling: if `el.id === 'caption-text'`, bind to `state.caption` instead of `state.slides[id]`.

- `generatorRender.js`: when `state.activeSlide === 'caption'`, render `state.caption` as plain text with line breaks preserved (use `<br>` for `\n`).

- `autoFill.js` `applyAutoFill()` — after populating slides, populate caption:
  ```js
  state.caption = _lastAutoFillData.caption?.TEXT || '';
  document.getElementById('caption-text').value = state.caption;
  ```

## Copy Behavior

The existing Copy button in the preview column copies the preview content. When the Caption tab is active, Copy copies the caption text. A toast shows "Caption copied!".

## Error Handling

- Empty caption: AI may return empty string. Textarea stays blank, preview shows nothing.
- Regeneration: pressing Regenerate in the Auto-Fill modal re-runs the full extraction (slides + caption). The caption is overwritten.
- Reset: the existing Reset button clears caption to `''`.

## Edge Cases

1. **User edits caption manually** — after AI fill, the textarea is editable. Manual edits are not preserved on regenerate (overwritten).
2. **Coverage calculation** — caption is a single field. Existing coverage logic treats it as one field. `emptyFields` includes `caption` if empty.
3. **Slide 5 vs Caption** — separate tabs. No coupling beyond navigation order.

## Files Changed

| File | Change |
|---|---|
| `server/ai/schema.js` | Add `caption: { TEXT: '' }` to SCHEMA |
| `server/ai/promptBuilder.js` | Add rule 8 for caption generation (TEXT field); update `normalizeOutput` (works automatically since caption is now an object) |
| `server/routes/autoFill.js` | Coverage loop handles caption.TEXT like any other slide field (no change needed) |
| `public/app.html` | Add Caption tab button + Caption form panel + caption textarea |
| `public/js/generatorState.js` | Add `caption: ''` (string) to STATE |
| `public/js/generatorBindings.js` | `switchSlide` — stop using `parseInt` (use `String` comparison). `bindInputs` — add special case for caption textarea. |
| `public/js/generatorRender.js` | Render `state.caption` as plain text when `activeSlide === 'caption'` |
| `public/js/autoFill.js` | `applyAutoFill()` — unwrap `data.caption.TEXT` into `state.caption` |
| `public/css/styles.css` | (If needed) style for caption panel — minimal, reuses existing field styles |

## Testing

- Auto-fill response includes `caption` string when a brief is provided.
- Caption appears in the Caption tab textarea after Apply is clicked.
- Preview shows caption text when Caption tab is active.
- Coverage correctly counts caption as one field.
