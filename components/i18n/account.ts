import type { Slice } from "./types";

/**
 * The account page.
 *
 * The first piece of the platform to come: a person, an address, a password,
 * and a session.
 */
export interface AccountCopy {
  title: string;
  titleAccent: string;
  sub: string;

  signIn: string;
  signUp: string;
  signOut: string;

  displayName: string;
  /** The public name, and the thing you sign in with. */
  handle: string;
  handlePlaceholder: string;
  /** Optional. The platform does not need it. */
  email: string;
  emailOptional: string;
  emailOptionalPlaceholder: string;
  /** The sign-in field: a handle, or an address. */
  identifier: string;
  identifierPlaceholder: string;
  password: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  sending: string;
  /** Saving a change to the profile. */
  saveName: string;

  /** "Signed in as {name}" */
  signedInAs: string;
  /** Shown while the address is not confirmed. */
  notVerified: string;
  /** "Welcome, {name}." */
  welcome: string;
  /** Shown for a moment after an account is created. */
  created: string;

  haveAccount: string;
  noAccount: string;
  switchToSignIn: string;
  switchToSignUp: string;

  /** The settings surface. */
  settingsTitle: string;
  settingsSub: string;
  appearance: string;
  light: string;
  dark: string;
  /** "Follow the system" - the third theme state. */
  system: string;
  language: string;

  /** The profile's own section. */
  photo: string;
  changePhoto: string;
  removePhoto: string;
  banner: string;
  dateOfBirth: string;
  dateOfBirthHint: string;
  /** "Member since {date}" */
  memberSince: string;
  /** "{name}'s profile photo" */
  photoAlt: string;

  profileTitle: string;
  profileSub: string;
  yourPosts: string;
  yourPostsBody: string;
  errors: {
    invalidHandle: string;
    handleTaken: string;
    invalidEmail: string;
    weakPassword: string;
    invalidName: string;
    invalidPhoto: string;
    invalidDate: string;
    emailTaken: string;
    wrongCredentials: string;
    rate: string;
    server: string;
    invalid: string;
    generic: string;
  };
}

