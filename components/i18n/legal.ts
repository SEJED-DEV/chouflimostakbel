import type { Slice } from "./types";

/**
 * The legal pages, in all three languages.
 *
 * The copy is plain text with a little inline markup, so a translator never
 * has to touch code:
 *
 *   **bold**        the site name, or a word that needs weight
 *   {{site}}        the project's name, in bold
 *   {{email}}       the contact address, as a mailto link
 *   {{orientation}} the official orientation portal, as a link
 *
 * Everything else is a paragraph. A section with bullets carries a `bullets`
 * array; a section that ends with the publisher's card sets `publisher`.
 */

export interface LegalSection {
  title: string;
  /** Paragraphs. Support the inline markup described above. */
  paragraphs: string[];
  /** Bullet points, if the section has a list. */
  bullets?: string[];
  /** Renders the publisher card after the paragraphs. */
  publisher?: boolean;
}

export interface LegalDoc {
  /** Small label above the title. */
  eyebrow: string;
  title: string;
  /** "Last updated" - the date itself is appended by the page. */
  updatedLabel: string;
  sections: LegalSection[];
}

export interface LegalCopy {
  privacy: LegalDoc;
  terms: LegalDoc;
}

const en: LegalDoc = {
  eyebrow: "Legal",
  title: "Privacy Policy",
  updatedLabel: "Last updated",
  sections: [
    {
      title: "The short version",
      paragraphs: [
        "{{site}} is a free, public information site. We do not sell your data, we do not run advertising, and we do not track you across other websites. There is no account to create.",
      ],
    },
    {
      title: "What we collect",
      paragraphs: [
        "When you use the orientation score calculator, everything you type is processed entirely in your browser. Your marks are never transmitted to our servers and are never stored.",
        "If you send us a message through the contact form, we receive the name, email address and message you choose to provide, so that we can reply to you.",
      ],
    },
    {
      title: "Update notifications",
      paragraphs: [
        "If you turn on update notifications, your browser gives us a device token: a long string that identifies this device and nothing else. It is not linked to you, and we never ask for an email address or a name in order to send it.",
        "We keep that token, and the date you subscribed, for as long as notifications are on. Turning them off deletes the token immediately. We cannot see the notifications you receive, and we do not use the token for anything else.",
      ],
    },
    {
      title: "Language preference",
      paragraphs: [
        "We store your language choice (English, French or Arabic) in your browser's local storage so the site remembers it on your next visit. This never leaves your device.",
      ],
    },
    {
      title: "Cookies and analytics",
      paragraphs: [
        "We set no advertising or tracking cookies. If privacy-respecting analytics are used in future, they will be aggregate-only and this policy will be updated before they are enabled.",
      ],
    },
    {
      title: "Third-party links",
      paragraphs: [
        "We link to official Tunisian government sites such as the orientation portal. Once you follow a link, that site governs your data. We have no control over it.",
      ],
    },
    {
      title: "Your rights",
      paragraphs: [
        "You can ask us at any time to show, correct or delete the data we hold about you, to withdraw a message you sent, or to delete the notification token for this device. Write to {{email}}.",
      ],
    },
    {
      title: "Accuracy of information",
      paragraphs: [
        "The orientation calculator implements the formula published by the Tunisian Ministry of Higher Education. It is a reference tool, not an official one. Always confirm your final score on the official orientation portal.",
      ],
    },
    {
      title: "Publisher",
      paragraphs: [
        "{{site}} is published and maintained by the person below. They can be reached directly for any question about this site.",
      ],
      publisher: true,
    },
  ],
};

const termsEn: LegalDoc = {
  eyebrow: "Legal",
  title: "Terms of Service",
  updatedLabel: "Last updated",
  sections: [
    {
      title: "Acceptance",
      paragraphs: [
        "By using {{site}} you agree to these terms. If you do not agree, please stop using the site.",
      ],
    },
    {
      title: "What this site is for",
      paragraphs: [
        "{{site}} is a free educational guidance resource for Tunisian students. It publishes information about vocational training, high school divisions and university orientation.",
        "It is an independent project. It is not affiliated with, endorsed by, or operated on behalf of the Tunisian Ministry of Education or the Ministry of Higher Education.",
      ],
    },
    {
      title: "Not official guidance",
      paragraphs: [
        "The orientation score calculator is a reference tool built from the Ministry's published formula. It is not an official calculator, and its output has no legal or administrative value.",
        "Admission decisions rest entirely with the Ministry and the official orientation portal. Nothing on this site constitutes an admission offer, a guarantee of placement, or professional academic advice. Always verify on {{orientation}}.",
      ],
    },
    {
      title: "Changing the information",
      paragraphs: [
        "Programmes, coefficients, thresholds and admission rules change every academic year. We update this site as information becomes available, but we cannot guarantee that every detail is current at the moment you read it.",
      ],
    },
    {
      title: "Acceptable use",
      paragraphs: [
        "You may read, share and link to our content for personal, educational use. You may not:",
      ],
      bullets: [
        "present our content as your own;",
        "use the site for commercial resale;",
        "attempt to disrupt, overload or gain unauthorised access to the site.",
      ],
    },
    {
      title: "Limitation of liability",
      paragraphs: [
        'The site is provided "as is". To the fullest extent permitted by law we are not liable for any loss arising from reliance on the information published here, including admission outcomes.',
      ],
    },
    {
      title: "Contact",
      paragraphs: ["Questions about these terms: {{email}}"],
    },
    {
      title: "Publisher",
      paragraphs: [
        "{{site}} is published and maintained by the person below, who can be reached directly with any question about these terms.",
      ],
      publisher: true,
    },
  ],
};

