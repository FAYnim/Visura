<p align="center">
  <img src="public/img/logo/android-chrome-192x192.png" alt="Visura Logo" width="128" />
</p>

# Visura

A portfolio content studio for turning one project brief into platform-ready assets: Instagram carousel prompts, LinkedIn posts, captions, hashtags, and portfolio storytelling copy. Visura combines structured forms, AI-assisted extraction, live previews, local history, BYOK API keys, and a cinematic dark UI.

## The Problem

Great projects often go unnoticed because builders face three persistent challenges:
* **Hard to Explain Clearly:** Project details are easy to build, but harder to turn into concise stories people understand quickly.
* **Different Platforms, Different Formats:** Instagram, LinkedIn, captions, and hashtags each need a different structure and tone.
* **Publishing Takes Too Long:** Without a repeatable workflow, good work stays unpublished because packaging it feels like another project.

## The Solution

**Visura** turns a single project brief into a structured content workflow for the places builders already publish:
* **One Brief, Multiple Outputs:** Paste project details or upload Markdown/PDF documentation once, then generate content for Instagram, LinkedIn, captions, and hashtags.
* **Structured Storytelling:** Extract project goals, features, audience, outcomes, and visual direction into reusable content inputs.
* **Faster Publishing:** Generate ready-to-copy content assets without starting from scratch for every platform.

## Key Features

- **5-Slide Instagram Carousel Generator** with distinct prompt templates for Cover, Overview, Features Grid, UI Showcase, and Closing slides.
- **Carousel Preview Showcase** on the landing page with five visual example slides.
- **AI Auto-Fill** — automatically populate carousel fields from a text brief or Markdown/PDF documentation file using Gemini or Groq.
- **LinkedIn Post Generator** — generate one LinkedIn-ready post from pasted project info or Markdown/PDF documentation using selectable post styles and language.
- **Instagram Caption Generator** — generate structured captions from a brief or uploaded documentation directly inside the prompt generator flow.
- **Live Preview** with syntax highlighting comparing placeholders and filled values.
- **One-Click Copy & Save** to clipboard/history with sleek toast feedback.
- **Prompt History** saved locally with quick search capabilities.
- **Prompt Manager** for batch prompt presets and template editing.
- **BYOK API Key Management** with client-side AES-GCM encryption.
- **Global Settings** for creator profile defaults synced across the app.
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
> This application does not upload screenshots; generated carousel prompts assume you will add actual screenshots when creating images in your favorite AI image generator.

## Tech Stack

- HTML, CSS, JavaScript (ES Modules)
- Node.js + Express as the HTTP server
- LocalStorage for persisting settings, keys, and history
- Font Awesome + Google Fonts

## Running Locally

Ensure Node.js >= 18.x is installed, then run:

```bash
npm install
```

### AI Features Setup (Optional)

AI Auto-Fill, LinkedIn generation, and caption generation support multiple models across multiple providers. You can choose one of two options:

**Option A — BYOK (Recommended for local use):**
- Open **/byok** and save your Gemini/Groq API key.
- Keys are **encrypted with AES-GCM** and stored locally in your browser.
- The key is decrypted client-side and sent directly to the provider during generation.

**Option B — Environment Variables:**
Create a `.env` file in the root directory with one or both:

```bash
GEMINI_API_KEY=AIza...   # Required for Gemini models
GROQ_API_KEY=gsk_...     # Required for Groq models
```

Models are registered in `server/ai/models.js`. Only models whose provider has a configured API key (or a BYOK key) appear in the frontend dropdown. The chosen model persists in localStorage.

Each model gets one **retry** attempt (with a repair prompt) if the initial JSON response is malformed.

> [!IMPORTANT]
> If no BYOK or ENV key is set, AI-powered generation will show an error. The prompt generator works fine without an API key.

Then, start the development server:

```bash
npm run dev
```

> [!NOTE]
> The `npm run dev` script runs the server using `nodemon` to dynamically watch backend files for changes and automatically restart the server.

Next, open `http://localhost:3000` in your web browser.

### Running Tests

This application includes automated test suites covering AI output schema validation, model selection, upload validation, BYOK behavior, profile widgets, caption generation, LinkedIn template loading, prompt building, generation services, route handling, and copy/history actions. Execute via:

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
5. Use the caption tab/generator if you also need Instagram caption copy.
6. Click **Copy** or **Save** to store the prompt/caption.
7. Open **History** to manage previously copied content.
8. Configure your creator name and role under **Settings**.

For the **LinkedIn Post Generator** at `/linkedin`:

1. Paste a project brief, and/or upload Markdown/PDF documentation (≤ 10 MB).
2. Select a post style, language, and AI model.
3. Click **Generate LinkedIn Post** and review the result.
4. Click **Copy** to save the post to your clipboard.

