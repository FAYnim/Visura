<p align="center">
  <img src="public/img/logo/android-chrome-192x192.png" alt="Visura Logo" width="128" />
</p>

# Visura

A premium prompt generator for crafting gorgeous 5-slide Instagram carousel portfolios with a cinematic UI style. Visura provides structured forms, real-time live preview, prompt history, and creator profile settings—all running directly in your browser.

## The Problem

Showcasing digital products and design portfolios on Instagram is highly effective, yet creators face three persistent challenges:
* **Tedious Prompting:** Crafting highly detailed, cinematic image generation prompts manually for every single slide takes hours.
* **Inconsistent Aesthetics:** Keeping lighting, color schemes, and layouts uniform across a multi-slide carousel is nearly impossible without a structured framework.
* **Lack of Narrative Structure:** High-converting portfolios require a cohesive storytelling flow (Cover → Overview → Features → Showcase → Outro) that raw prompt builders fail to guide.

## The Solution

**Visura** solves this by providing a structured, story-driven prompt construction pipeline that guarantees professional consistency:
* **Automated Storytelling:** Pre-structured 5-slide blueprints optimized specifically for Instagram's swipe mechanics.
* **Interactive Prototyping:** Edit fields dynamically with a real-time live compiler and cinematic syntax highlighting.
* **AI-Assisted Workflows:** Drop a project brief or upload design documentation (Markdown/PDF) to autofill all slide fields instantly via LLMs.

## Key Features

- **5-Slide Generator** with distinct prompt templates for the Cover, Overview, Features Grid, Showcase, and Outro slides.
- **AI Auto-Fill** — automatically populate all fields from a text brief or Markdown/PDF documentation file using a choice of LLMs (Gemini or Groq).
- **LinkedIn Post Generator** — generate one LinkedIn-ready post from pasted project info or Markdown/PDF documentation using selectable post styles and language.
- **Live Preview** with syntax highlighting comparing placeholders and filled values.
- **One-Click Copy** to clipboard with sleek toast feedback.
- **Prompt History** saved locally with quick search capabilities.
- **Global Settings** (Creator Name/Role) synced automatically across all slides.
- **Modern Dark UI** matching premium SaaS aesthetics.

## Application Routes

- **Marketing Landing Page:** `http://localhost:3000/`
- **Prompt Generator:** `http://localhost:3000/app`
- **LinkedIn Post Generator:** `http://localhost:3000/linkedin`
- **History:** `http://localhost:3000/history`
- **Settings:** `http://localhost:3000/settings`
- **Prompt Manager:** `http://localhost:3000/prompts`
- **BYOK (API Keys):** `http://localhost:3000/byok`

> [!NOTE]
> This application does not upload screenshots; the generated prompts assume you will add actual screenshots when generating images in your favorite AI image generator.

## Tech Stack

- HTML, CSS, JavaScript (ES Modules)
- Node.js + Express as the HTTP server
- LocalStorage for persisting settings & history
- Font Awesome + Google Fonts

## Running Locally

Ensure Node.js >= 18.x is installed, then run:

```bash
npm install
```

### AI Auto-Fill Setup (Optional)

The AI Auto-Fill feature supports multiple models across multiple providers. You can choose one of two options:

**Option A — BYOK (Recommended for local use):**
- Open **/byok** and save your Gemini/Groq API key.
- Keys are **encrypted with AES-GCM** and stored locally in your browser.
- The key is decrypted client-side and sent directly to the provider during Auto-Fill.

**Option B — Environment Variables:**
Create a `.env` file in the root directory with one or both:

```bash
GEMINI_API_KEY=AIza...   # Required for Gemini models
GROQ_API_KEY=gsk_...     # Required for Groq models
```

Models are registered in `server/ai/models.js`. Only models whose provider has a configured API key (or a BYOK key) appear in the frontend dropdown. The chosen model persists in localStorage.

Each model gets one **retry** attempt (with a repair prompt) if the initial JSON response is malformed.

> [!IMPORTANT]
> If no BYOK or ENV key is set, the **AI Auto-Fill** button will show an error. The prompt generator works fine without an API key.

Then, start the development server:

```bash
npm run dev
```

> [!NOTE]
> The `npm run dev` script runs the server using `nodemon` to dynamically watch backend files for changes and automatically restart the server.

Next, open `http://localhost:3000` in your web browser.

### Running Tests

This application includes a schema validation test suite to verify the output data formats returned by the AI Auto-Fill engine. You can execute these tests via:

```bash
npm test
```

## How to Use

