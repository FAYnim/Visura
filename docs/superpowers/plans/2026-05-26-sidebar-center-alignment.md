# Sidebar Center Alignment Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Center-align sidebar menu text and remove all collapse functionality to stabilize the layout.

**Architecture:** Remove collapse UI/state (HTML + JS + CSS modifiers) and ensure sidebar buttons are centered in normal styles. Keep existing sidebar structure and spacing, adjusting only alignment rules.

**Tech Stack:** HTML, CSS, vanilla JS

---

## File Structure
- Modify: `styles.css` — remove `.app-sidebar.collapsed` rules and set `.sidebar-btn` to centered alignment in normal styles.
- Modify: `common.js` — remove collapse state, localStorage key, and toggle event logic.
- Modify: `index.html` — remove collapse toggle button markup in sidebar (if present).
- Modify: `riwayat.html` — remove collapse toggle button markup in sidebar (if present).
- Modify: `settings.html` — remove collapse toggle button markup in sidebar (if present).

### Task 1: Remove collapse UI from HTML

**Files:**
- Modify: `index.html`
- Modify: `riwayat.html`
- Modify: `settings.html`

- [ ] **Step 1: Locate collapse toggle markup**
  - Find sidebar header row / toggle button (e.g., `.sidebar-header-row`, `.sidebar-toggle-btn`).

- [ ] **Step 2: Remove the toggle markup**
  - Delete the sidebar header row or toggle button block from each HTML file if present.

- [ ] **Step 3: Visual check**
  - Open pages and confirm sidebar renders without a collapse button.

- [ ] **Step 4: Commit**

```bash
git add index.html riwayat.html settings.html
git commit -m "chore: remove sidebar collapse toggle markup"
```

### Task 2: Remove collapse behavior from JS

**Files:**
- Modify: `common.js`

- [ ] **Step 1: Remove collapse storage key and state**
  - Delete the `SIDEBAR` key and any `sidebarCollapsed` logic.

- [ ] **Step 2: Remove event listeners and class toggles**
  - Remove code that toggles `.collapsed` on `.app-sidebar`.

- [ ] **Step 3: Quick smoke check**
  - Reload pages; ensure no console errors related to missing elements.

- [ ] **Step 4: Commit**

```bash
git add common.js
git commit -m "chore: remove sidebar collapse logic"
```

### Task 3: Center-align sidebar buttons and delete collapse CSS

**Files:**
- Modify: `styles.css`

- [ ] **Step 1: Center align normal sidebar buttons**
  - Update the base `.sidebar-btn` rules to use:

```css
justify-content: center;
text-align: center;
```

- [ ] **Step 2: Remove `.app-sidebar.collapsed` rules**
  - Delete all collapsed modifier blocks and related overrides.

- [ ] **Step 3: Visual check**
  - Confirm sidebar items are centered and spacing looks consistent.

- [ ] **Step 4: Commit**

```bash
git add styles.css
git commit -m "style: center sidebar items and remove collapse styles"
```

### Task 4: Full verification

**Files:**
- N/A

- [ ] **Step 1: Manual verification**
  - Open `index.html`, `riwayat.html`, `settings.html` and verify:
    - Sidebar items are centered.
    - No collapse button or collapsed state exists.
    - No layout regressions in normal view.

- [ ] **Step 2: Commit (if any tweaks)**

```bash
git add -A
git commit -m "chore: verify sidebar alignment" || true
```
