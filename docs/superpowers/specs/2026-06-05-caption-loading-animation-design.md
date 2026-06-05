# Caption Loading Animation Design

## Goal

Improve Generate Caption loading UX. Replace boring progress bar/modal wait with inline loading inside the caption output area. The modal closes after validation passes, then the output area shows a skeleton loader until generation finishes.

## Scope

In scope:
- Generate Caption frontend behavior.
- Caption output loading, success, and error states.
- CSS for skeleton/shimmer and rotating status text.

Out of scope:
- Backend caption generation logic.
- Auto-Fill behavior.
- New API contracts.
- Caption prompt changes.

## Chosen Approach

Use an inline output state machine in `public/js/captionGenerate.js`.

States:
- `idle`: current normal state.
- `loading`: output area is replaced by skeleton loader and status text.
- `success`: output area is replaced by generated caption.
- `error`: output area is emptied and toast error is shown.

This keeps changes focused in the Generate Caption module and avoids a shared abstraction before another feature needs it.

## User Flow

1. User opens Generate Caption modal and submits generation.
2. Existing validation runs first.
3. If validation fails, modal stays open and current validation feedback remains visible.
4. If validation passes, modal closes immediately before the API request starts.
5. Caption output div replaces all previous content with skeleton loading UI.
6. Small status text rotates through short messages:
   - `Membaca slide...`
   - `Merangkai hook...`
   - `Menyiapkan caption terbaik...`
7. On success, output div displays the generated caption.
8. On failure, output div is emptied and existing toast/error feedback displays the error.

## UI Design

The loader appears inside the caption output container, replacing the whole content. It is not an overlay and does not keep old caption text visible.

Visual direction:
- 3–4 rounded skeleton bars.
- Subtle shimmer animation.
- Small rotating status text.
- No percentage.
- No progress bar.

The loading state should feel calm and familiar, not flashy.

## Component and File Changes

Expected files:
- `public/js/captionGenerate.js`
  - Add loading state helper.
  - Add rotating message interval management.
  - Close modal only after validation passes.
  - Render skeleton while `fetch('/generate-caption')` runs.
  - Clear loader interval on success, error, and completion.
  - Empty output area on error and show toast.
- `public/css/styles.css`
  - Add skeleton loader styles.
  - Add shimmer keyframes.
  - Add caption loading status style.

Avoid large `public/app.html` changes unless existing markup lacks a stable output target.

## Error Handling

On API or network failure:
- Stop rotating status interval.
- Remove loading skeleton.
- Empty caption output div.
- Show existing toast/error message.

This follows the selected behavior: output empty plus toast only.

## Testing

Manual checks:
- Valid generate: modal closes, skeleton appears in output div, generated caption replaces skeleton.
- Invalid input/file: modal stays open and no skeleton appears.
- API failure: skeleton disappears, output becomes empty, toast shows error.
- Repeated generation: status interval does not duplicate or continue after completion.
- Existing Generate Caption success path still writes caption correctly.

Automated tests are not required unless frontend test infrastructure already exists for this module.

## Approval Notes

Approved decisions:
- Use Caption Skeleton visual direction.
- Skeleton replaces whole output content.
- Modal closes after validation succeeds and before request starts.
- Failure empties output and uses toast error only.
- Rotating status messages are included.