export const account: Slice<AccountCopy> = {
  en: {
    title: "Your",
    titleAccent: "account.",
    sub: "An account lets you write, comment, and keep a profile of your own. It is the first piece of the platform to come.",
    signIn: "Sign in",
    signUp: "Create an account",
    signOut: "Sign out",
    displayName: "Name",

    profileTitle: "Your profile.",
    profileSub: "This is where your profile lives. What you write appears here, and this is the page people will see.",
    yourPosts: "Your posts",
    yourPostsBody: "Nothing here yet. When you write something, it will show up here.",

    settingsTitle: "Settings.",
    settingsSub: "How the platform looks, and how it speaks.",
    appearance: "Appearance",
    light: "Light",
    dark: "Dark",
    system: "Automatic",
    language: "Language",

    photo: "Profile photo",
    changePhoto: "Change photo",
    removePhoto: "Remove",
    banner: "Banner",
    dateOfBirth: "Date of birth",
    dateOfBirthHint: "Optional. It shows as an age - the date itself is never public.",
    memberSince: "Member since {date}",
    photoAlt: "{name}'s profile photo",

    identifier: "Username or email",
    identifierPlaceholder: "Your username, or your email",
    handle: "Username",
    handlePlaceholder: "How you appear, and how you sign in",
    emailOptional: "Email (optional)",
    emailOptionalPlaceholder: "Only if you want to hear from us",    email: "Email",
    password: "Password",
    namePlaceholder: "What should we call you?",
    emailPlaceholder: "you@email.com",
    passwordPlaceholder: "At least ten characters",
    sending: "Just a moment...",
    saveName: "Save",
    signedInAs: "Signed in as {name}",
    notVerified:
      "Your email address is not confirmed yet. Some things stay closed until it is.",
    welcome: "Welcome, {name}.",
    created: "Your account is ready.",
    haveAccount: "Already have an account?",
    noAccount: "No account yet?",
    switchToSignIn: "Sign in instead",
    switchToSignUp: "Create one instead",
    errors: {

invalidHandle: "A username is 3 to 30 characters: letters, digits, dots, dashes and underscores.",
handleTaken: "That username is taken.",      invalidEmail: "That does not look like an email address.",
      weakPassword: "Use at least ten characters.",
      invalidName: "Tell us what to call you.",
      invalidPhoto: "That file is not an image we can use.",
      invalidDate: "That is not a date we can use.",
      emailTaken: "There is already an account with that address.",
      wrongCredentials: "That address and password do not match.",
      rate: "Too many attempts. Wait a little, then try again.",
      server: "Something went wrong on our side. Try again.",
      invalid: "Something was missing from that form.",
      generic: "That did not work. Try again.",
    },
  },

  fr: {
    title: "Votre",
    titleAccent: "compte.",
    sub: "Un compte vous permet d'écrire, de commenter et de garder un profil qui vous appartient. C'est la première pièce de la plateforme à venir.",
    signIn: "Se connecter",
    signUp: "Créer un compte",
    signOut: "Se déconnecter",
    displayName: "Nom",

    profileTitle: "Votre profil.",
    profileSub: "C’est ici que vit votre profil. Ce que vous écrivez apparaît ici, et c’est la page que les gens verront.",
    yourPosts: "Vos articles",
    yourPostsBody: "Rien ici pour l’instant. Quand vous écrirez quelque chose, cela apparaîtra ici.",

    settingsTitle: "Réglages.",
    settingsSub: "Comment la plateforme se présente, et comment elle parle.",
    appearance: "Apparence",
    light: "Clair",
    dark: "Sombre",
    system: "Automatique",
    language: "Langue",

    photo: "Photo de profil",
    changePhoto: "Changer la photo",
    removePhoto: "Retirer",
    banner: "Bannière",
    dateOfBirth: "Date de naissance",
    dateOfBirthHint: "Facultatif. Elle apparaît comme un âge - la date elle-même n’est jamais publique.",
    memberSince: "Membre depuis {date}",
    photoAlt: "Photo de profil de {name}",

    identifier: "Nom d’utilisateur ou e-mail",
    identifierPlaceholder: "Votre nom d’utilisateur, ou votre e-mail",
    handle: "Nom d’utilisateur",
    handlePlaceholder: "Comment vous apparaissez, et comment vous connectez",
    emailOptional: "E-mail (facultatif)",
    emailOptionalPlaceholder: "Seulement si vous voulez recevoir de nos nouvelles",    email: "E-mail",
    password: "Mot de passe",
    namePlaceholder: "Comment vous appeler ?",
    emailPlaceholder: "vous@email.com",
    passwordPlaceholder: "Au moins dix caractères",
    sending: "Un instant...",
    saveName: "Enregistrer",
    signedInAs: "Connecté en tant que {name}",
    notVerified:
      "Votre adresse e-mail n'est pas encore confirmée. Certaines choses restent fermées jusque-là.",
    welcome: "Bienvenue, {name}.",
    created: "Votre compte est prêt.",
    haveAccount: "Vous avez déjà un compte ?",
    noAccount: "Pas encore de compte ?",
    switchToSignIn: "Se connecter",
    switchToSignUp: "En créer un",
    errors: {

invalidHandle: "Un nom d’utilisateur fait de 3 à 30 caractères : lettres, chiffres, points, tirets et tirets bas.",
handleTaken: "Ce nom d’utilisateur est pris.",      invalidEmail: "Cela ne ressemble pas à une adresse e-mail.",
      weakPassword: "Utilisez au moins dix caractères.",
      invalidName: "Dites-nous comment vous appeler.",
      invalidPhoto: "Ce fichier n'est pas une image que nous pouvons utiliser.",
      invalidDate: "Ce n'est pas une date que nous pouvons utiliser.",
      emailTaken: "Il existe déjà un compte avec cette adresse.",
      wrongCredentials: "Cette adresse et ce mot de passe ne correspondent pas.",
      rate: "Trop de tentatives. Patientez un peu, puis réessayez.",
      server: "Un problème est survenu de notre côté. Réessayez.",
      invalid: "Il manquait quelque chose dans ce formulaire.",
      generic: "Cela n'a pas fonctionné. Réessayez.",
    },
  },

  ar: {
    title: "حسابك.",
    titleAccent: "",
    sub: "يتيح لك الحساب أن تكتب وأن تعلّق وأن تحتفظ بملفّ خاص بك. وهذه أوّل قطعة من المنصّة القادمة.",
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    signOut: "تسجيل الخروج",
    displayName: "الاسم",

    profileTitle: "ملفّك الشخصي.",
    profileSub: "هنا يقيم ملفّك الشخصي. ما تكتبه يظهر هنا، وهذه هي الصفحة التي يراها الناس.",
    yourPosts: "مقالاتك",
    yourPostsBody: "لا شيء هنا بعد. حين تكتب شيئًا سيظهر هنا.",

    settingsTitle: "الإعدادات.",
    settingsSub: "كيف تبدو المنصّة، وكيف تتحدّث.",
    appearance: "المظهر",
    light: "فاتح",
    dark: "داكن",
    system: "تلقائي",
    language: "اللغة",

    photo: "صورة الملفّ",
    changePhoto: "غيّر الصورة",
    removePhoto: "أزلها",
    banner: "الشعار العريض",
    dateOfBirth: "تاريخ الميلاد",
    dateOfBirthHint: "اختياري. يُعرض كعمر — أمّا التاريخ فلا يظهر للعامة أبدًا.",
    memberSince: "عضو منذ {date}",
    photoAlt: "صورة الملفّ الشخصي لـ{name}",

    identifier: "اسم المستخدم أو البريد",
    identifierPlaceholder: "اسم المستخدم، أو البريد الإلكتروني",
    handle: "اسم المستخدم",
    handlePlaceholder: "كيف تظهر، وكيف تسجّل الدخول",
    emailOptional: "البريد الإلكتروني (اختياري)",
    emailOptionalPlaceholder: "فقط إن أردت أن نُعلمك بشيء",    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    namePlaceholder: "بماذا نناديك؟",
    emailPlaceholder: "you@email.com",
    passwordPlaceholder: "عشرة أحرف على الأقل",
    sending: "لحظة من فضلك...",
    saveName: "احفظ",
    signedInAs: "مسجَّل الدخول باسم {name}",
    notVerified:
      "لم يُؤكَّد عنوان بريدك الإلكتروني بعد. تبقى بعض الأمور مغلقة إلى ذلك الحين.",
    welcome: "أهلًا بك، {name}.",
    created: "حسابك جاهز.",
    haveAccount: "لديك حساب بالفعل؟",
    noAccount: "ليس لديك حساب؟",
    switchToSignIn: "سجّل الدخول بدلًا من ذلك",
    switchToSignUp: "أنشئ حسابًا بدلًا من ذلك",
    errors: {

invalidHandle: "اسم المستخدم من ٣ إلى ٣٠ حرفًا: حروف وأرقام ونقاط وشرطات وشرطات سفلية.",
handleTaken: "اسم المستخدم هذا محجوز.",      invalidEmail: "لا يبدو هذا عنوان بريد إلكتروني.",
      weakPassword: "استخدم عشرة أحرف على الأقل.",
      invalidName: "أخبرنا بماذا نناديك.",
      invalidPhoto: "هذا الملف ليس صورة يمكننا استخدامها.",
      invalidDate: "هذه ليست تاريخًا يمكننا استخدامه.",
      emailTaken: "يوجد حساب بهذا العنوان بالفعل.",
      wrongCredentials: "العنوان وكلمة المرور لا يتطابقان.",
      rate: "محاولات كثيرة. انتظر قليلًا ثم أعد المحاولة.",
      server: "حدث خطأ من طرفنا. أعد المحاولة.",
      invalid: "نقص شيء في ذلك النموذج.",
      generic: "لم ينجح ذلك. أعد المحاولة.",
    },
  },
};
