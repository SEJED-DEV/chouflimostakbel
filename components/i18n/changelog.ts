import type { Slice } from "./types";

/**
 * Changelog page copy, in all three languages.
 *
 * The page is a timeline, so `entries` is a plain array kept newest first:
 * a new release means adding one object at the top of that array in each
 * language. Nothing else in the file needs to change.
 */

/** What a change did. Drives the grouping, the icons and the filters. */
export type ChangeKind = "added" | "fixed" | "changed" | "removed";

/** One thing that changed, and what kind of change it was. */
export interface ChangelogChange {
  text: string;
  kind: ChangeKind;
}

/** One shipped release: which version, when, and what it changed. */
export interface ChangelogEntry {
  /** Version string. Same in every language, e.g. "v1.1.0". */
  version: string;
  /** Release date, written the way each language writes dates. */
  date: string;
  /** One line describing the release as a whole. */
  summary: string;
  /**
   * The release told as a story, one string per paragraph.
   *
   * This is what the changelog page shows. The list below it is what the
   * generated CHANGELOG.md shows, and what a developer scanning for "when did
   * X change" still wants.
   *
   * Kept as paragraphs rather than as prose with line breaks so each language
   * decides its own rhythm, and so a translation is never forced to break a
   * sentence where English happened to break one.
   */
  story?: string[];
  /** Individual changes, most important first. */
  changes: ChangelogChange[];
  /**
   * The id the "what's new" sheet stores once this entry has been read.
   *
   * Defaults to the version. Give an entry its own id when the SAME version
   * ships more changes later - the sheet fires again for everyone, without
   * pretending a new version was released.
   */
  notice?: string;
  /**
   * Commits this release was built from. Short hashes only - the full hash is
   * resolved against the repository at render time.
   */
  commits?: { hash: string; summary: string }[];
}

export interface ChangelogCopy {
  entries: ChangelogEntry[];
  header: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    sub: string;
  };
  latest: string;
  changesLabel: string;
  /** Heading above the commit links for a release. */
  commitsLabel: string;
  /** Copy for the version-gated "what's new" sheet. */
  popup: { title: string; seeAll: string; close: string };
  /** Search box. */
  searchPlaceholder: string;
  /** Filter chips, one per kind plus "everything". */
  filterAll: string;
  filterAdded: string;
  filterFixed: string;
  filterChanged: string;
  filterRemoved: string;
  /** How many changes a release carries. */
  changeCount: string;
  changeCountOne: string;
  /** How long a release takes to read when it is told as a story. */
  storyMinutes: string;
  /** Headings for the groups of changes inside a release. */
  groupAdded: string;
  groupFixed: string;
  groupChanged: string;
  groupRemoved: string;
  /** Accessible labels for the show/hide control. */
  expand: string;
  collapse: string;
  /** Nothing matched the search or the filters. */
  noResults: string;
  noResultsBody: string;
  clearFilters: string;
  /** Heading above the list of releases. */
  releases: string;
  note: {
    title: string;
    body: string;
  };
  /** Copy for the live deploy-status line in the page header. */
  status: DeployStatusCopy;
}

/**
 * Arabic distinguishes singular, dual, "few" and "many", so every plural form
 * is spelled out and picked with Intl.PluralRules. English and French only
 * ever select `one` and `other`; the rest repeat the generic form so all three
 * languages keep the same shape.
 */
export type PluralKey = "one" | "two" | "few" | "many" | "other";

export interface DeployStatusCopy {
  /** Accessible name for the line, for screen readers. */
  label: string;
  /** This build matches the newest code on the branch. */
  current: string;
  /** Commits on the branch that this build does not contain. */
  behind: Record<PluralKey, string>;
  /** This build has commits the branch does not - usually a force-push. */
  ahead: string;
  /** Both: the branch and the build have moved apart. */
  diverged: string;
  /** "Built from {sha}" - {sha} is replaced at render time. */
  builtFrom: string;
  /** Link text to the compare view listing exactly what is missing. */
  seeDiff: string;
  /** Link text to the repository itself. */
  openRepo: string;
}

