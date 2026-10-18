/**
 * Translation dictionaries.
 *
 * `en` is the source of truth for the shape. `fr` and `ar` mirror it exactly.
 * Adding a key here means adding it to all three (TypeScript enforces it).
 */

export const subjects = {
  en: {
    M: "Mathematics",
    SP: "Physics",
    SVT: "Life & Earth Sciences",
    F: "French",
    ANG: "English",
    PH: "Philosophy",
    HG: "History & Geography",
    EC: "Economics",
    GE: "Management",
    TE: "Technology",
    ALGO: "Computer Science",
    STI: "Info Sci. & Tech.",
    A: "Arabic",
    SB: "Biological Sciences",
    SPORT: "Sport",
    EP: "Physical Education",
  },
  fr: {
    M: "Mathématiques",
    SP: "Physique",
    SVT: "SVT",
    F: "Français",
    ANG: "Anglais",
    PH: "Philosophie",
    HG: "Histoire-Géographie",
    EC: "Économie",
    GE: "Gestion",
    TE: "Technologie",
    ALGO: "Informatique",
    STI: "STI",
    A: "Arabe",
    SB: "Sciences Biologiques",
    SPORT: "Sport",
    EP: "Éducation Physique",
  },
  ar: {
    M: "الرياضيات",
    SP: "الفيزياء",
    SVT: "العلوم الطبيعية",
    F: "الفرنسية",
    ANG: "الإنجليزية",
    PH: "الفلسفة",
    HG: "التاريخ والجغرافيا",
    EC: "الاقتصاد",
    GE: "التصرف",
    TE: "التكنولوجيا",
    ALGO: "الإعلامية",
    STI: "المعلوميات",
    A: "العربية",
    SB: "علوم الأحياء",
    SPORT: "الرياضة",
    EP: "التربية البدنية",
  },
} as const;

