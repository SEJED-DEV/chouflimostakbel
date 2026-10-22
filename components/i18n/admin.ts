import type { Slice } from "./types";

/**
 * The admin panel's copy, in all three languages.
 *
 * A separate slice from `account`, because the panel is a different surface
 * and the account copy is about one person's own account. The panel is about
 * the platform - everybody, and everything written.
 *
 * The panel is read-only for now. The moderation queue that belongs here is
 * not built, and the copy says so rather than implying a feature that does
 * not exist.
 */
export interface AdminCopy {
  eyebrow: string;
  title: string;
  titleAccent: string;
  sub: string;

  /** The four counts. */
  overview: string;
  people: string;
  published: string;
  drafts: string;
  staff: string;

  /** The people table. */
  peopleTitle: string;
  peopleSub: string;
  handle: string;
  name: string;
  badges: string;
  joined: string;
  posts: string;
  noPeople: string;

  /** The posts table. */
  postsTitle: string;
  postsSub: string;
  postTitle: string;
  author: string;
  status: string;
  date: string;
  noPosts: string;

  /** The honest note about what is not built yet. */
  moderationTitle: string;
  moderationBody: string;

  /** Shown to a reader who is not staff. */
  refusedTitle: string;
  refusedBody: string;
  backToProfile: string;
}

export const admin: Slice<AdminCopy> = {
  en: {
    eyebrow: "Staff",
    title: "The",
    titleAccent: "admin panel.",
    sub: "A read-only view of the platform: who is here, what they have written, and how much of it is published. It opens for staff only, and the database still holds the addresses and birthdays it has always held - this page does not show them, and staff are no more able to read them from anywhere else than anyone else is.",

    overview: "At a glance",
    people: "People",
    published: "Published",
    drafts: "Drafts",
    staff: "Staff",

    peopleTitle: "Everyone",
    peopleSub:
      "Every account on the platform, newest first. A person's badges are the roles the database holds for them.",
    handle: "Handle",
    name: "Name",
    badges: "Badges",
    joined: "Joined",
    posts: "Posts",
    noPeople: "Nobody has an account yet.",

    postsTitle: "Everything written",
    postsSub:
      "Every post, drafts included, newest first. A draft is private to its author and only appears here because this panel reads with the service role.",
    postTitle: "Title",
    author: "Author",
    status: "Status",
    date: "Date",
    noPosts: "Nothing has been written yet.",

    moderationTitle: "What is not here yet",
    moderationBody:
      "A moderation queue: reported posts waiting for a decision, and the tools to make one. The report button does not exist yet, so there is nothing to queue and nothing to decide. It is on the roadmap, and it will be built before this page pretends to have it.",

    refusedTitle: "This page is not for you.",
    refusedBody:
      "The admin panel is for staff. If you think you should have access, say so and it will be looked at.",
    backToProfile: "Back to your profile",
  },

  fr: {
    eyebrow: "Équipe",
    title: "Le",
    titleAccent: "panneau d'administration.",
    sub: "Une vue en lecture seule de la plateforme : qui est là, ce qu'ils ont écrit, et quelle part est publiée. Il s'ouvre à l'équipe uniquement, et la base de données conserve toujours les adresses et les dates de naissance qu'elle conservait - cette page ne les montre pas, et l'équipe n'est pas plus capable de les lire ailleurs que personne d'autre.",

    overview: "En un coup d'œil",
    people: "Personnes",
    published: "Publiés",
    drafts: "Brouillons",
    staff: "Équipe",

    peopleTitle: "Tout le monde",
    peopleSub:
      "Tous les comptes de la plateforme, du plus récent au plus ancien. Les badges d'une personne sont les rôles que la base de données lui porte.",
    handle: "Identifiant",
    name: "Nom",
    badges: "Badges",
    joined: "Inscrit le",
    posts: "Articles",
    noPeople: "Personne n'a encore de compte.",

    postsTitle: "Tout ce qui a été écrit",
    postsSub:
      "Tous les articles, brouillons compris, du plus récent au plus ancien. Un brouillon est privé et n'apparaît ici que parce que ce panneau lit avec la clé de service.",
    postTitle: "Titre",
    author: "Auteur",
    status: "État",
    date: "Date",
    noPosts: "Rien n'a encore été écrit.",

    moderationTitle: "Ce qui n'est pas encore là",
    moderationBody:
      "Une file de modération : les articles signalés en attente d'une décision, et les outils pour la prendre. Le bouton de signalement n'existe pas encore, donc il n'y a rien à mettre en file et rien à décider. C'est sur la feuille de route, et cela sera construit avant que cette page prétende l'avoir.",

    refusedTitle: "Cette page n'est pas pour vous.",
    refusedBody:
      "Le panneau d'administration est réservé à l'équipe. Si vous pensez devoir y avoir accès, dites-le et cela sera examiné.",
    backToProfile: "Retour à votre profil",
  },

  ar: {
    eyebrow: "الفريق",
    title: "لوحة",
    titleAccent: "الإدارة.",
    sub: "نظرٌ للقراءة فقط في المنصّة: من هنا، وماذا كتب، وكمّ منه منشور. تُفتح لأعضاء الفريق وحدهم، وما زالت قاعدة البيانات تحمل العناوين وتواريخ الميلاد التي حملتها دائمًا - هذه الصفحة لا تعرضها، ولا يستطيع الفريق قراءتها من أيّ مكانٍ آخر أكثر من أيّ شخصٍ آخر.",

    overview: "لمحة سريعة",
    people: "أشخاص",
    published: "منشور",
    drafts: "مسودّات",
    staff: "الفريق",

    peopleTitle: "الجميع",
    peopleSub:
      "كلّ الحسابات في المنصّة، من الأحدث إلى الأقدم. وشارات الشخص هي الأدوار التي تحملها قاعدة البيانات له.",
    handle: "المعرّف",
    name: "الاسم",
    badges: "الشارات",
    joined: "انضمّ في",
    posts: "مقالات",
    noPeople: "لا أحد يملك حسابًا بعد.",

    postsTitle: "كل ما كُتب",
    postsSub:
      "كل المقالات، بما فيها المسودّات، من الأحدث إلى الأقدم. المسودّة خاصة بصاحبها، ولا تظهر هنا إلّا لأن هذه اللوحة تقرأ بمفتاح الخدمة.",
    postTitle: "العنوان",
    author: "الكاتب",
    status: "الحالة",
    date: "التاريخ",
    noPosts: "لم يُكتب شيء بعد.",

    moderationTitle: "ما ليس هنا بعد",
    moderationBody:
      "قائمة إشراف: مقالات مُبلَّغ عنها تنتظر القرار، والأدوات لاتخاذه. زرّ الإبلاغ غير موجود بعد، فلا شيء يُضاف إلى القائمة ولا شيء ينتظر قرارًا. وهو في خارطة الطريق، وسيُبنى قبل أن تتظاهر هذه الصفحة بامتلاكه.",

    refusedTitle: "هذه الصفحة ليست لك.",
    refusedBody:
      "لوحة الإدارة خاصة بالفريق. إن كنت تعتقد أن لك حقّ الوصول إليها فقل ذلك، وسيُنظر في الأمر.",
    backToProfile: "العودة إلى ملفّك",
  },
};