> [!TIP]
> Use **History** as a local content library for iterating on different carousel, caption, and LinkedIn post styles.

## Project Structure

```text
.
├── .env                         # API keys (git-ignored)
├── package.json                 # Node.js manifest, scripts, and dependencies
├── PRD.md                       # Full Product Requirement Document for AI Auto-Fill
├── server.js                    # Express entry point and named page routes
├── server/
│   ├── routes/
│   │   ├── autoFill.js          # POST /api/auto-fill and /api/generate-caption
│   │   └── linkedin.js          # POST /api/linkedin/generate
│   └── ai/
│       ├── linkedin/            # LinkedIn prompt templates, loader, builder, and service
│       ├── autoFillService.js   # Model-based LLM caller (Gemini / Groq)
│       ├── captionPromptBuilder.js # Instagram caption prompt builder and normalizer
│       ├── captionService.js    # Caption generation service
│       ├── models.js            # Model registry config
│       ├── promptBuilder.js     # System/user prompt generator and parsing schema
│       ├── schema.js            # JSON schema for AI Auto-Fill outputs
│       └── textExtractors.js    # Text extraction utilities for Markdown and PDF files
├── tests/
│   ├── autoFillSchema.test.js
│   ├── autoFillFallback.test.js
│   ├── autoFillQuota.test.js
│   ├── byokAutoFillFallback.test.js
│   ├── byokCrypto.test.js
│   ├── captionPromptBuilder.test.js
│   ├── captionUploadValidation.test.js
│   ├── captionByokDecryptFailure.test.js
│   ├── generatorClipboardActions.test.js
│   ├── linkedinActions.test.js
│   ├── linkedinPromptBuilder.test.js
│   ├── linkedinRouteValidation.test.js
│   ├── linkedinService.test.js
│   ├── linkedinTemplateLoader.test.js
│   ├── linkedinUploadValidation.test.js
│   ├── modelsRoute.test.js
│   └── profileWidgetLoading.test.js
└── public/
    ├── index.html               # Marketing landing page and carousel preview showcase
    ├── app.html                 # Core carousel prompt and caption generator page
    ├── linkedin.html            # LinkedIn Post Generator page
    ├── prompts.html             # Batch Prompt Manager and Template Editor
    ├── history.html             # Copy History Viewer
    ├── settings.html            # Global Creator Settings
    ├── byok.html                # BYOK API key management page
    ├── css/
    │   ├── styles.css           # Core app UI and cinematic dark theme system
    │   └── landing.css          # Portfolio Content Studio landing styles and reveals
    ├── js/
    │   ├── autoFill.js          # Client-side AI Auto-Fill flows
    │   ├── autoFillQuota.js     # AI quota display and helpers
    │   ├── byok.js              # BYOK encryption and localStorage helpers
    │   ├── captionGenerate.js   # Caption generation modal and UI flow
    │   ├── common.js            # Shared state, localStorage, and UI utilities
    │   ├── generator.js         # Generator entry point
    │   ├── generatorBindings.js # Form and tab event bindings
    │   ├── generatorClipboard.js # Copy/save/reset actions
    │   ├── generatorHistory.js  # History sync logic
    │   ├── generatorRender.js   # Preview rendering and counters
    │   ├── generatorState.js    # Runtime state and default presets
    │   ├── generatorTemplates.js # Prompt template compiler
    │   ├── history.js           # History management and search engine
    │   ├── linkedin.js          # LinkedIn Post Generator UI flows
    │   ├── linkedinActions.js   # LinkedIn clipboard and history helpers
    │   ├── promptStore.js       # Default presets and placeholder validations
    │   ├── prompts.js           # Batch prompt manager UI
    │   ├── settings.js          # Creator profile form management logic
    │   └── settingsDefaults.js  # Shared default creator info
    └── img/
        ├── avatar.png           # Default creator profile picture
        ├── visura-slide-01.webp # Carousel cover preview asset
        ├── visura-slide-02.webp # Carousel overview preview asset
        ├── visura-slide-03.webp # Carousel features preview asset
        ├── visura-slide-04.webp # Carousel UI showcase preview asset
        ├── visura-slide-05.webp # Carousel closing preview asset
        └── logo/                # Favicons and logo asset bundle
```

## Customization

- **Default Prompt Presets:** Customize inside `public/js/promptStore.js` under `DEFAULT_PROMPTS`.
- **Template Compiler:** Refer to `public/js/generatorTemplates.js` to modify placeholder extraction behavior.
- **Theme & Colors:** Customize variables inside `public/css/styles.css` and landing-specific styles inside `public/css/landing.css`.
- **Default Profile:** Update preset profile values inside `public/js/settingsDefaults.js`.

> [!IMPORTANT]
> Prompt history, API keys, and configuration settings are stored inside the browser's LocalStorage. Clearing your browser cache will erase this data.
