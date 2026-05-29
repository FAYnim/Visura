# Prompt Management Report

Generated: 2026-05-30

## Overview
- **Storage Layer**: Built `public/js/promptStore.js` to manage canonical prompt schemas, default prompt texts, required placeholder arrays, batch instantiation (`createPromptBatch`), and automatic normalization/repairing of batches (`normalizePromptBatches`).
- **Shared Data & I/O**: Modified [public/js/common.js](public/js/common.js#L10-L13) and [public/js/common.js](public/js/common.js#L104-L144) to support localStorage read/writes under `visura_prompt_batches` and migrate legacy `promptflex_prompt_batches` seamlessly, as well as providing active batch resolution helpers (`getActivePromptBatch`).
- **Interactive UI**: Implemented [public/prompts.html](public/prompts.html) and [public/js/prompts.js](public/js/prompts.js) featuring a sleek two-column responsive layout, live tabs for 5 slides, complete CRUD operations (Create, Edit, Duplicate, Delete, Set Active), and dynamic real-time validation of template tags.
- **Dynamic Tag Validation**: Added live `input` listeners to all editor textareas. If a required template key (e.g. `{{BADGE_TEXT}}`) is deleted or modified, a visual error displays beneath the editor, a warning highlights the tab in red, and the corresponding interactive placeholder tag turns red with a line-through styling (`.ph-tag.missing`).
- **Generator Integration**: Updated [public/js/generator.js](public/js/generator.js#L600-L610) to load custom user prompts from the active batch via `getActivePromptBatch`, rendering custom layouts and structural rules dynamically in both the HTML live preview and the plain-text copy-to-clipboard functionality.
- **Backend Serving**: Configured express routes in [server.js](server.js#L36-L38) to support serving the prompt manager workspace statically at `/prompts`.

---

## Flow Diagram (ASCII)
```
[User Action]
   ├─► Create Batch   ──► Instantiates batch metadata + default slide copies
   ├─► Select Batch   ──► Opens 5-tab workspace; locks fields if "Default Batch"
   ├─► Live Typing    ──► Runs real-time validation checking required {{TAGS}}
   │                         ├─► Missing? ──► Toggles red tab + strikethrough ph-tags
   │                         └─► Valid?   ──► Restores normal border & green tags
   ├─► Save Batch     ──► Strict check of all 5 slides; persists user-created template to LocalStorage
   └─► Activate       ──► Sets activeId in Storage; marks badge in list

[Generator Page Initialization]
   └─► DOMContentLoaded ──► Load visura_prompt_batches & activeId from storage
                            └──► User compiles slide prompt
                                  └──► getTemplateForSlide() ──► active template found?
                                        ├──► Yes ──► Uses active batch custom template
                                        └──► No  ──► Falls back to canonical DEFAULT_PROMPTS
```

---

## UI Workspace & Interaction
- The responsive two-column layout is defined in [public/prompts.html](public/prompts.html#L54-L65) and styled directly inside the embedded stylesheet for pixel-perfect layout isolation.
- **Batch List Panel**: Rendered dynamically in [public/js/prompts.js](public/js/prompts.js#L111-L150). System presets are marked with a distinct lock icon and an "Aktif" badge if selected, while custom batches are labeled with their creation dates.
- **Meta Inputs**: Fields for modifying the batch name and description dynamically adjust based on read-only permissions in [public/js/prompts.js](public/js/prompts.js#L167-L180).
- **Tab Panel Architecture**: Tab buttons for Slide 1 through Slide 5 switch panel visibility cleanly in [public/js/prompts.js](public/js/prompts.js#L210-L219). If validation fails on any tab, a custom class `.has-error` changes the tab button text to red.
- **Real-Time Validation UI**: Uses CSS transitions on [.ph-tag](public/prompts.html#L378-L387) and [.ph-tag.missing](public/prompts.html#L388-L394) to immediately render feedback when templates are being typed:
  ```css
  .ph-tag {
    background: rgba(74, 222, 128, 0.1);
    color: var(--accent-primary);
    border: 1px solid rgba(74, 222, 128, 0.25);
  }
  .ph-tag.missing {
    background: rgba(255, 107, 107, 0.1);
    color: #ff6b6b;
    border-color: rgba(255, 107, 107, 0.3);
    text-decoration: line-through;
  }
  ```

---

## DOM to JS Mapping
| Element ID / Class | HTML Selector Source | JS Binding & Imports | Functionality / Interactive Effect |
| --- | --- | --- | --- |
| `btn-create-batch` | [public/prompts.html](public/prompts.html#L477) | [public/js/prompts.js](public/js/prompts.js#L47) | Click listener calls `handleCreateBatch()`, generating batch object and focusing the name input. |
| `batch-list` | [public/prompts.html](public/prompts.html#L490) | [public/js/prompts.js](public/js/prompts.js#L42) | Container for rendering custom list items containing batch name, meta info, and active indicator. |
| `btn-save-batch` | [public/prompts.html](public/prompts.html#L523) | [public/js/prompts.js](public/js/prompts.js#L48) | Click triggers `handleSaveBatch()`, executing a strict validation check of all 5 slides before persisting. |
| `btn-duplicate-batch`| [public/prompts.html](public/prompts.html#L511) | [public/js/prompts.js](public/js/prompts.js#L49) | Click runs `handleDuplicateBatch()`, cloning active slide texts into a new editable user batch. |
| `btn-activate-batch` | [public/prompts.html](public/prompts.html#L515) | [public/js/prompts.js](public/js/prompts.js#L50) | Click updates `STATE.activeId` via `handleActivateBatch()`, enabling live template selection. |
| `btn-delete-batch` | [public/prompts.html](public/prompts.html#L519) | [public/js/prompts.js](public/js/prompts.js#L51) | Click runs `handleDeleteBatch()`, prompts confirmation, deletes from array, and resets storage. |
| `default-batch-notice`| [public/prompts.html](public/prompts.html#L534) | [public/js/prompts.js](public/js/prompts.js#L55) | Toggled to visible state inside `selectBatch()` if the selected batch is marked as system default (`isDefault`). |
| `slide-template-textarea`| [public/prompts.html](public/prompts.html#L571) | [public/js/prompts.js](public/js/prompts.js#L464-L474) | Monitors keystrokes via `input` listeners, invoking `validateSlideTemplate()` and updating the UI instantly. |
| `.ph-tag` | [public/prompts.html](public/prompts.html#L565) | [public/js/prompts.js](public/js/prompts.js#L232-L258) | Reflects tag presence; adds `.missing` when its respective `data-ph` key is absent from the textarea. |

---

## Data Model & Storage Contracts
Prompt Batches are saved as a single JSON object inside localStorage under key `visura_prompt_batches` to store user custom configurations and the designated active template ID.

### Storage Data Schema
```typescript
interface PromptBatchesStore {
  activeId: string | null; // ID of active batch (null refers to virtual 'default')
  batches: PromptBatch[];  // Array of user-created prompt batches
}

interface PromptBatch {
  id: string;               // Unique string prefix: batch_timestamp_random
  name: string;             // User defined name
  description: string;      // User description
  isDefault: boolean;       // System constant (always false for user batches)
  createdAt: string | null; // ISO Date String
  slides: {
    1: string;              // Slide 1 Custom Prompt Template
    2: string;              // Slide 2 Custom Prompt Template
    3: string;              // Slide 3 Custom Prompt Template
    4: string;              // Slide 4 Custom Prompt Template
    5: string;              // Slide 5 Custom Prompt Template
  };
}
```

### Required Placeholders Schema
The validation model explicitly checks for the existence of mandatory double-bracket keys per slide:
- **Slide 1**: `BADGE_TEXT`, `MAIN_HEADLINE`, `SUBTITLE_TEXT`, `CREATOR_NAME`
- **Slide 2**: `SECTION_BADGE`, `MAIN_HEADING`, `PROJECT_DESCRIPTION`, `QUOTE_TEXT`, `FEATURE_TITLE_1`, `FEATURE_DESC_1`, `FEATURE_TITLE_2`, `FEATURE_DESC_2`, `FEATURE_TITLE_3`, `FEATURE_DESC_3`, `FEATURE_TITLE_4`, `FEATURE_DESC_4`
- **Slide 3**: `SECTION_BADGE`, `MAIN_HEADING`, `SUBTITLE_TEXT`, `FEATURE_TITLE_1..6`, `FEATURE_DESC_1..6`, `FEATURE_UI_1..6`, `CTA_TEXT`, `CTA_BUTTON`
- **Slide 4**: `TOP_LEFT_BADGE`, `TOP_RIGHT_LABEL`, `MAIN_HEADLINE`, `SUBTITLE_TEXT`, `PILL_TEXT_1..4`, `CREATOR_NAME`, `BRAND_STATEMENT`
- **Slide 5**: `TOP_BADGE_TEXT`, `MAIN_HEADLINE`, `DESCRIPTION_TEXT`, `CREATOR_NAME`, `CREATOR_ROLE`, `CTA_TEXT_1`, `CTA_TEXT_2`

---

## Data Validation & Repair Mechanism
To maintain rendering integrity and prevent slide compiler crashes when custom prompt batches are loaded, `promptStore.js` implements a automatic normalization routine:

1. **`normalizePromptBatches(raw)`**: 
   - Invoked every time the system loads data from the client storage in [public/js/promptStore.js](public/js/promptStore.js#L663).
   - Validates that each user batch contains a slide structure for all 5 slides. If a slide template is missing, it drops in the system default template.
   - Iterates through required placeholders for each slide. If any mandatory placeholder (e.g. `{{CREATOR_NAME}}`) is completely omitted from the user template text, the program automatically resets that slide's prompt to the safe system default `DEFAULT_PROMPTS[s]` to avoid application crashes.

2. **`validateSlideTemplate(slideNum, text)`**:
   - Used inside the interactive editor page in [public/js/promptStore.js](public/js/promptStore.js#L703-L706) to filter required keys and return an array of keys that are missing.

---

## Integration in Prompt Generator
Customized templates are smoothly mapped inside the presentation compiling stage without impacting backend auto-fill workflows.

- **Dynamic Template Fetching**:
  [public/js/generator.js](public/js/generator.js#L600-L610) replaces static template lookups with a dynamic resolver:
  ```javascript
  function getTemplateForSlide(slide) {
    if (STATE.activePromptBatchId && STATE.promptBatches) {
      const activeBatch = getActivePromptBatch(STATE.promptBatches, STATE.activePromptBatchId);
      if (activeBatch && activeBatch.slides && activeBatch.slides[slide]) {
        return activeBatch.slides[slide];
      }
    }
    return DEFAULT_PROMPTS[slide] || DEFAULT_PROMPTS[1];
  }
  ```
- **Dynamic Compilation**:
  - `compileTemplate(slideNum)` in [public/js/generator.js](public/js/generator.js#L660-L675) compiles current user inputs inside the resolved template, wrapping inputs in CSS colored spans (`ph-filled` and `ph-empty`) for high fidelity in-app preview rendering.
  - `compilePlainText(slideNum)` in [public/js/generator.js](public/js/generator.js#L677-L688) compiles identical template strings without HTML markers, supplying clean plain text formatting ready for clipboard actions and history persistence.

---

## Error Mitigation & Client Alerts
- **Real-Time Input Checks**: Real-time listeners evaluate the template context dynamically as the user types. This immediately updates [.ph-tag.missing](public/js/prompts.js#L248-L258) indicators, alerts the user visually without blocking keypresses, and shows inline error messages below textareas.
- **Strict Saving Checks**: When hitting **Simpan**, `validateAllSlides()` executes in [public/js/prompts.js](public/js/prompts.js#L288). If any errors exist, a warning toast alerts the user, blocks the save action, and switches tabs directly to the first slide containing an invalid template configuration.
- **Default Presets Protection**: Attempting to edit, delete, or save the default batch is blocked. All metadata controls are disabled in [public/js/prompts.js](public/js/prompts.js#L171-L177), and a warning notice is displayed in the workspace informing the user to duplicate the preset to customize its contents.
