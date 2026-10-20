# Contributing to Choufli Mosta9bel

Thanks for wanting to help. This is a real site that people use to make
decisions about their future, so the bar is "would I be comfortable if this
went wrong for someone who needed it".

---

## Getting it running

You need **Node 22** and **Docker**. Supabase runs in it.

```bash
git clone https://github.com/SEJED-DEV/chouflimostakbel.git
cd chouflimostakbel
npm install
cp .env.example .env.local
```

Then start Supabase and apply the schema:

```bash
npm run supabase:start   # five containers: db, auth, rest, gateway, edge
npm run db:migrate      # apply pending supabase/migrations (never drops data)
```

`supabase start` prints a URL, an anon key and a service role key. Put them
in `.env.local` — `.env.example` says which is which. It is safe to run again.

> **Ports.** Supabase takes 54321-54324 and 54327. If another project of yours
> is already running, `supabase stop --project-id <name>` frees them, and it
> **keeps that project's data volume** so nothing is lost.

```bash
npm run dev          # http://localhost:3000
```

> **Use port 3000.** If something is already on it, find out whose it is
> before killing it - another project may be using it. Kill by PID, never
> `Stop-Process -Name node`, which kills every Node process on the machine.

### Supabase, briefly

The application never decides who may read a row. It presents a signed-in
reader, the API checks their JWT, and the policies - written against
`auth.uid()` - decide. If you are adding a table, enable row level security
and think hard about what `anon` may see. Today `anon` has no table grants at
all: it reaches the schema and finds nothing in it. That is deliberate.

Three roles:

- `anon` — no session, no table grants.
- `authenticated` — a signed-in reader. The policies apply.
- `service_role` — the server. Bypasses the policies, so use it only where
  there is no caller yet, and say why in a comment.

There is **no password column anywhere in this schema**. Supabase Auth holds
the hash in its own, behind its own API. If you find yourself writing one,
stop.

`npm run db:check` proves the policies still bind — please run it after
touching a migration.

---

## Before you push

```bash
npm test              # the unit suites
npm run check:encoding    # no translated file has been corrupted
npm run check:translations # nothing was left untranslated
npm run check:auth    # the whole account flow, against a running server
npm run verify:deploy -- http://localhost:3000   # the deployment checks
```

All of them must pass. `npm run build` type-checks as well.

The encoding and translation checks exist because Arabic has been silently
mangled twice in this project by tools that could not handle non-ASCII. If
you touch a translated file, run them.

---

## How the code is put together

- **`app/`** - routes. A page is a thin server component that exports
  `metadata` and renders a client component from `components/pages/`. The
  client component is what switches language.
- **`components/i18n/<page>.ts`** - one slice per page, holding the same
  structure in English, French and Arabic. TypeScript enforces that the three
  match.
- **`components/dictionaries.ts`** - the strings shared across every page.
- **`lib/`** - the parts with no interface: the database, sessions, the
  score formula, the site configuration.
- **`db/schema.sql`** - the database. Plain Postgres with row level security,
  which is what the self-hosted Supabase is underneath.

### Language

Adding a string means adding it in **all three languages**. The check will
tell you if you have not.

Arabic is right-to-left, and the whole layout mirrors for it. The site font
does not include Arabic, so it falls back to the system's - do not add a
font for it.

---

## Design

The site tries to be calm. It looks like an Apple product, and that is a
constraint rather than a mood:

- **Tokens, not colours.** `bg-bg`, `text-ink`, `text-gray-2` and the rest
  come from `app/globals.css`. Do not write a hex code in a component.
- **`--color-ink` is text and it flips with the theme. `--color-surface` is
  always dark and does not.** Getting that backwards makes white text on
  white in dark mode, which has happened.
- **A button whose background is fixed** - `bg-white` or `bg-ink` - needs a
  text colour that does not flip with it. `text-black` on a white button.
- **Motion is short and quiet.** 200-300ms, and never on a screen that asks
  for reduced motion.

---

## Commits

Write the message for someone reading it in a year. What changed, why, and
what you decided against.

Every commit carries its authors:

```
Co-Authored-By: Sejed Trabelsi <sejed.dev@gmail.com>
Co-Authored-By: TSSEJED <TSSEJED@users.noreply.github.com>
```

---

## The changelog

`components/i18n/changelog.ts` is the single source. `CHANGELOG.md` at the
root is **generated** from it by `scripts/write-changelog-md.mjs`, which runs
before every build - so never edit `CHANGELOG.md` by hand.

To record a release, add an entry to the slice in all three languages, and
list the commits it was built from.

---

## What is not done yet

The plan for the platform is published at `/soon`, including the decisions
that are still open. If you want to work on any of it, that page is where to
start - and the open questions there are genuinely open.

---

## Licence

Apache 2.0. The bundled fonts keep their own licences and are **not**
covered by it - see `README.md`.