export const legal: Slice<LegalCopy> = {
  en: {
    privacy: en,
    terms: termsEn,
  },
  fr: {
    privacy: {
      eyebrow: "Mentions légales",
      title: "Politique de confidentialité",
      updatedLabel: "Dernière mise à jour",
      sections: [
        {
          title: "En résumé",
          paragraphs: [
            "{{site}} est un site d'information gratuit et ouvert à tous. Nous ne vendons pas vos données, nous ne diffusons pas de publicité et nous ne vous suivons pas sur d'autres sites. Il n'y a aucun compte à créer.",
          ],
        },
        {
          title: "Ce que nous collectons",
          paragraphs: [
            "Lorsque vous utilisez le calculateur de score d'orientation, tout ce que vous saisissez est traité entièrement dans votre navigateur. Vos notes ne sont jamais transmises à nos serveurs et ne sont jamais conservées.",
            "Si vous nous envoyez un message via le formulaire de contact, nous recevons le nom, l'adresse e-mail et le message que vous choisissez de fournir, afin de pouvoir vous répondre.",
          ],
        },
        {
          title: "Notifications de mise à jour",
          paragraphs: [
            "Si vous activez les notifications de mise à jour, votre navigateur nous remet un jeton d'appareil : une longue chaîne qui identifie cet appareil et rien d'autre. Il n'est lié à aucun élément de votre identité, et nous ne vous demandons jamais une adresse e-mail ni un nom pour pouvoir l'envoyer.",
            "Nous conservons ce jeton, ainsi que la date de votre inscription, tant que les notifications sont activées. Les désactiver supprime le jeton immédiatement. Nous ne pouvons pas voir les notifications que vous recevez et nous n'utilisons ce jeton à aucune autre fin.",
          ],
        },
        {
          title: "Préférence de langue",
          paragraphs: [
            "Nous enregistrons votre choix de langue (anglais, français ou arabe) dans le stockage local de votre navigateur, afin que le site s'en souvienne à votre prochaine visite. Ces données ne quittent jamais votre appareil.",
          ],
        },
        {
          title: "Cookies et mesure d'audience",
          paragraphs: [
            "Nous ne déposons aucun cookie publicitaire ni de suivi. Si une mesure d'audience respectueuse de la vie privée est utilisée plus tard, elle sera uniquement agrégée et cette politique sera mise à jour avant son activation.",
          ],
        },
        {
          title: "Liens vers des sites tiers",
          paragraphs: [
            "Nous renvoyons vers des sites officiels du gouvernement tunisien, comme le portail d'orientation. Dès que vous suivez un lien, c'est ce site qui régit vos données. Nous n'avons aucun contrôle sur lui.",
          ],
        },
        {
          title: "Vos droits",
          paragraphs: [
            "Vous pouvez nous demander à tout moment d'afficher, de rectifier ou de supprimer les données que nous détenons sur vous, de retirer un message que vous avez envoyé, ou de supprimer le jeton de notification de cet appareil. Écrivez à {{email}}.",
          ],
        },
        {
          title: "Exactitude des informations",
          paragraphs: [
            "Le calculateur d'orientation applique la formule publiée par le ministère tunisien de l'Enseignement supérieur. C'est un outil de référence, et non un outil officiel. Vérifiez toujours votre score final sur le portail d'orientation officiel.",
          ],
        },
        {
          title: "Éditeur",
          paragraphs: [
            "{{site}} est publié et maintenu par la personne ci-dessous. Vous pouvez la joindre directement pour toute question relative à ce site.",
          ],
          publisher: true,
        },
      ],
    },
    terms: {
      eyebrow: "Mentions légales",
      title: "Conditions d'utilisation",
      updatedLabel: "Dernière mise à jour",
      sections: [
        {
          title: "Acceptation",
          paragraphs: [
            "En utilisant {{site}}, vous acceptez ces conditions. Si vous ne les acceptez pas, veuillez cesser d'utiliser le site.",
          ],
        },
        {
          title: "À quoi sert ce site",
          paragraphs: [
            "{{site}} est une ressource gratuite d'orientation éducative pour les étudiants tunisiens. Elle publie des informations sur la formation professionnelle, les filières du secondaire et l'orientation universitaire.",
            "Il s'agit d'un projet indépendant. Il n'est ni affilié, ni validé, ni exploité au nom du ministère tunisien de l'Éducation nationale ou du ministère de l'Enseignement supérieur.",
          ],
        },
        {
          title: "Un conseil non officiel",
          paragraphs: [
            "Le calculateur de score d'orientation est un outil de référence construit à partir de la formule publiée par le ministère. Ce n'est pas un calculateur officiel, et son résultat n'a aucune valeur juridique ou administrative.",
            "Les décisions d'admission relèvent entièrement du ministère et du portail d'orientation officiel. Rien sur ce site ne constitue une offre d'admission, une garantie de placement ni un avis professionnel d'orientation académique. Vérifiez toujours sur {{orientation}}.",
          ],
        },
        {
          title: "Évolution des informations",
          paragraphs: [
            "Les programmes, les coefficients, les seuils et les règles d'admission changent chaque année scolaire. Nous mettons ce site à jour au fur et à mesure que les informations deviennent disponibles, mais nous ne pouvons pas garantir que chaque détail soit à jour au moment où vous le lisez.",
          ],
        },
        {
          title: "Usage acceptable",
          paragraphs: [
            "Vous pouvez lire, partager et faire un lien vers notre contenu à des fins personnelles ou pédagogiques. Vous ne pouvez pas :",
          ],
          bullets: [
            "présenter notre contenu comme le vôtre ;",
            "utiliser le site à des fins de revente commerciale ;",
            "tenter de perturber, de saturer le site ou d'y accéder sans autorisation.",
          ],
        },
        {
          title: "Limitation de responsabilité",
          paragraphs: [
            "Le site est fourni « tel quel ». Dans toute la limite permise par la loi, nous ne sommes pas responsables des pertes résultant de la confiance accordée aux informations publiées ici, y compris les résultats d'admission.",
          ],
        },
        {
          title: "Contact",
          paragraphs: ["Questions sur ces conditions : {{email}}"],
        },
        {
          title: "Éditeur",
          paragraphs: [
            "{{site}} est publié et maintenu par la personne ci-dessous, que vous pouvez joindre directement pour toute question sur ces conditions.",
          ],
          publisher: true,
        },
      ],
    },
  },
  ar: {
    privacy: {
      eyebrow: "معلومات قانونية",
      title: "سياسة الخصوصية",
      updatedLabel: "آخر تحديث",
      sections: [
        {
          title: "باختصار",
          paragraphs: [
            "{{site}} موقع معلوماتي مجاني ومتاح للجميع. لا نبيع بياناتك، ولا ندير إعلانات، ولا نتتبّعك على مواقع أخرى. ولا حاجة إلى إنشاء أي حساب.",
          ],
        },
        {
          title: "ما الذي نجمعه",
          paragraphs: [
            "عند استخدامك حاسبة نقاط التوجيه، تُعالَج كل ما تكتبه بالكامل داخل متصفحك. لا تُنقل درجتك أبدًا إلى خوادمنا، ولا تُخزَّن.",
            "وإذا أرسلت لنا رسالة عبر استمارة الاتصال، نتلقّى الاسم والبريد الإلكتروني ونصّ الرسالة التي تختار تقديمها، حتى نتمكن من الرد عليك.",
          ],
        },
        {
          title: "إشعارات التحديث",
          paragraphs: [
            "إذا فعّلت إشعارات التحديث، يسلّم متصفحك رمز جهاز: سلسلة طويلة تعرّف هذا الجهاز ولا شيء غيره. وهو غير مرتبط بك، ولا نطلب منك أبدًا بريدًا إلكترونيًا ولا اسمًا من أجل إرساله.",
            "نحتفظ بهذا الرمز وبتاريخ اشتراكك ما دامت الإشعارات مفعّلة. ويؤدي إيقافها إلى حذف الرمز فورًا. لا يمكننا الاطلاع على الإشعارات التي تتلقّاها، ولا نستخدم الرمز لأي غرض آخر.",
          ],
        },
        {
          title: "تفضيل اللغة",
          paragraphs: [
            "نحفظ اختيارك للغة (الإنجليزية أو الفرنسية أو العربية) في التخزين المحلي لمتصفحك، ليتذكّر الموقع ذلك في زيارتك القادمة. لا تغادر هذه المعلومة جهازك أبدًا.",
          ],
        },
        {
          title: "ملفات تعريف الارتباط والتحليلات",
          paragraphs: [
            "لا نضع أي ملف تعريف ارتباط إعلاني أو تتبّعي. وإذا استُخدمت مستقبلًا تحليلات تحترم الخصوصية، فستكون مجمّعة فقط، وستُحدَّث سياسة الخصوصية هذه قبل تفعيلها.",
          ],
        },
        {
          title: "روابط إلى مواقع أخرى",
          paragraphs: [
            "نربط إلى مواقع حكومية تونسية رسمية مثل المنصّة الوطنية للتوجيه. وبمجرد اتباعك لأحد الروابط، تصبح بياناتك خاضعة لأحكام ذلك الموقع، ولا سبيل لدينا إلى السيطرة عليه.",
          ],
        },
        {
          title: "حقوقك",
          paragraphs: [
            "يمكنك أن تطلب منا في أي وقت عرض البيانات التي نحتفظ بها عنك أو تصحيحها أو حذفها، أو سحب رسالة أرسلتها، أو حذف رمز الإشعار الخاص بهذا الجهاز. اكتب إلينا على {{email}}.",
          ],
        },
        {
          title: "دقّة المعلومات",
          paragraphs: [
            "تطبّق حاسبة التوجيه الصيغة التي نشرتها وزارة التعليم العالي التونسية. وهي أداة مرجعية لا أداة رسمية. تحقّق دائمًا من نتيجتك النهائية على المنصّة الوطنية للتوجيه.",
          ],
        },
        {
          title: "الناشر",
          paragraphs: [
            "{{site}} يُنشر ويُدار من قِبل الشخص المذكور أدناه. ويمكن التواصل معه مباشرة لأي استفسار يخص هذا الموقع.",
          ],
          publisher: true,
        },
      ],
    },
    terms: {
      eyebrow: "معلومات قانونية",
      title: "شروط الاستخدام",
      updatedLabel: "آخر تحديث",
      sections: [
        {
          title: "القبول",
          paragraphs: [
            "باستخدامك {{site}} فإنك توافق على هذه الشروط. وإن لم توافق عليها، فيرجى التوقّف عن استخدام الموقع.",
          ],
        },
        {
          title: "غرض هذا الموقع",
          paragraphs: [
            "{{site}} مورد تعليمي مجاني يقدّم التوجيه للطلبة التونسيين. وينشر معلومات عن التكوين المهني وأقسام التعليم الثانوي والتوجيه الجامعي.",
            "وهو مشروع مستقل، لا يرتبط بوزارة التربية الوطنية التونسية ولا بوزارة التعليم العالي، ولا يحظى بتأييدهما ولا يُدار نيابة عنهما.",
          ],
        },
        {
          title: "توجيه غير رسمي",
          paragraphs: [
            "حاسبة نقاط التوجيه أداة مرجعية مبنية على الصيغة التي نشرتها الوزارة. وهي ليست حاسبة رسمية، ولا تحمل نتائجها أيّ قيمة قانونية أو إدارية.",
            "تقع قرارات القبول كليًا على عاتق الوزارة والمنصّة الوطنية للتوجيه. ولا يشكّل أيّ شيء في هذا الموقع عرضًا بالقبول، ولا ضمانًا للتوزيع، ولا توجيهًا أكاديميًا مهنيًا. تحقّق دائمًا على {{orientation}}.",
          ],
        },
        {
          title: "تغيّر المعلومات",
          paragraphs: [
            "تغيّر البرامج والمعاملات والنسب وقواعد القبول في كل سنة دراسية. ونحدّث هذا الموقع مع توفّر المعلومات، لكننا لا نستطيع أن نضمن أن يكون كل تفصيل محدَّثًا لحظة قراءتك له.",
          ],
        },
        {
          title: "الاستخدام المقبول",
          paragraphs: [
            "يمكنك قراءة محتوياتنا ومشاركتها والارتباط بها لأغراض شخصية أو تعليمية. ولا يمكنك:",
          ],
          bullets: [
            "أن تقدّم محتوياتنا على أنها من إنتاجك؛",
            "أن تستخدم الموقع لإعادة بيعه تجاريًا؛",
            "أن تحاول تعطيل الموقع أو إرهاقه أو الدخول إليه دون ترخيص.",
          ],
        },
        {
          title: "حدود المسؤولية",
          paragraphs: [
            "يُقدَّم الموقع «كما هو». وإلى أقصى حد يسمح به القانون، فإننا غير مسؤولين عن أي خسارة تنشأ عن الاعتماد على المعلومات المنشورة هنا، بما في ذلك نتائج القبول.",
          ],
        },
        {
          title: "الاتصال",
          paragraphs: ["أسئلة حول هذه الشروط: {{email}}"],
        },
        {
          title: "الناشر",
          paragraphs: [
            "{{site}} يُنشر ويُدار من قِبل الشخص المذكور أدناه، ويمكن التواصل معه مباشرة لأي سؤال يخص هذه الشروط.",
          ],
          publisher: true,
        },
      ],
    },
  },
};
