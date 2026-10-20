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
      sub: "What is here now - guides, accounts, profiles and a community you can write in - is the floor, not the plan. What is still being built: reactions and comments, direct messages between people, images and files attached to posts, and a feed that learns what you actually came here for.",
      cta: "See the roadmap",
      ctaSecondary: "Follow along on GitHub",
    },

    intro: {
      title: "Why this page exists.",
      body: "The site has grown past the guides it started as. You sign in with a username rather than an address, you keep a profile, and you can write, publish and delete posts in three languages. All of that is done, and so it is not on this page. What is on this page is the rest: the parts still being built, written down in the open while they are still uncertain. Two of them are new to the plan - direct messages between people, and attaching images, files and videos to a post - and both bring a decision with them that this page names rather than hides.",
    },

    questions: {
      title: "Decisions still open",
      sub: "Four calls we have not made yet.",
      decided: {
        label: "Decided",
        title: "Supabase, for the whole backend.",
        body: "Supabase covers the database and sign-in in one place, so we are not assembling and running two unrelated services. Because we host it ourselves, the data never leaves our own infrastructure, and no third-party bill grows as engagement grows. The trade is that backups, upgrades and uptime are ours to handle rather than a provider's. Permissions are still enforced in the database itself, through Row Level Security: a rule like \"only the author can edit their own post\" cannot be bypassed by a client.\n\nThe accounts came first, and they shaped one part of this. Supabase Auth owns them: the password, the sessions, the recovery flow. What it does not have is a username - GoTrue insists on an address - so a reader chooses a handle, and an address built from that handle is handed to it behind the scenes. The reader never sees it and nothing is ever sent to it. Their own address, if they gave one, is stored separately and is optional: the platform does not need one, and asking for something you do not need is a good way to lose people.\n\nA profile row also holds a date of birth and, if one was given, an address. Neither is public, and that was not left to a permission that could be widened by accident. What a stranger may read is a separate view holding the name, the photo, the banner, the badges and the join date, and it is not possible to ask that view for an address because an address is not in it. A person appears there once they have published something, and not before.\n\nOne part of the stack is about to change, and it is worth saying why. Avatars are resized in the browser and stored as data on the profile row, which keeps an image host off the list of things that can be down. That works for one small picture per person and it cannot work for a post carrying several images, a PDF or a video. So a storage bucket is being switched on for attachments - the one place the no-host rule had to bend. It is a real trade, taken deliberately, and it is named here rather than quietly dropped.",
      },
      items: [
        {
          q: "How much of this do we build ourselves?",
          why: "A ready-made CMS gives us auth, uploads and an admin panel immediately, but it is opinionated. Hand-rolling everything takes longer and keeps full control.",
        },
        {
          q: "Are direct messages private, or moderated?",
          why: "Messages between two people are private, and nobody here reads them by default - a site that quietly reads private conversations has broken the thing it was built for. The counterweight is abuse: a participant can report a conversation, and a report hands that one thread to moderators, and nothing else. Making that promise now, before the feature exists, is the only time it can be made honestly.",
        },
        {
          q: "Do posts need a moderation step?",
          why: "Settled, for now: anyone with an account may publish, with no approval queue and no verified email - an address is optional here, so gating on one would be gating on something the platform does not require. What is genuinely open is what happens the first time a stranger reads the feed and it has something in it they should not see. A report button and a way to hide a post are the answer, and neither is built.",
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
            "Avatars stay as data on the profile row - cropped and compressed to WebP in the browser, so there is no host for them. Post attachments cannot work that way, so Supabase Storage is being switched on for those, with size and type limits",
        },
        {
          label: "Live updates",
          value:
            "Not running yet. One subscription per signed-in reader, when reactions, comments and direct messages land",
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
      title: "The roadmap",
      sub: "What is left, roughly in order. Everything already shipped has been taken off this list.",
      items: [
        {
          n: "1",
          name: "Attachments",
          body: "Images and files on a post - a photo of a certificate, a scanned form, a course brochure. This is the first feature to need a real storage bucket: a post carrying several files cannot be squeezed onto a database row the way an avatar can, so Supabase Storage is switched on for it, with a ceiling on size and a short list of allowed types. Video is named separately below, because it is the one attachment this project is least sure it can carry.",
          points: [
            "Upload images and files to a post",
            "A storage bucket, with size and type limits",
            "Delete your own files, and remove them with the post",
            "Video, later and only if the bandwidth cost earns it",
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
          name: "Direct messages",
          body: "Private conversation between two people, one to one to begin with. Private means private: nobody here reads a thread by default, and the promise is written down before the feature exists because that is the only honest time to make it. The counterweight is abuse - a participant can report a conversation, and a report hands that one thread to moderators and nothing else. A block, a mute and a way to leave a thread come with it, not after it.",
          points: [
            "One-to-one threads, private by default",
            "Read receipts and typing, or neither - still open",
            "Report a conversation, handing over that thread only",
            "Block, mute and leave",
          ],
        },
        {
          n: "4",
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
          n: "5",
          name: "Notifications",
          body: "Beyond release notes: replies, follows, new posts on topics you chose, and messages, in the app and by weekly email.",
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
          risk: "Abuse in private messages, where nobody can see it",
          mitigation: "A participant can report a thread, which hands that thread and nothing else to moderators. Block, mute and leave exist from the first version. Private does not mean unaccountable",
        },
        {
          risk: "Self-hosted attachments make bandwidth and storage the cost that scales worst",
          mitigation: "Size and type ceilings on every upload, and video deliberately deferred. Storage is the one place the no-image-host rule bends, so it is watched rather than assumed",
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
      note: "Everything on this page is still being built. The pages you can visit now are the finished part; what is written above is the rest.",
    },
  },

  fr: {
    hero: {
      eyebrow: "En préparation",
      title: "Une plateforme",
      titleAccent: "plus grande.",
      sub: "Ce qui est en ligne aujourd'hui - les guides, les comptes, les profils et une communauté où l'on peut écrire - c'est le plancher, pas le plan. Ce qui reste à construire : les réactions et les commentaires, les messages directs entre personnes, les images et les fichiers joints aux articles, et un fil qui comprend ce que vous êtes vraiment venu chercher ici.",
      cta: "Voir la feuille de route",
      ctaSecondary: "Suivre sur GitHub",
    },

    intro: {
      title: "Pourquoi cette page existe.",
      body: "Le site a dépassé les guides par lesquels il a commencé. On se connecte avec un identifiant plutôt qu'avec une adresse, on garde un profil, et on peut écrire, publier et supprimer des articles en trois langues. Tout cela est fait, et ne figure donc pas sur cette page. Ce qui figure ici, c'est le reste : les parties encore en construction, écrites au grand jour tant qu'elles sont encore incertaines. Deux d'entre elles sont nouvelles dans le plan - les messages directs entre personnes, et le fait de joindre des images, des fichiers et des vidéos à un article - et chacune vient avec une décision que cette page nomme au lieu de la cacher.",
    },

    questions: {
      title: "Décisions encore ouvertes",
      sub: "Quatre choix que nous n'avons pas encore faits.",
      decided: {
        label: "Décidé",
        title: "Supabase, pour toute la partie serveur.",
        body: "Supabase couvre la base de données et l'authentification au même endroit, sans avoir à assembler et à exploiter deux services sans lien entre eux. Comme nous l'hébergeons nous-mêmes, les données ne quittent jamais notre propre infrastructure, et aucune facture d'un tiers ne grossit avec l'audience. En échange, les sauvegardes, les mises à niveau et la disponibilité sont notre affaire, et non celle d'un fournisseur. Les permissions restent appliquées dans la base de données elle-même, grâce aux Row Level Security : une règle comme « seul l'auteur peut modifier son propre article » ne peut pas être contournée par un client.\n\nLes comptes sont venus en premier, et ils ont façonné une partie de ce choix. C'est l'authentification de Supabase qui les porte : le mot de passe, les sessions, la récupération. Ce qu'elle n'a pas, en revanche, c'est le nom d'utilisateur - GoTrue exige une adresse - donc le lecteur choisit un identifiant, et une adresse construite à partir de cet identifiant lui est remise en coulisses. Le lecteur ne la voit jamais et rien ne lui est jamais envoyé. S'il a donné la sienne, elle est stockée à part et reste facultative : la plateforme n'en a pas besoin, et demander ce dont on n'a pas besoin, c'est perdre des gens.\n\nLa ligne du profil contient aussi une date de naissance et, si elle a été donnée, une adresse. Ni l'une ni l'autre n'est publique, et cela n'a pas été laissé à une permission qui pourrait s'élargir par accident. Ce qu'un inconnu peut lire est une vue séparée qui contient le nom, la photo, la bannière, les badges et la date d'inscription, et il n'est pas possible de demander une adresse à cette vue parce qu'une adresse n'y est pas. Une personne y apparaît une fois qu'elle a publié quelque chose, et pas avant.\n\nUne partie de la pile est sur le point de changer, et il vaut la peine d'en dire pourquoi. Les photos de profil sont redimensionnées dans le navigateur et stockées comme données sur la ligne du profil, ce qui retire un hébergeur d'images de la liste de ce qui peut tomber en panne. Cela marche pour une seule petite image par personne, et cela ne peut pas marcher pour un article portant plusieurs images, un PDF ou une vidéo. Un bac de stockage va donc être activé pour les pièces jointes - le seul endroit où la règle « pas d'hébergeur d'images » a dû céder. C'est un vrai compromis, pris exprès, et il est nommé ici plutôt que laissé tomber en silence.",
      },
      items: [
        {
          q: "Quelle part construisons-nous nous-mêmes ?",
          why: "Un CMS prêt à l'emploi nous donne immédiatement l'authentification, les envois de fichiers et un panneau d'administration, mais il est directeur. Tout construire à la main prend plus de temps et garde le contrôle total.",
        },
        {
          q: "Les messages directs sont-ils privés, ou modérés ?",
          why: "Les messages entre deux personnes sont privés, et personne ici ne les lit par défaut - un site qui lit discrètement les conversations privées a trahi ce pour quoi il a été construit. Le contrepoids, c'est l'abus : un participant peut signaler une conversation, et un signalement ne remet que ce fil aux modérateurs, rien d'autre. Promettre cela maintenant, avant que la fonction existe, est le seul moment où la promesse peut être faite honnêtement.",
        },
        {
          q: "Les articles ont-ils besoin d'une modération ?",
          why: "Tranché, pour l'instant : toute personne ayant un compte peut publier, sans file d'approbation et sans adresse vérifiée - l'adresse est facultative ici, donc l'exiger reviendrait à exiger ce que la plateforme ne demande pas. Ce qui reste vraiment ouvert, c'est ce qui se passe le jour où un inconnu lit le fil et y trouve quelque chose qu'il ne devrait pas voir. Un bouton de signalement et un moyen de masquer un article sont la réponse, et ni l'un ni l'autre n'existe.",
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
            "Les photos de profil restent des données sur la ligne du profil - recadrées et compressées en WebP dans le navigateur, donc sans hébergeur pour elles. Les pièces jointes ne peuvent pas fonctionner ainsi : Supabase Storage va être activé pour celles-ci, avec une limite de taille et de types",
        },
        {
          label: "Mises à jour en direct",
          value:
            "Pas encore en service. Un abonnement par lecteur connecté, quand les réactions, les commentaires et les messages directs arriveront",
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
      title: "La feuille de route",
      sub: "Ce qui reste, à peu près dans cet ordre. Tout ce qui est déjà livré a été retiré de cette liste.",
      items: [
        {
          n: "1",
          name: "Pièces jointes",
          body: "Des images et des fichiers sur un article - la photo d'un certificat, un formulaire scanné, une brochure de formation. C'est la première fonction à avoir besoin d'un vrai bac de stockage : un article portant plusieurs fichiers ne peut pas être tassé sur une ligne de base de données comme le peut une photo de profil, donc Supabase Storage est activé pour cela, avec un plafond de taille et une courte liste de types autorisés. La vidéo est traitée à part ci-dessous, car c'est la pièce jointe que ce projet est le moins sûr de pouvoir porter.",
          points: [
            "Joindre des images et des fichiers à un article",
            "Un bac de stockage, avec limites de taille et de types",
            "Supprimer ses propres fichiers, et les retirer avec l'article",
            "La vidéo, plus tard et seulement si le coût en bande passante le justifie",
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
          name: "Messages directs",
          body: "Une conversation privée entre deux personnes, d'abord à deux. Privée veut dire privée : personne ici ne lit un fil par défaut, et la promesse est écrite avant que la fonction existe, parce que c'est le seul moment où elle peut être faite honnêtement. Le contrepoids, c'est l'abus - un participant peut signaler une conversation, et un signalement ne remet que ce fil aux modérateurs, rien d'autre. Bloquer, silencier et quitter un fil viennent avec, pas après.",
          points: [
            "Des fils à deux, privés par défaut",
            "Accusés de réception et indicateur de saisie, ou aucun des deux - encore ouvert",
            "Signaler une conversation, en ne remettant que ce fil",
            "Bloquer, silencier et quitter",
          ],
        },
        {
          n: "4",
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
          n: "5",
          name: "Notifications",
          body: "Au-delà des notes de version : réponses, abonnements, nouveaux articles sur les thèmes que vous avez choisis, et messages, dans l'application et par e-mail hebdomadaire.",
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
          risk: "Les abus dans les messages privés, là où personne ne les voit",
          mitigation: "Un participant peut signaler un fil, ce qui remet ce fil et rien d'autre aux modérateurs. Bloquer, silencier et quitter existent dès la première version. Privé ne veut pas dire sans compte rendu",
        },
        {
          risk: "Les pièces jointes auto-hébergées font de la bande passante et du stockage le coût qui grossit le plus mal",
          mitigation: "Des plafonds de taille et de types sur chaque envoi, et la vidéo volontairement repoussée. Le stockage est le seul endroit où la règle « pas d'hébergeur d'images » cède, donc il est surveillé et non supposé",
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
      note: "Tout ce qui figure sur cette page est encore en construction. Les pages que vous pouvez visiter maintenant sont la partie finie ; ce qui est écrit au-dessus est le reste.",
    },
  },

  ar: {
    hero: {
      eyebrow: "قريباً",
      title: "منصة",
      titleAccent: "أكبر.",
      sub: "ما هو قائم اليوم - الأدلة والحسابات والملفّات الشخصية ومجتمعٌ يمكن الكتابة فيه - هو الحدّ الأدنى، لا الخطة. وما يزال قيد البناء: التفاعلات والتعليقات، والرسائل المباشرة بين الناس، وصور وملفات تُرفَق بالمقالات، وخلاصة تتعلّم ما جئت إلى هنا من أجله فعلاً.",
      cta: "اطّلع على خارطة الطريق",
      ctaSecondary: "تابعنا على GitHub",
    },

    intro: {
      title: "لماذا هذه الصفحة.",
      body: "تجاوز الموقعَ الأدلةَ التي بدأ بها. تسجّل الدخول باسم مستخدم بدل بريد، وتحتفظ بملفّ شخصي، وتستطيع أن تكتب مقالاتك وتنشرها وتحذفها بثلاث لغات. كل ذلك تمّ، ولذلك لا يرد في هذه الصفحة. ما يرد فيها هو الباقي: الأجزاء التي ما تزال قيد الإنشاء، مكتوبةً في العلن ما دامت غير محسومة. اثنان منها جديدان في الخطة - الرسائل المباشرة بين الناس، وإرفاق صور وملفات وفيديوهات بالمقال - وكلٌّ منهما يجلب معه قراراً تسمّيه هذه الصفحة بدل أن تخفيه.",
    },

    questions: {
      title: "قرارات لم تُتخذ بعد",
      sub: "أربعة اختيارات لم نُقرّرها بعد.",
      decided: {
        label: "قرّر",
        title: "Supabase، من أجل كلّ ما في الخلفية.",
        body: "Supabase يجمع قاعدة البيانات وتسجيل الدخول في مكان واحد، فلا نضطر إلى تجميع خدمتين لا صلة بينهما وتشغيلهما. وبما أننا نستضيفه بأنفسنا، فإن البيانات لا تغادر بنيتنا التحتية أبداً، ولا توجد فاتورة طرف ثالث تكبر مع نمو التفاعل. والمقابل أن النسخ الاحتياطي والترقيات وجاهزية الخدمة مسؤوليتنا نحن، لا مسؤولية مزوّد. أمّا الصلاحيات فتُطبَّق داخل قاعدة البيانات نفسها عبر أمان مستوى الصفوف، فلا يستطيع أيّ تطبيق عميل تجاوز قاعدة مثل «لا يعدّل المقال إلّا كاتبه».\n\nويتغيّر جزءٌ من المنظومة قريباً، ومن باب الأمانة يستحقّ أن يُقال لماذا. تبقى صور الملفّ الشخصي بياناتً في صفّ الملفّ الشخصي - تُقصّ وتُضغط إلى WebP داخل المتصفح، فيختفي مضيفُ صورِ الحسابات من قائمة ما قد يتعطّل. وهذا يصلح لصورةٍ صغيرة واحدة لكل شخص، ولا يصلح لمقال يحمل عدّة صور أو ملفّ PDF أو فيديو. لذلك سيُفعَّل دلو تخزين (bucket) للمرفقات - وهو الموضع الوحيد الذي اضطرّت فيه قاعدة «بلا مضيف صور» أن تنحني. إنه مقايضةٌ حقيقية، تُؤخذ عمداً، وتُسمّى هنا بدل أن تُترك تسقط في صمت.\n\nالحسابات جت أوّلًا، وهي وضعت جزءًا من هذا الاختيار. تسجيل الدخول في Supabase هو ما يحملها: كلمة السر والجلسات والاسترجاع. لكنه لا يعرف اسم المستخدم - GoTrue يشترط بريدًا - فيختار القارئ اسمًا، ثم تُبنى من ذلك الاسم بريدًا في الكواليس. لا يراه القارئ أبداً، ولا يُرسل إليه منه شيء أبداً. أمّا بريده هو إن أعطاه، فيُخزَّن جانباً وما يزال اختيارياً: فالمنصّة لا تحتاجه، وطلب شيءٍ لا تحتاجه طريقةٌ جيدة لتفقد الناس.\n\nويحمل صفّ الملفّ الشخصي أيضاً تاريخ ميلاد، وبريداً إن أُعطي. لا شيء منهما علني، ولم يُترك الأمر لصلاحية قد تتّسع سهواً. ما يستطيع الغريب قراءته هو عرضٌ منفصل يحمل الاسم والصورة والشعار والشارات وتاريخ الانضمام، ولا يمكن سؤال ذلك العرض عن بريد لأن البريد ليس فيه. ولا يظهر الشخص فيه إلّا بعد أن ينشر شيئاً، لا قبل ذلك.",
      },
      items: [
        {
          q: "كم نبنيه بأنفسنا؟",
          why: "نظام إدارة محتوى جاهز يمنحنا المصادقة ورفع الملفات ولوحة تحكّم فوراً، لكنه يفرض مقاربة خاصة به. وبناء كل شيء يدوياً يستغرق وقتاً أطول ويحافظ على التحكّم الكامل.",
        },
        {
          q: "هل الرسائل المباشرة خاصة أم مُراجَعة؟",
          why: "الرسائل بين شخصين خاصة، ولا يقرأها أحدٌ هنا افتراضياً - فموقعٌ يقرأ المحادثات الخاصة في الخفاء يكون قد خان الشيء الذي بُني لأجله. والميزان في المقابل هو الإساءة: يستطيع أحد الطرفين إبلاغ محادثة، والإبلاغ لا يسلّم لصاندي الإشراف إلّا ذلك الخيط ولا شيء غيره. والوعدُ بأن يُقال الآن، قبل أن توجد الميزة، هو الوقت الوحيد الذي يمكن أن يُقال فيه بصدق.",
        },
        {
          q: "هل تحتاج المقالات إلى خطوة مراجعة؟",
          why: "حُسم الأمر مؤقتاً: كل من يملك حساباً يستطيع النشر، بلا طابور موافقات وبلا بريد موثّق - فالبريد اختياري هنا، واشتراطه يعني اشتراط ما لا تطلبه المنصّة أصلاً. وما يبقى مفتوحاً فعلاً هو ما سيحدث أول مرة يقرأ فيها غريبٌ الخلاصة فيجد فيها ما لا ينبغي أن يراه. الجواب زرّ إبلاغ وطريقةٌ لإخفاء مقال، ولم يُبنَ أيٌّ منهما.",
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
            "تبقى صور الملفّ الشخصي بياناتً في صفّه - تُقصّ وتُضغط بصيغة WebP داخل المتصفح، فلا مضيف لها. أمّا المرفقات فلا يمكن أن تعمل بهذا الشكل، فسيُفعَّل Supabase Storage من أجلها، بحدود لحجم الملفات وأنواعها",
        },
        {
          label: "التحديثات المباشرة",
          value:
            "لا تعمل بعد. اشتراك واحد لكل قارئ مسجَّل الدخول، حين تصل التفاعلات والتعليقات والرسائل المباشرة",
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
      title: "خارطة الطريق",
      sub: "ما تبقّى، بترتيب تقريبي. وكل ما سُلِّم بالفعل قد أُزيل من هذه القائمة.",
      items: [
        {
          n: "1",
          name: "المرفقات",
          body: "صور وملفات على مقال - صورة شهادة، أو استمارة ممسوحة، أو دليل تكوين. وهذه أول ميزة تحتاج حاوية تخزين حقيقية: فمقال يحمل عدّة ملفات لا يمكن أن يُدسّ في صفّ واحد من قاعدة البيانات كما يمكن أن تُدسّ صورةُ ملفٍّ شخصي، لذلك يُفعَّل Supabase Storage من أجلها، بسقفٍ للحجم وقائمةٍ قصيرة للأنواع المسموحة. أمّا الفيديو فمذكور على حدة أدناه، لأنه المرفق الذي يقلّ يقين المشروع في حمله.",
          points: [
            "رفع صور وملفات إلى مقال",
            "حاوية تخزين، بحدود للحجم والأنواع",
            "حذف ملفاتك، وأن تُزال مع المقال",
            "الفيديو، لاحقاً فقط إن استحقّ كلفةُ النطاق العريض",
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
          name: "الرسائل المباشرة",
          body: "محادثة خاصة بين شخصين، اثنان في البداية. الخاصة تعني خاصة: لا يقرأ أحدٌ هنا الخيط افتراضياً، والوعد مكتوبٌ قبل أن توجد الميزة، لأن ذلك هو الوقت الوحيد الذي يمكن أن يُقال فيه بصدق. والميزان في المقابل هو الإساءة - يستطيع أحد الطرفين إبلاغ محادثة، والإبلاغ لا يسلّم لصاندي الإشراف إلّا ذلك الخيط ولا شيء غيره. الحظرُ والكتمُ ومغادرةُ الخيط تأتي معه، لا بعده.",
          points: [
            "خيوط بين اثنين، خاصة افتراضياً",
            "إشعارات القراءة ومؤشّر الكتابة، أو لا شيء منهما - ما زال مفتوحاً",
            "إبلاغ محادثة، فلا تُسلَّم إلّا ذلك الخيط",
            "حظر وكتم ومغادرة",
          ],
        },
        {
          n: "4",
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
          n: "5",
          name: "الإشعارات",
          body: "أبعد من مجرّد إشعارات الإصدارات: الردود والمتابعات والمقالات الجديدة في المواضيع التي اخترتها، والرسائل، داخل التطبيق وعبر بريد أسبوعي.",
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
          risk: "الإساءة في الرسائل الخاصة، حيث لا يراها أحد",
          mitigation: "يستطيع أحد الطرفين إبلاغ الخيط، فيُسلَّم ذلك الخيط وحده إلى صاندي الإشراف. والحظرُ والكتمُ ومغادرةُ الخيط موجودة منذ النسخة الأولى. الخاصة لا تعني بلا محاسبة",
        },
        {
          risk: "المرفقات المستضافة ذاتياً تجعل النطاق العريض والتخزين الكلفة التي تتضخّم أسوأ",
          mitigation: "سقوفٌ للحجم وللأنواع مع كل رفع، والفيديو مدفوع عمداً إلى وقتٍ لاحق. التخزين هو الموضع الوحيد الذي تنحني فيه قاعدة «بلا مضيف صور»، فهو يُراقَب ولا يُفترض",
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
      note: "كل ما في هذه الصفحة ما يزال قيد الإنشاء. والصفحات التي يمكنك زيارتها الآن هي الجزء المكتمل؛ وما كُتب أعلاه هو الباقي.",
    },
  },
};