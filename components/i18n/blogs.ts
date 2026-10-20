import type { Slice } from "./types";

/**
 * The blogs section: the list, the post itself, and the editor.
 *
 * The editor lives here rather than in its own slice because it is not a
 * separate page in the reader's head - it is writing a blog, and the words
 * for "draft" and "publish" have to agree with the ones on the list.
 *
 * `{n}` in `minRead` is replaced with the number. It is a placeholder rather
 * than a concatenation because Arabic does not put the number where English
 * does, and a unit glued to the front of a count is untranslatable.
 */
export interface BlogsCopy {
  title: string;
  titleAccent: string;
  sub: string;
  empty: string;
  emptyBody: string;
  writeOne: string;
  soonNote: string;

  /** The list. */
  write: string;
  by: string;
  minRead: string;
  draft: string;
  draftNote: string;
  /** Shown on a post the reader has not published, and to nobody else. */
  ownDraft: string;

  /** The post. */
  backToBlogs: string;
  editPost: string;
  publishedOn: string;
  editedOn: string;
  postNotFound: string;
  postNotFoundBody: string;

  /**
   * How long ago something was posted. "Just now", "5 minutes ago" and so on.
   *
   * The list shows when a post landed rather than the date it carries, because
   * "3 hours ago" is what a reader is actually asking. The exact date is still
   * on the post itself, where there is room for it.
   */
  justNow: string;
  minutesAgo: string;
  hoursAgo: string;
  daysAgo: string;
  postedAgo: string;

  /** The public profile of one person. */
  /** "{n} posts" */
  postCount: string;
  /** "Written by {name}" */
  byPerson: string;
  nothingPublished: string;
  personNotFound: string;
  personNotFoundBody: string;

  /** The editor. */
  editorNew: string;
  editorEdit: string;
  fieldTitle: string;
  fieldSlug: string;
  fieldExcerpt: string;
  fieldBody: string;
  fieldTags: string;
  fieldStatus: string;
  titlePlaceholder: string;
  slugPlaceholder: string;
  excerptPlaceholder: string;
  bodyPlaceholder: string;
  tagsPlaceholder: string;
  slugHint: string;
  excerptHint: string;
  tagsHint: string;
  bodyHint: string;
  statusDraft: string;
  statusPublished: string;
  saveDraft: string;
  publish: string;
  saving: string;
  saved: string;
  cancel: string;
  deletePost: string;
  deleteConfirm: string;
  deleting: string;
  preview: string;
  words: string;

  /** Editor and list errors. */
  errors: {
    invalidTitle: string;
    invalidSlug: string;
    invalidExcerpt: string;
    invalidBody: string;
    invalidTags: string;
    invalidStatus: string;
    slugTaken: string;
    refused: string;
    notSignedIn: string;
    server: string;
    network: string;
  };
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

    write: "Write a post",
    by: "By",
    minRead: "{n} min read",
    draft: "Draft",
    draftNote: "Only you can see a draft.",
    ownDraft: "This is your draft. Nobody else can see it.",

    backToBlogs: "All posts",
    editPost: "Edit",
    publishedOn: "Published",
    editedOn: "Last edited",
    postNotFound: "No such post.",
    postNotFoundBody:
      "It may have been deleted, or the address may be mistyped.",

    justNow: "just now",
    minutesAgo: "{n} min ago",
    hoursAgo: "{n} h ago",
    daysAgo: "{n} d ago",
    postedAgo: "Posted {when}",

    postCount: "{n} posts",
    byPerson: "Written by {name}",
    nothingPublished: "Nothing published yet.",
    personNotFound: "No such person.",
    personNotFoundBody:
      "Either the handle is misspelt, or they have not published anything yet.",

