# ENTERPRISE REPORT — Adam J. Lovell Digital Services
### Captain's Log | Architecture & Systems Reference

> **Classification:** Internal Operations Document  
> **Maintained by:** Lead Systems Architect  
> **Last Updated:** 2026-03-20  
> **Status:** Active / Production

---

## BRIDGE OVERVIEW — Who Is at the Helm

**Captain:** Adam J. Lovell  
**Mission:** Operate a lean, high-margin, multi-service freelance agency (Web Dev · Music Production · AP Calculus Tutoring) under a hard 27-hour weekly work cap.  
**Operating Model:** "Product Provider" — standardized deliverables, fixed pricing, client-side automation, zero backend dependencies.  
**Fleet Designation:** Static Multi-Page HTML Site | No build tools | No server | No framework

---

## VESSEL CLASSIFICATION — The Starfleet Diagnostic

> *"Data's report confirms the Enterprise is a Static Vessel."*

This site is a **standalone shuttlecraft on Impulse Power**. It operates without a constant subspace link to Starfleet Command (no backend server). All intelligence runs onboard. Here is the official component-to-Starfleet mapping:

| Web Component | Starfleet Analogy | Status | Notes |
|---|---|---|---|
| **HTML/CSS** | Physical Chassis & HUD | ✅ Online | The structure of the ship and every screen the crew sees. Stored client-side once the user "beams" the files down. |
| **JavaScript** | Computer Core (Onboard) | ✅ Online | Localized intelligence. Handles all `if/then` logic in the browser without calling Starfleet Command. |
| **APIs (JSONBlob / Formspree)** | Subspace Comms / Away Team Gear | ✅ Active | Since there is no Backend base, we use specialized relay tools to send data packets out and pull them back in. This is the ship's most clever move. |
| **Warp Core / Build Tools** | Warp Core | ⚡ Not Installed | No React, no Vite, no compiler. The site runs on **Raw Impulse Power** (plain HTML). Reliable and fast to deploy, but requires manual updates across all 7 pages for any global change. |
| **Backend / Server** | Starfleet Command | 🚫 Not Present | There is no remote base processing logic or storing secrets. This is why the Admin PIN is visible in source — the onboard Computer (browser) must see it to check it. No secure "Base" exists to hold it. |

### Impulse Power Implications (Plain English)

- **No Warp Core → No Auto-Pilot:** Global changes (e.g., updating the nav bar) must be made manually in all 7 HTML files. There is no component compilation.
- **No Starfleet Command → No Secrets Server-Side:** The Admin PIN lives in client-side JS and is visible in DevTools. Acceptable for current scope; a known limitation.
- **Subspace Links → Dynamic Capability:** The JSONBlob `fetch()` pipeline is the ship's most sophisticated system. It gives a static vessel a live data feed without any backend infrastructure.

---

## SECTOR MAP — File Structure

```
/
├── index.html                  — Bridge (Landing / Homepage)
├── website-development.html    — Starfleet Engineering (Web Dev service page)
├── tutoring.html               — Sciences Division (Tutoring service page)
├── romulus-beats.html          — Romulus Command (Beats / Music page)
├── reviews.html                — Crew Testimonials (Public reviews + submission)
├── contact.html                — Incoming Hails (Contact / Lead capture form)
├── admin.html                  — Captain's Ready Room (Protected review manager)
├── reviews.json                — Ship's Log Backup (Local seed copy of review data)
├── README.md                   — Mission Brief
├── WEBSITE_ARCHITECTURE.md     — This document (Enterprise Report)
└── js/
    ├── main.js                 — Universal Systems (Mobile nav toggle)
    ├── contact.js              — Comms Array (Contact form logic)
    └── reviews.js              — Intelligence Feed (Fetches & renders live reviews)
```

---

## DEPARTMENT REPORTS — Each System Explained

---

### DECK 1 — Navigation & Shell (`js/main.js` + shared `<nav>`)

