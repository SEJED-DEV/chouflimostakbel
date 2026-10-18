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
    items: { q: string; why: string }[];
  };
  stack: {
    title: string;
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
      sub: "Accounts, blogs, custom profiles, and a feed that learns what you actually came here for. Still being built, in the open.",
      cta: "See the roadmap",
      ctaSecondary: "Follow along on GitHub",
    },

    intro: {
      title: "Why this exists.",
      body: "Today the site is a static set of guides with no accounts and no database. The next phase turns it into something you can log into, write on, and be shown things that matter to you. None of it is built yet - this page is the plan, published as we go.",
    },

    questions: {
      title: "Decisions still open",
      sub: "Four calls we have not made yet.",
      items: [
        {
          q: "How much of this do we build ourselves?",
          why: "A ready-made CMS gives us auth, uploads and an admin panel immediately, but it is opinionated. Hand-rolling everything takes longer and keeps full control.",
        },
        {
          q: "Is there a database available on our own infrastructure?",
          why: "Everything above depends on Postgres. If it is not there yet, that is the only thing that matters right now.",
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
      title: "What it would run on",
      items: [
        { label: "Database", value: "Postgres with pgvector for semantic search" },
        {
          label: "Data access",
          value: "Drizzle - thin SQL, and we need real queries for ranking",
        },
        { label: "Accounts", value: "Email and Google or GitHub sign-in" },
        { label: "Media", value: "Object storage on our own CDN, resized on upload" },
        {
          label: "Email",
          value: "A transactional provider, for verification and notifications",
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
          body: "The database, accounts and storage. This is the whole foundation - nothing else can start until it exists.",
          points: [
            "Postgres and schema",
            "Sign-in and sessions",
            "Media uploads",
            "Transactional email",
          ],
        },
        {
          n: "1",
          name: "Profiles and posting",
          body: "Custom profiles, and an editor where anyone can write a post, with drafts and edit history.",
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
          risk: "Costs creep upward",
          mitigation: "Embeddings only; optional AI tagging stays off by default",
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
      sub: "Des comptes, des articles, des profils personnalisés, et un fil qui comprend ce que vous êtes vraiment venu chercher ici. Encore en construction, et tout est public.",
      cta: "Voir la feuille de route",
      ctaSecondary: "Suivre sur GitHub",
    },

    intro: {
      title: "Pourquoi cette page existe.",
      body: "Aujourd'hui, le site est un ensemble statique de guides, sans comptes et sans base de données. La prochaine étape en fait un lieu où l'on se connecte, où l'on écrit, et où l'on vous montre ce qui compte pour vous. Rien de tout cela n'existe encore - cette page est le plan, publié au fil de l'eau.",
    },

    questions: {
      title: "Décisions encore ouvertes",
      sub: "Quatre choix que nous n'avons pas encore faits.",
      items: [
        {
          q: "Quelle part construisons-nous nous-mêmes ?",
          why: "Un CMS prêt à l'emploi nous donne immédiatement l'authentification, les envois de fichiers et un panneau d'administration, mais il est directeur. Tout construire à la main prend plus de temps et garde le contrôle total.",
        },
        {
          q: "Avons-nous une base de données sur notre propre infrastructure ?",
          why: "Tout ce qui précède dépend de Postgres. Si elle n'existe pas encore, c'est la seule chose qui compte pour l'instant.",
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
      title: "Sur quoi cela tournerait",
      items: [
        {
          label: "Base de données",
          value: "Postgres avec pgvector pour la recherche sémantique",
        },
        {
          label: "Accès aux données",
          value: "Drizzle - du SQL direct, et nous avons besoin de vraies requêtes pour le classement",
        },
        { label: "Comptes", value: "E-mail et connexion Google ou GitHub" },
        {
          label: "Médias",
          value: "Stockage objet sur notre propre CDN, redimensionné à l'envoi",
        },
        {
          label: "E-mails",
          value: "Un fournisseur transactionnel, pour la vérification et les notifications",
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
          body: "La base de données, les comptes et le stockage. C'est toute la fondation - rien d'autre ne peut commencer avant qu'elle existe.",
          points: [
            "Postgres et le schéma",
            "Connexion et sessions",
            "Envoi de médias",
            "E-mails transactionnels",
          ],
        },
        {
          n: "1",
          name: "Profils et publication",
          body: "Des profils personnalisés, et un éditeur où chacun peut écrire un article, avec brouillons et historique des modifications.",
          points: [
            "Profils personnalisés avec des thèmes",
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
          risk: "Les coûts grisent vers le haut",
          mitigation: "Des vecteurs uniquement ; l'étiquetage par IA facultatif reste désactivé par défaut",
        },
      ],
    },

    contribute: {
      title: "Tout est construit au grand jour",
      body: "Chaque décision, correction de bug et version est écrite et archivée. Si vous voulez suivre, lisez le code, signalez ce qui vous paraît bancal, ou prenez une partie en charge - le dépôt est la version honnête de cette page.",
      repoCta: "Voir le dépôt",
      issuesCta: "Ouvrir un ticket",
      note: "Rien ici n'est encore en ligne. Les pages de ce site sont la partie stable ; le plan, c'est le reste.",
    },
  },

  ar: {
    hero: {
      eyebrow: "قريباً",
      title: "منصة",
      titleAccent: "أكبر.",
      sub: "حسابات، ومقالات، وملفّات شخصية مخصّصة، وخلاصة تتعلّم ما جئت إلى هنا من أجله فعلاً. ما زالت قيد البناء، وكل شيء مكشوف.",
      cta: "اطّلع على خارطة الطريق",
      ctaSecondary: "تابعنا على GitHub",
    },

    intro: {
      title: "لماذا هذه الصفحة.",
      body: "اليوم، الموقع مجموعة من الأدلة الثابتة، بلا حسابات وبلا قاعدة بيانات. المرحلة القادمة تحوّله إلى مكان تسجّل الدخول إليه، وتكتب فيه، ويُعرض لك فيه ما يهمّك فعلاً. لا شيء من ذلك مبنيّ بعد - هذه الصفحة هي الخطة، تُنشر بالتوازي مع التنفيذ.",
    },

    questions: {
      title: "قرارات لم تُتخذ بعد",
      sub: "أربعة اختيارات لم نُقرّرها بعد.",
      items: [
        {
          q: "كم نبنيه بأنفسنا؟",
          why: "نظام إدارة محتوى جاهز يمنحنا المصادقة ورفع الملفات ولوحة تحكّم فوراً، لكنه يفرض مقاربة خاصة به. وبناء كل شيء يدوياً يستغرق وقتاً أطول ويحافظ على التحكّم الكامل.",
        },
        {
          q: "هل تتوفّر لنا قاعدة بيانات على بنيتنا التحتية الخاصة؟",
          why: "كل ما سبق يعتمد على Postgres. وإن لم تكن متوفّرة بعد، فهذه هي المسألة الوحيدة التي تهمّ الآن.",
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
      title: "ما الذي سيُبنى عليه",
      items: [
        {
          label: "قاعدة البيانات",
          value: "Postgres مع pgvector للبحث الدلالي",
        },
        {
          label: "الوصول إلى البيانات",
          value: "Drizzle - SQL مباشر، ونحتاج إلى استعلامات حقيقية للترتيب",
        },
        {
          label: "الحسابات",
          value: "بريد إلكتروني وتسجيل دخول عبر Google أو GitHub",
        },
        {
          label: "الوسائط",
          value: "تخزين كائنات على شبكة توزيع خاصة بنا، مع تغيير الحجم عند الرفع",
        },
        {
          label: "البريد",
          value: "مزوّد خدمة بريد للمعاملات، من أجل التحقّق والإشعارات",
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
          body: "قاعدة البيانات والحسابات والتخزين. هذه هي الأساس كلّه - لا شيء آخر يمكن أن يبدأ قبل أن يوجد.",
          points: [
            "Postgres والمخطّط",
            "تسجيل الدخول والجلسات",
            "رفع الوسائط",
            "بريد المعاملات",
          ],
        },
        {
          n: "1",
          name: "الملفّات الشخصية والنشر",
          body: "ملفّات شخصية مخصّصة، ومحرّر يكتب فيه أيّ شخص مقالاً، مع مسودّات وسجلّ للتعديلات.",
          points: [
            "ملفّات شخصية مخصّصة مع مواضيع",
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
          risk: "تضخّم التكاليف تدريجياً",
          mitigation: "التضمينات فقط؛ وتحليل الموضوعات بالذكاء الاصطناعي يبقى معطّلاً افتراضياً",
        },
      ],
    },

    contribute: {
      title: "هذا المشروع يُبنى في العلن",
      body: "كل قرار وإصلاح علة وإصدار مكتوب ومُودَع. إن أردت المتابعة، فاقرأ الشيفرة، أو بلّغ عن أمر محيّر يصادفك، أو خُذ على عاتقك جزءاً منه - المستودع هو النسخة الصادقة من هذه الصفحة.",
      repoCta: "اطّلع على المستودع",
      issuesCta: "افتح مسألة",
      note: "لا شيء هنا يعمل بعد. صفحات هذا الموقع هي الجزء المستقرّ؛ والخطة هي الباقي.",
    },
  },
};