    editorNew: "New post",
    editorEdit: "Edit post",
    fieldTitle: "Title",
    fieldSlug: "Web address",
    fieldExcerpt: "Summary",
    fieldBody: "Post",
    fieldTags: "Tags",
    fieldStatus: "Status",
    titlePlaceholder: "What is this about?",
    slugPlaceholder: "left-blank-becomes-the-title",
    excerptPlaceholder: "One or two lines, shown in the list",
    bodyPlaceholder: "Write here. Markdown works: # heading, **bold**, - lists.",
    tagsPlaceholder: "guidance, bac, orientation",
    slugHint: "Lower-case letters, digits and hyphens. Leave it blank to choose one.",
    excerptHint: "Optional, up to 400 characters.",
    tagsHint: "Up to 8, separated by commas.",
    bodyHint: "Markdown. Anything you paste as HTML is shown as text, not run.",
    statusDraft: "Draft",
    statusPublished: "Published",
    saveDraft: "Save draft",
    publish: "Publish",
    saving: "Saving…",
    saved: "Saved",
    cancel: "Cancel",
    deletePost: "Delete post",
    deleteConfirm: "Delete this post? It cannot be undone.",
    deleting: "Deleting…",
    preview: "Preview",
    words: "{n} words",

    errors: {
      invalidTitle: "A post needs a title.",
      invalidSlug:
        "A web address is lower-case letters, digits and hyphens, starting with a letter or a digit.",
      invalidExcerpt: "The summary is too long. 400 characters at most.",
      invalidBody: "The post is too long.",
      invalidTags: "Tags are letters and numbers, up to 8 of them.",
      invalidStatus: "Pick a status.",
      slugTaken: "That web address is already taken. Pick another.",
      refused: "The platform refused this post.",
      notSignedIn: "Sign in to write.",
      server: "Something went wrong on our side.",
      network: "Could not reach the platform. Check your connection.",
    },
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

    write: "Écrire un article",
    by: "Par",
    minRead: "{n} min de lecture",
    draft: "Brouillon",
    draftNote: "Un brouillon n’est visible que par vous.",
    ownDraft: "Ceci est votre brouillon. Personne d’autre ne le voit.",

    backToBlogs: "Tous les articles",
    editPost: "Modifier",
    publishedOn: "Publié le",
    editedOn: "Dernière modification",
    postNotFound: "Cet article n’existe pas.",
    postNotFoundBody:
      "Il a peut-être été supprimé, ou l’adresse comporte une faute.",

    justNow: "à l’instant",
    minutesAgo: "il y a {n} min",
    hoursAgo: "il y a {n} h",
    daysAgo: "il y a {n} j",
    postedAgo: "Publié {when}",

    postCount: "{n} articles",
    byPerson: "Écrit par {name}",
    nothingPublished: "Rien de publié pour l’instant.",
    personNotFound: "Personne de ce nom.",
    personNotFoundBody:
      "Soit l’identifiant est mal orthographié, soit cette personne n’a encore rien publié.",

    editorNew: "Nouvel article",
    editorEdit: "Modifier l’article",
    fieldTitle: "Titre",
    fieldSlug: "Adresse",
    fieldExcerpt: "Résumé",
    fieldBody: "Article",
    fieldTags: "Mots-clés",
    fieldStatus: "Statut",
    titlePlaceholder: "De quoi parle-t-il ?",
    slugPlaceholder: "laissé-vide-devient-le-titre",
    excerptPlaceholder: "Une ou deux lignes, affichées dans la liste",
    bodyPlaceholder:
      "Écrivez ici. Le markdown fonctionne : # titre, **gras**, - listes.",
    tagsPlaceholder: "orientation, bac, filières",
    slugHint:
      "Minuscules, chiffres et tirets, commençant par une lettre ou un chiffre. Vide pour choisir automatiquement.",
    excerptHint: "Facultatif, 400 caractères au plus.",
    tagsHint: "8 au maximum, séparés par des virgules.",
    bodyHint:
      "Markdown. Tout HTML que vous collez est affiché comme du texte, pas exécuté.",
    statusDraft: "Brouillon",
    statusPublished: "Publié",
    saveDraft: "Enregistrer le brouillon",
    publish: "Publier",
    saving: "Enregistrement…",
    saved: "Enregistré",
    cancel: "Annuler",
    deletePost: "Supprimer l’article",
    deleteConfirm: "Supprimer cet article ? Cette action est définitive.",
    deleting: "Suppression…",
    preview: "Aperçu",
    words: "{n} mots",

