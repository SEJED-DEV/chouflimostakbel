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
| `npm run icons` | Regenerate `public/icons/` from `favicon.png` |
| `npm run test` | The chunk-error detector's own test suite |
| `npm run check:encoding` | Fail if any translated file has been corrupted |
| `npm run verify:deploy [url]` | Check a live deployment; exits non-zero on failure |
| `npm run vapid` | Generate a web-push key pair |
| `npm run notify:push` | Announce the newest release to push subscribers |

---

## PWA

Installable to the home screen on iOS, Android and desktop.

- **`app/manifest.ts`** — name, icons, `standalone` display, theme colour,
  generated at `/manifest.webmanifest`
- **`public/sw.js`** — service worker, registered only in production builds
- **`public/offline.html`** — offline fallback, Apple-style
- **`public/icons/`** — 192/512 standard, maskable variants, and a 180px
  Apple touch icon, generated from `favicon.png` via `npm run icons`

### The service worker will never serve stale HTML

This is the one rule that matters. Navigation requests are **network-first**
and only fall back to cache when genuinely offline. Only content-hashed assets
under `/_next/static/`, plus icons and images, are served cache-first — those
are immutable by definition.

Old caches are purged on activate. To invalidate everything, bump
`CACHE_VERSION` in `public/sw.js`.

> Registration is skipped in `npm run dev` on purpose: a cached bundle fights
> hot reloading, and dev serves everything un-cached anyway.

> **Service workers require HTTPS** (or `localhost`). Over plain HTTP on a
> deployed domain the browser will silently decline to register it.

---

## Cloudflare

Two settings on the Cloudflare side matter.

**Turn off Scrape Shield → Email Address Obfuscation.** It rewrites every
email address in the HTML into a `/cdn-cgi/l/email-protection` link, which
their script decodes. Where that script does not run — a plain text browser,
an email reader, a crawler, an offline page — the link lands on a 404 instead
of opening a mail client. The contact form falls back to that address, so a
broken one means a message that never gets sent.

The markup also carries Cloudflare's own `<!--email_off-->` exemption, so
this works either way, and `/cdn-cgi/l/email-protection` is answered with a
small page showing the address rather than a 404 for anything that was
cached before.

**Do not cache the HTML document for a year.** Next.js sends
`s-maxage=31536000` for prerendered pages, which tells the CDN to hold the
document until 2027. The assets are content-hashed and genuinely immutable —
it is only the document that has to be revalidated, because the next deploy
replaces the chunks it names. `next.config.ts` sets the correct policy, but a
CDN rule that overrides it will bring the stale-chunk error back.

---

## The database

Plain Postgres with row level security — which is what the self-hosted
Supabase is underneath, so the schema moves to it without changing.

The rule the whole thing rests on: **the application never decides who may
read a row.** It says who the caller is, and the database decides. A rule
that says "only your own rows" cannot be bypassed, because the browser never
talks to Postgres — only the server does, and the server tells the database
who it is acting for.

Two roles, on purpose:

| Role | Used for | RLS applies? |
|---|---|---|
| `chouflimostakbel` | Owns the tables. Migrations only. | No |
| `chouflimostakbel_app` | Runs the application. | **Yes** |

### Running it locally

The project keeps its own Postgres instance, separate from anything else on
the machine: its own data directory (`.pgdata`, git-ignored), its own port
(5433), and nothing of the system's is touched.

```bash
npm run db:start     # start the instance
npm run db:setup     # create the roles, the database, and the schema
npm run db:check     # prove the policies actually bind
npm run db:stop      # stop it
```

`db:setup` writes `DATABASE_URL` into `.env.local` with a generated
password. It is safe to run again.

> The instance is started with a trimmed `PATH`. The backend processes inherit
> it, and a `PATH` carrying another build of the same libraries — Git for
> Windows ships its own — makes them fail to load.

### The schema

`db/schema.sql`, in three tables:

- **profiles** — a person: address, a bcrypt hash, a name, a handle
- **sessions** — a signed-in session. The cookie carries a random token; only
  its hash is stored, so a copy of the table hands nobody a working session
