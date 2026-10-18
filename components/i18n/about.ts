import type { Slice } from "./types";

/** About page copy, in all three languages. */

export interface AboutCopy {
  hero: {
    eyebrow: string;
    chunks: { t: string; accent?: boolean }[];
    sub: string;
  };
  who: {
    title: string;
    p1: string;
    p2: string;
  };
  values: { title: string; body: string }[];
  contactLine: {
    email: string;
    madeIn: string;
  };
  contactTitle: string;
  contactNote: string;
}

export const about: Slice<AboutCopy> = {
  en: {
    hero: {
      eyebrow: "About Choufli Mosta9bel",
      chunks: [
        { t: "We help you build the " },
        { t: "future you choose", accent: true },
        { t: "." },
      ],
      sub: "A guidance project for Tunisian youth - helping dropouts, undecided students, and graduates find real, practical paths to a stable future.",
    },
    who: {
      title: "Who we are.",
      p1: "Choufli Mosta9bel means \"look to your future.\" We are a free guidance resource built for the moments when the next step is unclear: choosing a high school division, restarting after dropping out, or picking a path after the Bac.",
      p2: "We gather the real options - ATFP certifications, second chance schools, division breakdowns, and official score tools - and lay them out honestly so you can decide with confidence.",
    },
    values: [
      {
        title: "Real paths, not platitudes",
        body: "Every program, score tool, and division we point to is a concrete next step you can actually take - not vague encouragement.",
      },
      {
        title: "Honest guidance",
        body: "We say what is hard as well as what is hopeful. Pros come with cons, and choices come with tradeoffs.",
      },
      {
        title: "For everyone's starting point",
        body: "With or without a Bac, in school or out of it, staying in Tunisia or going abroad - there is a path worth building.",
      },
    ],
    contactLine: {
      email: "contact@chouflimostakbel.tn",
      madeIn: "Made in Tunisia.",
    },
    contactTitle: "Get in touch.",
    contactNote:
      "Send us anything you want to know about programs, divisions, or next steps - and we will get back to you. Honest reviews are welcome too.",
  },

  fr: {
    hero: {
      eyebrow: "À propos de Choufli Mosta9bel",
      chunks: [
        { t: "Nous vous aidons à construire " },
        { t: "l'avenir que vous choisissez", accent: true },
        { t: "." },
      ],
      sub: "Un projet d'orientation pour la jeunesse tunisienne - aider les décrochés, les élèves indécis et les bacheliers à trouver des chemins concrets vers un avenir stable.",
    },
    who: {
      title: "Qui sommes-nous.",
      p1: "Choufli Mosta9bel signifie « regarde ton avenir ». Nous sommes une ressource d'orientation gratuite, pensée pour les moments où la prochaine étape n'est pas claire : choisir une filière, recommencer après un décrochage, ou choisir une voie après le Bac.",
      p2: "Nous réunissons les options réelles - certifications ATFP, écoles de seconde chance, comparatifs de filières et outils de score - et les présentons honnêtement pour que vous décidiez en confiance.",
    },
    values: [
      {
        title: "Des chemins réels, pas des platitudes",
        body: "Chaque formation, outil de score et filière que nous indiquons est une étape concrète que vous pouvez réellement franchir - pas de simples encouragements.",
      },
      {
        title: "Un conseil honnête",
        body: "Nous disons ce qui est difficile autant que ce qui est prometteur. Les avantages viennent avec les inconvénients, et les choix avec leurs compromis.",
      },
      {
        title: "Pour tous les points de départ",
        body: "Avec ou sans Bac, à l'école ou dehors, en restant en Tunisie ou à l'étranger - il y a toujours un chemin qui mérite d'être construit.",
      },
    ],
    contactLine: {
      email: "contact@chouflimostakbel.tn",
      madeIn: "Fait en Tunisie.",
    },
    contactTitle: "Contactez-nous.",
    contactNote:
      "Envoyez-nous ce que vous voulez savoir sur les formations, les filières ou les prochaines étapes - et nous vous répondrons. Les avis sincères sont les bienvenus.",
  },

  ar: {
    hero: {
      eyebrow: "عن شوفلي مستقبلك",
      chunks: [
        { t: "نساعدك على بناء " },
        { t: "المستقبل الذي تختاره", accent: true },
        { t: "." },
      ],
      sub: "مشروع إرشاد للشباب التونسي - يساعد المتسربين من الدراسة والتلاميذ غير الحسمين والخريجين على إيجاد طرق حقيقية نحو مستقبل مستقر.",
    },
    who: {
      title: "من نحن.",
      p1: "شوفلي مستقبلك يعني «انظر إلى مستقبلك». نحن مصدر إرشاد مجاني، صُمّم للحظات التي تكون فيها الخطوة التالية غير واضحة: اختيار قسم في الثانوية، أو البدء من جديد بعد الانقطاع، أو اختيار طريق بعد البكالوريا.",
      p2: "نجمع الخيارات الحقيقية - شهادات التكوين المهني، ومدارس الفرصة الثانية، ومقارنات الأقسام، وأدوات السكور - ونعرضها بصدق لتقرر بثقة.",
    },
    values: [
      {
        title: "طرق حقيقية، لا كلام فارغ",
        body: "كل برنامج أو أداة سكور أو قسم نشير إليه هو خطوة ملموسة يمكنك اتخاذها فعلاً - ليست مجرد تشجيع.",
      },
      {
        title: "إرشاد صادق",
        body: "نقول ما هو صعب أيضاً بقدر ما نقول ما هو مبهج. الإيجابيات تأتي مع السلبيات، والخيارات تأتي مع تنازلاتها.",
      },
      {
        title: "لكل نقطة انطلاق",
        body: "مع البكالوريا أو بدونها، في المدرسة أو خارجها، في تونس أو في الخارج - هناك دائماً طريق يستحق البناء.",
      },
    ],
    contactLine: {
      email: "contact@chouflimostakbel.tn",
      madeIn: "صنع في تونس.",
    },
    contactTitle: "تواصل معنا.",
    contactNote:
      "أرسل لنا ما تريد معرفته عن البرامج أو الأقسام أو الخطوات القادمة - وسنجيبك. الآراء الصادقة مرحب بها.",
  },
};
