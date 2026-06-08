# Visura Landing Page Rebranding Design

Date: 2026-06-08

## Goal

Rebrand the public landing page from an Instagram carousel prompt generator into a Portfolio Content Studio. The page must make clear that Visura turns one project brief into multiple professional content assets for publishing and portfolio presentation.

## Scope

Update `public/index.html` and `public/css/landing.css` as needed. Keep the implementation static HTML, CSS, and browser JavaScript. Do not add dependencies or new backend behavior.

The rebrand focuses only on features that already exist:

- Instagram Carousel Prompt Generator
- LinkedIn Post Generator
- Instagram Caption Generator
- Instagram Hashtag Generator
- AI project information extraction from Markdown/PDF
- Local history/settings support where relevant

Future roadmap features are out of scope for the landing page.

## Positioning

Primary positioning: **Visura — Portfolio Content Studio**.

Core message: **Turn Your Projects Into Professional Content.**

Supporting message: users provide a project brief once, then generate platform-ready content for Instagram, LinkedIn, captions, hashtags, and portfolio presentation.

Tone must be modern, professional, focused, premium, practical, and builder-oriented. Avoid exaggerated claims such as “game-changing,” “magical,” “absolute perfection,” or “build your legacy.”

## Information Architecture

The landing page should use this structure:

1. Header
2. Hero
3. Problem
4. Solution
5. Outputs Preview
6. Feature Showcase
7. How It Works
8. Use Cases
9. FAQ
10. Final CTA
11. Footer

The previous carousel-only preview should be replaced or reframed so Instagram carousel is one output among several, not the whole product story.

## Header

Brand stays `Visura`, with small tag `Studio` or `Content Studio`.

Navigation:

- Problem
- Outputs
- Features
- Process
- FAQ

Primary CTA points to `/app` with label `Start Creating`.

Avoid `Try Demo` because it makes the product feel unfinished.

## Hero

Hero content:

- Badge: `Portfolio Content Studio • 100% Free`
- Headline: `Turn Your Projects Into Professional Content.`
- Subtitle: `Upload your project brief once and generate Instagram carousels, LinkedIn posts, captions, hashtags, and portfolio-ready content in seconds.`
- Primary CTA: `Start Creating` → `/app`
- Secondary CTA: `View Outputs` → Outputs Preview section
- Small support text: `Built for developers, designers, students, and indie builders.`

Hero visual direction: use an Output Hub composition. Show one input card labeled `Project Brief / PDF / Markdown`, a central Visura processing node, and output cards for:

- Instagram Carousel
- LinkedIn Post
- Instagram Caption
- Hashtags

The visual should preserve the existing premium dark aesthetic while making multi-output generation obvious within a few seconds.

## Problem Section

Shift the problem from “prompting carousel slides is tedious” to “good projects are hard to package and publish consistently.”

Use three focused problem cards:

1. Hard to explain the project clearly
2. Hard to adapt content for different platforms
3. Hard to publish consistently without spending too much time

## Solution Section

Present Visura as a project-to-content workflow:

1. Add or upload a project brief
2. Visura extracts or structures the project details
3. Generate ready-to-copy content assets for supported platforms

The solution visual can reuse the existing mockup-frame style, but its labels and examples should represent content outputs instead of slide-only prompts.

## Outputs Preview

Add a dedicated Outputs Preview section with cards for current outputs:

- Instagram Carousel: structured visual prompt deck for portfolio showcase
- LinkedIn Post: professional post generated from project details
- Instagram Caption: short platform-ready caption for project sharing
- Hashtags: relevant tags for reach and categorization

Each card should state the output, its purpose, and a short example-style snippet. This section replaces the old “Ultimate 5-Slide Anatomy” framing.

## Feature Showcase

Feature cards should describe existing product capabilities:

1. One project brief, multiple outputs
2. AI extraction from Markdown/PDF
3. Live editing and copy workflow
4. Local history/settings for repeat use

Do not mention unreleased features as available.

## How It Works

Three-step process:

1. Add project details or upload a brief
2. Review extracted information and choose an output
3. Copy and publish platform-ready content

Keep it concrete and avoid overblown phrasing.

## Use Cases

Include a section for target users:

- Developers showcasing shipped projects
- Designers presenting portfolio work
- Students building personal branding
- Indie builders sharing product progress
- Freelancers packaging work for client trust

## FAQ

FAQ should cover:

- Is Visura free?
- Do I need an API key?
- What files can AI extraction read?
- What outputs can Visura generate today?
- Where is my history/settings data stored?

Answers must match existing behavior: basic manual workflows work without an API key; AI extraction/generation requires configured BYOK or environment keys depending on feature flow.

## Visual Style

Use the selected **Output Hub** direction:

- Dark premium base
- Grid/card layout for output assets
- Subtle neon accents
- Clear branching visual from one input to many outputs
- Modern SaaS polish without abstract hype

Keep existing brand continuity where useful: dark background, glow accents, rounded glassy cards, reveal motion, responsive layout.

## JavaScript Behavior

Retain:

- Mobile navigation open/close
- FAQ accordion
- Scroll reveal animation

Remove or rewrite carousel-specific JavaScript only if the carousel preview markup is removed. Avoid dead event listeners for removed elements.

## Testing and Verification

Run `npm test` after implementation. There is no lint or typecheck script in `package.json`, so tests are the required automated verification unless scripts are added later.

Manual checks:

- Landing page loads at `/`
- Header CTA goes to `/app`
- Secondary CTA scrolls to Outputs Preview
- Mobile nav works
- FAQ accordion works
- No visible carousel-only positioning remains in title, metadata, hero, preview, features, CTA, or footer
- Existing app routes remain unchanged

## Out of Scope

- Backend changes
- New generators
- Roadmap/future feature marketing
- Authentication, accounts, or workspace features
- New dependencies