export const en = {
  nav: {
    home: "Home",
    dropouts: "Dropouts",
    divisions: "Divisions",
    graduates: "Graduates",
    about: "About",
    getStarted: "Get started",
    language: "Language",
    aboutUs: "About us",
    contactUs: "Contact us",
  },

  langPicker: {
    title: "Choose your language",
    subtitle: "You can change this at any time.",
    continue: "Continue",
  },

  install: {
    title: "Install Choufli Mosta9bel",
    body: "Add it to your home screen and it opens like an app - faster, and it works offline.",
    action: "Install",
    later: "Not now",
    iosStep1: "Tap the Share button in Safari.",
    iosStep2: "Choose “Add to Home Screen”, then tap Add.",
  },

  welcome: {
    title: "Welcome.",
    body: "Real options for Tunisian youth, with or without a Bac - vocational training, high school divisions, and what to do after graduating.",
    cta: "Find your path",
    ctaHref: "/dropouts",
    later: "Maybe later",
  },

  home: {
    eyebrow: "Guidance for Tunisian youth",
    sub: "Choufli Mosta9bel helps school dropouts, undecided students, and graduates find real, practical paths to a stable future.",
    cta: "Find your path",
    pathsTitle: "Three audiences. One mission.",
    cards: {
      dropouts: {
        kicker: "ATFP and second chances",
        title: "School Dropout",
        body: "Discover ATFP programs and second chances. Dropping out is not the end, it is the start of a new path.",
      },
      divisions: {
        kicker: "Before 2nd year",
        title: "HS Student",
        body: "Understand every division before choosing, with advice on pros, cons, and major subjects.",
      },
      graduates: {
        kicker: "Tunisia and abroad",
        title: "Graduate",
        body: "Opportunities in Tunisia and abroad, based on what you love and your grades.",
      },
    },
    explore: "Explore",
    manifestoTitle: "“Where you find offers that ensure you a good future.”",
    manifestoBody:
      "Choufli Mosta9bel is where you will find solutions, helping you build a future to live individually and work with or without a Bac. We provide teenagers with guidance, giving them the opportunity to express themselves and build the future they are most comfortable with.",
    manifestoCta: "Start with the dropout guide",
  },

  dropouts: {
    sub: "Real options if you left school early - what they are, who they are for, and how to take the next step.",
    atfpTitle: "ATFP certifications",
    atfpSub: "Vocational training that turns into a qualification you can actually use.",
    carouselHint: "Swipe to explore",
  },

  divisions: {
    sub: "Every Tunisian high school division, side by side, so you can choose with your eyes open.",
    tabLabel: "Division",
  },

  graduates: {
    sub: "Choosing the most convenient path after graduating sounds challenging and a little confusing. One thing that confuses a lot of Tunisian graduates is how universities and colleges choose their students. We break it all down for you.",
    toolsTitle: "We help you take the first steps.",
    toolsSub:
      "Choosing the most convenient path after graduating sounds challenging and a little confusing. One thing that confuses a lot of Tunisian graduates is how universities and colleges choose their students. We break it all down for you.",
    calc: {
      eyebrow: "Reference calculator",
      title: "University Admission Score",
      subtitle:
        "Enter your average and your marks to see your orientation score (FG) using the formula published by the Ministry.",
      yourSection: "Your Bac section",
      averageLabel: "General average (MG)",
      averageHelp: "The weighted average printed on your transcript, out of 20.",
      marksLabel: "Your marks",
      resultLabel: "Orientation score",
      bonusLabel: "With 7% geographic bonus",
      bonusHelp: "Applies only to eligible programmes offered in your governorate.",
      incomplete: "Fill in every field to see your score.",
      clear: "Clear all",
      rangeError: "Marks must be between 0 and 20.",
      controleHint:
        "An average between 7 and 10 means you go to the session de controle. Orientation scores then count as (2 x main + controle) / 3.",
      formulaLabel: "Formula",
      disclaimer:
        "This is a reference calculator based on the Ministry's published formula - not an official tool. The Ministry publishes the formula as a PDF and offers no calculator of its own. Confirm your score on the official orientation site.",
      guideLink: "Read the official orientation guide",
    },
  },

  about: {
    sub: "A guidance project for Tunisian youth - helping dropouts, undecided students, and graduates find real, practical paths to a stable future.",
    whoTitle: "Who we are.",
    madeIn: "Made in Tunisia.",
  },

  contact: {
    title: "Ask us anything.",
    note: "Send us anything you want to know, and we will get back to you. Honest reviews are welcome too.",
    name: "Name",
    email: "Email",
    message: "Message",
    namePlaceholder: "Your name",
    emailPlaceholder: "you@email.com",
    messagePlaceholder: "What do you want to know?",
    send: "Send message",
    sentTitle: "Message on its way.",
    sentBody: "Thanks for writing. We will get back to you soon.",
    sendAnother: "Send another",
  },

  footer: {
    blurb: "Real, practical paths to a stable future for Tunisian youth, with or without a Bac.",
    explore: "Explore",
    contact: "Contact",
    legal: "Legal",
    changelog: "What's new",
    rights: "© 2026 Choufli Mosta9bel. Made in Tunisia.",
  },

  legal: {
    privacyTitle: "Privacy Policy",
    termsTitle: "Terms of Service",
    lastUpdated: "Last updated",
  },
};

/**
 * Widen the literal types produced above into plain strings, so `fr` and `ar`
 * can supply translated values without fighting the type checker.
 */
type Widen<T> = T extends string
  ? string
  : { -readonly [K in keyof T]: Widen<T[K]> };

export type Dictionary = Widen<typeof en>;

