# History Skeleton Loader Design

## Goal

Show a loading skeleton on `public/riwayat.html` while Prompt History is still loading, so users do not see an empty history area before JavaScript renders real content.

## Context

Visura is an HTML/CSS/JavaScript app. The History page uses `public/riwayat.html`, `public/js/riwayat.js`, and shared styles in `public/css/styles.css`. History data is loaded from localStorage through `loadHistory()` and then rendered into `#history-list` by `renderHistory()`.

Recent work added a profile-name loading skeleton, so the implementation should reuse that visual direction: subtle dark shimmer, rounded shapes, and no disruptive layout shift.

## Chosen Approach

Use static skeleton markup inside `#history-list` in `public/riwayat.html`. This gives the fastest first paint because skeleton cards are visible before `riwayat.js` runs. When `DOMContentLoaded` fires, `riwayat.js` loads history and `renderHistory()` replaces the skeleton with real cards, empty state, or search results.

## UI Design

Display exactly 4 skeleton cards.

Each skeleton card is a compact non-interactive loading card. It should contain:

- One title-width shimmer line
- Three prompt-text shimmer lines
- One short footer-width shimmer line for visual balance

The skeleton uses the existing history grid layout, so it stays responsive with current `.history-list` behavior. Styling should match current dark card surfaces and the existing shimmer feel from `.profile-name-loading`.

## Components and Boundaries

- `public/riwayat.html`: owns initial static placeholder markup only.
- `public/js/riwayat.js`: keeps existing data and render flow. No new async model required.
- `public/css/styles.css`: owns skeleton visuals and shimmer animation.

No new dependencies, routes, storage keys, or API calls.

## Data Flow

1. Browser parses `riwayat.html`.
2. `#history-list` initially shows 4 skeleton cards.
3. `riwayat.js` runs on `DOMContentLoaded`.
4. Settings and history load from localStorage.
5. `renderHistory()` replaces `#history-list.innerHTML` with:
   - history cards when records exist,
   - empty state when history is empty,
   - no-results state when search has no match.

## Error Handling

No special error path is needed for the skeleton. If history loading returns an empty array, the existing empty state replaces the skeleton. If `#history-list` is missing, `renderHistory()` already exits safely.

## Testing

Manual checks:

- Open `/riwayat` and confirm 4 skeleton cards show before render.
- Confirm skeleton is replaced by real history cards when history exists.
- Confirm skeleton is replaced by empty state when no history exists.
- Confirm search, delete, and copy behavior remain unchanged after render.
- Confirm responsive grid still looks acceptable on desktop and mobile.

Automated checks:

- Run existing test command if relevant: `npm test`.
- Run lint/typecheck if available in project scripts.

## Scope

In scope: Prompt History initial loading skeleton only.

Out of scope: skeletons for search filtering, Prompt Manager, Generator, settings, backend loading states, or changing localStorage history behavior.
