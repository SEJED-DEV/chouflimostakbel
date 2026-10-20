import type { Slice } from "./types";

/**
 * The blogs section.
 *
 * It exists and it is empty. That is the honest state of it, and saying so
 * is better than a page that pretends.
 */
export interface BlogsCopy {
  title: string;
  titleAccent: string;
  sub: string;
  empty: string;
  emptyBody: string;
  writeOne: string;
  soonNote: string;
}

export const blogs: Slice<BlogsCopy> = {
  en: {
    title: "The",
    titleAccent: "blogs.",
    sub: "What people have written. Every post here is written by a reader, not by us.",
    empty: "No posts yet.",
    emptyBody:
      "The first posts are on their way. If you have an account, yours will be the first.",
    writeOne: "Write the first one",
    soonNote: "What is being built is written down on the roadmap.",
  },

  fr: {
    title: "Les",
    titleAccent: "blogs.",
    sub: "Ce que les gens ont écrit. Chaque article vient d’un lecteur, pas de nous.",
    empty: "Aucun article pour l’instant.",
    emptyBody:
      "Les premiers articles arrivent. Si vous avez un compte, le vôtre sera le premier.",
    writeOne: "Écrire le premier",
    soonNote: "Ce qui est en construction est écrit sur la feuille de route.",
  },

  ar: {
    title: "المدو",
    titleAccent: "نة.",
    sub: "ما كتبه الناس. كل مقال هنا كتبه قارئ، لا نحن.",
    empty: "لا مقالات بعد.",
    emptyBody:
      "المقالات الأولى في الطريق. إن كان لك حساب فمقالك سيكون الأول.",
    writeOne: "اكتب الأول",
    soonNote: "ما يُبنى مكتوب في خارطة الطريق.",
  },
};
