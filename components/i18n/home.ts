import type { Slice } from "./types";

/** Home page copy, in all three languages. */

export interface HomeCopy {
  hero: {
    eyebrow: string;
    chunks: { t: string; accent?: boolean }[];
    sub: string;
    cta: string;
  };
  paths: {
    title: string;
    titleAccent: string;
    dropouts: { kicker: string; title: string; body: string };
    divisions: { kicker: string; title: string; body: string };
    graduates: { kicker: string; title: string; body: string };
    explore: string;
  };
  manifesto: {
    quote: string;
    body: string;
    cta: string;
  };
}

export const home: Slice<HomeCopy> = {
  en: {
    hero: {
      eyebrow: "Guidance for Tunisian youth",
      chunks: [
        { t: "Build a " },
        { t: "consistent future", accent: true },
        { t: ", no matter where you start." },
      ],
      sub: "Choufli Mosta9bel helps school dropouts, undecided students, and graduates find real, practical paths to a stable future.",
      cta: "Find your path",
    },
    paths: {
      title: "Three audiences.",
      titleAccent: "One mission.",
      dropouts: {
        kicker: "ATFP and second chances",
        title: "School Dropout",
        body: "Discover ATFP programs and second chances. Dropping out is not the end, it is the start of a new path.",
      },
      divisions: {
        kicker: "Before 2nd year",
        title: "HS Student",
        body: "Understand every division before choosing, with advice on pros, cons, and major subjects.",
      },
      graduates: {
        kicker: "Tunisia and abroad",
        title: "Graduate",
        body: "Opportunities in Tunisia and abroad, based on what you love and your grades.",
      },
      explore: "Explore",
    },
    manifesto: {
      quote: "“Where you find offers that ensure you a good future.”",
      body: "Choufli Mosta9bel is where you will find solutions, helping you build a future to live individually and work with or without a Bac. We provide teenagers with guidance, giving them the opportunity to express themselves and build the future they are most comfortable with.",
      cta: "Start with the dropout guide",
    },
  },

  fr: {
    hero: {
      eyebrow: "Orientation pour la jeunesse tunisienne",
      chunks: [
        { t: "Construisez un " },
        { t: "avenir stable", accent: true },
        { t: ", d'où que vous partiez." },
      ],
      sub: "Choufli Mosta9bel aide les décrochés scolaires, les élèves indécis et les bacheliers à trouver des chemins concrets vers un avenir stable.",
      cta: "Trouvez votre voie",
    },
    paths: {
      title: "Trois publics.",
      titleAccent: "Une mission.",
      dropouts: {
        kicker: "ATFP et seconde chance",
        title: "Décroché scolaire",
        body: "Découvrez les formations ATFP et les solutions de seconde chance. Abandonner l'école n'est pas la fin, c'est le début d'un nouveau chemin.",
      },
      divisions: {
        kicker: "Avant la 2ème année",
        title: "Élève au lycée",
        body: "Comprenez chaque filière avant de choisir, avec des conseils sur les avantages, les inconvénients et les matières principales.",
      },
      graduates: {
        kicker: "Tunisie et à l'étranger",
        title: "Bachelier",
        body: "Des opportunités en Tunisie et à l'étranger, selon ce que vous aimez et vos résultats.",
      },
      explore: "Découvrir",
    },
    manifesto: {
      quote: "« Là où vous trouvez des offres qui vous assurent un avenir. »",
      body: "Choufli Mosta9bel est l'endroit où vous trouverez des solutions, pour vous aider à construire un avenir où vivre et travailler, avec ou sans Bac. Nous orientons les adolescents, en leur laissant l'occasion de s'exprimer et de construire l'avenir qui leur convient le mieux.",
      cta: "Commencez par le guide des décrochés",
    },
  },

  ar: {
    hero: {
      eyebrow: "إرشاد للشباب التونسي",
      chunks: [
        { t: "ابنِ " },
        { t: "مستقبلًا مستقرًا", accent: true },
        { t: "، مهما كانت نقطتك البداية." },
      ],
      sub: "يساعد «شوفلي مستقبلك» المتسربين من الدراسة والتلاميذ غير الحسمين والخريجين على إيجاد طرق حقيقية نحو مستقبل مستقر.",
      cta: "اعثر على طريقك",
    },
    paths: {
      title: "ثلاث فئات.",
      titleAccent: "رسالة واحدة.",
      dropouts: {
        kicker: "التكوين المهني وفرص ثانية",
        title: "متسرب من الدراسة",
        body: "اكتشف برامج التكوين المهني وفرص العودة إلى الدراسة. الانقطاع ليس النهاية، بل بداية طريق جديد.",
      },
      divisions: {
        kicker: "قبل السنة الثانية",
        title: "تلميذ في الثانوي",
        body: "افهم كل قسم قبل أن تختار، مع نصائح حول الإيجابيات والسلبيات والمواد الأساسية.",
      },
      graduates: {
        kicker: "تونس والخارج",
        title: "خريج البكالوريا",
        body: "فرص في تونس وخارجها، حسب ما تحبه ونتائجك.",
      },
      explore: "اكتشف",
    },
    manifesto: {
      quote: "« حيث تجد عروضاً تضمن لك مستقبلاً جيداً »",
      body: "شوفلي مستقبلك هو المكان الذي تجد فيه الحلول، يساعدك على بناء مستقبل تعيش فيه وتعمل، مع الشهادة أو بدونها. نوجه المراهقين، ونتيح لهم التعبير عن أنفسهم وبناء المستقبل الذي يناسبهم أكثر.",
      cta: "ابدأ بدليل المتسربين",
    },
  },
};
