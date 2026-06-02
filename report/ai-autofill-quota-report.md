# AI Auto-Fill Quota System Flow Report

Generated: 2026-06-01

## Overview
- **Visura** now enforces a client-side daily quota of **3 free requests/day** for the AI Auto-Fill feature when using the shared **Developer API Key**.
- Users who configure their own API keys via the **BYOK (Bring Your Own Key)** settings page are completely exempted from this restriction, experiencing zero quota limits and hidden quota indicators.
- The quota tracking is entirely self-contained client-side using `localStorage` (key: `visura.aiQuota`), preventing unnecessary backend database setup while maintaining daily usage metrics resolved against the user's local system clock.
- Counts are incremented **before** making the LLM request (at click-time), ensuring all attempts count regardless of server success or network failures per core specification (REQ-003).

---

## Flow Diagrams

### 1. Quota Initialization & Reset Flow (`loadQuota`)
When the Auto-Fill modal opens or a model selection changes, the system determines the remaining quota by verifying storage records against the local clock.

```mermaid
graph TD
    A[loadQuota() Invoked] --> B[Retrieve Local clock: today's date YYYY-MM-DD]
    B --> C{Does localStorage key 'visura.aiQuota' exist?}
    
    C -- No --> D[Create fresh record: count = 0, date = today]
    C -- Yes --> E[Attempt JSON Parse]
    
    E -- Parse Error / Corrupt --> D
    E -- Parse Success --> F{Does record.date == today's date?}
    
    F -- No (Stale Date / Day changed) --> D
    F -- Yes (Current Day) --> G[Use existing record: return count]
    
    D --> H[Persist new record to localStorage]
    G --> I[Return active quota state]
    H --> I
```

### 2. Auto-Fill Request & Quota Validation Flow (`runAutoFill`)
When the user clicks the "Extract with AI" button, the system checks whether the request utilizes a developer key or a personal BYOK key, then validates or increments the quota.

```mermaid
graph TD
    A[User clicks 'Extract with AI'] --> B{Is Selected Model BYOK-enabled?}
    
    B -- Yes (BYOK Active) --> C[Bypass Quota System]
    C --> D[Retrieve decrypted key client-side]
    D --> E[Append byokKey to FormData POST payload]
    E --> F[POST /api/auto-fill]
    
    B -- No (Developer Key) --> G{Is getRemainingQuota() > 0?}
    
    G -- No (Exhausted) --> H[Show validation error: Quota exhausted]
    H --> I[Update UI state: disable Extract button]
    
    G -- Yes (Available) --> J[Increment quota count in localStorage]
    J --> K[Update Quota UI immediately: count decremented]
    K --> L[POST /api/auto-fill with Developer Key]
```

### 3. Visual Quota UI State Machine
The quota banner dynamically transitions through three distinct visual states based on the count of remaining requests.

```
[BYOK Model Selected] ─────────────► (Hidden State)
                                      • Element hidden (display: none)
                                      • Button always enabled

[Developer Model Selected] ────────► (Info State) ──[1 request left]──► (Warning State) ──[0 requests left]──► (Exhausted State)
                                      • Cyan styling                    • Amber styling                    • Red styling
                                      • Icon: Hourglass-half            • Icon: Hourglass-half             • Icon: Ban
                                      • Button enabled                  • Button enabled                   • Button disabled
```

---

## Technical Architecture & Files

The quota system is implemented cleanly using modular JS components, pure-CSS visual states, and structured HTML hooks:

