# Choufli Mosta9bel

> "Look to your future."

A guidance platform for Tunisian youth — helping **school dropouts**, **undecided students**, and **graduates** find real, practical paths to a stable future, with or without a Bac.

Built with **Next.js 15** (App Router) and **Tailwind CSS v4**.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

For a production build (much faster page-to-page navigation):

```bash
npm run build
npm run start
```

> **Why use the production build?** In dev, Next.js compiles each route on
> demand, so the first visit to a page can take 1–5 seconds. The production
> build precompiles everything and serves routes in **15–50ms**. If navigation
> feels sluggish, switch to `npm run build && npm run start`.

---

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build (also type-checks) |
| `npm run start` | Serve the production build |
| `npm run sync:site` | Refresh `lib/site.generated.json` from sejed.dev |
| `npm run check:site` | Fail if the generated profile is out of date (CI) |

---

## Languages

English, French and Arabic, with full RTL support for Arabic.

- **First visit** — an Apple-style sheet asks for the language, then saves the
  choice to `localStorage`
- **Desktop** — a globe menu in the top capsule
- **Mobile** — the globe button in the nav cluster (tap to cycle)
- Switching is **entirely client-side**: no page reload, no route change. The
  tree cross-fades over ~220ms so text morphs rather than popping
- Arabic flips `dir="rtl"` on `<html>`, which mirrors the entire layout

Translations live in one file: `components/dictionaries.ts`. English is the
source of truth and TypeScript enforces that French and Arabic mirror its shape.

> All five pages are translated. The score calculator's formula labels are
> formulaic (`FG = 4 x MG + ...`) and stay in English by design, since that is
> how they appear in the official guide.

---

## Score calculator

`/graduates` ships a **reference** orientation-score calculator built from the
formula the Tunisian Ministry publishes in its annual orientation guide.

There is **no official API** — the Ministry publishes the formula as a PDF and
runs no calculator of its own, which is why every Tunisian site (including
`score.faccna.tn`) reimplements the same table client-side.

What it computes:

- Your **general average (MG)**
- Your **orientation score (FG)** for your section
- The same score with the **7% geographic bonus** applied

What it deliberately does **not** do: show per-filière thresholds. The Ministry
republishes ~700 filière formulas every year, and stale thresholds are worse than
none. The calculator links out to the official guide instead.

**Accuracy:** the engine reproduces the official worked example exactly
(technique student → FG of 104.055). Coefficients are centralised in
`lib/scoring.ts`, so next year's update is a single-file edit.

```bash
# Verify the engine against the published example
node -e "console.log(4*11 + 1.5*13.37 + 1.5*6 + 8.75 + 9.25 + 13)"  // 104.055
```

---

## Two identities, kept separate

`lib/site.ts` deliberately distinguishes the **project** from its **publisher**:

| | Where it shows | Where to edit |
|---|---|---|
| **Choufli Mosta9bel** — email, domain, project socials | Footer, contact section | The `site` / `projectSocials` blocks in `lib/site.ts` |
| **Sejed Trabelsi** — the publisher | Legal notices only | Auto-synced from sejed.dev |

