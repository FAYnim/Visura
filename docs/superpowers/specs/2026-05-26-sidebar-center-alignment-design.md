# Sidebar Center Alignment + Remove Collapse

## Summary
Center-align sidebar menu text in normal state and remove the unused collapse feature to prevent conflicting styles.

## Goals
- Sidebar menu items are centered (text alignment and content alignment).
- Collapse functionality is полностью removed (UI control, JS state, and CSS rules).
- No layout regressions in normal desktop and mobile views.

## Non-Goals
- Redesigning colors, typography, or iconography beyond alignment.
- Reintroducing any collapse behavior.

## Current Issues
- Alignment appears inconsistent because multiple sidebar style blocks and collapse overrides conflict.
- Collapse styles remain in CSS/JS even though the feature is no longer needed.

## Proposed Design
### UI
- `.sidebar-btn` uses centered alignment (`justify-content: center; text-align: center;`).
- Keep existing spacing/padding unless it breaks centering; adjust minimally if necessary.

### Behavior
- Remove collapse feature entirely: no toggle button, no localStorage state, no `.collapsed` class toggling.

### Files & Changes
- **styles.css**
  - Remove `.app-sidebar.collapsed` modifier rules and related collapsed overrides.
  - Ensure `.sidebar-btn` alignment is centered in normal styles.
- **common.js**
  - Remove sidebar collapse state, localStorage key usage, and event listeners.
- **index.html / riwayat.html / settings.html**
  - Remove collapse toggle button markup if present.

## Data Flow
- No state persisted for sidebar collapse.

## Error Handling
- Not applicable (no JS behavior for sidebar collapse).

## Testing
- Visual check on desktop: sidebar text centered, buttons still full-width.
- Resize to mobile: sidebar still renders correctly without collapse logic.

## Risks
- Removing collapse selectors must not delete unrelated sidebar styling blocks. Ensure only collapse-specific rules are removed.

## Rollout
- Single change-set. No feature flags.
