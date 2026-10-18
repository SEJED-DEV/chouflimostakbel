import type { Slice } from "./types";

/** Divisions page copy, in all three languages. */

/** One division card: name, pitch, pros, cons and the subjects it leans on. */
export interface DivisionItem {
  name: string;
  tagline: string;
  pros: string[];
  cons: string[];
  subjects: string[];
}

/** One segmented tab (2nd year / 3rd year) with its divisions. */
export interface DivisionTab {
  id: string;
  label: string;
  intro: string;
  items: DivisionItem[];
}

/**
 * Everything `<DivisionTabs />` needs to render. Kept as its own object so the
 * component stays a dumb renderer: all copy lives here, nothing is hardcoded.
 */
export interface DivisionTabsCopy {
  ariaLabel: string;
  prosLabel: string;
  consLabel: string;
  subjectsLabel: string;
  tabs: DivisionTab[];
}

export interface DivisionsCopy {
  hero: {
    eyebrow: string;
    chunks: { t: string; accent?: boolean }[];
    sub: string;
  };
  chooser: {
    title: string;
    body: string;
  } & DivisionTabsCopy;
  contact: {
    title: string;
    note: string;
  };
}

export const divisions: Slice<DivisionsCopy> = {
  en: {
    hero: {
      eyebrow: "HS divisions",
      chunks: [
        { t: "Being lost is totally " },
        { t: "normal", accent: true },
        { t: "." },
      ],
      sub: "This section is dedicated to students who do not know which division to choose. Here you will find advice and everything you need to know about every division.",
    },
    chooser: {
      title: "Choose wisely.",
      body: "In Tunisia the first year of high school is the same for every student. By the end of that year, students must make their first choice.",
      ariaLabel: "High school year",
      prosLabel: "Pros",
      consLabel: "Cons",
      subjectsLabel: "Major subjects",
      tabs: [
        {
          id: "second",
          label: "2nd Year",
          intro: "The first choice, made at the end of a common year.",
          items: [
            {
              name: "Sciences",
              tagline:
                "If you are interested in pursuing any STEM-related career, this is the division for you, one of the most flexible tracks.",
              pros: [
                "Extra year to decide your career path",
                "Highly competitive, motivating environment",
              ],
              cons: [
                "Requires hard work and logical reasoning",
                "High stress, not suitable for every student",
              ],
              subjects: [
                "Mathematics",
                "Physics & Chemistry",
                "Life & Earth Sciences",
                "Technology",
              ],
            },
            {
              name: "Computer Science",
              tagline:
                "Passionate about coding, digital logic, and building tech? Get an early head start into the digital world.",
              pros: [
                "Practical modern skills: algorithms and databases",
                "Interactive, like solving real-world puzzles",
              ],
              cons: [
                "Requires a strict, meticulous mindset",
                "Debugging during timed exams is very stressful",
              ],
              subjects: ["Algorithms & Programming", "ICT", "Mathematics", "Physics"],
            },
            {
              name: "Economics & Services",
              tagline:
                "Interested in how businesses operate, financial markets, and global events? This is the perfect branch for you.",
              pros: [
                "Immediately applicable to real-world situations",
                "Great balance of math without intense lab sciences",
              ],
              cons: [
                "Requires both math and strong writing skills",
                "Must balance calculations with long analytical essays",
              ],
              subjects: ["Economics", "Management", "Mathematics", "History-Geography"],
            },
            {
              name: "Literature",
              tagline:
                "For creative and critical thinkers who love reading, debating, and mastering languages.",
              pros: [
                "Master multiple languages and develop your voice",
                "Heavy analytical reading, discussion, self-expression",
              ],
              cons: [
                "Grading is highly subjective",
                "Grades depend on how convincingly you argue your points",
              ],
              subjects: ["Philosophy", "Arabic", "French", "English", "History-Geography"],
            },
          ],
        },
        {
          id: "third",
          label: "3rd Year",
          intro: "Sciences branch splits into specialized tracks.",
          items: [
            {
              name: "Mathematics",
              tagline:
                "For those with a deep love for logic and abstract reasoning, the golden key to elite universities.",
              pros: [
                "Highest priority for engineering, architecture, medicine",
                "Grade based strictly on objective reasoning",
              ],
              cons: [
                "Incredibly fast-paced and abstract",
                "Zero room for slacking, full dedication required",
              ],
              subjects: ["Advanced Mathematics", "Physics & Chemistry"],
            },
            {
              name: "Experimental Sciences",
              tagline:
                "Fascinated by biology, anatomy, and chemistry? Best foundation if your dream is medical school.",
              pros: [
                "Best path to medicine, pharmacy, dentistry, nursing",
                "Grounded in real-world observations, highly engaging",
              ],
              cons: [
                "Massive amount of memory retention required",
                "Must master huge volumes of scientific terminology",
              ],
              subjects: ["Life & Earth Sciences", "Physics & Chemistry", "Mathematics"],
            },
            {
              name: "Technical Sciences",
              tagline:
                "Prefer engineering labs and understanding how machines operate? This is your branch.",
              pros: [
                "Highly practical, schematics and automated logic",
                "Massive head start for civil or mechanical engineering",
              ],
              cons: [
                "Lab exams require absolute geometric precision",
                "Strong spatial visualization is essential",
              ],
              subjects: ["Technology (Mechanical & Electrical)", "Mathematics", "Physics"],
            },
            {
              name: "Sports",
              tagline:
                "An elite athlete who wants to turn their passion for athleticism into a structured academic career.",
              pros: [
                "Designed to balance training with education",
                "Opens paths to sports science, coaching, physical therapy",
              ],
              cons: [
                "Highly exclusive and physically exhausting",
                "Injury can completely disrupt your academic path",
              ],
              subjects: ["Physical Education Specialties", "Biological Sciences", "Anatomy"],
            },
          ],
        },
      ],
    },
    contact: {
      title: "Still unsure about your division?",
      note: "Send us anything you want to know about choosing your division, and we will get back to you. Honest reviews are welcome too.",
    },
  },

  fr: {
    hero: {
      eyebrow: "Les filières du lycée",
      chunks: [
        { t: "Se sentir perdu, c'est tout à fait " },
        { t: "normal", accent: true },
        { t: "." },
      ],
      sub: "Cette section est consacrée aux élèves qui ne savent pas encore quelle filière choisir. Vous y trouverez des conseils et tout ce qu'il faut savoir sur chaque filière.",
    },
    chooser: {
      title: "Choisissez en connaissance de cause.",
      body: "En Tunisie, la première année du lycée est la même pour tous les élèves. À la fin de cette année, chaque élève doit faire son premier choix.",
      ariaLabel: "Année du lycée",
      prosLabel: "Avantages",
      consLabel: "Inconvénients",
      subjectsLabel: "Matières principales",
      tabs: [
        {
          id: "second",
          label: "2ème année",
          intro: "Le premier choix, à la fin d'une année commune à tous.",
          items: [
            {
              name: "Sciences expérimentales",
              tagline:
                "Si vous visez une carrière liée aux sciences et aux technologies, c'est la filière qu'il vous faut : l'une des plus souples.",
              pros: [
                "Une année de plus pour préciser votre projet professionnel",
                "Un environnement exigeant et très motivant",
              ],
              cons: [
                "Exige un travail sérieux et un esprit logique",
                "Forte pression, pas adaptée à tous les élèves",
              ],
              subjects: [
                "Mathématiques",
                "Physique et chimie",
                "Sciences de la vie et de la Terre",
                "Technologie",
              ],
            },
            {
              name: "Informatique",
              tagline:
                "Passionné de programmation, de logique numérique et de création technologique ? Prenez une longueur d'avance dans le monde du numérique.",
              pros: [
                "Des compétences modernes et concrètes : algorithmes et bases de données",
                "Une matière interactive, comme des énigmes du réel",
              ],
              cons: [
                "Exige une rigueur et une méticulosité constantes",
                "Corriger ses erreurs pendant les examens chronométrés est très stressant",
              ],
              subjects: ["Algorithmique et programmation", "TIC", "Mathématiques", "Physique"],
            },
            {
              name: "Économie et gestion",
              tagline:
                "Ce qui vous intéresse, c'est le fonctionnement des entreprises, les marchés financiers et l'actualité mondiale ? Cette filière est faite pour vous.",
              pros: [
                "Directement applicable à des situations concrètes",
                "Un bon équilibre entre les mathématiques et sans sciences de laboratoire",
              ],
              cons: [
                "Exige les mathématiques et une solide expression écrite",
                "Doit alterner calculs et longues dissertations analytiques",
              ],
              subjects: ["Économie", "Gestion", "Mathématiques", "Histoire-Géographie"],
            },
            {
              name: "Lettres",
              tagline:
                "Pour les esprits créatifs et critiques qui aiment lire, débattre et maîtriser les langues.",
              pros: [
                "Maîtriser plusieurs langues et affirmer sa propre voix",
                "Beaucoup de lecture analytique, de débat et d'expression personnelle",
              ],
              cons: [
                "Une notation très subjective",
                "Les notes dépendent de la force de vos arguments",
              ],
              subjects: ["Philosophie", "Arabe", "Français", "Anglais", "Histoire-Géographie"],
            },
          ],
        },
        {
          id: "third",
          label: "3ème année",
          intro: "La filière Sciences se subdivise en filières spécialisées.",
          items: [
            {
              name: "Mathématiques",
              tagline:
                "Pour ceux qui aiment profondément la logique et le raisonnement abstrait : la clé d'or des grandes écoles.",
              pros: [
                "Priorité maximale pour l'ingénierie, l'architecture et la médecine",
                "Une note fondée uniquement sur un raisonnement objectif",
              ],
              cons: [
                "Un rythme extrêmement rapide et un contenu très abstrait",
                "Aucune marge pour se relâcher, une implication totale exigée",
              ],
              subjects: ["Mathématiques avancées", "Physique et chimie"],
            },
            {
              name: "Sciences expérimentales",
              tagline:
                "Fasciné par la biologie, l'anatomie et la chimie ? La meilleure base si votre rêve est la médecine.",
              pros: [
                "La meilleure voie vers la médecine, la pharmacie, la chirurgie dentaire et les soins infirmiers",
                "Fondée sur l'observation du réel, et très vivante",
              ],
              cons: [
                "Une mémoire énorme à mobiliser",
                "Un volume considérable de vocabulaire scientifique à maîtriser",
              ],
              subjects: ["Sciences de la vie et de la Terre", "Physique et chimie", "Mathématiques"],
            },
            {
              name: "Sciences techniques",
              tagline:
                "Vous préférez les laboratoires d'ingénierie et comprendre le fonctionnement des machines ? C'est votre filière.",
              pros: [
                "Très concrète : schémas et logique automatisée",
                "Un gain de temps décisif pour l'ingénierie civile ou mécanique",
              ],
              cons: [
                "Les examens de laboratoire exigent une précision géométrique absolue",
                "Une solide visualisation dans l'espace est indispensable",
              ],
              subjects: ["Technologie (mécanique et électrique)", "Mathématiques", "Physique"],
            },
            {
              name: "Sport",
              tagline:
                "Un athlète de haut niveau qui veut faire de sa passion du sport une carrière scolaire structurée.",
              pros: [
                "Conçue pour concilier entraînement et scolarité",
                "Ouvre des voies vers les sciences du sport, l'entraînement et la physiothérapie",
              ],
              cons: [
                "Très sélective et physiquement exigeante",
                "Une blessure peut complètement perturber votre parcours scolaire",
              ],
              subjects: ["Spécialités d'éducation physique", "Sciences biologiques", "Anatomie"],
            },
          ],
        },
      ],
    },
    contact: {
      title: "Toujours pas sûr de votre filière ?",
      note: "Envoyez-nous toutes vos questions sur le choix de la filière, et nous vous répondrons. Les avis honnêtes sont les bienvenus aussi.",
    },
  },

  ar: {
    hero: {
      eyebrow: "أقسام الثانوية",
      chunks: [
        { t: "أن تشعر بالتائه أمر " },
        { t: "طبيعي", accent: true },
        { t: " تمامًا." },
      ],
      sub: "هذا القسم موجّه إلى التلاميذ الذين لا يعرفون بعد أي قسم ينبغي أن يختاروا. ستجد هنا نصائح وكل ما تحتاج إلى معرفته عن كل قسم.",
    },
    chooser: {
      title: "اختر بعناية.",
      body: "في تونس تكون السنة الأولى من الثانوية موحّدة بالنسبة إلى جميع التلاميذ، وفي نهاية هذه السنة يتعيّن على التلميذ أن يتخذ أول قرار له.",
      ariaLabel: "سنة الدراسة في الثانوية",
      prosLabel: "الإيجابيات",
      consLabel: "السلبيات",
      subjectsLabel: "المواد الأساسية",
      tabs: [
        {
          id: "second",
          label: "السنة الثانية",
          intro: "القرار الأول، في نهاية سنة موحّدة للجميع.",
          items: [
            {
              name: "العلوم التجريبية",
              tagline:
                "إذا كنت مهتمًّا بمسار مهني مرتبط بالعلوم والتقنية، فهذا هو القسم الأنسب لك، وهو من أكثر المسارات مرونة.",
              pros: [
                "سنة إضافية لتحديد مسارك المهني",
                "بيئة دراسية تنافسية ومحفّزة",
              ],
              cons: [
                "يتطلب مجهودًا كبيرًا وتفكيرًا منطقيًا",
                "ضغط مرتفع، وليس مناسبًا لكل تلميذ",
              ],
              subjects: [
                "الرياضيات",
                "الفيزياء والكيمياء",
                "علوم الحياة والأرض",
                "التكنولوجيا",
              ],
            },
            {
              name: "الإعلامية",
              tagline:
                "شغوف بالبرمجة والمنطق الرقمي وبناء الحلول التقنية؟ خذ طول مسبق في عالم الرقمنة.",
              pros: [
                "مهارات حديثة وقابلة للتطبيق: الخوارزميات ومعطيات قواعد البيانات",
                "مادة تفاعلية، كأنك تحل ألغازًا من الواقع",
              ],
              cons: [
                "يتطلّب انضباطًا ودقة في التفاصيل",
                "معالجة الأخطاء أثناء الامتحانات الموقوتة مرهقة جدًا",
              ],
              subjects: ["الخوارزميات والبرمجة", "الإعلام الآلي", "الرياضيات", "الفيزياء"],
            },
            {
              name: "الاقتصاد والتسيير",
              tagline:
                "يهمّك كيف تعمل المؤسسات والأسواق المالية والأحداث العالمية؟ هذا القسم مناسب لك تمامًا.",
              pros: [
                "قابل للتطبيق فورًا في وضعيات واقعية",
                "توازن جيد بين الرياضيات وغياب العلوم المخبرية",
              ],
              cons: [
                "يتطلّب الرياضيات مع تعبير كتابي قوي",
                "يجب الموازنة بين الحسابات والمقالات التحليلية الطويلة",
              ],
              subjects: ["الاقتصاد", "التسيير", "الرياضيات", "التاريخ والجغرافيا"],
            },
            {
              name: "الآداب",
              tagline:
                "للمبدعين والنقّرين الذين يحبون القراءة والجدل وإتقان اللغات.",
              pros: [
                "إتقان عدّة لغات وتطوير صوتك الخاص",
                "قراءة تحليلية مكثّفة ونقاش وتعبير عن الذات",
              ],
              cons: [
                "التصحيح ذاتي إلى حد كبير",
                "العلامة تعتمد إلى حد بعيد على قوة حججك",
              ],
              subjects: ["الفلسفة", "العربية", "الفرنسية", "الإنجليزية", "التاريخ والجغرافيا"],
            },
          ],
        },
        {
          id: "third",
          label: "السنة الثالثة",
          intro: "ينقسم قسم العلوم إلى مسارات متخصّصة.",
          items: [
            {
              name: "الرياضيات",
              tagline:
                "لمن يعشق المنطق والتفكير المجرّد: المفتاح الذهبي نحو المدارس العليا المرموقة.",
              pros: [
                "أولوية قصوى للهندسة والعمارة والطب",
                "العلامة تقوم على الاستدلال الموضوعي وحده",
              ],
              cons: [
                "إيقاع سريع جدًا ومحتوى مجرّد إلى حد بعيد",
                "لا مجال للتراخي، والالتزام الكامل شرط",
              ],
              subjects: ["الرياضيات المتقدّمة", "الفيزياء والكيمياء"],
            },
            {
              name: "العلوم التجريبية",
              tagline:
                "شغوف بالأحياء والتشريح والكيمياء؟ أفضل أساس إذا كان حلمك دراسة الطب.",
              pros: [
                "أفضل طريق نحو الطب والصيدلة وطب الأسنان والتمريض",
                "تقوم على الملاحظة الواقعية وهي ممتعة جدًا",
              ],
              cons: [
                "تتطلّب الاحتفاظ بكميات هائلة من المعلومات",
                "يجب إتقان حجم كبير من المصطلحات العلمية",
              ],
              subjects: ["علوم الحياة والأرض", "الفيزياء والكيمياء", "الرياضيات"],
            },
            {
              name: "العلوم التقنية",
              tagline:
                "تفضّل مخابر الهندسة وفهم طريقة عمل الآلات؟ فهذا هو قسمك.",
              pros: [
                "طابع عملي كبير: المخططات والمنطق الآلي",
                "انطلاقة قوية جدًا نحو الهندسة المدنية أو الميكانيكية",
              ],
              cons: [
                "امتحانات المخبر تتطلّب دقة هندسية مطلقة",
                "التصوّر المكاني القوي ضروري",
              ],
              subjects: ["التكنولوجيا (الميكانيك والكهرباء)", "الرياضيات", "الفيزياء"],
            },
            {
              name: "الرياضة",
              tagline:
                "رياضي من الطراز الأول يريد تحويل شغفه بالرياضة إلى مسار دراسي منظّم.",
              pros: [
                "مُعدّة للموازنة بين التدريب والدراسة",
                "تفتح أبوابًا نحو علوم الرياضة والتدريب والعلاج الطبيعي",
              ],
              cons: [
                "انتقائي جدًا ومرهق بدنيًا",
                "قد تعرّض مسارك الدراسي للاضطراب كليًا بسبب إصابة",
              ],
              subjects: ["اختصاصات التربية البدنية", "العلوم البيولوجية", "التشريح"],
            },
          ],
        },
      ],
    },
    contact: {
      title: "ما زلت مترددًا في اختيار القسم؟",
      note: "أرسل لنا أي سؤال تريد معرفته عن اختيار القسم، وسنجيبك. كما نرحّب بأي آراء صادقة.",
    },
  },
};