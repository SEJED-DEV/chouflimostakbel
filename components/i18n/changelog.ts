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
  /** Copy for the version-gated "what's new" sheet. */
  popup: { title: string; seeAll: string; close: string };
  note: {
    title: string;
    body: string;
  };
}

export const changelog: Slice<ChangelogCopy> = {
  en: {
    entries: [
      {
        version: "v1.1.0",
        date: "18 October 2026",
        summary:
          "A complete rebuild of the site, plus installable as an app and light or dark mode.",
        changes: [
          "The site was rebuilt from the ground up. The design, layout and writing are all new - v1.0.0 looked nothing like this.",
          "A full redesign across every page, built for clarity on a phone first.",
          "Installable on iOS, Android and desktop: add it to your home screen and it opens full screen, like a native app.",
          "Offline fallback: pages you have already opened stay readable when the connection drops.",
          "An install prompt inside the browser, so adding the site to your device takes a single tap.",
          "Light and dark themes, following your system setting automatically.",
          "New typography throughout, with Arabic typeset properly across the whole site.",
        ],
      },
      {
        version: "v1.0.0",
        date: "2 March 2026",
        summary:
          "The original first release, since rebuilt in v1.1.0: three paths for three kinds of students.",
        changes: [
          "Three audience paths: students restarting after dropping out, students choosing a high school division, and graduates looking into university.",
          "The ATFP reference guide: certifications, the fields they open, and where to apply.",
          "Division comparisons - subjects, advantages and drawbacks for every branch of the Tunisian high school.",
          "The university orientation score calculator, built on the Ministry of Higher Education formula.",
          "The whole site in English, French and Arabic, switchable at any time.",
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
    popup: {
      title: "What's new",
      seeAll: "See everything",
      close: "Close",
    },
    note: {
      title: "Missing something?",
      body: "Every release is written here as it ships. If a change is missing from this page, or something is still unclear, tell us - it goes into the next version.",
    },
  },

  fr: {
    entries: [
      {
        version: "v1.1.0",
        date: "18 octobre 2026",
        summary:
          "Une refonte complète du site, plus l'installation comme une application et le mode clair ou sombre.",
        changes: [
          "Le site a été entièrement reconstruit. Le design, la mise en page et les textes sont neufs - la v1.0.0 n'avait rien à voir.",
          "Une refonte complète de toutes les pages, pensée d'abord pour la clarté sur mobile.",
          "Installable sur iOS, Android et sur ordinateur : ajoutez-le à votre écran d'accueil et il s'ouvre en plein écran, comme une application native.",
          "Mode hors ligne : les pages déjà consultées restent lisibles même lorsque la connexion est coupée.",
          "Une invite d'installation s'affiche dans le navigateur : ajouter le site à votre appareil ne demande qu'un seul geste.",
          "Thèmes clair et sombre, suivant automatiquement le réglage de votre système.",
          "Une nouvelle typographie partout, avec un arabe correctement composé sur tout le site.",
        ],
      },
      {
        version: "v1.0.0",
        date: "2 mars 2026",
        summary:
          "La première version publique, reconstruite en v1.1.0 : trois chemins pour trois types d'élèves.",
        changes: [
          "Trois parcours : les élèves qui reprennent après un décrochage, ceux qui choisissent une filière au lycée, et les bacheliers qui regardent vers l'université.",
          "Le guide de référence de l'ATFP : les certifications, les métiers qu'elles ouvrent, et où se porter candidat.",
          "Comparatifs des filières - matières, avantages et inconvénients pour chaque section du lycée tunisien.",
          "Le calculateur de score d'orientation universitaire, fondé sur la formule du ministère de l'Enseignement supérieur.",
          "Le site entier en anglais, en français et en arabe, avec un changement de langue à tout moment.",
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
    popup: {
      title: "Nouveautés",
      seeAll: "Tout voir",
      close: "Fermer",
    },
    note: {
      title: "Il manque quelque chose ?",
      body: "Chaque version est consignée ici dès sa publication. Si un changement n'y figure pas, ou si quelque chose reste flou, dites-le-nous : cela ira dans la prochaine version.",
    },
  },

  ar: {
    entries: [
      {
        version: "v1.1.0",
        date: "18 أكتوبر 2026",
        summary:
          "إعادة بناء كاملة للموقع، مع إمكانية التثبيت كتطبيق ووضع فاتح أو داكن.",
        changes: [
          "أُعيد بناء الموقع من الأساس. التصميم والتنسيق والنصوص كلها جديدة - فالإصدار 1.0.0 لم يكن شيئاً يشبهه.",
          "تصميم جديد لكل الصفحات، صُمم أولاً لوضوح القراءة على الهاتف.",
          "قابل للتثبيت على iOS وAndroid وعلى الحاسوب: أضِفه إلى شاشتك الرئيسية فيفتح بملء الشاشة، مثل التطبيق الأصلي.",
          "العمل دون اتصال: تبقى الصفحات التي فتحتها سابقاً قابلة للقراءة عند انقطاع الاتصال.",
          "رسالة تثبيت تظهر داخل المتصفح، فتضيف الموقع إلى جهازك بلمسة واحدة.",
          "وضع فاتح ووضع داكن، يتبعان تلقائياً إعداد نظامك.",
          "خط جديد في كل الموقع، مع ضبط العربية بشكل صحيح في كل الصفحات.",
        ],
      },
      {
        version: "v1.0.0",
        date: "2 مارس 2026",
        summary:
          "الإصدار العام الأول، الذي أُعيد بناؤه في الإصدار 1.1.0: ثلاثة مسارات لثلاث فئات من التلاميذ.",
        changes: [
          "ثلاثة مسارات: التلاميذ الذين يعودون بعد الانقطاع، ومن يختارون قسماً في الثانوية، والخريجون الذين ينظرون في التعليم العالي.",
          "الدليل المرجعي للتكوين المهني ATFP: الشهادات، والحقول التي تفتحها، وأماكن الترشح.",
          "مقارنات بين الأقسام - المواد والإيجابيات والسلبيات لكل قسم في الثانوية التونسية.",
          "حاسبة نقاط التوجيه الجامعي، مبنية على صيغة وزارة التعليم العالي.",
          "الموقع كاملاً بالإنجليزية والفرنسية والعربية، مع إمكانية تغيير اللغة في أي وقت.",
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
    popup: {
      title: "ما الجديد",
      seeAll: "عرض الكل",
      close: "إغلاق",
    },
    note: {
      title: "هل ينقصك شيء؟",
      body: "كل إصدار يُدوَّن هنا فور نشره. إن لم تجد تغييرًا مذكورًا في هذه الصفحة، أو بقي شيء غير واضح، فأخبرنا وسيكون في الإصدار القادم.",
    },
  },
};