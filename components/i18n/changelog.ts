import type { Slice } from "./types";

/**
 * Changelog page copy, in all three languages.
 *
 * The page is a timeline, so `entries` is a plain array kept newest first:
 * a new release means adding one object at the top of that array in each
 * language. Nothing else in the file needs to change.
 */

/** One shipped release: which version, when, and what it changed. */
export interface ChangelogEntry {
  /** Version string. Same in every language, e.g. "v1.1.0". */
  version: string;
  /** Release date, written the way each language writes dates. */
  date: string;
  /** One line describing the release as a whole. */
  summary: string;
  /** Individual changes, most important first. */
  changes: string[];
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
        version: "v1.1.1",
        notice: "v1.1.1-r2",
        date: "18 October 2026",
        summary:
          "Fixes: the install buttons did nothing on phones, iOS had no honest answer, and a few buttons lost their text in dark mode.",
        changes: [
          "The download buttons in the mobile menu and the footer now work. They were silently broken for anyone who had dismissed the install sheet in the previous week.",
          "The install sheet no longer offers a lone “Not now”. When a browser cannot prompt, it explains what to do instead.",
          "On iOS the sheet now says plainly that a website cannot install itself, and gives the three taps that work: Share, Add to Home Screen, Add.",
          "Everywhere else, it explains the reload-once step browsers require before they will offer installation.",
          "The service worker now registers early enough that a first visit can become installable.",
          "Buttons whose background inverts in dark mode now invert their text too. The install button used to turn near-white and keep white text, which made it disappear.",
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
        changes: [
          "The site was rebuilt from the ground up. The design, layout and writing are all new - v1.0.0 looked nothing like this.",
          "A full redesign across every page, built for clarity on a phone first.",
          "Four new pages: About, Changelog, and proper Privacy and Terms pages.",
          "The site is now in English, French and Arabic, switchable at any time, with Arabic laid out right-to-left.",
          "A university orientation score calculator, built on the Ministry of Higher Education formula, replacing the third-party tool we used to link to.",
          "Installable on iOS, Android and desktop: add it to your home screen and it opens full screen, like a native app.",
          "Offline fallback: pages you have already opened stay readable when the connection drops.",
          "An install prompt inside the browser, so adding the site to your device takes a single tap.",
          "Install buttons in the mobile menu and the footer.",
          "On iOS, where a site cannot install itself, the button explains the three taps that add it to the home screen instead.",
          "Light and dark themes, following your system setting automatically.",
          "New typography throughout, with Arabic typeset properly across the whole site.",
          "Search rebuilt from scratch: a sitemap and robots file, per-page canonical URLs, and link previews for every page when it is shared.",
        ],
      },
      {
        version: "v1.0.0",
        date: "2 March 2026",
        summary:
          "The original site: four hand-written HTML pages, in English only, with no installable app and no dark mode.",
        changes: [
          "Four static pages - home, school dropouts, high school divisions and graduates.",
          "The ATFP reference guide: certifications, the fields they open, and where to apply.",
          "Division comparisons - subjects, advantages and drawbacks for every branch of the Tunisian high school.",
          "English only, with no language switching.",
          "No light or dark theme, no installable app, no offline support.",
          "Questions and reviews went to a Gmail address, with no privacy policy or terms page.",
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
        version: "v1.1.1",
        notice: "v1.1.1-r2",
        date: "18 octobre 2026",
        summary:
          "Correctifs : les boutons d'installation ne faisaient rien sur mobile, iOS n'avait pas de vraie réponse, et quelques boutons perdaient leur texte en mode sombre.",
        changes: [
          "Les boutons de téléchargement du menu mobile et du pied de page fonctionnent enfin. Ils étaient cassés sans rien dire à qui avait fermé la fenêtre d'installation la semaine précédente.",
          "La fenêtre d'installation n'affiche plus un simple « Pas maintenant ». Lorsqu'un navigateur ne peut pas proposer l'installation, elle explique quoi faire à la place.",
          "Sur iOS, elle dit clairement qu'un site ne peut pas s'installer lui-même, et donne les trois gestes qui marchent : Partager, Sur l'écran d'accueil, Ajouter.",
          "Partout ailleurs, elle explique l'étape de rechargement que les navigateurs exigent avant de proposer l'installation.",
          "Le service worker s'enregistre suffisamment tôt pour qu'une première visite devienne installable.",
          "Les boutons dont le fond s'inverse en mode sombre inversent désormais leur texte aussi. Le bouton d'installation devenait presque blanc tout en gardant un texte blanc, ce qui le rendait invisible.",
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
        changes: [
          "Le site a été entièrement reconstruit. Le design, la mise en page et les textes sont neufs - la v1.0.0 n'avait rien à voir.",
          "Une refonte complète de toutes les pages, pensée d'abord pour la clarté sur mobile.",
          "Quatre nouvelles pages : À propos, Nouveautés, et de vraies pages Confidentialité et Conditions.",
          "Le site est désormais en anglais, français et arabe, changeable à tout moment, avec l'arabe correctement mis en page de droite à gauche.",
          "Une calculatrice de score d'orientation universitaire, fondée sur la formule du Ministère de l'Enseignement Supérieur, qui remplace l'outil tiers que nous utilisions.",
          "Installable sur iOS, Android et sur ordinateur : ajoutez-le à votre écran d'accueil et il s'ouvre en plein écran, comme une application native.",
          "Mode hors ligne : les pages déjà consultées restent lisibles même lorsque la connexion est coupée.",
          "Une invite d'installation s'affiche dans le navigateur : ajouter le site à votre appareil ne demande qu'un seul geste.",
          "Des boutons d'installation dans le menu mobile et en bas de page.",
          "Sur iOS, où un site ne peut pas s'installer tout seul, le bouton explique les trois gestes pour l'ajouter à l'écran d'accueil.",
          "Thèmes clair et sombre, suivant automatiquement le réglage de votre système.",
          "Une nouvelle typographie partout, avec un arabe correctement composé sur tout le site.",
          "Référencement reconstruit de zéro : un fichier sitemap et robots, des URL canoniques pour chaque page, et un aperçu enrichi à chaque partage.",
        ],
      },
      {
        version: "v1.0.0",
        date: "2 mars 2026",
        summary:
          "Le site d'origine : quatre pages HTML écrites à la main, en anglais seulement, sans application installable ni mode sombre.",
        changes: [
          "Quatre pages statiques - accueil, décrochés scolaires, filières du lycée et bacheliers.",
          "Le guide de référence de l'ATFP : les certifications, les métiers qu'elles ouvrent, et où se porter candidat.",
          "Comparatifs des filières - matières, avantages et inconvénients pour chaque section du lycée tunisien.",
          "En anglais seulement, sans changement de langue.",
          "Ni thème clair ou sombre, ni application installable, ni mode hors ligne.",
          "Les questions et les avis allaient à une adresse Gmail, sans page de confidentialité ni de conditions.",
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
        version: "v1.1.1",
        notice: "v1.1.1-r2",
        date: "18 أكتوبر 2026",
        summary:
          "إصلاحات: لم تعمل أزرار التثبيت على الهواتف، ولم يكن هناك جواب صادق على iOS، وفقدت بعض الأزرار نصّها في الوضع الليلي.",
        changes: [
          "صار زرّا التحميل في قائمة الهاتف وفي أسفل الصفحة يعملان. كانا معطّلين بصمت لكل من أغلق نافذة التثبيت في الأسبوع الماضي.",
          "لم تعد نافذة التثبيت تعرض زرّ «ليس الآن» وحده. وعندما لا يستطيع المتصفح اقتراح التثبيت، تشرح النافذة ما ينبغي فعله بدلاً من ذلك.",
          "على iOS تقول النافذة بوضوح إن الموقع لا يستطيع تثبيت نفسه، وتوضّح الخطوات الثلاث التي تنفع: المشاركة، ثمّ الإضافة إلى الشاشة الرئيسية، ثمّ إضافة.",
          "في كل مكان آخر، تشرح خطوة إعادة التحميل التي تشترطها المتصفحات قبل أن تقترح التثبيت.",
          "يسجّل عامل الخدمة أبكر من ذلك، حتى تصبح الزيارة الأولى قابلة للتثبيت.",
          "الأزرار التي ينقلب لونها في الوضع الليلي صارت تقلب نصّها معه أيضاً. كان زرّ التثبيت يصير أبيض تقريباً ويحتفظ بنصّ أبيض، فيختفي تماماً.",
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
        changes: [
          "أُعيد بناء الموقع من الأساس. التصميم والتنسيق والنصوص كلها جديدة - فالإصدار 1.0.0 لم يكن شيئاً يشبهه.",
          "تصميم جديد لكل الصفحات، صُمم أولاً لوضوح القراءة على الهاتف.",
          "أربع صفحات جديدة: من نحن، وما الجديد، وصفحتان فعليتان للخصوصية والشروط.",
          "الموقع متاح الآن بالإنجليزية والفرنسية والعربية، مع إمكانية تغيير اللغة في أي وقت والعربية مرتبة من اليمين إلى اليسار.",
          "حاسبة سكور التوجيه الجامعي، مبنية على صيغة وزارة التعليم العالي، لتحل محل الأداة الخارجية التي كنا نربط بها.",
          "قابل للتثبيت على iOS وAndroid وعلى الحاسوب: أضِفه إلى شاشتك الرئيسية فيفتح بملء الشاشة، مثل التطبيق الأصلي.",
          "العمل دون اتصال: تبقى الصفحات التي فتحتها سابقاً قابلة للقراءة عند انقطاع الاتصال.",
          "رسالة تثبيت تظهر داخل المتصفح، فتضيف الموقع إلى جهازك بلمسة واحدة.",
          "أزراء تثبيت في قائمة التنقّل موا في التفاويز.",
          "على iOS، حيث لا يسمح للموقع أن يثبت نفسه، يشرر الزرم إلى الثلاث الضغطات التي تضيفه إلى الشاشة الرئيسية.",
          "وضع فاتح ووضع داكن، يتبعان تلقائياً إعداد نظامك.",
          "خط جديد في كل الموقع، مع ضبط العربية بشكل صحيح في كل الصفحات.",
          "إعادة بناء البحث من الصفر: ملف sitemap وrobots، ورابط أساسي لكل صفحة، ومعاينة غنية عند مشاركة أي رابط.",
        ],
      },
      {
        version: "v1.0.0",
        date: "2 مارس 2026",
        summary:
          "الموقع الأصلي: أربع صفحات HTML مكتوبة يدوياً، بالإنجليزية فقط، وبدون تطبيق قابل للتثبيت ولا وضع داكن.",
        changes: [
          "أربع صفحات ثابتة - الرئيسية، المتسربون من الدراسة، أقسام الثانوية، والخريجون.",
          "الدليل المرجعي للتكوين المهني ATFP: الشهادات، والحقول التي تفتحها، وأماكن الترشح.",
          "مقارنات بين الأقسام - المواد والإيجابيات والسلبيات لكل قسم في الثانوية التونسية.",
          "بالإنجليزية فقط، وبدون إمكانية تغيير اللغة.",
          "لا وضع فاتح ولا داكن، ولا تطبيق قابل للتثبيت، ولا عمل دون اتصال.",
          "كانت الأسئلة والآراء تُرسل إلى عنوان Gmail، دون صفحة خصوصية ولا صفحة شروط.",
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