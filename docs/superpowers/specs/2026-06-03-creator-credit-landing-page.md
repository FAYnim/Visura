# Creator Credit — Landing Page

**Date:** 2026-06-03
**Status:** Approved
**Project:** Visura — Premium Portfolio Prompt Generator

## Overview

Add creator credit for **FAYdev** on the landing page (`index.html`) in two locations: hero section and footer. The credit acknowledges the creator of the Visura tool.

## Design Decisions

- **Name:** FAYdev
- **Hero credit:** Text only, no links — keeps hero section clean and focused on the product
- **Footer credit:** Text + social icon links — provides discoverability without visual clutter
- **Links:** GitHub (`FAYnim`), Portfolio (`faydev.my.id`), Instagram (`fay.developer`)
- **Icons:** Font Awesome brands (already loaded via CDN in the project)

## Changes

### 1. Hero Section

**File:** `public/index.html`

**Location:** After `.hero-actions` div (line ~105), add:

```html
<p class="hero-credit">Crafted by <strong>FAYdev</strong></p>
```

**CSS additions** to `public/css/landing.css`:

- `.hero-credit`: small subtle text, `var(--text-muted)` color, 12px font, centered, with top margin
- `.hero-credit strong`: use `color: #ffffff` or `var(--accent-primary)` for the name

### 2. Footer Section

**File:** `public/index.html`

**Location:** Inside `.footer-bottom-container` (line ~566), replace the existing `<span class="creator-credit">` with:

```html
<span class="creator-credit">Crafted by <strong>FAYdev</strong></span>
<span class="creator-social">
  <a href="https://github.com/FAYnim" target="_blank" rel="noopener" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
  <a href="https://faydev.my.id" target="_blank" rel="noopener" aria-label="Portfolio"><i class="fa-solid fa-globe"></i></a>
  <a href="https://instagram.com/fay.developer" target="_blank" rel="noopener" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
</span>
```

**CSS additions** to `public/css/landing.css`:

- `.footer-bottom-container`: switch to `display: flex; align-items: center; justify-content: space-between;` (already flex)
- `.creator-social`: flex row, gap 12px
- `.creator-social a`: icon size 16px, color `var(--text-muted)`, transition to `var(--accent-primary)` on hover with glow

## Scope

- No changes to any other page
- No changes to the app (`app.html`, `generator.js`, etc.)
- Only `public/index.html` and `public/css/landing.css` are modified
