import type { Slice } from "./types";

/**
 * "Coming soon" page copy, in all three languages.
 *
 * The page publishes the platform roadmap while it is still being built, so
 * the sections are ordered the way a reader needs them: what is coming, why,
 * what is still undecided, what it would run on, the phases, the feed
 * algorithm, the risks, and how to follow along.
 *
 * `formula` is the one place that is *not* translated: the ranking lines are
 * technical identifiers and stay byte-identical in every language.
 */

/** One open question: the call, and why it has not been made yet. */
export interface SoonCopy {
  hero: {
    eyebrow: string;
    title: string;
    /** Rendered in the accent colour, after `title`. */
    titleAccent: string;
    sub: string;
    /** Scrolls to the phases section on this page. */
    cta: string;
    ctaSecondary: string;
  };
  intro: {
    title: string;
    body: string;
  };
  questions: {
    title: string;
    sub: string;
    /** The calls already made - currently just the backend choice. */
    decided: { label: string; title: string; body: string };
    items: { q: string; why: string }[];
  };
  stack: {
    title: string;
    sub: string;
    items: { label: string; value: string }[];
  };
  phases: {
    title: string;
    sub: string;
    items: { n: string; name: string; body: string; points: string[] }[];
  };
  algorithm: {
    title: string;
    sub: string;
    steps: { title: string; body: string }[];
    /** Caption above the ranking sketch. */
    formulaLabel: string;
    /** Lines of the ranking formula, exactly as they appear. Not translated. */
    formula: string[];
    guardrails: { title: string; items: string[] };
  };
  risks: {
    title: string;
    sub: string;
    items: { risk: string; mitigation: string }[];
  };
  contribute: {
    title: string;
    body: string;
    repoCta: string;
    issuesCta: string;
    note: string;
  };
}