**Function:** Universal navigation bar present on all 7 pages. Fixed at top (`z-50`), uses `backdrop-blur`, and collapses to a hamburger menu on mobile (`md:hidden`).

**How it works:**
- `main.js` attaches a click listener to `#mobile-menu-btn` and toggles the `hidden` class on `#mobile-menu`.
- Active page is highlighted in `primary-400` orange; all others are `slate-400` with hover transitions.
- The `Contact` link is always styled as a CTA button (`bg-primary-500`).

**Replication note:** Nav and footer HTML is copy-pasted across all pages — no templating engine. Any global nav change must be made in **all 7 files**.

---

### DECK 2 — Design System (Tailwind CDN + Google Fonts)

**Stack:** Tailwind CSS loaded via CDN script tag. No PostCSS, no `tailwind.config.js` file — config is declared inline on each page via `tailwind.config = { ... }`.

**Color Palette:**
| Token | Hex | Usage |
|---|---|---|
| `primary-400` | `#f19340` | Links, stars, highlights |
| `primary-500` | `#ed751a` | CTA buttons, accents |
| `primary-600` | `#de5b10` | Button hover states |
| `slate-950` | `#0d1321` | Page background |
| `slate-900` | `#0f172a` | Section backgrounds |
| `slate-800/50` | — | Card surfaces (50% opacity) |

**Typography:**
- **Body:** DM Sans (Google Fonts) — weights 300–700, italic 400
- **Display/Headings:** Outfit (Google Fonts) — weights 400–800, applied via `font-display` utility class

**Breakpoints used:** `md:` (768px) for all responsive layout switches (grid columns, nav collapse, footer flex direction).

---

### DECK 3 — Homepage / Landing (`index.html`)

**Sections:**
1. Hero — Headline, subheadline, two CTA buttons (Contact / Reviews)
2. Review Slider — Infinite CSS scroll animation fed by `reviews.json` via `fetch()`
3. Services Overview — 3-card grid linking to each service page
4. CTA Banner — Final push to `contact.html`
5. Footer

**Review Slider mechanism:**
- Inline `<script>` on the page fetches `reviews.json`.
- Cards are built via template literals with `textContent`-based XSS escaping.
- The track is duplicated (`html + html`) so the CSS `slide` keyframe animation loops seamlessly.
- Animation pauses on hover via `.slider-track:hover { animation-play-state: paused; }`.

---

### DECK 4 — Service Pages

#### `website-development.html` — Web Dev
Details custom website builds, pricing/tiers, process, and CTA to contact.

#### `tutoring.html` — AP Calculus Tutoring
Details online tutoring offering, subjects covered, session structure, and booking CTA.

#### `romulus-beats.html` — Romulus Beats
Music production / beat licensing page. Links out to external store/platform for purchasing beats.

**All three pages share the same template pattern:** hero header → feature/detail sections → CTA → footer.

---

### DECK 5 — Contact / Lead Capture (`contact.html` + `js/contact.js`)

**Form fields:** Name, Email, Service (dropdown: Website / Tutoring / Beats / Other), Message.

**Current data flow:**
1. User submits form.
2. `contact.js` intercepts `submit` event, stores submission in `localStorage` as a fallback.
3. No live email delivery by default — a `<p>` note on the page instructs connecting to Formspree or Netlify Forms.

**Recommended upgrade path:** Point `<form action="https://formspree.io/f/{ID}">` to push submissions directly to email with zero backend code.

**Review Slider** (same as homepage) is also rendered below the form on this page.

---

### DECK 6 — Reviews System (Full Pipeline)

This is the most architecturally significant system on the site. It spans three files and two external services.

```
Client submits review
        │
        ▼
reviews.html form (Formspree POST)
        │  → Email delivered to Adam
        ▼
Adam logs into admin.html
        │  → PIN gate (client-side, CODE = '23262326')
        ▼
Admin enters review manually → PUT to JSONBlob API
        │  BLOB_URL = https://jsonblob.com/api/jsonBlob/019ce0dc-...
        ▼
All public pages fetch() JSONBlob → render reviews live
        │
        ├─ index.html        → Animated slider
        ├─ contact.html      → Animated slider
        └─ reviews.html      → Full paginated list (via js/reviews.js)
```