export const fr: Dictionary = {
  nav: {
    home: "Accueil",
    dropouts: "Décrochés",
    divisions: "Filières",
    graduates: "Bacheliers",
    about: "À propos",
    getStarted: "Commencer",
    language: "Langue",
    aboutUs: "À propos",
    contactUs: "Contact",
  },

  langPicker: {
    title: "Choisissez votre langue",
    subtitle: "Vous pourrez changer à tout moment.",
    continue: "Continuer",
  },

  install: {
    title: "Installer Choufli Mosta9bel",
    body: "Ajoutez-le à votre écran d'accueil : il s'ouvre comme une application - plus rapide, et il fonctionne hors ligne.",
    action: "Installer",
    later: "Pas maintenant",
    iosStep1: "Appuyez sur le bouton Partager dans Safari.",
    iosStep2: "Choisissez « Sur l'écran d'accueil », puis appuyez sur Ajouter.",
  },

  welcome: {
    title: "Bienvenue.",
    body: "Des options concrètes pour la jeunesse tunisienne, avec ou sans Bac - formation professionnelle, filières du lycée, et quoi faire après le baccalauréat.",
    cta: "Trouvez votre voie",
    ctaHref: "/dropouts",
    later: "Plus tard",
  },

  home: {
    eyebrow: "Orientation pour la jeunesse tunisienne",
    sub: "Choufli Mosta9bel aide les décrochés scolaires, les élèves indécis et les bacheliers à trouver des chemins concrets vers un avenir stable.",
    cta: "Trouvez votre voie",
    pathsTitle: "Trois publics. Une mission.",
    cards: {
      dropouts: {
        kicker: "ATFP et seconde chance",
        title: "Décroché scolaire",
        body: "Découvrez les formations ATFP et les solutions de seconde chance. Abandonner l'école n'est pas la fin, c'est le début d'un nouveau chemin.",
      },
      divisions: {
        kicker: "Avant la 2ème année",
        title: "Élève au lycée",
        body: "Comprenez chaque filière avant de choisir, avec des conseils sur les avantages, les inconvénients et les matières principales.",
      },
      graduates: {
        kicker: "Tunisie et à l'étranger",
        title: "Bachelier",
        body: "Des opportunités en Tunisie et à l'étranger, selon ce que vous aimez et vos résultats.",
      },
    },
    explore: "Découvrir",
    manifestoTitle: "« Là où vous trouvez des offres qui vous assurent un avenir. »",
    manifestoBody:
      "Choufli Mosta9bel est l'endroit où vous trouverez des solutions, pour vous aider à construire un avenir où vivre et travailler, avec ou sans Bac. Nous orientons les adolescents, en leur laissant l'occasion de s'exprimer et de construire l'avenir qui leur convient le mieux.",
    manifestoCta: "Commencez par le guide des décrochés",
  },

  dropouts: {
    sub: "Des options concrètes si vous avez quitté l'école tôt - ce qu'elles sont, à qui elles s'adressent, et comment faire le prochain pas.",
    atfpTitle: "Certifications ATFP",
    atfpSub: "Une formation professionnelle qui mène à un diplôme vraiment utilisable.",
    carouselHint: "Faites glisser pour explorer",
  },

  divisions: {
    sub: "Toutes les filières du lycée tunisien, côte à côte, pour choisir en toute connaissance de cause.",
    tabLabel: "Filière",
  },

  graduates: {
    sub: "Choisir la voie la plus adaptée après le baccalauréat semble difficile et un peu confus. Ce qui confuse beaucoup de bacheliers tunisiens, c'est la façon dont les universités choisissent leurs étudiants. Nous vous expliquons tout.",
    toolsTitle: "Nous vous aidons à faire les premiers pas.",
    toolsSub:
      "Choisir la voie la plus adaptée après le baccalauréat semble difficile et un peu confus. Ce qui confuse beaucoup de bacheliers tunisiens, c'est la façon dont les universités choisissent leurs étudiants. Nous vous expliquons tout.",
    calc: {
      eyebrow: "Calculatrice de référence",
      title: "Score d'orientation",
      subtitle:
        "Saisissez votre moyenne et vos notes pour voir votre score d'orientation (FG), selon la formule publiée par le Ministère.",
      yourSection: "Votre section du Bac",
      averageLabel: "Moyenne générale (MG)",
      averageHelp: "La moyenne pondérée inscrite sur votre relevé, sur 20.",
      marksLabel: "Vos notes",
      resultLabel: "Score d'orientation",
      bonusLabel: "Avec le bonus géographique de 7 %",
      bonusHelp: "S'applique uniquement aux filières éligibles de votre gouvernorat.",
      incomplete: "Remplissez tous les champs pour voir votre score.",
      clear: "Tout effacer",
      rangeError: "Les notes doivent être entre 0 et 20.",
      controleHint:
        "Une moyenne entre 7 et 10 signifie que vous passez la session de contrôle. Les scores comptent alors (2 x principale + contrôle) / 3.",
      formulaLabel: "Formule",
      disclaimer:
        "Ceci est une calculatrice de référence fondée sur la formule publiée par le Ministère - et non un outil officiel. Le Ministère publie la formule en PDF et ne propose pas de calculatrice. Vérifiez votre score sur le site officiel de l'orientation.",
      guideLink: "Lire le guide officiel de l'orientation",
    },
  },

  about: {
    sub: "Un projet d'orientation pour la jeunesse tunisienne - aider les décrochés, les élèves indécis et les bacheliers à trouver des chemins concrets vers un avenir stable.",
    whoTitle: "Qui sommes-nous.",
    madeIn: "Fait en Tunisie.",
  },

  contact: {
    title: "Posez-nous vos questions.",
    note: "Envoyez-nous ce que vous voulez savoir, et nous vous répondrons. Les avis sincères sont les bienvenus.",
    name: "Nom",
    email: "E-mail",
    message: "Message",
    namePlaceholder: "Votre nom",
    emailPlaceholder: "vous@email.com",
    messagePlaceholder: "Que voulez-vous savoir ?",
    send: "Envoyer",
    sentTitle: "Message envoyé.",
    sentBody: "Merci pour votre message. Nous vous répondrons rapidement.",
    sendAnother: "Envoyer un autre",
  },

  footer: {
    blurb: "Des chemins concrets vers un avenir stable pour la jeunesse tunisienne, avec ou sans Bac.",
    explore: "Explorer",
    contact: "Contact",
    legal: "Légal",
    changelog: "Nouveautés",
    rights: "© 2026 Choufli Mosta9bel. Fait en Tunisie.",
  },

  legal: {
    privacyTitle: "Politique de confidentialité",
    termsTitle: "Conditions d'utilisation",
    lastUpdated: "Dernière mise à jour",
  },
};

