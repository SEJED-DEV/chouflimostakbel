import type { Slice } from "./types";

/**
 * Copy for the pages that are not part of the normal flow: the 404, the
 * route error boundary, and the last-resort boundary that replaces the whole
 * document.
 *
 * The 404 and the route boundary sit inside the language provider, so they
 * read the active language normally. The last-resort boundary replaces the
 * root layout and therefore has no provider above it - it reads the stored
 * language directly.
 */
export interface ErrorCopy {
  notFound: {
    title: string;
    body: string;
    backHome: string;
  };
  error: {
    title: string;
    body: string;
    tryAgain: string;
    backHome: string;
    /** Shown when the failure is a stale build rather than a real fault. */
    staleTitle: string;
    staleBody: string;
  };
  globalError: {
    title: string;
    body: string;
    tryAgain: string;
    staleTitle: string;
    staleBody: string;
  };
}

export const errors: Slice<ErrorCopy> = {
  en: {
    notFound: {
      title: "This page went looking for a different future.",
      body: "The link may be old, or the page may have moved. Nothing here is lost though - pick a path below.",
      backHome: "Back home",
    },
    error: {
      title: "Something went sideways.",
      body: "This page hit an unexpected error. Trying again usually clears it.",
      tryAgain: "Try again",
      backHome: "Back home",
      staleTitle: "Updating to the latest version.",
      staleBody:
        "This page was left open while the site was updated. Refreshing picks up the current version.",
    },
    globalError: {
      title: "Something went sideways.",
      body: "The site failed to load properly. Try again, or reload the page.",
      tryAgain: "Try again",
      staleTitle: "Updating to the latest version.",
      staleBody:
        "This page was left open while the site was updated. Refreshing picks up the current version.",
    },
  },

  fr: {
    notFound: {
      title: "Cette page est partie à la recherche d'un autre avenir.",
      body: "Le lien est peut-être ancien, ou la page a peut-être été déplacée. Rien n'est perdu pour autant - choisissez une voie ci-dessous.",
      backHome: "Retour à l'accueil",
    },
    error: {
      title: "Quelque chose a mal tourné.",
      body: "Cette page a rencontré une erreur inattendue. Réessayer suffit généralement à tout régler.",
      tryAgain: "Réessayer",
      backHome: "Retour à l'accueil",
      staleTitle: "Mise à jour vers la dernière version.",
      staleBody:
        "Cette page est restée ouverte pendant la mise à jour du site. L'actualisation affiche la version en cours.",
    },
    globalError: {
      title: "Quelque chose a mal tourné.",
      body: "Le site n'a pas pu se charger correctement. Réessayez, ou rechargez la page.",
      tryAgain: "Réessayer",
      staleTitle: "Mise à jour vers la dernière version.",
      staleBody:
        "Cette page est restée ouverte pendant la mise à jour du site. L'actualisation affiche la version en cours.",
    },
  },

  ar: {
    notFound: {
      title: "انطلقت هذه الصفحة تبحث عن مستقبل آخر.",
      body: "قد يكون الرابط قديمًا، أو ربما نُقلت الصفحة. لا شيء ضاع هنا على أي حال - اختر مسارًا أدناه.",
      backHome: "العودة إلى الرئيسية",
    },
    error: {
      title: "حدث خطأ ما.",
      body: "واجهت هذه الصفحة خطأ غير متوقع. عادةً ما تحلّ إعادة المحاولة المشكلة.",
      tryAgain: "أعد المحاولة",
      backHome: "العودة إلى الرئيسية",
      staleTitle: "جارٍ التحديث إلى أحدث إصدار.",
      staleBody:
        "بقيت هذه الصفحة مفتوحة أثناء تحديث الموقع. وتُحمِّل الصفحةُ النسخةَ الحالية عند إعادة التحميل.",
    },
    globalError: {
      title: "حدث خطأ ما.",
      body: "تعذّر تحميل الموقع على نحو صحيح. أعد المحاولة، أو أعد تحميل الصفحة.",
      tryAgain: "أعد المحاولة",
      staleTitle: "جارٍ التحديث إلى أحدث إصدار.",
      staleBody:
        "بقيت هذه الصفحة مفتوحة أثناء تحديث الموقع. وتُحمِّل الصفحةُ النسخةَ الحالية عند إعادة التحميل.",
    },
  },
};