export const soon: Slice<SoonCopy> = {
  en: {
    hero: {
      eyebrow: "On the way",
      title: "A bigger",
      titleAccent: "platform.",
      sub: "Accounts, profiles and role badges are live, and so is the editor - anyone with an account can write a post, save a draft and delete it again. Still being built, in the open: a feed that learns what you actually came here for.",
      cta: "See the roadmap",
      ctaSecondary: "Follow along on GitHub",
    },

    intro: {
      title: "Why this exists.",
      body: "When this started it was a static set of guides with no accounts and no database. It is neither any more: you sign in with a username rather than an address, and you keep a profile - a photo, a banner, a birthday, and whatever badges the platform has granted you. What is still missing is the reason people will come back: writing posts, reading them, and being shown the ones that actually matter to you. This page is the plan for that, published as we go.",
    },

    questions: {
      title: "Decisions still open",
      sub: "Three calls we have not made yet.",
      decided: {
        label: "Decided",
        title: "Supabase, for the whole backend.",
        body: "Supabase covers the database and sign-in in one place, so we are not assembling and running two unrelated services. Because we host it ourselves, the data never leaves our own infrastructure, and no third-party bill grows as engagement grows. The trade is that backups, upgrades and uptime are ours to handle rather than a provider's. Permissions are still enforced in the database itself, through Row Level Security: a rule like \"only verified accounts can publish\" cannot be bypassed by a client.\n\nThe stack we actually run is deliberately smaller than the one Supabase offers: Postgres and Supabase Auth, and nothing else. File storage, Realtime and analytics are switched off - photos are resized in the browser and stored as data on the profile row, which takes an image host off the list of things that can be down.\n\nThe accounts came first, and they shaped one part of this. Supabase Auth owns them: the password, the sessions, the recovery flow. What it does not have is a username - GoTrue insists on an address - so a reader chooses a handle, and an address built from that handle is handed to it behind the scenes. The reader never sees it and nothing is ever sent to it. Their own address, if they gave one, is stored separately and is optional: the platform does not need one, and asking for something you do not need is a good way to lose people.",
      },
      items: [
        {
          q: "How much of this do we build ourselves?",
          why: "A ready-made CMS gives us auth, uploads and an admin panel immediately, but it is opinionated. Hand-rolling everything takes longer and keeps full control.",
        },
        {
          q: "Who is allowed to publish?",
          why: "The plan is anyone. We would still require a verified email, rate limits and a report button, because an open feed with no identity gate fills with junk and the guidance loses its credibility.",
        },
        {
          q: "Which languages do posts come in?",
          why: "Our readers write and read in Arabic, French and English. Posts in one language with no translation quietly lose most of the audience.",
        },
      ],
    },

    stack: {
      title: "What it runs on",
      sub: "Supabase bundles the database and sign-in into one coherent stack, instead of bolting unrelated services together. Since we host it ourselves, running it, upgrading it, backing it up and keeping it patched land on us too: the saving is the assembly, the cost is the operations. Most of what Supabase also ships is deliberately switched off until it earns its place.",
      items: [
        {
          label: "Platform",
          value:
            "Supabase - Postgres and sign-in in one place, self-hosted on our own infrastructure",
        },
        {
          label: "Database",
          value: "Supabase Postgres with the pgvector extension, for semantic search",
        },
        {
          label: "Data access",
          value: "The Supabase client over PostgREST. Row level security decides what a query may return, so the application never has to",
        },
        {
          label: "Accounts",
          value: "Supabase Auth. A username and a password; an email address is not required, and GoTrue is given one built from the handle",
        },
        {
          label: "Media",
          value:
            "No image host at all. Photos are cropped and compressed to WebP in the browser, and stored as data on the profile row - so there is no upload service, no bucket, and one less thing that can be down",
        },
        {
          label: "Live updates",
          value:
            "Not running yet. One subscription per signed-in reader, when reactions and comments land",
        },
        {
          label: "Permissions",
          value:
            "Row Level Security, so the database enforces who may do what - including refusing to let anyone grant themselves a role",
        },
        {
          label: "Transactional email",
          value:
            "Deferred until the domain is live. The platform works without one, and asking for an address nobody reads is how you lose people",
        },
      ],
    },

    phases: {
      title: "The phases",
      sub: "Roughly in order, each one usable before the next starts.",
      items: [
        {
          n: "0",
          name: "Foundations",
          body: "The database, the accounts, and the profile table everything else hangs off. This is the whole foundation - nothing else can start until it exists. Postgres, Supabase Auth, the profiles schema and the role badges are built and working. Storage was deliberately left out: photos are resized in the browser and stored as data. Transactional email waits on the domain.",
          points: [
            "Postgres and schema",
            "Sign-in and sessions",
            "Roles, granted in the database",
            "Transactional email, waiting on the domain",
          ],
        },
        {
          n: "1",
          name: "Profiles and posting",
          body: "Custom profiles, and an editor where anyone can write a post. Both are built: you can rename your profile, and you can write a post in markdown, save it as a draft, publish it and delete it. What is not built is version history - a post currently has one body and no past versions - and profiles do not carry topics yet.",
          points: [
            "Custom profiles with topics",
            "Markdown editor",
            "Drafts, versions, delete",
            "Public or unlisted, per post",
          ],
        },
        {
          n: "2",
          name: "Reactions and comments",
          body: "A small fixed set of reactions instead of a generic like, threaded one level deep, plus follows - and reporting from day one.",
          points: [
            "Meaningful reactions, not just a like",
            "Threaded comments, one level",
            "Follow authors and topics",
            "Report and moderation queue",
          ],
        },
        {
          n: "3",
          name: "Preferences and the feed",
          body: "Ask once what someone cares about, understand what each post is about, and show it to the people most likely to want it.",
          points: [
            "One-time preference questions",
            "Post embedding and tagging",
            "A user vector from their behaviour",
            "Ranked feed with diversity rules",
          ],
        },
        {
          n: "4",
          name: "Notifications",
          body: "Beyond release notes: replies, follows and new posts on topics you chose, in the app and by weekly email.",
          points: [
            "Replies and follows in-app",
            "Live updates over a single connection",
            "Weekly digest email",
            "Per-notification controls",
          ],
        },
      ],
    },

    algorithm: {
      title: "How the feed decides",
      sub: "The interesting part, written plainly.",
      steps: [
        {
          title: "Ask once",
          body: "On first sign-in we ask three to five questions about topics and what you are trying to figure out. Skippable, editable later, never asked again.",
        },
        {
          title: "Understand the post",
          body: "Author-picked topics first, because they carry the most signal. Then reading time, language and media. Then one embedding vector of the text. AI summaries and tagging are optional and off by default.",
        },
        {
          title: "Learn from behaviour",
          body: "Every reaction, save and comment adds that post's vector to a rolling average for that person, with old signals decaying. Dismissals and 'not interested' count, in the other direction.",
        },
        {
          title: "Rank, then spread out",
          body: "Score each candidate, then apply rules so no single author floods the feed and nothing appears twice.",
        },
      ],
      formulaLabel: "Roughly",
      formula: [
        "score = w1\u00b7topic match",
        "     + w2\u00b7similarity to what you engage with",
        "     + w3\u00b7recency",
        "     + w4\u00b7author affinity",
        "     + w5\u00b7engagement quality",
        "     \u2212 w6\u00b7already seen",
      ],
      guardrails: {
        title: "Two rules that decide whether it is any good",
        items: [
          "Engagement quality is not raw counts. Weight by unique people, decay over time, and cap what one author can contribute - otherwise one popular post wins every slot forever.",
          "Always show why. Every card can say why you are seeing it. On a site people make decisions from, unexplained ranking is a trust problem.",
        ],
      },
    },

    risks: {
      title: "What could go wrong",
      sub: "Named up front, not discovered later.",
      items: [
        {
          risk: "Spam, since anyone can post",
          mitigation: "Verified email to publish, rate limits, optional AI flags, one-tap report",
        },
        {
          risk: "Feed quality collapses",
          mitigation: "Quality-weighted engagement, diversity caps, explicit not-interested feedback",
        },
        {
          risk: "The feed is poor until there is data",
          mitigation: "Start on topics alone, and be honest about it early on",
        },
        {
          risk: "Privacy and data protection",
          mitigation: "Consent before tracking, export and delete account, clear retention",
        },
        {
          risk: "One person becomes the whole moderation team",
          mitigation: "Report queue with triage and ban tooling, built in from the first release",
        },
        {
          risk: "AI costs creep upward",
          mitigation: "Embeddings only, and optional AI tagging stays off by default. Both are metered per call, so the bill tracks engagement instead of being fixed up front.",
        },
        {
          risk: "Infrastructure costs are ours now, and they scale with traffic and storage",
          mitigation: "Self-hosting swaps a SaaS bill for Postgres CPU, memory and IOPS, object storage, bandwidth and backups. Cheaper at small scale, and it becomes the dominant cost if the feed gets busy.",
        },
        {
          risk: "We operate the backend ourselves, so an unattended major upgrade can take the whole platform down at once - accounts, reads and writes together.",
          mitigation: "A staging instance to rehearse upgrades on, and a restore path tested before every production change. With a managed service this is the vendor's problem; here it is ours.",
        },
      ],
    },

    contribute: {
      title: "This is built in the open",
      body: "Every decision, bug fix and release is written down and committed. If you want to follow along, read the code, report something awkward you find, or pick up a piece of it - the repository is the honest version of this page.",
      repoCta: "View the repository",
      issuesCta: "Open an issue",
      note: "Nothing here is live yet. The pages on this site are the stable part; the plan is the rest.",
    },
  },

  fr: {
    hero: {
      eyebrow: "En préparation",
      title: "Une plateforme",
      titleAccent: "plus grande.",
      sub: "Les comptes, les profils et les badges sont en ligne, et l'éditeur aussi : chacun avec un compte peut écrire un article, l'enregistrer en brouillon et le supprimer. Ce qui reste à construire, au grand jour : un fil qui comprend ce que vous êtes vraiment venu chercher ici.",
      cta: "Voir la feuille de route",
      ctaSecondary: "Suivre sur GitHub",
    },

    intro: {
      title: "Pourquoi cette page existe.",
      body: "Au début, ce n'était qu'un ensemble statique de guides, sans comptes et sans base de données. Ce n'est plus le cas : on se connecte avec un identifiant plutôt qu'avec une adresse, et l'on garde un profil - une photo, une bannière, une date de naissance, et les badges que la plateforme vous a attribués. Ce qui manque encore, c'est la raison pour laquelle on reviendra : écrire des articles, les lire, et voir ceux qui comptent vraiment pour vous. Cette page est le plan, publié au fil de l'eau.",
    },

    questions: {
      title: "Décisions encore ouvertes",
      sub: "Trois choix que nous n'avons pas encore faits.",
      decided: {
        label: "Décidé",
        title: "Supabase, pour toute la partie serveur.",
        body: "Supabase couvre la base de données et l'authentification au même endroit, sans avoir à assembler et à exploiter deux services sans lien entre eux. Comme nous l'hébergeons nous-mêmes, les données ne quittent jamais notre propre infrastructure, et aucune facture d'un tiers ne grossit avec l'audience. En échange, les sauvegardes, les mises à niveau et la disponibilité sont notre affaire, et non celle d'un fournisseur. Les permissions restent appliquées dans la base de données elle-même, grâce aux Row Level Security : une règle comme « seuls les comptes vérifiés peuvent publier » ne peut pas être contournée par un client.\n\nLa pile que nous exploitons réellement est volontairement plus petite que celle que Supabase propose : Postgres et l'authentification de Supabase, et rien d'autre. Le stockage de fichiers, Realtime et l'analyse sont désactivés - les photos sont redimensionnées dans le navigateur et stockées comme données sur la ligne du profil, ce qui retire un hébergeur d'images de la liste de ce qui peut tomber en panne.\n\nLes comptes sont venus en premier, et ils ont façonné une partie de ce choix. C'est l'authentification de Supabase qui les porte : le mot de passe, les sessions, la récupération. Ce qu'elle n'a pas, en revanche, c'est le nom d'utilisateur - GoTrue exige une adresse - donc le lecteur choisit un identifiant, et une adresse construite à partir de cet identifiant lui est remise en coulisses. Le lecteur ne la voit jamais et rien ne lui est jamais envoyé. S'il a donné la sienne, elle est stockée à part et reste facultative : la plateforme n'en a pas besoin, et demander ce dont on n'a pas besoin, c'est perdre des gens.",
      },
      items: [
        {
          q: "Quelle part construisons-nous nous-mêmes ?",
          why: "Un CMS prêt à l'emploi nous donne immédiatement l'authentification, les envois de fichiers et un panneau d'administration, mais il est directeur. Tout construire à la main prend plus de temps et garde le contrôle total.",
        },
        {
          q: "Qui a le droit de publier ?",
          why: "Le plan, c'est tout le monde. Nous exigerions quand même une adresse e-mail vérifiée, des limites de débit et un bouton de signalement, parce qu'un fil ouvert sans identité vérifiée se remplit de déchets et que l'orientation perd sa crédibilité.",
        },
        {
          q: "Dans quelles langues publie-t-on ?",
          why: "Nos lecteurs écrivent et lisent en arabe, en français et en anglais. Des articles dans une seule langue, sans traduction, perdent discrètement la plus grande partie du public.",
        },
      ],
    },

    stack: {
      title: "Sur quoi cela tourne",
      sub: "Supabase réunit la base de données et l'authentification dans une pile cohérente, au lieu d'assembler des services sans lien entre eux. Puisque nous l'hébergeons nous-mêmes, l'exploiter, le mettre à niveau, en assurer les sauvegardes et les correctifs revient aussi à nous : l'économie porte sur l'assemblage, le coût porte sur l'exploitation. La plupart de ce que Supabase fournit encore est désactivé volontairement, jusqu'à ce qu'il le mérite.",
      items: [
        {
          label: "Plateforme",
          value:
            "Supabase - Postgres et authentification au même endroit, auto-hébergé sur notre propre infrastructure",
        },
        {
          label: "Base de données",
          value:
            "Postgres de Supabase avec l'extension pgvector, pour la recherche sémantique",
        },
        {
          label: "Accès aux données",
          value: "Le client Supabase par-dessus PostgREST. Le Row Level Security décide ce qu'une requête peut renvoyer, l'application n'a donc rien à décider",
        },
        {
          label: "Comptes",
          value:
            "L'authentification de Supabase : un nom d'utilisateur et un mot de passe. Aucune adresse n'est requise, GoTrue en reçoit une construite à partir de l'identifiant",
        },
        {
          label: "Médias",
          value:
            "Aucun hébergeur d'images. Les photos sont recadrées et compressées en WebP dans le navigateur, puis stockées comme données sur la ligne du profil : pas de service d'envoi, pas de bac, une chose de moins qui peut tomber en panne",
        },
        {
          label: "Mises à jour en direct",
          value:
            "Pas encore en service. Un abonnement par lecteur connecté, quand les réactions et les commentaires arriveront",
        },
        {
          label: "Permissions",
          value:
            "Row Level Security, pour que la base de données applique qui peut faire quoi - y compris refuser à quiconque de s'attribuer un badge",
        },
        {
          label: "E-mails transactionnels",
          value:
            "Reportés tant que le domaine n'est pas en ligne. La plateforme fonctionne sans, et demander une adresse que personne ne lit, c'est perdre des gens",
        },
      ],
    },

    phases: {
      title: "Les phases",
      sub: "À peu près dans cet ordre, chacune utilisable avant que la suivante commence.",
      items: [
        {
          n: "0",
          name: "Les fondations",
          body: "La base de données, les comptes, et la table des profils à laquelle tout le reste se rattache. C'est toute la fondation - rien d'autre ne peut commencer avant qu'elle existe. Postgres, l'authentification de Supabase, le schéma des profils et les badges sont construits et fonctionnent. Le stockage a été laissé de côté volontairement : les photos sont redimensionnées dans le navigateur et stockées comme données. Les e-mails transactionnels attendent le domaine.",
          points: [
            "Postgres et le schéma",
            "Connexion et sessions",
            "Les badges, attribués dans la base",
            "E-mails transactionnels, en attente du domaine",
          ],
        },
        {
          n: "1",
          name: "Profils et publication",
          body: "Les profils sont terminés : une photo, une bannière, une date de naissance, la date d'inscription, et les badges que la plateforme vous a attribués - le tout avec une surface de réglages pour le thème et la langue. L'éditeur l'est aussi : on y écrit un article en markdown, on l'enregistre en brouillon, on le publie, on le supprime. Ce qui manque est l'historique des versions - un article n'a pour l'instant qu'un seul corps - et les profils ne portent pas encore de thèmes.",
          points: [
            "Photo, bannière, naissance, badges",
            "Éditeur Markdown",
            "Brouillons, versions, suppression",
            "Public ou non répertorié, article par article",
          ],
        },
        {
          n: "2",
          name: "Réactions et commentaires",
          body: "Un petit jeu fixe de réactions plutôt qu'un « j'aime » générique, des commentaires imbriqués sur un seul niveau, plus les abonnements - et le signalement dès le premier jour.",
          points: [
            "Des réactions qui veulent dire quelque chose, pas seulement un « j'aime »",
            "Commentaires imbriqués, un niveau",
            "Suivre des auteurs et des thèmes",
            "File de signalement et de modération",
          ],
        },
        {
          n: "3",
          name: "Préférences et le fil",
          body: "Demander une fois ce qui intéresse la personne, comprendre de quoi parle chaque article, et le montrer à ceux qui ont le plus de chances de le vouloir.",
          points: [
            "Questions de préférence posées une seule fois",
            "Représentation vectorielle et étiquetage",
            "Un vecteur utilisateur construit sur son comportement",
            "Fil classé avec des règles de diversité",
          ],
        },
        {
          n: "4",
          name: "Notifications",
          body: "Au-delà des notes de version : réponses, abonnements et nouveaux articles sur les thèmes que vous avez choisis, dans l'application et par e-mail hebdomadaire.",
          points: [
            "Réponses et abonnements dans l'application",
            "Mises à jour en direct sur une seule connexion",
            "Résumé hebdomadaire par e-mail",
            "Réglages par notification",
          ],
        },
      ],
    },

    algorithm: {
      title: "Comment le fil décide",
      sub: "La partie intéressante, écrite simplement.",
      steps: [
        {
          title: "Demander une fois",
          body: "À la première connexion, nous posons trois à cinq questions sur les thèmes et sur ce que vous cherchez à comprendre. Facultatives, modifiables plus tard, jamais reposées.",
        },
        {
          title: "Comprendre l'article",
          body: "D'abord les thèmes choisis par l'auteur, parce qu'ils portent le plus de signal. Ensuite le temps de lecture, la langue et les médias. Puis un seul vecteur du texte. Les résumés et l'étiquetage par IA sont facultatifs et désactivés par défaut.",
        },
        {
          title: "Apprendre du comportement",
          body: "Chaque réaction, enregistrement et commentaire ajoute le vecteur de l'article à une moyenne glissante pour cette personne, les anciens signaux perdant de leur poids. Les passages et « pas intéressé » comptent aussi, dans l'autre sens.",
        },
        {
          title: "Classer, puis étaler",
          body: "Noter chaque candidat, puis appliquer des règles pour qu'un seul auteur ne noie pas le fil et que rien n'apparaisse deux fois.",
        },
      ],
      formulaLabel: "Environ",
      formula: [
        "score = w1\u00b7topic match",
        "     + w2\u00b7similarity to what you engage with",
        "     + w3\u00b7recency",
        "     + w4\u00b7author affinity",
        "     + w5\u00b7engagement quality",
        "     \u2212 w6\u00b7already seen",
      ],
      guardrails: {
        title: "Deux règles qui décident si c'est vraiment bon",
        items: [
          "L'engagement de qualité, pas les chiffres bruts. On pondère par personnes uniques, on fait décroître dans le temps, et on plafonne ce qu'un auteur peut apporter - sinon un seul article populaire gagne toutes les places pour toujours.",
          "Toujours montrer pourquoi. Chaque carte peut dire pourquoi vous la voyez. Sur un site où l'on prend des décisions, un classement non expliqué est un problème de confiance.",
        ],
      },
    },

    risks: {
      title: "Ce qui pourrait mal tourner",
      sub: "Nommé tout de suite, pas découvert plus tard.",
      items: [
        {
          risk: "Le spam, puisque tout le monde peut publier",
          mitigation: "E-mail vérifié pour publier, limites de débit, signalement par IA facultatif, bouton de signalement en un geste",
        },
        {
          risk: "La qualité du fil s'effondre",
          mitigation: "Engagement pondéré par la qualité, plafonds de diversité, retour explicite « pas intéressé »",
        },
        {
          risk: "Le fil est médiocre tant qu'il n'y a pas de données",
          mitigation: "Démarrer sur les thèmes seuls, et être honnête là-dessus dès le début",
        },
        {
          risk: "Vie privée et protection des données",
          mitigation: "Consentement avant tout suivi, export et suppression du compte, durée de conservation claire",
        },
        {
          risk: "Une seule personne devient toute l'équipe de modération",
          mitigation: "File de signalements avec triage et outils de blocage, prévus dès la première version",
        },
        {
          risk: "Les coûts de l'IA grisent vers le haut",
          mitigation: "Des vecteurs uniquement, et un étiquetage par IA facultatif qui reste désactivé par défaut. Les deux sont facturés à l'appel : la facture suit l'usage réel au lieu d'être fixée dès le départ.",
        },
        {
          risk: "Les coûts d'infrastructure sont désormais les nôtres, et ils augmentent avec le trafic et le stockage",
          mitigation: "L'auto-hébergement remplace une facture d'abonnement par du CPU Postgres, de la mémoire, des IOPS, du stockage objet, de la bande passante et des sauvegardes. Moins cher à petite échelle, et cela devient le poste dominant si le fil s'anime.",
        },
        {
          risk: "Nous exploitons le backend nous-mêmes : une mise à niveau majeure lancée sans surveillance peut faire tomber toute la plateforme d'un coup - comptes, lectures et écritures ensemble.",
          mitigation: "Une instance de préproduction pour répéter les mises à niveau, et une procédure de restauration testée avant chaque changement en production. Avec un service géré, c'est le problème du fournisseur ; ici, c'est le nôtre.",
        },
      ],
    },

    contribute: {
      title: "Tout est construit au grand jour",
      body: "Chaque décision, correction de bug et version est écrite et archivée. Si vous voulez suivre, lisez le code, signalez ce qui vous paraît bancal, ou prenez une partie en charge - le dépôt est la version honnête de cette page.",
      repoCta: "Voir le dépôt",
      issuesCta: "Ouvrir un ticket",
      note: "Les guides, les comptes et les profils sont en ligne. L'écriture, la lecture et le fil sont le reste.",
    },
  },

  ar: {
    hero: {
      eyebrow: "قريباً",
      title: "منصة",
      titleAccent: "أكبر.",
      sub: "الحسابات والملفّات الشخصية وشارات الأدوار تعمل الآن، وكذلك المحرّر: أيّ صاحب حساب يستطيع أن يكتب مقالاً، ويحفظه مسودّة، ثم يحذفه. وما يزال قيد البناء، في العلن: خلاصة تتعلّم ما جئت إلى هنا من أجله فعلاً.",
      cta: "اطّلع على خارطة الطريق",
      ctaSecondary: "تابعنا على GitHub",
    },

    intro: {
      title: "لماذا هذه الصفحة.",
      body: "في البداية كان الموقع مجموعة أدلة ثابتة، بلا حسابات وبلا قاعدة بيانات. وقد صار ذلك غير صحيح: تسجّل الدخول باسم مستخدم بدل بريد، وتحتفظ بملفّ شخصي - صورة وشعاراً عريضاً وتاريخ ميلاد، وما منحته المنصّة من شارات. وما يزال ناقصاً ما يجعل الناس يعودون: كتابة المقالات وقراءتها، وعرض ما يهمّك فعلاً. هذه الصفحة هي الخطة لذلك، تُنشر بالتوازي مع التنفيذ.",
    },

    questions: {
      title: "قرارات لم تُتخذ بعد",
      sub: "ثلاثة اختيارات لم نُقرّرها بعد.",
      decided: {
        label: "قرّر",
        title: "Supabase، من أجل كلّ ما في الخلفية.",
        body: "Supabase يجمع قاعدة البيانات وتسجيل الدخول في مكان واحد، فلا نضطر إلى تجميع خدمتين لا صلة بينهما وتشغيلهما. وبما أننا نستضيفه بأنفسنا، فإن البيانات لا تغادر بنيتنا التحتية أبداً، ولا توجد فاتورة طرف ثالث تكبر مع نمو التفاعل. والمقابل أن النسخ الاحتياطي والترقيات وجاهزية الخدمة مسؤوليتنا نحن، لا مسؤولية مزوّد. أمّا الصلاحيات فتُطبَّق داخل قاعدة البيانات نفسها عبر أمان مستوى الصفوف، فلا يستطيع أيّ تطبيق عميل تجاوز قاعدة مثل «لا يُنشر إلّا من حسابات موثّقة».\n\nالمنظومة التي نشغّلها فعلاً أصغر عمداً ممّا يقدّمه Supabase: Postgres وتسجيل الدخول في Supabase، ولا شيء سواهما. أمّا تخزين الملفات والتحديثات المباشرة والتحليلات فمعطّلة - فالصور تُصغَّر داخل المتصفح وتُخزَّن كبيانات في صفّ الملفّ الشخصي، فيختفي مضيف الصور من قائمة ما قد يتعطّل.\n\nالحسابات جت أوّلًا، وهي وضعت جزءًا من هذا الاختيار. تسجيل الدخول في Supabase هو ما يحملها: كلمة السر والجلسات والاسترجاع. لكنه لا يعرف اسم المستخدم - GoTrue يشترط بريدًا - فيختار القارئ اسمًا، ثم تُبنى من ذلك الاسم بريدًا في الكواليس. لا يراه القارئ أبداً، ولا يُرسل إليه منه شيء أبداً. أمّا بريده هو إن أعطاه، فيُخزَّن جانباً وما يزال اختيارياً: فالمنصّة لا تحتاجه، وطلب شيءٍ لا تحتاجه طريقةٌ جيدة لتفقد الناس.",
      },
      items: [
        {
          q: "كم نبنيه بأنفسنا؟",
          why: "نظام إدارة محتوى جاهز يمنحنا المصادقة ورفع الملفات ولوحة تحكّم فوراً، لكنه يفرض مقاربة خاصة به. وبناء كل شيء يدوياً يستغرق وقتاً أطول ويحافظ على التحكّم الكامل.",
        },
        {
          q: "من يحقّ له النشر؟",
          why: "الخطة أن ينشر الجميع. لكننا سنشترط مع ذلك بريداً إلكترونياً موثّقاً، وحدوداً لمعدل النشر، وزرّاً للإبلاغ، لأن خلاصة مفتوحة بلا هوية موثّقة تمتلئ بالهراء، فيخسر الإرشاد مصداقيته.",
        },
        {
          q: "بأي لغات تُكتب المقالات؟",
          why: "قرّاؤنا يكتبون ويقرأون بالعربية والفرنسية والإنجليزية. المقالات بلغة واحدة بلا ترجمة تخسر بهدوء معظم الجمهور.",
        },
      ],
    },

    stack: {
      title: "على ماذا تعمل المنصّة",
      sub: "Supabase يجمع قاعدة البيانات وتسجيل الدخول في منظومة واحدة متجانسة، بدل تجميع خدمات لا صلة بينها. وبما أننا نستضيفه بأنفسنا، فإن تشغيله وترقيته وأخذ النسخ الاحتياطي منه وتصحيح ثغراته تقع علينا نحن أيضاً: التوفير في التجميع، والتكلفة في التشغيل. ومعظم ما يقدّمه Supabase أيضاً معطّل عمداً، حتى يستحقّ مكانه.",
      items: [
        {
          label: "المنصّة",
          value:
            "Supabase - Postgres وتسجيل الدخول في مكان واحد، باستضافة ذاتية على بنيتنا التحتية",
        },
        {
          label: "قاعدة البيانات",
          value: "Postgres من Supabase مع إضافة pgvector، للبحث الدلالي",
        },
        {
          label: "الوصول إلى البيانات",
          value: "عميل Supabase فوق PostgREST. أمان مستوى الصفوف هو ما يقرّر ما تستطيع الاستعلامات إعادته، فالتطبيق لا يحتاج أن يقرّر شيئًا",
        },
        {
          label: "الحسابات",
          value:
            "تسجيل الدخول في Supabase: اسم مستخدم وكلمة مرور. البريد ليس مطلوبًا، وGoTrue يُعطى بريدًا مبنيًا على اسم المستخدم",
        },
        {
          label: "الوسائط",
          value:
            "لا مضيف صور إطلاقاً. تُقصّ الصور وتُضغط بصيغة WebP داخل المتصفح، ثم تُخزَّن كبيانات في صفّ الملفّ الشخصي - فلا خدمة رفع، ولا حاوية تخزين، وشيء أقلّ قد يتعطّل",
        },
        {
          label: "التحديثات المباشرة",
          value:
            "لا تعمل بعد. اشتراك واحد لكل قارئ مسجَّل الدخول، حين تصل التفاعلات والتعليقات",
        },
        {
          label: "الصلاحيات",
          value:
            "أمان مستوى الصفوف، فتطبّق قاعدة البيانات نفسها من يحقّ له فعل ماذا - بما في ذلك رفض السماح لأحدٍ بأن يمنح نفسه شارة",
        },
        {
          label: "بريد المعاملات",
          value:
            "مؤجَّل حتى يعمل النطاق. المنصّة تعمل بدونه، وطلب بريد لا يقرأه أحد طريقةٌ مضمونة لتفقد الناس",
        },
      ],
    },

    phases: {
      title: "المراحل",
      sub: "بترتيب تقريبي، كل مرحلة قابلة للاستعمال قبل أن تبدأ التي تليها.",
      items: [
        {
          n: "0",
          name: "الأساسات",
          body: "قاعدة البيانات والحسابات، وجدول الملفّات الشخصية الذي يتعلّق به كل شيء آخر. هذا هو الأساس كلّه - لا شيء آخر يمكن أن يبدأ قبل أن يوجد. Postgres وتسجيل الدخول في Supabase ومخطّط الملفّات الشخصية وشارات الأدوار مبنيّة وتعمل. أمّا التخزين فترك عمداً: الصور تُصغَّر داخل المتصفح وتُخزَّن كبيانات. وبريد المعاملات ينتظر النطاق.",
          points: [
            "Postgres والمخطّط",
            "تسجيل الدخول والجلسات",
            "الشارات، تُمنح داخل قاعدة البيانات",
            "بريد المعاملات، بانتظار النطاق",
          ],
        },
        {
          n: "1",
          name: "الملفّات الشخصية والنشر",
          body: "الملفّات الشخصية اكتملت: صورة وشعار عريض وتاريخ ميلاد وتاريخ الانضمام، والشارات التي منحتها لك المنصّة - مع سطح إعدادات للمظهر واللغة. واكتمل المحرّر أيضاً: يكتب المرء مقاله بصيغة ماركداون، ويحفظه مسودّة أو ينشره، ثم يحذفه. وما لم يُبنَ بعد هو سجلّ الإصدارات - للمقال جسد واحد لا أجيال - والوسوم التي يختارها الكاتب.",
          points: [
            "الصورة والشعار والميلاد والشارات",
            "محرّر Markdown",
            "مسودّات وإصدارات وحذف",
            "عام أو غير مُدرج، لكل مقال",
          ],
        },
        {
          n: "2",
          name: "التفاعلات والتعليقات",
          body: "مجموعة صغيرة وثابتة من التفاعلات بدل «إعجاب» عام، وتعليقات متداخلة في مستوى واحد فقط، إضافة إلى المتابعة - والإبلاغ منذ اليوم الأول.",
          points: [
            "تفاعلات ذات معنى، لا مجرد إعجاب",
            "تعليقات متداخلة، مستوى واحد",
            "متابعة المؤلّفين والمواضيع",
            "قائمة إبلاغ وإشراف",
          ],
        },
        {
          n: "3",
          name: "التفضيلات والخلاصة",
          body: "نسأل مرة واحدة عمّ يهمّ الشخص، ونفهم عمّ يتحدث كل مقال، ونعرضه على من هم أكثر احتمالاً لرغبته فيه.",
          points: [
            "أسئلة تفضيلات تُطرح مرة واحدة",
            "تضمين نصي وتحليل موضوعات",
            "متجه للمستخدم مستنتج من سلوكه",
            "خلاصة مرتّبة مع قواعد تنوّع",
          ],
        },
        {
          n: "4",
          name: "الإشعارات",
          body: "أبعد من مجرّد إشعارات الإصدارات: الردود والمتابعات والمقالات الجديدة في المواضيع التي اخترتها، داخل التطبيق وعبر بريد أسبوعي.",
          points: [
            "الردود والمتابعات داخل التطبيق",
            "تحديثات مباشرة عبر اتصال واحد",
            "ملخّص أسبوعي عبر البريد",
            "ضبط لكل إشعار على حدة",
          ],
        },
      ],
    },

    algorithm: {
      title: "كيف تتّخذ الخلاصة قرارها",
      sub: "الجزء المثير للاهتمام، مكتوباً ببساطة.",
      steps: [
        {
          title: "نسأل مرة واحدة",
          body: "عند أول تسجيل دخول، نطرح ثلاثة إلى خمسة أسئلة عن المواضيع وعن ما تحاول معرفته. يمكن تخطّيها، وتعديلها لاحقاً، ولا تُطرح مرة أخرى أبداً.",
        },
        {
          title: "نفهم المقال",
          body: "أولاً المواضيع التي يختارها الكاتب، لأنها تحمل أكبر إشارة. ثم مدة القراءة واللغة والوسائط. ثم متجه واحد لتمثيل النص. أما الملخّصات وتحليل الموضوعات بالذكاء الاصطناعي فاختيارية ومعطّلة افتراضياً.",
        },
        {
          title: "نتعلّم من السلوك",
          body: "كل تفاعل أو حفظ أو تعليق يضيف متجه ذلك المقال إلى متوسّط متحرّك لهذا الشخص، مع تلاشي وزن الإشارات القديمة. أمّا التمرير و«غير مهتمّ» فيحسبان أيضاً، في الاتجاه المعاكس.",
        },
        {
          title: "نرتّب، ثم نوزّع",
          body: "نمنح كل مرشّح درجة، ثم نطبّق قواعد حتى لا يغرق مؤلّف واحد الخلاصة، وحتى لا يظهر الشيء نفسه مرتين.",
        },
      ],
      formulaLabel: "تقريباً",
      formula: [
        "score = w1\u00b7topic match",
        "     + w2\u00b7similarity to what you engage with",
        "     + w3\u00b7recency",
        "     + w4\u00b7author affinity",
        "     + w5\u00b7engagement quality",
        "     \u2212 w6\u00b7already seen",
      ],
      guardrails: {
        title: "قاعدتان تحدّدان إن كان الأمر جيّداً فعلاً",
        items: [
          "التفاعل النوعي، لا الأرقام الخام. يُرجَّح حسب الأشخاص الفريدين، ويزول وزنه مع مرور الوقت، ويُحدّ ما يسهم به مؤلّف واحد - وإلا فاز مقال واحد شهير بكل الخانات إلى الأبد.",
          "برّر دائماً. كل بطاقة تستطيع أن تقول لماذا تراها. في موقع يتّخذ فيه الناس قراراتهم، الترتيب غير المفسَّر مشكلة ثقة.",
        ],
      },
    },

    risks: {
      title: "ما الذي قد يسوء",
      sub: "مذكور منذ البداية، لا مكتشف لاحقاً.",
      items: [
        {
          risk: "رسائل مزعجة، لأن الجميع يستطيع النشر",
          mitigation: "بريد إلكتروني موثّق للنشر، وحدود لمعدل النشر، وإشارات ذكاء اصطناعي اختيارية، وإبلاغ بلمسة واحدة",
        },
        {
          risk: "انهيار جودة الخلاصة",
          mitigation: "تفاعل مرجَّح بالجودة، وحدود للتنوّع، وملاحظات صريحة «غير مهتمّ»",
        },
        {
          risk: "الخلاصة رديئة ما دام لا توجد بيانات",
          mitigation: "البدء بالمواضيع وحدها، والصراحة بذلك منذ البداية",
        },
        {
          risk: "الخصوصية وحماية البيانات",
          mitigation: "الموافقة قبل أي تتبّع، وتصدير الحساب وحذفه، ومدة احتفاظ واضحة",
        },
        {
          risk: "شخص واحد يصبح فريق الإشراف كلّه",
          mitigation: "قائمة إبلاغات مع فرز وأدوات حظر، مبنيّة منذ الإصدار الأول",
        },
        {
          risk: "تكاليف الذكاء الاصطناعي تتضخّم تدريجياً",
          mitigation: "التضمينات فقط، ويبقى تحليل الموضوعات بالذكاء الاصطناعي اختيارياً ومعطّلاً افتراضياً. وكلاهما يُحتسب لكل استدعاء، فالفاتورة تتابع تفاعل المستخدمين بدل أن تكون مبلغاً ثابتاً مقدّماً.",
        },
        {
          risk: "تكاليف البنية التحتية صارت مسؤوليتنا، وهي تتناسب مع عدد الزوّار وحجم التخزين",
          mitigation: "الاستضافة الذاتية تستبدل فاتورة الاشتراك بمعالجة Postgres والذاكرة وعمليات الإدخال والإخراج وتخزين الملفات واستهلاك البيانات والنسخ الاحتياطية. أرخص ما لم يكبر الاستعمال، لكنها تصبح أكبر بند في التكلفة إذا ازدحمت الخلاصة.",
        },
        {
          risk: "إدارة الواجهة الخلفية مسؤوليتنا وحدنا، لذلك يمكن أن تُسقط ترقيةٌ كبرى غيرُ مراقبة المنصّة كلّها مرّة واحدة - الحسابات والقراءة والكتابة معاً.",
          mitigation: "بيئة اختبار لتدريب الترقيات عليها، ومسار استعادة نُختبَر قبل كل تغيير في بيئة الإنتاج. مع خدمة مُدارة يكون ذلك مشكلةَ المزوّد؛ أمّا هنا فهو مسؤوليّتنا.",
        },
      ],
    },

    contribute: {
      title: "هذا المشروع يُبنى في العلن",
      body: "كل قرار وإصلاح علة وإصدار مكتوب ومُودَع. إن أردت المتابعة، فاقرأ الشيفرة، أو بلّغ عن أمر محيّر يصادفك، أو خُذ على عاتقك جزءاً منه - المستودع هو النسخة الصادقة من هذه الصفحة.",
      repoCta: "اطّلع على المستودع",
      issuesCta: "افتح مسألة",
      note: "الأدلة والحسابات والملفّات الشخصية تعمل الآن. أمّا الكتابة والقراءة والخلاصة فهي الباقي.",
    },
  },
};