**JSONBlob:** A free REST-based JSON hosting service. The entire reviews array is stored as one JSON document. `PUT` replaces it; `GET` retrieves it.

**`reviews.json`** (local file): Acts as a local backup/seed. Not currently auto-synced — manually maintained.

**`js/reviews.js`:** Fetches from JSONBlob, renders review cards into `#reviews-container` on `reviews.html`, hides `#reviews-placeholder` when data exists.

**XSS protection:** All user content rendered via innerHTML uses the `esc()` helper:
```js
function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
```

**Security note on admin PIN:** The access code `23262326` is hardcoded in plain JavaScript — visible to anyone who views source. This is security-by-obscurity only. Acceptable for low-stakes use; not suitable if admin privileges escalate in scope.

---

### DECK 7 — Admin Panel (`admin.html`)

**Access:** PIN-gated (`23262326`), fully client-side. No session persistence — logout clears the UI state only.

**Capabilities:**
- Add a review (name, service, rating, text) → PUTs updated array to JSONBlob → immediately live on site
- Delete a review → PUTs updated array to JSONBlob
- View all current reviews with count

**Workflow:** Adam receives a Formspree email when a client submits a review → copies content → pastes into admin panel → hits "Post Review" → live within seconds.

**Entry point:** The `©` copyright symbol in the footer on every page is a hidden link to `admin.html`.

---

## ENGINEERING SPECS — External Dependencies

| Service | Purpose | Cost | Notes |
|---|---|---|---|
| Tailwind CDN | Styling framework | Free | No build step; not suitable for tree-shaking |
| Google Fonts | DM Sans + Outfit typefaces | Free | Loaded via `<link>` preconnect |
| Formspree | Form-to-email (reviews + contact) | Free tier | `maqpnovj` endpoint on reviews form |
| JSONBlob | Live review data store | Free tier | Single blob URL; no auth beyond knowing the URL |
| localStorage | Contact form fallback persistence | Browser native | Data lives in user's browser only |

---

## DEPLOYMENT PROFILE

**Host requirement:** Any static file host. Zero server-side logic required.  
**Recommended hosts:** GitHub Pages, Netlify, Vercel, Cloudflare Pages  
**Build command:** None  
**Environment variables:** None  
**Current branch:** `main` (default & production)  
**Repo:** `adam-lovell/adamjlovell-digital-services`

---

## KNOWN TECHNICAL DEBT & UPGRADE TARGETS

| Issue | Impact | Fix |
|---|---|---|
| Nav/footer duplicated across 7 files | Any global change requires 7 edits | Migrate to a JS include or SSG (Eleventy/Astro) |
| Tailwind loaded from CDN | Larger payload, no purging, no custom plugins | Add a build step with Tailwind CLI |
| Admin PIN hardcoded in JS source | Visible in browser DevTools | Move to a proper auth provider (Clerk, Supabase Auth) |
| `reviews.json` local file out of sync with JSONBlob | Potential data drift | Auto-generate from JSONBlob on deploy, or deprecate |
| Contact form no live email delivery | Leads may be missed | Connect Formspree endpoint |
| No analytics | Blind to traffic sources and conversion | Add Plausible or Fathom (privacy-first, script-tag drop-in) |
| No meta/OG tags beyond `<title>` | Poor SEO and social sharing previews | Add `<meta>` description, Open Graph, Twitter Card tags |

---

## CHANGE LOG

| Date | Change | Files Affected |
|---|---|---|
| 2026-03-20 | Initial architecture document created | `WEBSITE_ARCHITECTURE.md` |
| 2026-03-20 | Added Vessel Classification / Starfleet Diagnostic section | `WEBSITE_ARCHITECTURE.md` |

---

*"Shields up. All systems nominal. The Enterprise is flight-ready."*