export const changelog: Slice<ChangelogCopy> = {
  en: {
    entries: [
      {
        version: "v1.2",
        date: "19 October 2026",
        summary:
          "The roadmap page, a contact form that actually delivers, and a site that survives its own updates.",
        story: [
          "Once there was a small website that helped young people in Tunisia decide what to do next. It could tell them about school, about the branches they might choose, about the apprenticeships and the universities waiting at the end. What it could not do was tell anyone what it was planning to become.",
          "So it started telling. A new page appeared, called the roadmap, where the site writes down - out loud, where anyone can read it - what it is going to build next, why, and what it has not decided yet. It is a promise written in pencil, and the eraser marks are part of the charm.",
          "Then it fixed an old, quiet dishonesty. The contact form had looked like it worked. You filled it in, you pressed send, and it thanked you politely while dropping your message on the floor. Now the mail actually arrives, and when something is wrong it says so instead of smiling and losing things.",
          "Next came the accounts. You no longer needed an email address to belong here - a name and a password were enough, because the site had decided that asking for something it did not need was a good way to lose people. Behind the curtain, a quiet helper called Supabase now keeps the passwords safe and remembers who is who, so nobody has to trust a home-made lock.",
          "And then, on a phone, the top bar disappeared altogether. In its place a small row of tabs settled at the bottom of the screen, close to thumbs, where it takes exactly the room it needs so nothing hides underneath it.",
          "There was a smaller kindness too, for the dark. Some buttons had turned a very light colour and kept their white writing, so they vanished. They still do the turning - they just bring their words with them now.",
          "Last of all, and least visible, the site learned to survive its own updates. It checks whether the version you are reading is the newest, and says so honestly, link and all. If a page goes stale underneath you it mends itself instead of leaving a blank white screen where a page should be. Nobody will ever notice this, which is exactly how it should be.",
        ],
        changes: [
          { text: "A new page: /soon. It publishes the roadmap for the platform to come - accounts, posts, profiles and a feed - along with the decisions taken so far and the ones still open.", kind: "added" },
          { text: "The backend decision is no longer pending. Supabase, self-hosted on our own infrastructure. What that costs us, and what it saves, is written down plainly rather than glossed over.", kind: "changed" },
          { text: "The contact form now delivers. It used to look like it worked and drop your message on the floor. It validates, rate limits, and says what went wrong instead of pretending.", kind: "fixed" },
          { text: "The changelog now says whether the code you are reading is the newest. If the site is behind its own repository, it says so and links to what is missing.", kind: "added" },
          { text: "A stale build can no longer kill the page. Documents are revalidated rather than cached for a year, and a failed chunk load recovers by itself instead of leaving a blank screen.", kind: "fixed" },
          { text: "Buttons that inverted in dark mode now invert their text too. The install button used to turn near-white and keep white text, which made it disappear.", kind: "fixed" },
          { text: "The cost risks on /soon are split apart: the AI cost, which is metered per call, and the infrastructure cost, which is ours now that the backend is self-hosted.", kind: "changed" },

          { text: "Update notifications, if you want them: the app can tell you when the site is updated, in your own language. It is a device token, not an account - no email address, and nothing is tracked.", kind: "added" },
          { text: "The privacy policy, the terms, the 404 and the error pages now switch language with the rest of the site. An Arabic reader who hit a broken link used to get an English page.", kind: "added" },
          { text: "The contact form opens by itself on the project's own domain and stays closed on preview builds, so a half-finished version never collects messages it cannot deliver.", kind: "added" },
          { text: "The domain is defined in one place now. Moving it used to mean four files, which had already drifted apart.", kind: "changed" },

          { text: "The changelog page itself is rebuilt: each release collapses to one line, the newest stays open, and the changes are grouped by kind and searchable. A long changelog no longer means a long scroll.", kind: "changed" },

          { text: "Accounts. A username and a password, on Supabase, with the row level security policies deciding who may read what. An email address is not required - the platform does not need one.", kind: "added" },
          { text: "Sign-in runs on Supabase Auth rather than sessions of our own. The password, the refresh tokens and the recovery flow are its. The handle is still what you sign in with: GoTrue insists on an address, so it is handed one built from the handle, which the reader never sees and nothing is ever sent to.", kind: "changed" },
          { text: "The account page is gone, split into /login and /signup, and joined by a profile page of your own.", kind: "added" },
          { text: "A blogs section, empty for now, and honest about being empty.", kind: "added" },
          { text: "On a phone there is no top bar any more. The tab bar at the bottom is the navigation, and it takes the space it needs so nothing hides underneath it.", kind: "changed" },
          { text: "The blue button in the navigation is now Log in, and it becomes your name once you are signed in.", kind: "changed" },
          { text: "A context menu of your own: open in a new tab, copy the link, share, install the app, and flip the theme.", kind: "added" },
          { text: "CONTRIBUTING.md, and a CHANGELOG.md generated from the same data the site uses, so the two can never disagree.", kind: "added" },
        ],
        commits: [
          { hash: "9fe2316", summary: "Add a /soon page publishing the platform roadmap" },
          { hash: "4b85839", summary: "Settle the backend decision: self-hosted Supabase" },
          { hash: "3cff07d", summary: "Fix dark-mode buttons that kept a fixed text colour" },
          { hash: "a546d47", summary: "Stop a stale build from killing the page" },
          { hash: "bc0f170", summary: "Say on the changelog whether this build is the newest" },
          { hash: "0222878", summary: "Make the contact form actually deliver" },
          { hash: "4b13f13", summary: "Split the cost risk, and check deploys and encoding automatically" },

          { hash: "9e135e7", summary: "Define the domain in one place" },
          { hash: "49ffe21", summary: "Add update notifications" },
          { hash: "f9cd963", summary: "Switch language on the legal and error pages too" },
        ],
      },
      {
        version: "v1.1.1",
        notice: "v1.1.1-r2",
        date: "18 October 2026",
        summary:
          "Fixes: the install buttons did nothing on phones, iOS had no honest answer, and a few buttons lost their text in dark mode.",
        story: [
          "The new site had promised that you could install it, and then, for some people, the buttons that were supposed to do it did nothing at all when tapped. That is a worse failure than never offering: the site had made a promise and quietly broken it, and the people it broke for had no way of knowing it was not their fault.",
          "So the buttons were mended. Where a browser will not offer to install until you have reloaded the page once, the site now says so instead of waiting in silence. Where you are on an iPhone, and a website genuinely cannot install itself, it stops pretending and gives you the three taps that do work: Share, then Add to Home Screen, then Add. And it stopped offering a lone 'Not now' button, which is not a choice - it is a door with no handle.",
          "There was one more of the dark-mode buttons that turned pale and kept its white writing, so it vanished into itself. It was fixed, and so was the way it kept happening: the site now changes the writing and the background together.",
        ],
        changes: [
          { text: "The download buttons in the mobile menu and the footer now work. They were silently broken for anyone who had dismissed the install sheet in the previous week.", kind: "fixed" },
          { text: "The install sheet no longer offers a lone “Not now”. When a browser cannot prompt, it explains what to do instead.", kind: "changed" },
          { text: "On iOS the sheet now says plainly that a website cannot install itself, and gives the three taps that work: Share, Add to Home Screen, Add.", kind: "changed" },
          { text: "Everywhere else, it explains the reload-once step browsers require before they will offer installation.", kind: "changed" },
          { text: "The service worker now registers early enough that a first visit can become installable.", kind: "fixed" },
          { text: "Buttons whose background inverts in dark mode now invert their text too. The install button used to turn near-white and keep white text, which made it disappear.", kind: "fixed" },
        ],
        commits: [
          { hash: "827d685", summary: "Fix the install buttons doing nothing on mobile" },
          { hash: "b6ef424", summary: "Explain the install flow on iOS instead of silently failing" },
          { hash: "279af42", summary: "Add install buttons to the mobile nav and the footer" },
        ],
      },
      {
        version: "v1.1.0",
        date: "18 October 2026",
        summary:
          "A complete rebuild of the site, plus installable as an app and light or dark mode.",
        story: [
          "Once there was a website that had grown out of four pages of hand-written HTML, and it had begun to feel like four pages of hand-written HTML. So it was taken apart and built again from the beginning - not repainted, rebuilt - and everything you see now is from that second building.",
          "The first thing the new one learned was to speak. English, French and Arabic, any of them, switched whenever you like, with Arabic set properly right-to-left rather than squeezed into a shape made for Latin letters. A guidance site for Tunisian students that could only speak English had been leaving most of its readers outside.",
          "Then it learned to fold into a pocket. Added to your home screen it opens full screen, with no browser bar around it, like something you installed rather than somewhere you visited. And because a phone with no signal should not mean a blank page, the pages you have already opened stay readable when the connection drops.",
          "It learned to be kind about the light, too. Dark theme if you prefer the dark, light if you prefer that, and whichever your phone already chose if you would rather not decide. Along with it came a new set of letters - the typography was rebuilt, in every language.",
          "And it learned to do one useful sum. A university orientation score calculator, built on the Ministry of Higher Education's own formula, so a student can work out where their marks might take them. Before this the site had merely pointed at somebody else's tool and hoped it still worked.",
          "Finally, and invisibly, it learned to be found. A sitemap, a robots file, a canonical address for every page, and a proper preview whenever a page is shared into a group chat - which, for a site that spreads by being shared, is the difference between being passed around and being passed over.",
        ],
        changes: [
          { text: "The site was rebuilt from the ground up. The design, layout and writing are all new - v1.0.0 looked nothing like this.", kind: "added" },
          { text: "A full redesign across every page, built for clarity on a phone first.", kind: "added" },
          { text: "Four new pages: About, Changelog, and proper Privacy and Terms pages.", kind: "added" },
          { text: "The site is now in English, French and Arabic, switchable at any time, with Arabic laid out right-to-left.", kind: "added" },
          { text: "A university orientation score calculator, built on the Ministry of Higher Education formula, replacing the third-party tool we used to link to.", kind: "added" },
          { text: "Installable on iOS, Android and desktop: add it to your home screen and it opens full screen, like a native app.", kind: "added" },
          { text: "Offline fallback: pages you have already opened stay readable when the connection drops.", kind: "added" },
          { text: "An install prompt inside the browser, so adding the site to your device takes a single tap.", kind: "added" },
          { text: "Install buttons in the mobile menu and the footer.", kind: "added" },
          { text: "On iOS, where a site cannot install itself, the button explains the three taps that add it to the home screen instead.", kind: "added" },
          { text: "Light and dark themes, following your system setting automatically.", kind: "added" },
          { text: "New typography throughout, with Arabic typeset properly across the whole site.", kind: "added" },
          { text: "Search rebuilt from scratch: a sitemap and robots file, per-page canonical URLs, and link previews for every page when it is shared.", kind: "changed" },
        ],
      },
      {
        version: "v1.0.0",
        date: "2 March 2026",
        summary:
          "The original site: four hand-written HTML pages, in English only, with no installable app and no dark mode.",
        story: [
          "Before any of this, there was a question that nobody in Tunisia had answered in one place: after school, what are the choices, and what does each one actually lead to? So four pages were written by hand and put on the web, because four pages were better than the shrug that had come before them.",
          "One of them explained the apprenticeships - the ATFP certifications, the fields each one opens, and where to go and apply. Another compared the branches of the Tunisian high school honestly, subjects and drawbacks together, because a choice made on the advantages alone is a choice made blind. The others spoke to the two people who needed it most: the ones thinking of leaving school, and the ones who had just finished.",
          "It was English only. There was no dark mode, no way to install it, nothing to read offline. It did not remember you, because it did not know you. Anyone with a question sent it to a Gmail address, and if they wanted to know what happened to their message, there was no policy to tell them.",
          "It was small and it was rough and it worked, in the way that a first thing works. Everything after this is the story of it growing up.",
        ],
        changes: [
          { text: "Four static pages - home, school dropouts, high school divisions and graduates.", kind: "added" },
          { text: "The ATFP reference guide: certifications, the fields they open, and where to apply.", kind: "added" },
          { text: "Division comparisons - subjects, advantages and drawbacks for every branch of the Tunisian high school.", kind: "added" },
          { text: "English only, with no language switching.", kind: "removed" },
          { text: "No light or dark theme, no installable app, no offline support.", kind: "removed" },
          { text: "Questions and reviews went to a Gmail address, with no privacy policy or terms page.", kind: "removed" },
        ],
      },
    ],
    header: {
      eyebrow: "Changelog",
      title: "Every change,",
      titleAccent: "in the open.",
      sub: "Every release of Choufli Mosta9bel, newest first. Nothing ships quietly: if it is on the site, it is written down here.",
    },
    latest: "Current version",
    changesLabel: "What changed",
    commitsLabel: "Commits",
    popup: {
      title: "What's new",
      seeAll: "See everything",
      close: "Close",
    },

    searchPlaceholder: "Search releases and changes",
    filterAll: "Everything",
    filterAdded: "Added",
    filterFixed: "Fixed",
    filterChanged: "Changed",
    filterRemoved: "Removed",
    changeCount: "{n} changes",
    changeCountOne: "1 change",
    storyMinutes: "{n} min read",
    groupAdded: "Added",
    groupFixed: "Fixed",
    groupChanged: "Changed",
    groupRemoved: "Removed",
    expand: "Show",
    collapse: "Hide",
    noResults: "Nothing matches that.",
    noResultsBody: "Try another word, or clear the filters.",
    clearFilters: "Clear the filters",
    releases: "Releases",
    note: {
      title: "Missing something?",
      body: "Every release is written here as it ships. If a change is missing from this page, or something is still unclear, tell us - it goes into the next version.",
    },
    status: {
      label: "Deploy status",
      current: "This build matches the newest code on main.",
      behind: {
        one: "1 commit on main is not in this build yet.",
        two: "{n} commits on main are not in this build yet.",
        few: "{n} commits on main are not in this build yet.",
        many: "{n} commits on main are not in this build yet.",
        other: "{n} commits on main are not in this build yet.",
      },
      ahead:
        "This build has commits main does not - the branch was probably moved back.",
      diverged:
        "This build and main have moved apart. Some commits are on the branch, some are not.",
      builtFrom: "Built from {sha}",
      seeDiff: "See what is missing on GitHub",
      openRepo: "Open the repository",
    },
  },

  fr: {
    entries: [
      {
        version: "v1.2",
        date: "19 octobre 2026",
        summary:
          "La page /soon, un formulaire de contact qui livre enfin, et un site qui survit à ses propres mises à jour.",
        story: [
          "Il était une fois un petit site qui aidait les jeunes de Tunisie à décider de la suite. Il savait leur parler de l'école, des filières qu'ils pourraient choisir, des apprentissages et des universités qui attendent au bout. Ce qu'il ne savait pas faire, c'était dire à quiconque ce qu'il comptait devenir.",
          "Alors il s'est mis à le dire. Une nouvelle page est apparue, la feuille de route, où le site écrit - à voix haute, là où tout le monde peut le lire - ce qu'il va construire ensuite, pourquoi, et ce qu'il n'a pas encore décidé. C'est une promesse au crayon, et les traces de gomme font partie du charme.",
          "Puis il a réparé une vieille malhonnêteté, discrète. Le formulaire de contact avait l'air de fonctionner. On le remplissait, on appuyait sur envoyer, et il remerciait poliment en laissant tomber le message par terre. Maintenant le courrier arrive vraiment, et quand quelque chose ne va pas, il le dit au lieu de sourire et de perdre des choses.",
          "Les comptes sont venus ensuite. On n'a plus besoin d'une adresse e-mail pour faire partie de tout ça - un nom et un mot de passe suffisent, parce que le site avait décidé que demander ce dont il n'a pas besoin était une bonne façon de perdre les gens. Derrière le rideau, un aide discret nommé Supabase garde les mots de passe à l'abri et se souvient de qui est qui, pour que personne n'ait à faire confiance à une serrure fabriquée à la maison.",
          "Et puis, sur téléphone, la barre du haut a complètement disparu. À sa place, une petite rangée d'onglets s'est posée en bas de l'écran, à portée de pouce, et elle prend exactement la place qu'il lui faut pour que rien ne se cache dessous.",
          "Il y a eu une gentillesse plus petite aussi, pour le mode sombre. Certains boutons devenaient très clairs tout en gardant leur texte blanc, et disparaissaient. Ils font toujours la même chose - ils emportent juste leurs mots avec eux, désormais.",
          "Enfin, et le moins visible de tout, le site a appris à survivre à ses propres mises à jour. Il vérifie si la version que vous lisez est la plus récente, et le dit honnêtement, lien compris. Si une page se périmait sous vous, elle se répare au lieu de laisser un écran blanc là où il devrait y avoir une page. Personne ne le remarquera jamais, et c'est exactement comme ça que ça doit être.",
        ],
        changes: [
          { text: "Une nouvelle page : /soon. Elle publie la feuille de route de la plateforme à venir - comptes, articles, profils et un fil - avec les décisions déjà prises et celles qui restent à prendre.", kind: "added" },
          { text: "La décision sur le backend n'est plus en attente. Supabase, auto-hébergé sur notre propre infrastructure. Ce que cela nous coûte, et ce que cela nous économise, est écrit noir sur blanc.", kind: "changed" },
          { text: "Le formulaire de contact livre enfin. Avant, il avait l'air de fonctionner et jetait votre message. Il vérifie, limite le débit, et dit ce qui a échoué au lieu de faire semblant.", kind: "fixed" },
          { text: "Le journal des versions dit maintenant si le code que vous lisez est le plus récent. Si le site est en retard sur son propre dépôt, il le dit et affiche ce qui manque.", kind: "added" },
          { text: "Un déploiement peut être plus ancien que l'onglet ouvert sans casser la page. Les documents sont revalidés au lieu d'être mis en cache pendant un an, et un chargement de fichier manquant se répare tout seul.", kind: "fixed" },
          { text: "Les boutons qui s'inversaient en mode sombre inversent aussi leur texte. Le bouton d'installation devenait presque blanc et gardait un texte blanc, ce qui le rendait invisible.", kind: "fixed" },
          { text: "Les risques de coût sur /soon sont séparés : le coût de l'IA, facturé à l'appel, et le coût d'infrastructure, qui est le nôtre depuis que le backend est auto-hébergé.", kind: "changed" },

          { text: "Des notifications de mise à jour, si vous en voulez : l'application peut vous prévenir quand le site est mis à jour, dans votre langue. C'est un jeton d'appareil, pas un compte - pas d'adresse e-mail, et rien n'est suivi.", kind: "added" },
          { text: "La politique de confidentialité, les conditions, la page 404 et les pages d'erreur suivent maintenant la langue du reste du site. Un lecteur en arabe qui tombait sur un lien cassé se retrouvait avec une page en anglais.", kind: "added" },
          { text: "Le formulaire de contact s'ouvre tout seul sur le domaine du projet et reste fermé sur les versions de prévisualisation, pour qu'une version inachevée ne recueille jamais des messages qu'elle ne peut pas livrer.", kind: "added" },
          { text: "Le domaine est défini à un seul endroit maintenant. Le changer demandait quatre fichiers, qui avaient déjà divergé.", kind: "changed" },

          { text: "La page des versions est reconstruite : chaque version tient sur une ligne, la plus récente reste ouverte, et les changements sont regroupés par type et cherchables. Un long journal ne veut plus dire un long défilement.", kind: "changed" },

          { text: "Les comptes. Un nom d'utilisateur et un mot de passe, sur Supabase, avec les politiques de sécurité au niveau des lignes qui décident qui peut lire quoi. Aucune adresse e-mail n'est requise - la plateforme n'en a pas besoin.", kind: "added" },
          { text: "La connexion passe par l'authentification de Supabase, et non par des sessions qui nous appartiennent. Le mot de passe, les jetons de rafraîchissement et la récupération sont les siens. C'est toujours l'identifiant qui sert à se connecter : GoTrue exige une adresse, il en reçoit donc une construite à partir de l'identifiant, que le lecteur ne voit jamais et à laquelle rien n'est jamais envoyé.", kind: "changed" },
          { text: "La page compte a disparu, coupée en /login et /signup, et rejointe par une page de profil qui vous appartient.", kind: "added" },
          { text: "Une section blogs, vide pour l'instant, et honnête sur le fait qu'elle est vide.", kind: "added" },
          { text: "Sur un téléphone, il n'y a plus de barre du haut. La barre d'onglets en bas est la navigation, et elle prend la place qu'il lui faut pour que rien ne passe dessous.", kind: "changed" },
          { text: "Le bouton bleu de la navigation est maintenant « Connexion », et il devient votre nom une fois connecté.", kind: "changed" },
          { text: "Un menu contextuel à vous : ouvrir dans un nouvel onglet, copier le lien, partager, installer l'application, et changer de thème.", kind: "added" },
          { text: "CONTRIBUTING.md, et un CHANGELOG.md généré depuis les mêmes données que le site, pour que les deux ne puissent pas diverger.", kind: "added" },
        ],
        commits: [
          { hash: "9fe2316", summary: "Add a /soon page publishing the platform roadmap" },
          { hash: "4b85839", summary: "Settle the backend decision: self-hosted Supabase" },
          { hash: "3cff07d", summary: "Fix dark-mode buttons that kept a fixed text colour" },
          { hash: "a546d47", summary: "Stop a stale build from killing the page" },
          { hash: "bc0f170", summary: "Say on the changelog whether this build is the newest" },
          { hash: "0222878", summary: "Make the contact form actually deliver" },
          { hash: "4b13f13", summary: "Split the cost risk, and check deploys and encoding automatically" },

          { hash: "9e135e7", summary: "Define the domain in one place" },
          { hash: "49ffe21", summary: "Add update notifications" },
          { hash: "f9cd963", summary: "Switch language on the legal and error pages too" },
        ],
      },
      {
        version: "v1.1.1",
        notice: "v1.1.1-r2",
        date: "18 octobre 2026",
        summary:
          "Correctifs : les boutons d'installation ne faisaient rien sur mobile, iOS n'avait pas de vraie réponse, et quelques boutons perdaient leur texte en mode sombre.",
        story: [
          "Le nouveau site avait promis qu'on pourrait l'installer, et puis, pour certaines personnes, les boutons censés le faire ne faisaient rien du tout quand on appuyait. C'est un pire échec que de ne jamais proposer : le site avait fait une promesse et l'avait tranquillement cassée, et ceux pour qui elle était cassée n'avaient aucun moyen de savoir que ce n'était pas leur faute.",
          "Alors les boutons ont été réparés. Là où un navigateur ne propose pas l'installation avant que vous ayez rechargé la page une fois, le site le dit maintenant au lieu d'attendre en silence. Là où vous êtes sur un iPhone, et où un site ne peut vraiment pas s'installer lui-même, il cesse de faire semblant et vous donne les trois gestes qui marchent : Partager, puis Sur l'écran d'accueil, puis Ajouter. Et il a cessé de proposer un « Pas maintenant » solitaire, qui n'est pas un choix - c'est une porte sans poignée.",
          "Il restait un de ces boutons du mode sombre qui pâlissait en gardant son écriture blanche, et disparaissait en lui-même. Il a été corrigé, et la façon dont ça n'arrêtait pas d'arriver aussi : le site change maintenant l'écriture et le fond ensemble.",
        ],
        changes: [
          { text: "Les boutons de téléchargement du menu mobile et du pied de page fonctionnent enfin. Ils étaient cassés sans rien dire à qui avait fermé la fenêtre d'installation la semaine précédente.", kind: "fixed" },
          { text: "La fenêtre d'installation n'affiche plus un simple « Pas maintenant ». Lorsqu'un navigateur ne peut pas proposer l'installation, elle explique quoi faire à la place.", kind: "changed" },
          { text: "Sur iOS, elle dit clairement qu'un site ne peut pas s'installer lui-même, et donne les trois gestes qui marchent : Partager, Sur l'écran d'accueil, Ajouter.", kind: "changed" },
          { text: "Partout ailleurs, elle explique l'étape de rechargement que les navigateurs exigent avant de proposer l'installation.", kind: "changed" },
          { text: "Le service worker s'enregistre suffisamment tôt pour qu'une première visite devienne installable.", kind: "fixed" },
          { text: "Les boutons dont le fond s'inverse en mode sombre inversent désormais leur texte aussi. Le bouton d'installation devenait presque blanc tout en gardant un texte blanc, ce qui le rendait invisible.", kind: "fixed" },
        ],
        commits: [
          { hash: "827d685", summary: "Fix the install buttons doing nothing on mobile" },
          { hash: "b6ef424", summary: "Explain the install flow on iOS instead of silently failing" },
          { hash: "279af42", summary: "Add install buttons to the mobile nav and the footer" },
        ],
      },
      {
        version: "v1.1.0",
        date: "18 octobre 2026",
        summary:
          "Une refonte complète du site, plus l'installation comme une application et le mode clair ou sombre.",
        story: [
          "Il était une fois un site qui avait grandi à partir de quatre pages de HTML écrites à la main, et il commençait à ressembler à quatre pages de HTML écrites à la main. Alors il a été démonté et reconstruit depuis le début - pas repeint, reconstruit - et tout ce que vous voyez maintenant vient de cette seconde construction.",
          "La première chose que le nouveau a apprise, c'est à parler. Anglais, français et arabe, au choix, changés quand on veut, avec l'arabe composé correctement de droite à gauche au lieu d'être pressé dans une forme faite pour les lettres latines. Un site d'orientation pour les élèves tunisiens qui ne parlait qu'anglais laissait la plupart de ses lecteurs dehors.",
          "Puis il a appris à se plier dans une poche. Ajouté à votre écran d'accueil, il s'ouvre en plein écran, sans barre de navigateur autour, comme quelque chose qu'on a installé plutôt qu'un endroit où l'on est passé. Et parce qu'un téléphone sans réseau ne devrait pas vouloir dire une page blanche, les pages déjà ouvertes restent lisibles quand la connexion tombe.",
          "Il a appris à être gentil avec la lumière, aussi. Thème sombre si vous préférez le sombre, clair si vous préférez ça, et celui que votre téléphone avait déjà choisi si vous préférez ne pas décider. Avec lui est venu un nouvel ensemble de lettres - la typographie a été refaite, dans chaque langue.",
          "Et il a appris à faire un calcul utile. Un calculateur de score d'orientation universitaire, bâti sur la formule du ministère de l'Enseignement supérieur, pour qu'un élève puisse voir où ses notes pourraient le mener. Avant cela, le site se contentait de pointer vers l'outil de quelqu'un d'autre en espérant qu'il fonctionne encore.",
          "Enfin, et invisiblement, il a appris à être trouvé. Un sitemap, un fichier robots, une adresse canonique pour chaque page, et un bel aperçu chaque fois qu'une page est partagée dans une conversation de groupe - ce qui, pour un site qui se répand en étant partagé, fait la différence entre être transmis et être ignoré.",
        ],
        changes: [
          { text: "Le site a été entièrement reconstruit. Le design, la mise en page et les textes sont neufs - la v1.0.0 n'avait rien à voir.", kind: "added" },
          { text: "Une refonte complète de toutes les pages, pensée d'abord pour la clarté sur mobile.", kind: "added" },
          { text: "Quatre nouvelles pages : À propos, Nouveautés, et de vraies pages Confidentialité et Conditions.", kind: "added" },
          { text: "Le site est désormais en anglais, français et arabe, changeable à tout moment, avec l'arabe correctement mis en page de droite à gauche.", kind: "added" },
          { text: "Une calculatrice de score d'orientation universitaire, fondée sur la formule du Ministère de l'Enseignement Supérieur, qui remplace l'outil tiers que nous utilisions.", kind: "added" },
          { text: "Installable sur iOS, Android et sur ordinateur : ajoutez-le à votre écran d'accueil et il s'ouvre en plein écran, comme une application native.", kind: "added" },
          { text: "Mode hors ligne : les pages déjà consultées restent lisibles même lorsque la connexion est coupée.", kind: "added" },
          { text: "Une invite d'installation s'affiche dans le navigateur : ajouter le site à votre appareil ne demande qu'un seul geste.", kind: "added" },
          { text: "Des boutons d'installation dans le menu mobile et en bas de page.", kind: "added" },
          { text: "Sur iOS, où un site ne peut pas s'installer tout seul, le bouton explique les trois gestes pour l'ajouter à l'écran d'accueil.", kind: "added" },
          { text: "Thèmes clair et sombre, suivant automatiquement le réglage de votre système.", kind: "added" },
          { text: "Une nouvelle typographie partout, avec un arabe correctement composé sur tout le site.", kind: "added" },
          { text: "Référencement reconstruit de zéro : un fichier sitemap et robots, des URL canoniques pour chaque page, et un aperçu enrichi à chaque partage.", kind: "changed" },
        ],
      },
      {
        version: "v1.0.0",
        date: "2 mars 2026",
        summary:
          "Le site d'origine : quatre pages HTML écrites à la main, en anglais seulement, sans application installable ni mode sombre.",
        story: [
          "Avant tout cela, il y avait une question que personne en Tunisie n'avait traitée en un seul endroit : après l'école, quels sont les choix, et où mène réellement chacun d'eux ? Alors quatre pages ont été écrites à la main et mises en ligne, parce que quatre pages valaient mieux que le haussement d'épaules qui les précédait.",
          "L'une expliquait les apprentissages - les certifications de l'ATFP, les métiers que chacune ouvre, et où aller s'inscrire. Une autre comparait honnêtement les filières du lycée tunisien, les matières et les inconvénients ensemble, parce qu'un choix fait sur les seuls avantages est un choix fait à l'aveugle. Les autres parlaient aux deux personnes qui en avaient le plus besoin : celles qui pensent à quitter l'école, et celles qui viennent de terminer.",
          "Il n'était qu'en anglais. Pas de mode sombre, aucun moyen de l'installer, rien à lire hors ligne. Il ne se souvenait pas de vous, parce qu'il ne vous connaissait pas. Quiconque avait une question l'envoyait à une adresse Gmail, et s'il voulait savoir ce qu'il advenait de son message, aucune politique ne le lui disait.",
          "Il était petit, il était brut, et il fonctionnait, comme fonctionne une première chose. Tout ce qui suit est l'histoire de sa croissance.",
        ],
        changes: [
          { text: "Quatre pages statiques - accueil, décrochés scolaires, filières du lycée et bacheliers.", kind: "added" },
          { text: "Le guide de référence de l'ATFP : les certifications, les métiers qu'elles ouvrent, et où se porter candidat.", kind: "added" },
          { text: "Comparatifs des filières - matières, avantages et inconvénients pour chaque section du lycée tunisien.", kind: "added" },
          { text: "En anglais seulement, sans changement de langue.", kind: "removed" },
          { text: "Ni thème clair ou sombre, ni application installable, ni mode hors ligne.", kind: "removed" },
          { text: "Les questions et les avis allaient à une adresse Gmail, sans page de confidentialité ni de conditions.", kind: "removed" },
        ],
      },
    ],
    header: {
      eyebrow: "Journal des versions",
      title: "Chaque changement,",
      titleAccent: "en toute transparence.",
      sub: "Chaque version de Choufli Mosta9bel, de la plus récente à la plus ancienne. Rien ne passe inaperçu : ce qui est en ligne figure ici.",
    },
    latest: "Version actuelle",
    changesLabel: "Ce qui a changé",
    commitsLabel: "Commits",
    popup: {
      title: "Nouveautés",
      seeAll: "Tout voir",
      close: "Fermer",
    },

    searchPlaceholder: "Rechercher une version ou un changement",
    filterAll: "Tout",
    filterAdded: "Ajouts",
    filterFixed: "Corrections",
    filterChanged: "Modifications",
    filterRemoved: "Retraits",
    changeCount: "{n} changements",
    changeCountOne: "1 changement",
    storyMinutes: "{n} min de lecture",
    groupAdded: "Ajouts",
    groupFixed: "Corrections",
    groupChanged: "Modifications",
    groupRemoved: "Retraits",
    expand: "Voir",
    collapse: "Masquer",
    noResults: "Rien ne correspond.",
    noResultsBody: "Essayez un autre mot, ou effacez les filtres.",
    clearFilters: "Effacer les filtres",
    releases: "Versions",
    note: {
      title: "Il manque quelque chose ?",
      body: "Chaque version est consignée ici dès sa publication. Si un changement n'y figure pas, ou si quelque chose reste flou, dites-le-nous : cela ira dans la prochaine version.",
    },
    status: {
      label: "État du déploiement",
      current: "Cette version correspond au code le plus récent sur main.",
      behind: {
        one: "1 commit sur main n'est pas encore dans cette version.",
        two: "{n} commits sur main ne sont pas encore dans cette version.",
        few: "{n} commits sur main ne sont pas encore dans cette version.",
        many: "{n} commits sur main ne sont pas encore dans cette version.",
        other: "{n} commits sur main ne sont pas encore dans cette version.",
      },
      ahead:
        "Cette version contient des commits que main n'a pas - la branche a probablement été reculée.",
      diverged:
        "Cette version et main ont divergé. Certains commits sont sur la branche, d'autres non.",
      builtFrom: "Compilée depuis {sha}",
      seeDiff: "Voir ce qui manque sur GitHub",
      openRepo: "Ouvrir le dépôt",
    },
  },

  ar: {
    entries: [
      {
        version: "v1.2",
        date: "19 أكتوبر 2026",
        summary:
          "صفحة الطريق، ونموذج تواصل يوصل أخيراً، وموقع يصمد أمام تحديثاته.",
        story: [
          "في قديم الزمان، كان موقع صغير يساعد شباب تونس على اختيار ما بعد المدرسة. كان يعرف أن يحدّثهم عن الدراسة، وعن الشُّعب التي قد يختارونها، وعن التكوين المهني والجامعات التي تنتظر في النهاية. أمّا ما لم يكن يعرف فعله، فهو أن يقول لأحد ما ينوي أن يصير إليه.",
          "فبدأ يقول. ظهرت صفحة جديدة، هي صفحة الطريق، يكتب فيها الموقع — بصوت مسموع، حيث يمكن للجميع أن يقرأ — ما سيبينيه بعد ذلك، ولماذا، وما لم يقرّره بعد. إنه وعدٌ مكتوب بالقلم الرصاص، وآثار الممحاة جزءٌ من سحره.",
          "ثم أصلح خدعة قديمة خفيّة. كان نموذج التواصل يبدو ناجحاً. تملأه، وتضغط إرسال، فيشكرك بلطف ويترك رسالتك تسقط على الأرض. الآن يصل البريد حقًّا، وإن اختلّ شيء قاله بدل أن يبتسم ويضيّع الأشياء.",
          "ثم جاءت الحسابات. لم تعد بحاجة إلى بريد إلكتروني لتكون جزءًا من هذا كله — يكفي اسم وكلمة سرّ، لأن الموقع قرّر أن السؤال عمّا لا تحتاجه طريقة جيدة لخسارة الناس. وخلف الستارة، يبقى مُعين هادئ اسمه Supabase يحفظ كلمات السرّ بأمان ويتذكّر من هو من، حتى لا يُضطرّ أحد إلى الوثوق بقفل صنعناه بأنفسنا.",
          "ثم اختفت، على الهاتف، الشريط العلوي كلّياً. وفي مكانه استقرّ صفّ صغير من التبويبات أسفل الشاشة، في متناول الإبهام، ولا يأخذ من المساحة إلا قدر ما يحتاج حتى لا يختفي شيء تحته.",
          "وكانت هناك لفتة أصغر أيضًا، للوضع الليلي. كانت بعض الأزرار تصير فاتحة جدًّا وتحتفظ بنصّها الأبيض، فتختفي. ما زالت تفعل الشيء نفسه — إلا أنها صارت تحمل كلماتها معها.",
          "وأخيرًا، وهو أخفى ما في الأمر، تعلّم الموقع أن يصمد أمام تحديثاته هو. يتحقّق إن كانت النسخة التي تقرؤها هي الأحدث، ويقول ذلك بصدق، مع الرابط. وإن تلفت صفحة تحتك، فإنها تصلح نفسها بدل أن تترك شاشة بيضاء حيث كان ينبغي أن تكون هناك صفحة. لن يلاحظ أحد ذلك أبدًا، وهذا بالضبط ما ينبغي أن يكون عليه الأمر.",
        ],
        changes: [
          { text: "صفحة جديدة: ‎/soon. تنشر خطة الطريق للمنصّة القادمة — حسابات، ومقالات، وملفّات شخصية، وخلاصة — مع القرارات المتَّخذة والقرارات التي ما تزال مفتوحة.", kind: "added" },
          { text: "القرار بشأن الخلفية لم يعد معلّقاً. Supabase، باستضافة ذاتية على بنيتنا التحتية. وما ينفقه هذا علينا، وما يوفّره، مكتوب بوضوح لا مُجمَّلاً.", kind: "changed" },
          { text: "نموذج التواصل يوصل الآن. كان يبدو ناجحاً ويتخلّص من رسالتك على الأرض. صار يتحقّق من البيانات، ويحدّ من عدد الرسائل، ويقول ما الذي أخفق بدل أن يدّعي النجاح.", kind: "fixed" },
          { text: "سجلّ الإصدارات يقول الآن إن كانت الشيفرة التي تقرؤها هي الأحدث. وإن كان الموقع متأخّراً عن مستودعه، فإنه يقول ذلك ويعرض ما ينقص.", kind: "added" },
          { text: "لم تعد نسخة قديمة تكسر الصفحة. صار المستند يُعاد التحقّق منه بدل أن يُخزَّن سنة كاملة، وأي جزء مفقود من الملفات يُصلَح تلقائياً بدل ترك شاشة فارغة.", kind: "fixed" },
          { text: "الأزرار التي كان ينقلب لونها في الوضع الليلي صارت تقلب نصّها معه أيضاً. كان زرّ التثبيت يصير أبيض تقريباً ويحتفظ بنصّ أبيض، فيختفي تماماً.", kind: "fixed" },
          { text: "مخاطر التكلفة على ‎/soon صارت منفصلة: تكلفة الذكاء الاصطناعي، وهي تُحتسب لكل استدعاء، وتكلفة البنية التحتية، التي صارت مسؤوليتنا منذ أن استضافنا الخلفية بأنفسنا.", kind: "changed" },

          { text: "إشعارات التحديث، إن أردتها: يستطيع التطبيق أن يخبرك عند تحديث الموقع، وبـلغتك. إنه رمز جهاز لا حساب - لا بريد إلكتروني، ولا شيء يُتبَّع.", kind: "added" },
          { text: "سياسة الخصوصية والشروط وصفحة 404 وصفحات الخطأ صارت تتبع لغة بقية الموقع. كان القارئ العربي الذي يصطدم برابط مكسور يجد صفحة بالإنجليزية.", kind: "added" },
          { text: "نموذج التواصل يُفتح تلقائياً على نطاق المشروع ويبقى مغلقاً على نسخ المعاينة، حتى لا تجمع نسخة ناقصة رسائل لا تستطيع توصيلها.", kind: "added" },
          { text: "النطاق صار معرّفاً في مكان واحد. تغييره كان يتطلّب أربعة ملفات، وقد تباعدت فعلاً.", kind: "changed" },

          { text: "أُعيد بناء صفحة سجلّ الإصدارات: كل إصدار ينطبق في سطر واحد، والأحدث يبقى مفتوحًا، والتغييرات مُجمَّعة حسب نوعها وقابلة للبحث. فالسجلّ الطويل لم يعد يعني تمريرًا طويلًا.", kind: "changed" },

          { text: "الحسابات. اسم مستخدم وكلمة مرور، على Supabase، مع سياسات أمان مستوى الصفوف هي التي تقرّر من يقرأ ماذا. البريد الإلكتروني ليس مطلوبًا - المنصّة لا تحتاجه.", kind: "added" },
          { text: "تسجيل الدخول يتمّ عبر تسجيل دخول Supabase، لا عبر جلسات تخصّنا. كلمة السر ورموز التجديد والاسترجاع من اختصاصه. وما يزال اسم المستخدم هو ما يُدخَل به: GoTrue يشترط بريدًا، فيُعطى بريدًا مبنيًا على الاسم، لا يراه القارئ ولا يُمرَّس إليه شيء أبداً.", kind: "changed" },
          { text: "لم تعد صفحة الحساب موجودة. انقسمت إلى /login و /signup، ومعها صفحة ملفّ شخصي لك.", kind: "added" },
          { text: "قسم المدوّنات، فارغ الآن، وصريح بأنه فارغ.", kind: "added" },
          { text: "لم يعد في الهاتف شريط علوي. شريط التبويبات في الأسفل هو التنقّل، وقد أخذ المساحة التي يحتاجها كي لا يختبئ شيء تحته.", kind: "changed" },
          { text: "الزر الأزرق في التنقّل صار «تسجيل الدخول»، ثم يصير اسمك بعد أن تسجّل الدخول.", kind: "changed" },
          { text: "قائمة سياق خاصة بك: فتح في تبويب جديد، ونسخ الرابط، ومشاركة، وتثبيت التطبيق، وتبديل المظهر.", kind: "added" },
          { text: "ملفّ CONTRIBUTING.md، وملفّ CHANGELOG.md مولَّد من البيانات نفسها التي يستعملها الموقع، فلا يمكن للاثنين أن يختلفا.", kind: "added" },
        ],
        commits: [
          { hash: "9fe2316", summary: "Add a /soon page publishing the platform roadmap" },
          { hash: "4b85839", summary: "Settle the backend decision: self-hosted Supabase" },
          { hash: "3cff07d", summary: "Fix dark-mode buttons that kept a fixed text colour" },
          { hash: "a546d47", summary: "Stop a stale build from killing the page" },
          { hash: "bc0f170", summary: "Say on the changelog whether this build is the newest" },
          { hash: "0222878", summary: "Make the contact form actually deliver" },
          { hash: "4b13f13", summary: "Split the cost risk, and check deploys and encoding automatically" },

          { hash: "9e135e7", summary: "Define the domain in one place" },
          { hash: "49ffe21", summary: "Add update notifications" },
          { hash: "f9cd963", summary: "Switch language on the legal and error pages too" },
        ],
      },
      {
        version: "v1.1.1",
        notice: "v1.1.1-r2",
        date: "18 أكتوبر 2026",
        summary:
          "إصلاحات: لم تعمل أزرار التثبيت على الهواتف، ولم يكن هناك جواب صادق على iOS، وفقدت بعض الأزرار نصّها في الوضع الليلي.",
        story: [
          "كان الموقع الجديد قد وعد بأنه يمكن تثبيته، ثم لم تفعل الأزرار التي يُفترض أن تفعل ذلك شيئًا على الإطلاق عند النقر، لدى بعض الناس. هذا فشل أسوأ من ألّا تعرض أصلًا: فقد قطع الموقع وعدًا وأخلّ به بهدوء، ولم يكن بوسع من انكسر الوعد في يده أن يعرف أن الذنب ليس ذنبه.",
          "فأُصلحت الأزرار. وحيث لا يعرض المتصفّح التثبيت قبل أن تعيد تحميل الصفحة مرّة واحدة، يقول الموقع ذلك الآن بدل أن ينتظر في صمت. وحيث تكون على آيفون، وحيث لا يمكن لموقع أن يثبّت نفسه حقًّا، فإنه يتوقّف عن التظاهر ويمنحك الثلاث نقرات التي تعمل: مشاركة، ثم إضافة إلى الشاشة الرئيسية، ثم إضافة. وتوقّف أيضًا عن عرض زرّ «ليس الآن» وحده، فهو ليس خيارًا — بل بابٌ بلا مقبض.",
          "وبقي واحد من تلك الأزرار الليلية يبهت ويحتفظ بكتابته البيضاء، فيختفي في نفسه. أُصلح هو، وأُصلح معه السبب الذي جعل الأمر يتكرّر: صار الموقع يغيّر الكتابة والخلفية معًا.",
        ],
        changes: [
          { text: "صار زرّا التحميل في قائمة الهاتف وفي أسفل الصفحة يعملان. كانا معطّلين بصمت لكل من أغلق نافذة التثبيت في الأسبوع الماضي.", kind: "fixed" },
          { text: "لم تعد نافذة التثبيت تعرض زرّ «ليس الآن» وحده. وعندما لا يستطيع المتصفح اقتراح التثبيت، تشرح النافذة ما ينبغي فعله بدلاً من ذلك.", kind: "changed" },
          { text: "على iOS تقول النافذة بوضوح إن الموقع لا يستطيع تثبيت نفسه، وتوضّح الخطوات الثلاث التي تنفع: المشاركة، ثمّ الإضافة إلى الشاشة الرئيسية، ثمّ إضافة.", kind: "changed" },
          { text: "في كل مكان آخر، تشرح خطوة إعادة التحميل التي تشترطها المتصفحات قبل أن تقترح التثبيت.", kind: "changed" },
          { text: "يسجّل عامل الخدمة أبكر من ذلك، حتى تصبح الزيارة الأولى قابلة للتثبيت.", kind: "fixed" },
          { text: "الأزرار التي ينقلب لونها في الوضع الليلي صارت تقلب نصّها معه أيضاً. كان زرّ التثبيت يصير أبيض تقريباً ويحتفظ بنصّ أبيض، فيختفي تماماً.", kind: "fixed" },
        ],
        commits: [
          { hash: "827d685", summary: "Fix the install buttons doing nothing on mobile" },
          { hash: "b6ef424", summary: "Explain the install flow on iOS instead of silently failing" },
          { hash: "279af42", summary: "Add install buttons to the mobile nav and the footer" },
        ],
      },
      {
        version: "v1.1.0",
        date: "18 أكتوبر 2026",
        summary:
          "إعادة بناء كاملة للموقع، مع إمكانية التثبيت كتطبيق ووضع فاتح أو داكن.",
        story: [
          "في قديم الزمان، كان موقعًا نشأ من أربع صفحات HTML مكتوبة يدويًا، وبدأ يبدو كأربع صفحات HTML مكتوبة يدويًا. ففُكِّك وأُعيد بناؤه من الصفر — لا طُلي بالدهان، بل أُعيد بناؤه — وكل ما تراه الآن جاء من ذلك البناء الثاني.",
          "أول ما تعلّمه الجديد أن يتكلّم. الإنجليزية والفرنسية والعربية، أيّها شئت، تُبدَّل وقتما تشاء، والعربية مُصفَّفة من اليمين إلى اليسار على وجهها الصحيح بدل أن تُحشر في قالب صُنع للحروف اللاتينية. موقع إرشادي لطلبة تونس لا يتحدّث إلا الإنجليزية كان يترك معظم قرّائه في الخارج.",
          "ثم تعلّم أن يُطوى في جيب. يُضاف إلى شاشتك الرئيسية فيفتح بملء الشاشة، بلا شريط متصفّح حوله، كشيء ثبّته بدل مكان زرته. ولأن هاتفًا بلا شبكة لا ينبغي أن يعني صفحة بيضاء، تبقى الصفحات التي فتحتها من قبل مقروءة حين تنقطع الشبكة.",
          "وتعلّم أن يكون رفيقًا بالنور أيضًا. وضع داكن إن كنت تفضّل الداكن، وفاتح إن كنت تفضّل ذاك، وأيّهما اختاره هاتفك سلفًا إن كنت تفضّل ألا تقرّر. وجاء معه طقم حروف جديد — أُعيدت التايبوغرافيا في كل لغة.",
          "وتعلّم أن يحسب حسابًا واحدًا نافعًا. حاسبة معدّل التوجيه الجامعي، مبنيّة على صيغة وزارة التعليم العالي نفسها، ليستطيع الطالب أن يعرف إلى أين قد تبلغه أعداده. قبل ذلك كان الموقع يشير فقط إلى أداة شخص آخر ويأمل أنها ما زالت تعمل.",
          "وأخيرًا، وبشكل غير مرئي، تعلّم أن يُوجَد. خريطة موقع، وملفّ robots، وعنوان أساسي لكل صفحة، ومعاينة جميلة كلما شُوركت صفحة في محادثة جماعية — وهذا، لموقع ينتشر بالمشاركة، هو الفرق بين أن يُتناقَل وأن يُتجاوَز.",
        ],
        changes: [
          { text: "أُعيد بناء الموقع من الأساس. التصميم والتنسيق والنصوص كلها جديدة - فالإصدار 1.0.0 لم يكن شيئاً يشبهه.", kind: "added" },
          { text: "تصميم جديد لكل الصفحات، صُمم أولاً لوضوح القراءة على الهاتف.", kind: "added" },
          { text: "أربع صفحات جديدة: من نحن، وما الجديد، وصفحتان فعليتان للخصوصية والشروط.", kind: "added" },
          { text: "الموقع متاح الآن بالإنجليزية والفرنسية والعربية، مع إمكانية تغيير اللغة في أي وقت والعربية مرتبة من اليمين إلى اليسار.", kind: "added" },
          { text: "حاسبة سكور التوجيه الجامعي، مبنية على صيغة وزارة التعليم العالي، لتحل محل الأداة الخارجية التي كنا نربط بها.", kind: "added" },
          { text: "قابل للتثبيت على iOS وAndroid وعلى الحاسوب: أضِفه إلى شاشتك الرئيسية فيفتح بملء الشاشة، مثل التطبيق الأصلي.", kind: "added" },
          { text: "العمل دون اتصال: تبقى الصفحات التي فتحتها سابقاً قابلة للقراءة عند انقطاع الاتصال.", kind: "added" },
          { text: "رسالة تثبيت تظهر داخل المتصفح، فتضيف الموقع إلى جهازك بلمسة واحدة.", kind: "added" },
          { text: "أزراء تثبيت في قائمة التنقّل موا في التفاويز.", kind: "added" },
          { text: "على iOS، حيث لا يسمح للموقع أن يثبت نفسه، يشرر الزرم إلى الثلاث الضغطات التي تضيفه إلى الشاشة الرئيسية.", kind: "added" },
          { text: "وضع فاتح ووضع داكن، يتبعان تلقائياً إعداد نظامك.", kind: "added" },
          { text: "خط جديد في كل الموقع، مع ضبط العربية بشكل صحيح في كل الصفحات.", kind: "added" },
          { text: "إعادة بناء البحث من الصفر: ملف sitemap وrobots، ورابط أساسي لكل صفحة، ومعاينة غنية عند مشاركة أي رابط.", kind: "changed" },
        ],
      },
      {
        version: "v1.0.0",
        date: "2 مارس 2026",
        summary:
          "الموقع الأصلي: أربع صفحات HTML مكتوبة يدوياً، بالإنجليزية فقط، وبدون تطبيق قابل للتثبيت ولا وضع داكن.",
        story: [
          "قبل كل هذا، كان هناك سؤال لم يُجِب عنه أحد في تونس في مكان واحد: بعد المدرسة، ما هي الخيارات، وإلى أين يؤدّي كل خيار منها فعلًا؟ فكُتبت أربع صفحات يدويًا ووُضعت على الويب، لأن أربع صفحات خيرٌ من التكتّل الذي سبقها.",
          "إحداها شرحت التكوين المهني — شهادات الـ ATFP، والمجالات التي يفتحها كل منها، وأين تذهب لتسجّل. وأخرى قارنت شُعب الثانوية التونسية بصدق، الموادّ والمساوئ معًا، لأن اختيارًا مبنيًّا على المحاسن وحدها اختيارٌ في العَمى. وتحدّثت الأخريان إلى أكثر من احتاجهما: من يفكّر في ترك المدرسة، ومن أنهى للتوّ.",
          "كان بالإنجليزية فقط. لا وضع داكن، ولا سبيل لتثبيته، ولا شيء يُقرأ دون اتصال. ولم يكن يتذكّرك، لأنه لم يكن يعرفك. ومن كان لديه سؤال أرسله إلى عنوان Gmail، وإن أراد أن يعرف ماذا حدث لرسالته، لم تكن هناك سياسة تخبره.",
          "كان صغيرًا وخشنًا وقد نجح، بالطريقة التي ينجح بها الشيء الأول. وكل ما يأتي بعد هذا هو حكاية كبره.",
        ],
        changes: [
          { text: "أربع صفحات ثابتة - الرئيسية، المتسربون من الدراسة، أقسام الثانوية، والخريجون.", kind: "added" },
          { text: "الدليل المرجعي للتكوين المهني ATFP: الشهادات، والحقول التي تفتحها، وأماكن الترشح.", kind: "added" },
          { text: "مقارنات بين الأقسام - المواد والإيجابيات والسلبيات لكل قسم في الثانوية التونسية.", kind: "added" },
          { text: "بالإنجليزية فقط، وبدون إمكانية تغيير اللغة.", kind: "removed" },
          { text: "لا وضع فاتح ولا داكن، ولا تطبيق قابل للتثبيت، ولا عمل دون اتصال.", kind: "removed" },
          { text: "كانت الأسئلة والآراء تُرسل إلى عنوان Gmail، دون صفحة خصوصية ولا صفحة شروط.", kind: "removed" },
        ],
      },
    ],
    header: {
      eyebrow: "سجلّ الإصدارات",
      title: "كل تغيير،",
      titleAccent: "علنًا ووضوحًا.",
      sub: "كل إصدارات «شوفلي مستقبلك»، من الأحدث إلى الأقدم. لا تغييرات صامتة: كل ما هو منشور على الموقع مُدوَّن هنا.",
    },
    latest: "الإصدار الحالي",
    changesLabel: "ما الذي تغيّر",
    commitsLabel: "التغييرات",
    popup: {
      title: "ما الجديد",
      seeAll: "عرض الكل",
      close: "إغلاق",
    },

    searchPlaceholder: "ابحث عن إصدار أو تغيير",
    filterAll: "الكل",
    filterAdded: "إضافات",
    filterFixed: "إصلاحات",
    filterChanged: "تعديلات",
    filterRemoved: "إزالة",
    changeCount: "{n} تغييرات",
    changeCountOne: "تغيير واحد",
    storyMinutes: "{n} دقائق قراءة",
    groupAdded: "إضافات",
    groupFixed: "إصلاحات",
    groupChanged: "تعديلات",
    groupRemoved: "إزالة",
    expand: "إظهار",
    collapse: "إخفاء",
    noResults: "لا شيء يطابق ذلك.",
    noResultsBody: "جرّب كلمة أخرى، أو امسح عوامل التصفية.",
    clearFilters: "امسح عوامل التصفية",
    releases: "الإصدارات",
    note: {
      title: "هل ينقصك شيء؟",
      body: "كل إصدار يُدوَّن هنا فور نشره. إن لم تجد تغييرًا مذكورًا في هذه الصفحة، أو بقي شيء غير واضح، فأخبرنا وسيكون في الإصدار القادم.",
    },
    status: {
      label: "حالة النشر",
      current: "هذه النسخة مطابقة لأحدث الشيفرة على main.",
      behind: {
        one: "تغيير واحد على main لم يدخل بعد في هذه النسخة.",
        two: "تغييران على main لم يدخلا بعد في هذه النسخة.",
        few: "{n} تغييرات على main لم تدخل بعد في هذه النسخة.",
        many: "{n} تغييراً على main لم تدخل بعد في هذه النسخة.",
        other: "{n} تغيير على main لم يدخل بعد في هذه النسخة.",
      },
      ahead:
        "تحتوي هذه النسخة على تغييرات غير موجودة في main. ربما أُرجع الفرع إلى الوراء.",
      diverged:
        "تباعدت هذه النسخة عن main. بعض التغييرات على الفرع وبعضها ليس عليه.",
      builtFrom: "مبنية من {sha}",
      seeDiff: "انظر ما ينقص على GitHub",
      openRepo: "افتح المستودع",
    },
  },
};