export const ar: Dictionary = {
  nav: {
    home: "الرئيسية",
    dropouts: "المتسربون",
    divisions: "الأقسام",
    graduates: "البكالوريا",
    about: "من نحن",
    getStarted: "ابدأ",
    language: "اللغة",
    aboutUs: "من نحن",
    contactUs: "اتصل بنا",
  },

  langPicker: {
    title: "اختر لغتك",
    subtitle: "يمكنك تغييرها في أي وقت.",
    continue: "متابعة",
  },

  install: {
    title: "ثبّت شوفلي مستقبلك",
    body: "أضفه إلى شاشتك الرئيسية ليفتح مثل التطبيق - أسرع، ويعمل بدون إنترنت.",
    action: "تثبيت",
    later: "ليس الآن",
    iosStep1: "اضغط زر المشاركة في سفاري.",
    iosStep2: "اختر «إضافة إلى الشاشة الرئيسية»، ثم اضغط إضافة.",
  },

  welcome: {
    title: "أهلاً بك.",
    body: "خيارات حقيقية للشباب التونسي، مع البكالوريا أو بدونها - التكوين المهني، وأقسام الثانوية، وماذا تفعل بعد التخرج.",
    cta: "اعثر على طريقك",
    ctaHref: "/dropouts",
    later: "لاحقاً",
  },

  home: {
    eyebrow: "إرشاد للشباب التونسي",
    sub: "يساعد «شوفلي مستقبلك» المتسربين من الدراسة والتلاميذ غير الحسمين والخريجين على إيجاد طرق حقيقية نحو مستقبل مستقر.",
    cta: "اعثر على طريقك",
    pathsTitle: "ثلاث فئات. رسالة واحدة.",
    cards: {
      dropouts: {
        kicker: "التكوين المهني وفرص ثانية",
        title: "متسرب من الدراسة",
        body: "اكتشف برامج التكوين المهني وفرص العودة إلى الدراسة. الانقطاع ليس النهاية، بل بداية طريق جديد.",
      },
      divisions: {
        kicker: "قبل السنة الثانية",
        title: "تلميذ في الثانوي",
        body: "افهم كل قسم قبل أن تختار، مع نصائح حول الإيجابيات والسلبيات والمواد الأساسية.",
      },
      graduates: {
        kicker: "تونس والخارج",
        title: "خريج البكالوريا",
        body: "فرص في تونس وخارجها، حسب ما تحبه ونتائجك.",
      },
    },
    explore: "اكتشف",
    manifestoTitle: "« حيث تجد عروضاً تضمن لك مستقبلاً جيداً »",
    manifestoBody:
      "شوفلي مستقبلك هو المكان الذي تجد فيه الحلول، يساعدك على بناء مستقبل تعيش فيه وتعمل، مع الشهادة أو بدونها. نوجه المراهقين، ونتيح لهم التعبير عن أنفسهم وبناء المستقبل الذي يناسبهم أكثر.",
    manifestoCta: "ابدأ بدليل المتسربين",
  },

  dropouts: {
    sub: "خيارات حقيقية إذا تركت الدراسة مبكراً - ما هي، ولمن تناسب، وكيف تأخذ الخطوة التالية.",
    atfpTitle: "شهادات التكوين المهني",
    atfpSub: "تكوين مهني يؤدي إلى شهادة يمكنك استعمالها فعلاً.",
    carouselHint: "اسحب للاستكشاف",
  },

  divisions: {
    sub: "كل أقسام الثانوية في تونس، جنباً إلى جنب، لتختار بعين مفتوحة.",
    tabLabel: "القسم",
  },

  graduates: {
    sub: "اختيار أنسب طريق بعد البكالوريا يبدو صعباً ومربكاً. وما يربك كثيراً من البكالوريين التونسيين هو كيف تختار الجامعات طلبتها. نشرح لك كل شيء.",
    toolsTitle: "نساعدك على اتخاذ الخطوة الأولى.",
    toolsSub:
      "اختيار أنسب طريق بعد البكالوريا يبدو صعباً ومربكاً. وما يربك كثيراً من البكالوريين التونسيين هو كيف تختار الجامعات طلبتها. نشرح لك كل شيء.",
    calc: {
      eyebrow: "حاسبة مرجعية",
      title: "سكور التوجيه",
      subtitle: "أدخل معدلك ونقطك لمعرفة سكور التوجيه (FG) حسب الصيغة المنشورة من الوزارة.",
      yourSection: "شعبتك في البكالوريا",
      averageLabel: "المعدل العام (MG)",
      averageHelp: "المعدل المرجح المكتوب في كشف النقاط، من 20.",
      marksLabel: "نقطك",
      resultLabel: "سكور التوجيه",
      bonusLabel: "مع منحة 7% الجهوية",
      bonusHelp: "تُطبَّق فقط على الاختصاصات المؤهلة في ولايتك.",
      incomplete: "املأ كل الخانات لترى سكورك.",
      clear: "مسح الكل",
      rangeError: "يجب أن تكون النقط بين 0 و20.",
      controleHint:
        "معدل بين 7 و10 يعني أنك في دورة المراقبة. عندئذ يُحتسب السكور (2 × الأساسية + المراقبة) / 3.",
      formulaLabel: "الصيغة",
      disclaimer:
        "هذه حاسبة مرجعية تعتمد على صيغة الوزارة المنشورة - وليست أداة رسمية. الوزارة تنشر الصيغة في ملف PDF ولا توفر حاسبة. تأكّد سكورك على موكع التوجيه موقع",
      guideLink: "اقرأ دليل التوجيه الرسمي",
    },
  },

  about: {
    sub: "مشروع إرشاد للشباب التونسي - يساعد المتسربين من الدراسة والتلاميذ غير الحسمين والخريجين على إيجاد طرق حقيقية نحو مستقبل مستقر.",
    whoTitle: "من نحن.",
    madeIn: "صنع في تونس.",
  },

  contact: {
    title: "اسألنا أي شيء.",
    note: "أرسل لنا ما تريد معرفته وسنجيبك. الآراء الصادقة مرحب بها.",
    name: "الاسم",
    email: "البريد الإلكتروني",
    message: "الرسالة",
    namePlaceholder: "اسمك",
    emailPlaceholder: "you@email.com",
    messagePlaceholder: "ما الذي تريد معرفته؟",
    send: "إرسال",
    sentTitle: "تم إرسال رسالتك.",
    sentBody: "شكراً لكتابتك. سنجيبك قريباً.",
    sendAnother: "إرسال رسالة أخرى",
  },

  footer: {
    blurb: "طرق حقيقية نحو مستقبل مستقر للشباب التونسي، مع البكالوريا أو بدونها.",
    explore: "استكشاف",
    contact: "اتصل بنا",
    legal: "قانوني",
    changelog: "ما الجديد",
    rights: "© 2026 شوفلي مستقبلك. صنع في تونس.",
  },

  legal: {
    privacyTitle: "سياسة الخصوصية",
    termsTitle: "شروط الاستخدام",
    lastUpdated: "آخر تحديث",
  },
};

export const dictionaries = { en, fr, ar, subjects };
export default dictionaries;
