import type { Slice } from "./types";

/**
 * Graduates page copy, in all three languages.
 *
 * The score calculator keeps its own strings (see `components/dictionaries.ts`)
 * and is deliberately excluded here.
 */

export interface GraduatesCopy {
  hero: {
    eyebrow: string;
    chunks: { t: string; accent?: boolean }[];
    sub: string;
  };
  tools: {
    title: string;
    titleAccent: string;
    body: string;
  };
  directory: {
    kicker: string;
    title: string;
    body: string;
    link: string;
  };
  mission: {
    quote: string;
    body: string;
    cta: string;
  };
  contact: {
    title: string;
    note: string;
  };
}

export const graduates: Slice<GraduatesCopy> = {
  en: {
    hero: {
      eyebrow: "Graduates",
      chunks: [{ t: "“What do you want to study after high school?”" }],
      sub: "This section is dedicated to graduates who do not know which path to follow. Not knowing the answer is okay.",
    },
    tools: {
      title: "We help you take",
      titleAccent: "the first steps.",
      body: "Choosing the most convenient path after graduating sounds challenging and a little confusing. One thing that confuses a lot of Tunisian graduates is how universities and colleges choose their students. We break it all down for you.",
    },
    directory: {
      kicker: "Program directory",
      title: "College Orientation Guide",
      body: "Once you know your score, explore every program that matches your profile and interests.",
      link: "orientation.tn",
    },
    mission: {
      quote: "Whether you stay in Tunisia or explore opportunities abroad, we walk with you through every first step.",
      body: "Choufli Mosta9bel provides teenagers with guidance, giving them the opportunity to express themselves and build the future they are most comfortable with. Your grades and what you love decide the offer, and we help you make the right decision.",
      cta: "Review HS divisions",
    },
    contact: {
      title: "Questions about university orientation?",
      note: "Ask us anything you want to know about university orientation or career paths, and we will get back to you. Honest reviews are welcome too.",
    },
  },

  fr: {
    hero: {
      eyebrow: "Bacheliers",
      chunks: [{ t: "« Que voulez-vous étudier après le Bac ? »" }],
      sub: "Cette section s'adresse aux bacheliers qui ne savent pas encore quel chemin suivre. Ne pas avoir la réponse, ce n'est pas grave.",
    },
    tools: {
      title: "Nous vous aidons à franchir",
      titleAccent: "les premières étapes.",
      body: "Choisir la filière la plus adaptée après le baccalauréat semble difficile, et un peu déroutant. Ce qui perd beaucoup de bacheliers tunisiens, c'est la manière dont les universités et les écoles sélectionnent leurs étudiants. Nous vous expliquons tout ça clairement.",
    },
    directory: {
      kicker: "Annuaire des filières",
      title: "Guide d'orientation des études supérieures",
      body: "Une fois votre score d'orientation connu, explorez toutes les filières qui correspondent à votre profil et à vos centres d'intérêt.",
      link: "orientation.tn",
    },
    mission: {
      quote: "Que vous restiez en Tunisie ou que vous exploriez les opportunités à l'étranger, nous vous accompagnons à chaque première étape.",
      body: "Choufli Mosta9bel offre aux adolescents un accompagnement, en leur laissant la possibilité de s'exprimer et de construire l'avenir dans lequel ils se sentent le mieux. Vos notes et vos goûts déterminent les offres, et nous vous aidons à faire le bon choix.",
      cta: "Voir les filières du secondaire",
    },
    contact: {
      title: "Des questions sur l'orientation universitaire ?",
      note: "Posez-nous toutes vos questions sur l'orientation universitaire ou les parcours professionnels, nous vous répondrons. Les avis sincères sont les bienvenus aussi.",
    },
  },

  ar: {
    hero: {
      eyebrow: "خريجو البكالوريا",
      chunks: [{ t: "« ماذا تريد أن تدرس بعد البكالوريا؟ »" }],
      sub: "هذا القسم مخصص لمن لا يعرف بعد أي طريق يسير. عدم معرفة الإجابة ليس عيبًا.",
    },
    tools: {
      title: "نساعدك على اتخاذ",
      titleAccent: "الخطوات الأولى.",
      body: "قد يبدو اختيار المسار الأنسب بعد البكالوريا صعبًا ومربكًا في آن. وأكثر ما يربك الخريجين التونسيين هو طريقة اختيار الجامعات والمؤسسات لطلابها. نشرح لك كل ذلك بالتفصيل.",
    },
    directory: {
      kicker: "دليل البرامج والتخصصات",
      title: "دليل توجيه التعليم العالي",
      body: "بعد أن تعرف نقاطك، تصفّح جميع التخصصات التي تناسب ملفك واهتماماتك.",
      link: "orientation.tn",
    },
    mission: {
      quote: "سواء بقيت في تونس أو استكشفت الفرص في الخارج، نرافقك في كل خطوة أولى.",
      body: "يوفّر «شوفلي مستقبلك» المرافقة والتوجيه للمراهقين، ويتيح لهم التعبير عن أنفسهم وبناء المستقبل الذي يناسبهم أكثر. نتائجك واهتماماتك هما ما يحدّد العروض المتاحة، ونعاونك على اتخاذ القرار المناسب.",
      cta: "استعرض أقسام التعليم الثانوي",
    },
    contact: {
      title: "أسئلة حول التوجيه الجامعي؟",
      note: "اسألنا عن أي شيء تريد معرفته في التوجيه الجامعي أو المسارات المهنية، وسنجيبك. كما نرحّب بالآراء الصريحة.",
    },
  },
};