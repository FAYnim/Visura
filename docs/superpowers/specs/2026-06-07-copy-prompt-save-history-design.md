# Copy Prompt and Save to History Design

## Goal
Separate clipboard copy from history persistence in the Prompt Generator.

## Current Context
The generator page has preview actions in `public/app.html`: AI Auto-Fill, Copy, Reset. Existing JavaScript already loads and saves history through `public/js/generator.js`, `public/js/generatorClipboard.js`, `public/js/generatorHistory.js`, and `public/js/common.js`. The History page reads the same localStorage-backed history store.

## Selected Approach
Use separate actions:

- `Copy`: copy only the active preview text to the clipboard.
- `Save`: save the active preview text to History.
- `Reset`: unchanged.

This keeps user intent clear and avoids saving every copied prompt automatically.

## UI Design
The preview header actions become:

`AI Auto-Fill | Copy | Save | Reset`

`Save` should use the same visual button style as `Copy` and `Reset` unless existing CSS indicates a more suitable secondary action style. It should include an accessible label such as “Save current slide prompt to history”.

## Behavior
- Copy reads the current preview output and writes it to `navigator.clipboard` only.
- Save reads the same current preview output and passes it to the existing history-saving flow.
- Empty prompt/caption content should not be copied or saved; show the existing empty-state toast behavior if available.
- Success toasts must distinguish the actions: copied vs saved.
- Caption tab follows the same active preview behavior as slides.

## Components and Data Flow
- `public/app.html`: add `btn-save` beside `btn-copy`.
- `public/js/generator.js`: bind the new Save button and keep Copy bound to clipboard-only behavior.
- `public/js/generatorClipboard.js`: ensure copy logic no longer triggers history persistence.
- `public/js/generatorHistory.js`: reuse existing `addToHistory` for Save.
- `public/js/common.js`: unchanged storage layer.

Flow:

1. User edits a slide or caption.
2. Preview renders active prompt text.
3. User clicks Copy → clipboard only.
4. User clicks Save → History localStorage update only.
5. History page displays saved item using existing logic.

## Error Handling
- Clipboard failure: show copy failure toast.
- Empty content: do not copy/save; show a clear toast.
- localStorage failure: preserve existing storage error behavior and show a save failure toast if the current modules support it.

## Testing
- Unit or DOM test for Copy not adding to History.
- Unit or DOM test for Save adding the active prompt to History.
- Manual smoke test: fill a slide, Copy, verify History unchanged; Save, verify History page includes the prompt.
- Run available project test/lint/typecheck commands from `package.json`.

## Scope
In scope:
- Generator preview actions only.
- Current active slide/caption only.
- History as Save destination.

Out of scope:
- Saving to Prompt Manager.
- Saving all slides at once.
- Duplicate prevention unless already implemented by existing history logic.