Sejed's details never leak into the project's own contact details. His profile
lives in `lib/site.generated.json`, which is produced by scraping the JSON-LD
`Person` block from [sejed.dev](https://sejed.dev):

```bash
npm run sync:site
```

Add a profile over there (Instagram, LinkedIn, X, ...) and it flows into the
publisher block of `/privacy` and `/terms`.

### Adding the project's socials

In `lib/site.ts`, fill in a value:

```ts
export const projectSocials = [
  { network: "instagram", handle: "https://www.instagram.com/choufli_mostakbel/" },
  { network: "linkedin", handle: "https://www.linkedin.com/company/choufli-mostakbel" },
  { network: "github", handle: "" },
  { network: "x", handle: "" },
];
```

Paste whichever you have — the shape does not matter:

| You type | Result |
|---|---|
| `choufli_mostakbel` | `https://instagram.com/choufli_mostakbel` |
| `www.instagram.com/choufli_mostakbel/` | `https://instagram.com/choufli_mostakbel` |
| `https://www.linkedin.com/company/choufli-mostakbel` | `https://linkedin.com/company/choufli-mostakbel` |

Protocol, `www.`, trailing slashes and query strings are stripped automatically,
and a LinkedIn `/company/` slug stays under `/company/` rather than being forced
into `/in/`. Duplicate URLs are collapsed, and an empty `""` hides that icon
entirely — no broken links, no empty circles.

Rendered in the **footer** and the **contact section** on every page.

---

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing page — three audiences (dropout / student / graduate) |
| `/dropouts` | ATFP certifications + second chance schools |
| `/divisions` | Tunisian high school divisions, compared |
| `/graduates` | University orientation + the score calculator |
| `/about` | About the project + contact form (`#contact`) |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

Also auto-generated: `/sitemap.xml`, `/robots.txt`.

Custom error states:

| File | Handles |
|---|---|
| `app/not-found.tsx` | 404 — on-brand, with every path one tap away |
| `app/error.tsx` | Runtime failures inside a page, with a retry button |
| `app/global-error.tsx` | Failures in the root layout itself |

---

## Design language

**Apple-native calm.** System-first typography, generous white space, one
system blue used sparingly, and soft depth instead of hard borders. Every
animation uses the Apple easing curve and respects
`prefers-reduced-motion`.

### Colour tokens (`app/globals.css`)

| Token | Value | Use |
|---|---|---|
| `bg` | `#ffffff` | Page background |
| `bg-alt` | `#f5f5f7` | Alternating sections, placeholders |
| `ink` | `#1d1d1f` | Primary text, dark sections |
| `gray` | `#86868b` | Muted icons and labels |
| `gray-2` | `#6e6e73` | Body copy |
| `blue` | `#0071e3` | The single accent — CTAs, active states |
| `sep` | `#d2d2d7` | Hairline dividers |

All tokens live in the `@theme` block, so Tailwind generates utilities like
`text-ink`, `bg-bg-alt`, and `text-blue` directly.

### Typography

| Font | Role | Source |
|---|---|---|
| **Matcha Style** | Hero headlines only | Local, `app/fonts/MatchaStyle.ttf` (free for personal + commercial) |
| **Patrick Hand** | Everything else | Google Fonts |

Loaded via `next/font` in `app/layout.tsx`, exposed as `--font-matcha` and
`--font-patrick`. Swap or remove them in the same file.

### Custom utilities

| Class | Purpose |
|---|---|
| `.hero-mask` | Hero headline where the **text is filled with the photo** via `background-clip: text` |
| `.frosted` / `.frosted-dark` | Translucent blurred surfaces (nav, tab bar) |
| `.skeleton` | iOS-style shimmer placeholder |
| `.input-ios` | iOS-style filled input |
| `.seg-track` | iOS segmented control track |
| `.snap-cara` / `.snap-card` | Horizontal scroll-snap carousel |
| `.card-soft` / `.card-soft-hover` | Soft layered elevation |

Page and carousel scrollbars are also custom-styled (thin, rounded, blue thumb).

---

## Project structure

```
app/
  layout.tsx          Root layout: fonts, metadata, JSON-LD, Nav + Footer
  template.tsx        Route transition (soft rise on every page change)
  not-found.tsx       404
  error.tsx           Route-level error boundary
  global-error.tsx    Root-layout fallback
  page.tsx            Home
  dropouts/divisions/graduates/about/privacy/terms/page.tsx
  sitemap.ts          Auto-generated sitemap
  robots.ts           Auto-generated robots.txt
  globals.css         Design tokens + custom utilities
  fonts/              MatchaStyle.ttf

components/
  Nav.tsx             Top capsule + mobile bottom tab bar
  Hero.tsx            Typographic hero (photo-through-letters)
  Kinetic.tsx         Word-by-word reveal animation
  Reveal.tsx          Scroll-triggered reveal, Rule, ZoomFrame
  ScrubText.tsx       Text that fills in as you scroll
  SpotlightCard.tsx   Card with cursor spotlight
  DivisionTabs.tsx    Segmented control + division cards
  AtfpPan.tsx         Scroll-snap carousel of ATFP levels
  Contact.tsx         Contact form + social links
  ScoreCalculator.tsx Orientation score calculator
  LanguageProvider.tsx  i18n context, RTL, cross-fade
  LanguagePicker.tsx    First-visit Apple-style sheet
  LanguageSwitcher.tsx  Navbar language control
  dictionaries.ts     EN / FR / AR strings
  Footer.tsx
  SiteIcons.tsx       Custom client-provided SVG icons
  Logo.tsx            Favicon-based logo

  # Present but not currently mounted anywhere:
  Skeleton.tsx        Shimmer placeholder (ready to use)
  Marquee.tsx         Infinite horizontal marquee
  Magnetic.tsx        Magnetic hover effect

lib/
  site.ts             Site constants, hosting info, contact details
  site.generated.json Synced from sejed.dev - do not hand-edit
  scoring.ts          Bac coefficients + FG formula (single source of truth)

scripts/
  sync-site.mjs       Scrapes sejed.dev -> lib/site.generated.json

public/
  images/             Hero and section photography
  favicon.png  logo.svg  logo-white.png  og-image.png
```

---

## Navigation

- **Desktop** — a floating frosted capsule with inline links plus a "Get
  started" CTA.
- **Mobile** — the capsule shows the logo and two custom icons (info, mail);
  primary navigation moves to an iOS-style **bottom tab bar** with a blue
  active state and safe-area insets.

The body carries `pb-[calc(64px+env(safe-area-inset-bottom))]` on small
screens so content never hides behind the bar.

---

## SEO

Built from scratch — we own every URL, there is no legacy HTML to preserve.

- **Metadata** — per-page `title`, `description`, and `canonical`
- **Open Graph + Twitter cards** — per-page `og:url` and `og:title`, with a
  1200×630 image
- **JSON-LD** — `Organization` and `WebSite` schema for a Google knowledge panel
- **`sitemap.xml` / `robots.txt`** — generated from `app/sitemap.ts` and
  `app/robots.ts`

### Before deploying to a different domain

The production domain is hardcoded in three files. If you deploy somewhere
other than `chouflimostakbel.tn`, update it:

- `app/layout.tsx` — `metadataBase`
- `app/sitemap.ts` — `base`
- `app/robots.ts` — `sitemap` and `host`

---

## Accessibility

- `prefers-reduced-motion` is respected across all animation components
- Visible focus rings (`:focus-visible`) on every interactive element
- Semantic landmarks, `aria-label`s on icon-only links, and `aria-current` on
  the active tab
- Skeletons are `aria-hidden` so they aren't announced

---

## Hosting & publisher

| | |
|---|---|
| **Publisher** | [Sejed Trabelsi](https://sejed.dev) — Full Stack Developer |
| **Hosting** | CortexHQ infrastructure (`cortexhq.net`) |
| **Data centre** | Gravelines (GRA), France |

Author details are synced automatically from sejed.dev — see
[Author profile](#author-profile-is-synced-from-sejeddev). Static hosting facts
live in `lib/site.ts`.

---

## Contact

**contact@chouflimostakbel.tn**

> The contact form is a front-end stub — it currently shows a success state
> locally without sending. Wire it to an API route or form service before
> launch.

---

## Stack

| | |
|---|---|
| Framework | Next.js 15.5 (App Router, React 19) |
| Styling | Tailwind CSS v4 |
| Animation | `motion` (Framer Motion) |
| Icons | `@phosphor-icons/react` + custom SVGs |
| Language | TypeScript |

---

Made in Tunisia. Built by [sejed.dev](https://sejed.dev).
