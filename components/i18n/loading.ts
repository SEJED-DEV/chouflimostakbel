import type { Slice } from "./types";

/**
 * What a page says while it is loading.
 *
 * Empty grey blocks remove the jump but they are not very good company. So
 * the wait is filled with the site's own words instead: the mark, and one
 * line from the project picked at random each time, so somebody who waits
 * twice does not read the same sentence twice.
 *
 * The lines are short on purpose. They sit under a skeleton in the middle of
 * a page that has not arrived yet, and a paragraph there would look like the
 * page itself - which is the confusion this is meant to avoid.
 */
export interface LoadingCopy {
  /** Read out to a screen reader while the page loads. */
  label: string;
  /** One is picked at random per load. */
  quotes: string[];
}

export const loading: Slice<LoadingCopy> = {
  en: {
    label: "Loading",
    quotes: [
      "Where you find offers that ensure you a good future.",
      "A stable future, no matter where you start.",
      "Dropping out is not the end. It is the start of another path.",
      "With a Bac, or without one. Both are real paths.",
      "Guidance written in the open, decisions and all.",
    ],
  },

  fr: {
    label: "Chargement",
    quotes: [
      "Là où vous trouvez des offres qui vous assurent un avenir.",
      "Un avenir stable, quel que soit votre point de départ.",
      "Décrocher n'est pas la fin. C'est le début d'un autre chemin.",
      "Avec un Bac, ou sans. Les deux sont de vrais chemins.",
      "Une orientation écrite à ciel ouvert, décisions comprises.",
    ],
  },

  ar: {
    label: "جارٍ التحميل",
    quotes: [
      "حيث تجد عروضاً تضمن لك مستقبلاً جيداً.",
      "مستقبلٌ مستقر، أيًّا كانت نقطة انطلاقك.",
      "الانقطاع ليس النهاية، بل بداية طريق آخر.",
      "بالباكالوريا أو بدونها، كلاهما طريقٌ حقيقي.",
      "توجيهٌ مكتوب في العلن، بقراراته كلها.",
    ],
  },
};