- **email_verifications** — a pending address confirmation

The operations that happen *before* we know who the caller is — creating an
account, checking a password, finding a session — are `SECURITY DEFINER`
functions. They are the only way in, and they check their own conditions.

The password is hashed by the database, with bcrypt through `pgcrypto`. The
application never stores a hash and never compares a password itself.

### Accounts

`/account` — create an account, sign in, sign out. `npm run check:auth` runs
the whole flow against a running server: register, sign in with the wrong
password, sign in with the right one, refuse a weak password, refuse an
address already taken, and confirm that signing out deletes the session row
rather than just the cookie.

---

## Update notifications

When the site is updated, everyone who turned on update alerts gets a
notification. One message, in the reader's own language, linking to the
changelog.

- **Opt-in, always.** A push subscription is a device token, not a contact: no
  email address is asked for and nothing is tracked. The reader can turn it
  off, and turning it off deletes the stored token immediately.
- **Never on page load.** The prompt appears in the footer, so it is offered
  when someone reaches the end of a page rather than while they are reading.
  Asking unprompted is how a browser ends up permanently refusing.
- **For a day, then never again.** The first prompt starts a 24 hour window.
  Inside it the prompt reminds every four hours; after that the reader is
  locked out permanently. The schedule lives in `lib/push-prompt.ts` and is
  pinned by tests.
- **Once per version.** The store remembers the last version announced, so
  deploying five times in a day does not ping anyone five times.

```bash
npm run vapid            # generate a key pair
npm run notify:push      # announce the newest release
npm run notify:push -- --dry-run   # show what would be sent
```

Set `NEXT_PUBLIC_VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` in `.env.local`
first. **Back the private key up**: changing it invalidates every existing
subscription, and every reader would have to turn notifications on again.

Subscriptions live in Postgres when `DATABASE_URL` is set — the self-hosted
Supabase the platform is planned on — and in `data/push.json` otherwise, which
is fine for one machine but is not a backup.

> **iOS** delivers web push only to an app added to the Home Screen, on
> iOS 16.4 and later. The opt-in stays hidden on an iOS tab that is not
> installed, rather than failing after the reader has agreed to something.

> **Delivery is best effort.** A push that cannot be delivered expires rather
> than queueing forever, so the copy never promises that a message arrived.

---

## Languages

English, French and Arabic, with full RTL support for Arabic.

- **First visit** — an Apple-style sheet asks for the language, then saves the
  choice to `localStorage`
- **After that** — a version-gated "what's new" sheet (see below)
- **Desktop** — a language menu in the top capsule
- **Mobile** — the language button in the nav cluster (tap to cycle)
- Switching is **entirely client-side**: no page reload, no route change. The
  tree cross-fades over ~220ms so text morphs rather than popping
- Arabic flips `dir="rtl"` on `<html>`, which mirrors the entire layout

Translations live per page in `components/i18n/<page>.ts` — the same shape in
all three languages, with TypeScript enforcing it. Shared chrome strings (nav,
footer, form, calculator) live in `components/dictionaries.ts`.

The two modals are sequenced rather than concurrent — the language sheet always
wins the first visit, so nothing ever appears underneath it.

### "What's new" is version-gated, not a permanent flag

It stores **the version the visitor last saw** (`cmb-version`), not a boolean:

| Situation | Behaviour |
|---|---|
| Never seen the site | Shows the latest release as a welcome |
| Last saw v1.0.0, now on v1.1.0 | Shows **every** entry newer than v1.0.0 |
| Already on the newest | Stays quiet |

So it reappears whenever you ship something and never nags otherwise. To notify
people about a release, add an entry to the top of `entries` in
`components/i18n/changelog.ts` (all three languages) — that is the only step.

---

## Themes

Light and dark, following the OS setting until the visitor picks explicitly.

- Every colour is a `@theme` custom property, so flipping `.dark` on `<html>`
  re-themes the whole site **with no `dark:` variants anywhere in the JSX**
