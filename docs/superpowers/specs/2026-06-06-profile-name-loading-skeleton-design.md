# Profile Name Loading Skeleton Design

## Goal
Prevent the sidebar profile name in `public/app.html` from flashing the placeholder text `John Doe` while the creator name is loading from localStorage.

## Scope
This change affects only the sidebar profile widget on the app page. It does not change settings storage, creator-name editing, or other pages unless they already reuse the same `updateProfileWidget()` behavior.

## Approach
Use a small skeleton shimmer for `.profile-name` during initial page load. The HTML starts in a loading state. When `generator.js` loads settings and calls `updateProfileWidget(settings)`, the widget replaces the skeleton with the creator name and removes the loading state.

## Components

### `public/app.html`
- Replace the static `John Doe` text inside `.profile-name` with an empty loading state.
- Add a loading class such as `profile-name-loading` so CSS can render a skeleton.
- Keep the element accessible with an `aria-label` that describes the loading state.

### `public/css/styles.css`
- Add a skeleton/shimmer style for `.profile-name-loading`.
- Keep the skeleton compact, aligned with the current sidebar profile layout, and visually consistent with the app theme.

### `public/js/common.js`
- Update `updateProfileWidget(settings)` so it always removes the loading class after resolving the name.
- Continue using `settings.CREATOR_NAME?.trim() || 'John Doe'` as the final display value.
- Keep existing `.profile-title` behavior unchanged.

## Data Flow
1. Browser renders sidebar profile name as a skeleton.
2. `public/js/generator.js` runs on `DOMContentLoaded`.
3. Settings load from localStorage through `loadSettings(SETTINGS_DEFAULTS)`.
4. `updateProfileWidget(STATE.settings)` sets the final profile name.
5. Loading class is removed, hiding the skeleton state.

## Error Handling
If localStorage read fails or `CREATOR_NAME` is empty, `loadSettings()` returns defaults and `updateProfileWidget()` displays `John Doe`. The loading class is still removed so the UI never remains stuck in skeleton mode.

## Testing
Manual test `/app` reload:
- During initial load, profile name shows skeleton/shimmer instead of `John Doe`.
- After JavaScript initializes, creator name from localStorage appears.
- If no creator name exists, `John Doe` appears after initialization.
- No layout shift or sidebar visual break occurs.

## Non-Goals
- No changes to localStorage key names.
- No changes to settings page forms.
- No inline prefill script in `app.html`.
- No broader sidebar refactor.
