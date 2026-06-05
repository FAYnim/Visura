# Preview Loader Design

## Context

On `public/app.html`, the prompt preview panel starts empty while the generator JavaScript loads state from browser storage and renders the first prompt. The delay is short, but the empty box feels visually abrupt when content appears suddenly.

## Goal

Add a small loading state to the right-side prompt preview panel so first paint feels intentional. The loader should only cover the initial preview render, not normal slide switching.

## Chosen Approach

Use an HTML-first loader inside the existing preview panel.

- Add loader markup directly in `public/app.html` as a sibling of `#preview-output`.
- Start `.preview-panel` with an `is-loading` class.
- Add CSS for a centered spinner and short loading label.
- Update `public/js/generator.js` to hide the loader after the initial render completes and at least 320ms have elapsed.

This approach makes the loader visible before JavaScript finishes loading, which solves the empty-box flash more reliably than injecting the loader from JavaScript.

## UI Behavior

1. Browser paints the preview panel with a centered spinner and `Loading prompt...` text.
2. `DOMContentLoaded` starts generator initialization.
3. Settings, history, and prompt batches load from browser storage.
4. Inputs, tabs, auto-fill, caption generation, copy, and reset handlers initialize.
5. The first slide renders with `switchSlideBase({ slideNum: 1 })`.
6. The loader remains visible until both conditions are true:
   - first render has completed or failed safely;
   - at least 320ms have elapsed since initialization started.
7. The loader fades out and `#preview-output` fades in.

## Components

### `public/app.html`

Add:

- `is-loading` class to `.preview-panel`.
- `#preview-loader` element with `role="status"` and concise loading text.

Keep `#preview-output` in place so existing JavaScript bindings stay unchanged.

### `public/css/styles.css`

Add styles for:

- `.preview-panel.is-loading`
- `.preview-loader`
- `.preview-loader-spinner`
- loading/ready opacity transitions for `#preview-output`

Style direction: centered spinner, subtle dark premium look, consistent with existing UI. No full-screen overlay.

### `public/js/generator.js`

Add DOM reference for `previewLoader` and helper to end initial preview loading.

Implementation shape:

- capture `const previewLoadingStartedAt = performance.now()` near init start;
- render initial slide inside `try/finally`;
- in `finally`, wait `Math.max(0, 320 - elapsed)` before removing loading class;
- if loader element is missing, no-op.

## Error Handling

- Missing `#preview-loader`: app still works.
- Initial render error: loader still stops after minimum delay using `finally`; error behavior should not create permanent stuck loading state.
- Existing copy/reset/slide switching behavior stays unchanged.

## Out of Scope

- Loader for every slide switch.
- Loader for AI Auto-Fill modal.
- Loader for form inputs.
- Full-page app loading screen.
- Changing localStorage structure or prompt render logic.

## Testing

Manual checks:

1. Hard refresh `/app`.
2. Preview panel shows spinner immediately.
3. After about 320ms, prompt text appears.
4. Switching slides works normally without re-showing initial loader.
5. Copy button still copies current slide prompt.
6. Reset still clears inputs and refreshes preview.
7. Mobile layout does not overflow or hide preview actions.

## Approval

User approved:

- Scope: preview panel only.
- Style: centered spinner.
- Timing: minimum 320ms loading state.