    errors: {
      invalidTitle: "Un article a besoin d’un titre.",
      invalidSlug:
        "Une adresse comporte des minuscules, des chiffres et des tirets, et commence par une lettre ou un chiffre.",
      invalidExcerpt: "Le résumé est trop long. 400 caractères au plus.",
      invalidBody: "L’article est trop long.",
      invalidTags:
        "Les mots-clés sont des lettres et des chiffres, 8 au maximum.",
      invalidStatus: "Choisissez un statut.",
      slugTaken: "Cette adresse est déjà prise. Choisissez-en une autre.",
      refused: "La plateforme a refusé cet article.",
      notSignedIn: "Connectez-vous pour écrire.",
      server: "Quelque chose s’est mal passé de notre côté.",
      network: "Impossible de joindre la plateforme. Vérifiez votre connexion.",
    },
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

    write: "اكتب مقالاً",
    by: "بقلم",
    minRead: "{n} دقائق قراءة",
    draft: "مسودّة",
    draftNote: "المسودّة لا يراها سواك.",
    ownDraft: "هذه مسودّتك، ولا يراها أحد سواك.",

    backToBlogs: "كل المقالات",
    editPost: "تعديل",
    publishedOn: "نُشر في",
    editedOn: "آخر تعديل",
    postNotFound: "لا يوجد مقال بهذا الاسم.",
    postNotFoundBody: "لعله حُذف، أو أن في العنوان خطأ.",

    justNow: "الآن",
    minutesAgo: "قبل {n} دقيقة",
    hoursAgo: "قبل {n} ساعة",
    daysAgo: "قبل {n} يوم",
    postedAgo: "نُشر {when}",

    postCount: "{n} مقالاً",
    byPerson: "بقلم {name}",
    nothingPublished: "لم يُنشر شيء بعد.",
    personNotFound: "لا يوجد شخص بهذا الاسم.",
    personNotFoundBody:
      "إمّا أن المعرّف مكتوب خطأً، وإمّا أن صاحبه لم ينشر شيئًا بعد.",

    editorNew: "مقال جديد",
    editorEdit: "تعديل المقال",
    fieldTitle: "العنوان",
    fieldSlug: "الرابط",
    fieldExcerpt: "الملخّص",
    fieldBody: "المقال",
    fieldTags: "الوسوم",
    fieldStatus: "الحالة",
    titlePlaceholder: "عن ماذا يتحدّث؟",
    slugPlaceholder: "يُترك فارغاً فيصير العنوان",
    excerptPlaceholder: "سطر أو سطران يظهران في القائمة",
    bodyPlaceholder:
      "اكتب هنا. صيغة ماركداون تعمل: # عنوان، **عريض**، - قوائم.",
    tagsPlaceholder: "توجيه، باك، مسالك",
    slugHint: "حروف صغيرة وأرقام وشرطات، ويبدأ بحرف أو رقم. اتركه فارغاً ليُختار تلقائياً.",
    excerptHint: "اختياري، 400 حرف على الأكثر.",
    tagsHint: "ثمانية على الأكثر، مفصولة بفواصل.",
    bodyHint: "ماركداون. أي HTML تلصقه يُعرض كنص، لا يُنفَّذ.",
    statusDraft: "مسودّة",
    statusPublished: "منشور",
    saveDraft: "حفظ المسودّة",
    publish: "نشر",
    saving: "جارٍ الحفظ…",
    saved: "تم الحفظ",
    cancel: "إلغاء",
    deletePost: "حذف المقال",
    deleteConfirm: "هل تريد حذف هذا المقال؟ لا يمكن التراجع.",
    deleting: "جارٍ الحذف…",
    preview: "معاينة",
    words: "{n} كلمة",

    errors: {
      invalidTitle: "المقال يحتاج عنواناً.",
      invalidSlug:
        "الرابط حروف صغيرة وأرقام وشرطات، ويبدأ بحرف أو رقم.",
      invalidExcerpt: "الملخّص طويل جداً. 400 حرف على الأكثر.",
      invalidBody: "المقال طويل جداً.",
      invalidTags: "الوسوم حروف وأرقام، ثمانية على الأكثر.",
      invalidStatus: "اختر حالة.",
      slugTaken: "هذا الرابط محجوز. اختر رابطاً آخر.",
      refused: "رفضت المنصّة هذا المقال.",
      notSignedIn: "سجّل الدخول للكتابة.",
      server: "حدث خطأ من جانبنا.",
      network: "تعذّر الوصول إلى المنصّة. تحقّق من اتصالك.",
    },
  },
};
