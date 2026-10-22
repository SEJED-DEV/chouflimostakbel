# Changelog

Every release of [Choufli Mosta9bel](https://www.chouflimostakbel), newest first.

Nothing ships quietly: if it is on the site, it is written down here. This file is
generated from `components/i18n/changelog.ts`, which is the single source - do not
edit it by hand. The site carries the same record in English, French and Arabic at
[/changelog](https://www.chouflimostakbel/changelog).

## v1.3 - 22 October 2026

The site learns to wear a face, to look after itself, and to say who wrote what.

### Added

- An admin panel at /admin, for staff. Everyone with an account, everything that has been written, how much of it is published, and who holds which badge. It says what it cannot do yet rather than implying a moderation queue that does not exist.
- The account button opens a menu: the profile, the admin panel for staff, and signing out. Signing out is now reachable from any page, including on a phone, instead of only from the pages that had a settings gear.
- A seventh tab for staff in the bottom bar on a phone, for the admin panel. The tab labels scale with the screen, so seven of them fit on a narrow phone where six fixed-size ones did not.
- Signing in and signing up now ask the reader to agree to the terms of service and the privacy policy, with both documents linked inside the sentence that asks. The server asks as well, so the box cannot be posted around.
- The moment the terms were agreed is recorded, once, in a new column that only the platform can write - the same guard that stops a reader granting themselves a badge now stops them writing their own consent date.
- Every post and every person now has its own preview image, drawn with the post's own title or the person's own photograph. A link shared in a chat shows the thing that was shared.
- Every post carries BlogPosting structured data, and every person carries ProfilePage and Person, so a search engine knows what it is looking at rather than guessing.
- A deploy script, so the live site is fetched, migrated, built and restarted the same way every time, with each migration applied inside a transaction with its ledger row. There is no reset and no delete anywhere in it.

### Fixed

- The top capsule no longer hides on the community index and the admin panel. It is out of the flow and never took any width from anything - what it took was the account, the theme, the language and the gear, on the two pages a reader is most likely to be reading.
- The button on the profile page said "Write the first one" to everybody. It now says "Write another" once you have written something.
- The upstream Supabase image grants every table to anon by default. A migration revokes what was never asked for and re-asserts exactly the grants each table is meant to have. It only ever removes privileges.

### Changed

- The account button in the navigation now carries the reader's own photograph instead of a generic person icon, and the ring around it is sampled from the photograph so a pale picture does not vanish into a pale circle.
- Posts and profiles now carry full Open Graph and Twitter card metadata, a canonical URL, keywords built from the post's tags, and the author linked so a reader can go from the post to the person.
- The navigation was reworked. On a narrow screen the wordmark is gone and the account is the photograph alone, because the capsule was carrying more than a phone could hold.
- The roadmap page now lists only what is still to come, and names two new features: direct messages between people, and images and files attached to a post. Both bring a decision with them, and the page says which.

## v1.2 - 19 October 2026

The roadmap page, a contact form that actually delivers, and a site that survives its own updates.

### Added

- A new page: /soon. It publishes the roadmap for the platform to come - accounts, posts, profiles and a feed - along with the decisions taken so far and the ones still open.
- The changelog now says whether the code you are reading is the newest. If the site is behind its own repository, it says so and links to what is missing.
- Update notifications, if you want them: the app can tell you when the site is updated, in your own language. It is a device token, not an account - no email address, and nothing is tracked.
- The privacy policy, the terms, the 404 and the error pages now switch language with the rest of the site. An Arabic reader who hit a broken link used to get an English page.
- The contact form opens by itself on the project's own domain and stays closed on preview builds, so a half-finished version never collects messages it cannot deliver.
- Accounts. A username and a password, on Supabase, with the row level security policies deciding who may read what. An email address is not required - the platform does not need one.
- The account page is gone, split into /login and /signup, and joined by a profile page of your own.
- A blogs section, empty for now, and honest about being empty.
- A context menu of your own: open in a new tab, copy the link, share, install the app, and flip the theme.
- CONTRIBUTING.md, and a CHANGELOG.md generated from the same data the site uses, so the two can never disagree.

### Fixed

- The contact form now delivers. It used to look like it worked and drop your message on the floor. It validates, rate limits, and says what went wrong instead of pretending.
- A stale build can no longer kill the page. Documents are revalidated rather than cached for a year, and a failed chunk load recovers by itself instead of leaving a blank screen.
- Buttons that inverted in dark mode now invert their text too. The install button used to turn near-white and keep white text, which made it disappear.

### Changed

- The backend decision is no longer pending. Supabase, self-hosted on our own infrastructure. What that costs us, and what it saves, is written down plainly rather than glossed over.
- The cost risks on /soon are split apart: the AI cost, which is metered per call, and the infrastructure cost, which is ours now that the backend is self-hosted.
- The domain is defined in one place now. Moving it used to mean four files, which had already drifted apart.
- The changelog page itself is rebuilt: each release collapses to one line, the newest stays open, and the changes are grouped by kind and searchable. A long changelog no longer means a long scroll.
- Sign-in runs on Supabase Auth rather than sessions of our own. The password, the refresh tokens and the recovery flow are its. The handle is still what you sign in with: GoTrue insists on an address, so it is handed one built from the handle, which the reader never sees and nothing is ever sent to.
- On a phone there is no top bar any more. The tab bar at the bottom is the navigation, and it takes the space it needs so nothing hides underneath it.
- The blue button in the navigation is now Log in, and it becomes your name once you are signed in.

### Commits

- [`9fe2316`](https://github.com/SEJED-DEV/chouflimostakbel/commit/9fe2316) - Add a /soon page publishing the platform roadmap
- [`4b85839`](https://github.com/SEJED-DEV/chouflimostakbel/commit/4b85839) - Settle the backend decision: self-hosted Supabase
- [`3cff07d`](https://github.com/SEJED-DEV/chouflimostakbel/commit/3cff07d) - Fix dark-mode buttons that kept a fixed text colour
- [`a546d47`](https://github.com/SEJED-DEV/chouflimostakbel/commit/a546d47) - Stop a stale build from killing the page
- [`bc0f170`](https://github.com/SEJED-DEV/chouflimostakbel/commit/bc0f170) - Say on the changelog whether this build is the newest
- [`0222878`](https://github.com/SEJED-DEV/chouflimostakbel/commit/0222878) - Make the contact form actually deliver
- [`4b13f13`](https://github.com/SEJED-DEV/chouflimostakbel/commit/4b13f13) - Split the cost risk, and check deploys and encoding automatically
- [`9e135e7`](https://github.com/SEJED-DEV/chouflimostakbel/commit/9e135e7) - Define the domain in one place
- [`49ffe21`](https://github.com/SEJED-DEV/chouflimostakbel/commit/49ffe21) - Add update notifications
- [`f9cd963`](https://github.com/SEJED-DEV/chouflimostakbel/commit/f9cd963) - Switch language on the legal and error pages too

## v1.1.1 - 18 October 2026

Fixes: the install buttons did nothing on phones, iOS had no honest answer, and a few buttons lost their text in dark mode.

### Fixed

- The download buttons in the mobile menu and the footer now work. They were silently broken for anyone who had dismissed the install sheet in the previous week.
- The service worker now registers early enough that a first visit can become installable.
- Buttons whose background inverts in dark mode now invert their text too. The install button used to turn near-white and keep white text, which made it disappear.

### Changed

- The install sheet no longer offers a lone “Not now”. When a browser cannot prompt, it explains what to do instead.
- On iOS the sheet now says plainly that a website cannot install itself, and gives the three taps that work: Share, Add to Home Screen, Add.
- Everywhere else, it explains the reload-once step browsers require before they will offer installation.

### Commits

- [`827d685`](https://github.com/SEJED-DEV/chouflimostakbel/commit/827d685) - Fix the install buttons doing nothing on mobile
- [`b6ef424`](https://github.com/SEJED-DEV/chouflimostakbel/commit/b6ef424) - Explain the install flow on iOS instead of silently failing
- [`279af42`](https://github.com/SEJED-DEV/chouflimostakbel/commit/279af42) - Add install buttons to the mobile nav and the footer

## v1.1.0 - 18 October 2026

A complete rebuild of the site, plus installable as an app and light or dark mode.

### Added

- The site was rebuilt from the ground up. The design, layout and writing are all new - v1.0.0 looked nothing like this.
- A full redesign across every page, built for clarity on a phone first.
- Four new pages: About, Changelog, and proper Privacy and Terms pages.
- The site is now in English, French and Arabic, switchable at any time, with Arabic laid out right-to-left.
- A university orientation score calculator, built on the Ministry of Higher Education formula, replacing the third-party tool we used to link to.
- Installable on iOS, Android and desktop: add it to your home screen and it opens full screen, like a native app.
- Offline fallback: pages you have already opened stay readable when the connection drops.
- An install prompt inside the browser, so adding the site to your device takes a single tap.
- Install buttons in the mobile menu and the footer.
- On iOS, where a site cannot install itself, the button explains the three taps that add it to the home screen instead.
- Light and dark themes, following your system setting automatically.
- New typography throughout, with Arabic typeset properly across the whole site.

### Changed

- Search rebuilt from scratch: a sitemap and robots file, per-page canonical URLs, and link previews for every page when it is shared.

## v1.0.0 - 2 March 2026

The original site: four hand-written HTML pages, in English only, with no installable app and no dark mode.

### Added

- Four static pages - home, school dropouts, high school divisions and graduates.
- The ATFP reference guide: certifications, the fields they open, and where to apply.
- Division comparisons - subjects, advantages and drawbacks for every branch of the Tunisian high school.

### Removed

- English only, with no language switching.
- No light or dark theme, no installable app, no offline support.
- Questions and reviews went to a Gmail address, with no privacy policy or terms page.

---

Licensed under Apache 2.0. The bundled fonts keep their own licences.