1. Open the **Prompt Generator** at `/app`.
2. *(Optional)* Click **AI Auto-Fill** and:
   - Provide a project brief inside the textarea, and/or
   - Upload a Markdown/PDF project document (≤ 10 MB).
   - Select an AI model from the dropdown.
   - Click **Extract with AI** and wait for 10–30 seconds.
   - Review the coverage summary, then click **Apply to All Slides**.
3. Fill or edit the fields on the active slide form.
4. Review the compiled prompt inside the **Preview** panel.
5. Click **Copy** to save the prompt to your clipboard.
6. Open **History** to manage previously copied prompts.
7. Configure your creator name and role under **Settings**.

For the **LinkedIn Post Generator** at `/linkedin`:

1. Paste a project brief, and/or upload Markdown/PDF documentation (≤ 10 MB).
2. Select a post style, language, and AI model.
3. Click **Generate LinkedIn Post** and review the result.
4. Click **Copy** or **Save** to store it in **History**.

> [!TIP]
> Use **History** as a prompt library for iterating on different visual styles of your carousel projects.

## Project Structure

```text
.
├── .env                      # API keys (git-ignored)
├── package.json              # Node.js manifest, scripts, & dev dependencies (nodemon, etc.)
├── PRD.md                    # Full Product Requirement Document for AI Auto-Fill
├── server.js                 # Express entry point (initializes HTTP server)
├── server/
│   ├── routes/
│   │   ├── autoFill.js       # Express route handler for POST /api/auto-fill
│   │   └── linkedin.js       # Express route handler for POST /api/linkedin/generate
│   └── ai/
│       ├── linkedin/         # LinkedIn prompt templates, loader, builder, and service
│       ├── autoFillService.js # Model-based LLM caller (Gemini / Groq)
│       ├── models.js          # Model registry config
│       ├── promptBuilder.js   # System/user prompt generator & parsing schema
│       ├── schema.js          # JSON schema for AI Auto-Fill outputs
│       └── textExtractors.js  # Text extraction utilities for Markdown & PDF files
├── tests/
│   ├── autoFillSchema.test.js  # Minimal validation schema test (run via `npm test`)
│   ├── autoFillFallback.test.js # Model selection unit tests
│   ├── linkedinTemplateLoader.test.js # LinkedIn template loading tests
│   ├── linkedinPromptBuilder.test.js  # LinkedIn prompt builder tests
│   ├── linkedinService.test.js        # LinkedIn service tests
│   └── linkedinUploadValidation.test.js # LinkedIn upload validation tests
└── public/
    ├── index.html            # Marketing Landing Page (story-led layout)
    ├── app.html              # Core Slide Generator Page (moved from index.html)
    ├── linkedin.html         # LinkedIn Post Generator Page
    ├── prompts.html          # Batch Prompt Manager & Template Editor
    ├── history.html          # Copy History Viewer
    ├── settings.html         # Global Creator Settings (Name & Role)
    ├── byok.html             # BYOK (API Keys) management page
    ├── css/
    │   ├── styles.css        # Core app UI & cinematic dark theme system
    │   └── landing.css       # Premium marketing landing page styles & reveals
    ├── js/
    │   ├── autoFill.js           # Client-side AI Auto-Fill flows
    │   ├── common.js             # Shared state, localStorage, & UI utilities
    │   ├── generator.js          # Generator entry point (wiring module)
    │   ├── generatorBindings.js  # Form & tab event bindings
    │   ├── generatorClipboard.js # Prompt copy/reset + toast notifications
    │   ├── generatorHistory.js   # Syncing history logic
    │   ├── generatorRender.js    # Preview rendering & counters
    │   ├── generatorState.js     # Runtime state & default presets
    │   ├── generatorTemplates.js # Prompt template compiler
    │   ├── linkedin.js           # LinkedIn Post Generator UI flows
    │   ├── promptStore.js        # Default presets + placeholder validations
    │   ├── prompts.js            # Batch prompt manager UI
    │   ├── settingsDefaults.js   # Shared defaults creator info
    │   ├── history.js            # History management & search engine
    │   ├── settings.js           # Creator profile form management logic
    │   └── byok.js                # BYOK encryption + localStorage helpers
    └── img/
        ├── avatar.png        # Default creator profile picture
        └── logo/             # Favicons & logo asset bundle
```

## Customization

- **Default Prompt Presets:** Customize inside `public/js/promptStore.js` under `DEFAULT_PROMPTS`.
- **Template Compiler:** Refer to `public/js/generatorTemplates.js` to modify the placeholder extraction behavior.
- **Theme & Colors:** Customize variables inside `public/css/styles.css`.
- **Default Profile:** Update preset profile values inside `public/js/settingsDefaults.js`.

> [!IMPORTANT]
> Prompt history and configuration settings are stored inside the browser's LocalStorage. Clearing your browser cache will erase this data.