- **Quota Helper Module ([public/js/autoFillQuota.js](file:///c:/xampp/htdocs/faydev/visura/public/js/autoFillQuota.js))**:
  - Encapsulates low-level `localStorage` read/write operations under the key `visura.aiQuota`.
  - Implements local clock mapping to generate date-stamp keys (`YYYY-MM-DD`).
  - Provides helper methods: `loadQuota()`, `incrementQuota()`, `getRemainingQuota()`, `hasQuotaRemaining()`, and `resetQuota()`.
- **Auto-Fill Controller ([public/js/autoFill.js](file:///c:/xampp/htdocs/faydev/visura/public/js/autoFill.js))**:
  - Imports the quota helpers and updates UI dynamically.
  - Implements `isByokProvider()` in [L62-L68](file:///c:/xampp/htdocs/faydev/visura/public/js/autoFill.js#L62-L68) to inspect model options and query local crypto keys.
  - Implements `updateQuotaUI()` in [L71-L94](file:///c:/xampp/htdocs/faydev/visura/public/js/autoFill.js#L71-L94) to style the quota banner and toggle button states.
  - Wires event listeners to update the UI on modal open (`openModal`) and model select changes (`modelSelect.addEventListener('change')`).
  - Guards requests inside `runAutoFill()` in [L242-L252](file:///c:/xampp/htdocs/faydev/visura/public/js/autoFill.js#L242-L252) to check and block exhausted attempts and increment counts before sending requests.
- **UI Markup ([public/app.html](file:///c:/xampp/htdocs/faydev/visura/public/app.html))**:
  - Adds the target quota anchor `<div class="autofill-quota" id="autofill-quota" hidden></div>` at [L715](file:///c:/xampp/htdocs/faydev/visura/public/app.html#L715) right above the footer button controls.
- **Visual Design Stylesheet ([public/css/styles.css](file:///c:/xampp/htdocs/faydev/visura/public/css/styles.css))**:
  - Implements the glassmorphic, theme-harmonized styling for the quota alert banners under `.autofill-quota` in [L2536-L2590](file:///c:/xampp/htdocs/faydev/visura/public/css/styles.css#L2536-L2590).
  - Uses CSS custom properties to ensure consistency with the dark/cyberpunk color palette.

---

## DOM to JS Mapping (`public/app.html` & `public/js/autoFill.js`)

| DOM ID / Selector | Component / Description | HTML Reference | JS Event / Handling |
| --- | --- | --- | --- |
| `af-model` | AI Model Selection Dropdown | [public/app.html:L672](file:///c:/xampp/htdocs/faydev/visura/public/app.html#L672) | Change event triggers `updateQuotaUI()` in [public/js/autoFill.js:L339](file:///c:/xampp/htdocs/faydev/visura/public/js/autoFill.js#L339) |
| `autofill-quota` | Quota Alert/Status Banner | [public/app.html:L715](file:///c:/xampp/htdocs/faydev/visura/public/app.html#L715) | Updated dynamically via `updateQuotaUI()`; hides or styles based on remaining count |
| `autofill-run` | "Extract with AI" Trigger Button | [public/app.html:L729](file:///c:/xampp/htdocs/faydev/visura/public/app.html#L729) | Click starts `runAutoFill()`; disabled automatically in `updateQuotaUI()` if quota is 0 |
| `btn-ai-fill` | Auto-Fill Modal Open Button | [public/app.html:L729](file:///c:/xampp/htdocs/faydev/visura/public/app.html#L729) | Click triggers `openModal()` which runs initial quota check & updates UI |

---

## Quota Design & Storage Representation

The storage key `visura.aiQuota` keeps records light and self-healing.

### JSON Representation
```json
{
  "date": "2026-06-01",
  "count": 2
}
```

### Self-Healing Mechanics
1. **New Day Automatic Reset**: When the current system date becomes `2026-06-02`, the date-string mismatch causes `loadQuota()` to automatically discard the stale count and return a fresh record with count `0`.
2. **Corrupted JSON Guard**: If the `localStorage` value is manually altered or corrupted (e.g. `{"date": "2026-06-01", "count": "abc"}`), the `try-catch` wrapper inside `loadQuota()` handles the parsing exception gracefully and resets the record to `0` without breaking the application execution flow.

---

## Visual Aesthetics & CSS Tokens

The visual styles are explicitly tailored to complement Visura's premium look, utilizing CSS variables and smooth transitions:

```css
/* Normal state: Cyan theme */
.autofill-quota {
  background: rgba(0, 200, 255, 0.05);
  border: 1px solid rgba(0, 200, 255, 0.15);
  color: rgba(140, 220, 255, 0.8);
}
/* Warning state (1 request remaining): Amber theme */
.autofill-quota--warning {
  background: rgba(255, 180, 0, 0.05);
  border-color: rgba(255, 180, 0, 0.2);
  color: rgba(255, 210, 80, 0.85);
}
/* Exhausted state (0 requests remaining): Red theme */
.autofill-quota--exhausted {
  background: rgba(255, 70, 70, 0.06);
  border-color: rgba(255, 80, 80, 0.25);
  color: rgba(255, 140, 140, 0.9);
}
```

---

## Error Handling & Key Validation
- **Button Lockout**: When the quota is fully exhausted, the "Extract with AI" button (`#autofill-run`) is set to `disabled = true` to prevent any click attempts.
- **Request Guarding**: If a user manages to click or invoke `runAutoFill()` (e.g., via console execution) when no quota is remaining, the script returns a clear validation error message and halts execution before any network request or model invocation takes place.
- **BYOK Autocomplete Override**: Selecting a model that has an active custom key stored in the browser's crypto storage automatically bypasses all restrictions, hides the banner, and unlocks the action button.

---

## Test Verification & Suite Details

A complete, self-contained unit test suite was written in [tests/autoFillQuota.test.js](file:///c:/xampp/htdocs/faydev/visura/tests/autoFillQuota.test.js) and is verified using a customized Node.js `localStorage` global stub:

### Verified Test Cases
1. **Fresh Storage Initialization**: Confirms `loadQuota` returns `{ count: 0, date: today }` on clean systems.
2. **Quota Limit Retrieval**: Confirms `getDailyLimit()` returns exactly `3`.
3. **Fresh Storage Remaining Count**: Confirms `getRemainingQuota()` starts at `3`.
4. **Boolean Check**: Confirms `hasQuotaRemaining()` is `true` initially.
5. **Sequential Increment**: Verifies that sequential increments increment counts accurately (`1` → `2` → `3`).
6. **Remaining Countdown**: Confirms countdown decreases as counts grow (`3` → `2` → `1` → `0`).
7. **Exhaustion Boolean Check**: Confirms `hasQuotaRemaining()` returns `false` at `0`.
8. **Overflow Protection clamping**: Confirms the remaining count never goes below `0` even if count exceeds the limit.
9. **Automatic Reset (Date Change)**: Confirms stale yesterday records automatically reset counts to `0` and dates to today.
10. **Corrupt Payload Safety**: Confirms parsing invalid JSON strings recovers gracefully without crashing.
11. **Admin Reset Tool**: Verifies that `resetQuota()` resets the daily count to `0` successfully.
12. **Persistence Guarantee**: Confirms that incremented counts survive across multiple `loadQuota` and module imports.

### Verification Execution Commands
To run the automated test suite in the environment:
```powershell
# Run the specific quota helper unit tests
node tests/autoFillQuota.test.js

# Run the comprehensive application test suites
npm test
```