- `--color-ink` is text and flips; `--color-surface` is an always-dark surface
  for the full-bleed statement sections and deliberately does not
- An inline pre-paint script applies the stored theme before React hydrates, so
  there is no flash of the wrong theme
- The switch is animated: browsers with the View Transitions API get a circular
  wipe out from the button; everything else eases colour changes via a
  short-lived `.theme-anim` class. Both are skipped under
  `prefers-reduced-motion`
- Toggle lives in the nav capsule, icon-only on mobile

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
| `/blogs` | The blogs. Empty for now, and honest about it |
| `/about` | About the project + contact form (`#contact`) |
| `/contact` | The contact form on a page of its own |
| `/login` | Sign in |
| `/signup` | Create an account — a username and a password is enough |
| `/profile` | Your own profile |
| `/changelog` | Release history, newest first, with the deploy status |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/soon` | The roadmap for the platform to come |

### The navigation

**On a phone there is no top bar.** The tab bar at the bottom is the
navigation — home, the three guides, blogs, and your profile — and the body
carries the padding it needs so nothing hides underneath it. The language and
theme controls live in the footer on a phone, and in the top bar on a
desktop.

**On a desktop** the capsule holds the links, and the blue button is the
account: it says **Log in** until you are signed in, and your name afterwards.

**A right click opens the site's own menu** — open in a new tab, copy the
link, share, install the app, flip the theme. Touch is left alone, because a
long press on a phone is for selecting text. Shift and right click gives the
browser's own menu back.

---

## Contributing and the changelog

**[CONTRIBUTING.md](CONTRIBUTING.md)** is the guide for anyone picking this
up: how to run it, what has to pass before a push, the design rules, and the
commit convention.

**`CHANGELOG.md` is generated.** `components/i18n/changelog.ts` is the single
source — the same data the site's changelog page uses — and
`scripts/write-changelog-md.mjs` writes the file at the root, before every
build. So GitHub and the site can never disagree about what shipped. Edit the
slice, never the Markdown.

---

## License

[Apache License 2.0](LICENSE) © 2026 Sejed Trabelsi.

Bundled fonts keep their own licences and are **not** covered by it:

| Font | Licence |
|---|---|
| **Satoshi** | ITF Free Font License v2.0 — `app/fonts/Satoshi-LICENSE.txt` |
| **Matcha Style** | Free for personal and commercial use (Khurasan Studio) |

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
  Publisher.tsx       Publisher block for the legal notices
  SocialLinks.tsx     Shared social glyphs + icon row
  ServiceWorkerRegister.tsx  Registers the PWA service worker (prod only)
  WhatsNewPopup.tsx   Version-gated "what's new" sheet
  ThemeProvider.tsx   Light/dark state + pre-paint init script
  ThemeToggle.tsx     Nav theme control (animated switch)
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

The production domain lives in **one place** — `site.domain` in `lib/site.ts`.
Sitemap, robots, canonical URLs, Open Graph and the structured data all read
from it, so moving the domain is a one-line change.

Two things do not move with it, because they are not ours to change:

- **The apex certificate.** `chouflimostakbel.tn` and `www.chouflimostakbel.tn`
  need to be on the certificate, and the apex needs to redirect.
- **`site.liveHosts`.** The list of hostnames that count as the real site. It
  gates the contact form (see below), so add the new hostname there too.

```ts
export const site = {
  domain: "https://www.chouflimostakbel.tn",
  liveHosts: ["chouflimostakbel.tn", "www.chouflimostakbel.tn"],
  // ...
};
```

### The contact form opens itself

The form is closed by default and opens only on `site.liveHosts`. A preview
build on some other address therefore never collects messages it cannot
deliver — it shows the email address instead.

`NEXT_PUBLIC_CONTACT_FORM=always` opens it everywhere, which is how you test
the real thing before the domain move. `never` closes it everywhere.

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

**contact@chouflimostakbel.tn** (currently live at https://loujayn.sejed.dev

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
