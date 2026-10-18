import type { Slice } from "./types";

/** Dropouts page copy, in all three languages. */

export interface DropoutsCopy {
  hero: {
    eyebrow: string;
    chunks: { t: string; accent?: boolean }[];
    sub: string;
  };
  anotherChance: {
    titleLead: string;
    titleAccent: string;
    body1: string;
    body2: string;
    imageAlt: string;
    quote: string;
  };
  atfp: {
    agency: string;
    titleLead: string;
    titleAccent: string;
    titleTail: string;
    hint: string;
    fieldsLabel: string;
    levels: {
      code: string;
      name: string;
      body: string;
      fields: string;
      duration: string;
    }[];
  };
  secondChance: {
    kicker: string;
    statement: string;
    body: string;
  };
  apply: {
    title: string;
    sub: string;
    portals: { href: string; title: string; domain: string }[];
    steps: string[];
  };
  contact: {
    title: string;
    note: string;
  };
}

export const dropouts: Slice<DropoutsCopy> = {
  en: {
    hero: {
      eyebrow: "School dropouts",
      chunks: [
        { t: "Dropping out at 16 is not a burden. It is the sign of a " },
        { t: "new beginning", accent: true },
        { t: "." },
      ],
      sub: "This section is dedicated to students looking to build a future outside high school, through real vocational paths and second chance programs.",
    },
    anotherChance: {
      titleLead: "Give yourself",
      titleAccent: "another chance.",
      body1:
        "Dropping out often leads to unemployment among teens, but it does not mean you cannot build a consistent, stable future. A lot of people have incredible talents and are deeply creative.",
      body2:
        "Tunisia has real opportunities waiting for you. Through vocational training and second chance programs, you can build the future you deserve.",
      imageAlt: "Students building a new path",
      quote: "Dropping out is not the end, it is the start of a new path.",
    },
    atfp: {
      agency: "Agence Tunisienne de la Formation Professionnelle",
      titleLead: "The safest option: a certified qualification with",
      titleAccent: "real weight",
      titleTail: "in the job market.",
      hint: "Swipe to explore all four levels",
      fieldsLabel: "Fields",
      levels: [
        {
          code: "CC",
          name: "Certificat de Compétence",
          body: "Teaches practical skills that could get you through life in the future.",
          fields:
            "Sewing, Arc welding, Auto-body prep, House wiring, Bricklaying, Wall Tiling, Baking, Barbering",
          duration: "3 to 6 months",
        },
        {
          code: "CAP",
          name: "Certificat d'Aptitude Professionnelle",
          body: "Creates certified, well-trained workers ready to make their first steps into work life.",
          fields:
            "Mechanical, Automotive, Electricity, Electronics, HVAC, Plumbing, Metalwork, Textile, Fashion, IT, Administration, Hospitality, Culinary, Beauty, Crafts",
          duration: "2 years",
        },
        {
          code: "BTP",
          name: "Brevet de Technicien Professionnel",
          body: "Creates well-trained technicians able to solve high-level technical problems and even lead a team.",
          fields:
            "IT, Electronics, Automotive Mechanics, Civil Engineering, Accounting, Logistics, Fashion, Hospitality",
          duration: "2 years",
        },
        {
          code: "BTS",
          name: "Brevet de Technicien Supérieur",
          body: "Bridges the gap between engineers and field workers, almost like going to college.",
          fields:
            "IT, Cybersecurity, Biomedical Electronics, Smart Industrial Automation, HVAC Engineering, Civil Architectural Drafting, Business Management, International Commerce, Logistics, Fashion Design, Upscale Hospitality",
          duration: "2 years",
        },
      ],
    },
    secondChance: {
      kicker: "Second chances",
      statement: "It is never too late to reintegrate.",
      body: "Some people may regret dropping out, thinking there is no way back. Thankfully, Tunisia's Ministry of Education gives any young dropout the chance to reintegrate in second chance schools. It does not necessarily let you pick up exactly where you left off, but it helps you feel integrated and build a path to a bright future.",
    },
    apply: {
      title: "How to apply.",
      sub: "Both official portals follow the same process from account creation to registration.",
      portals: [
        {
          href: "https://www.atfp.tn",
          title: "ATFP Courses",
          domain: "takwin.atfp.tunis",
        },
        {
          href: "https://2emechance.education.tn/",
          title: "Second Chance Centers",
          domain: "2emechance.education.tn",
        },
      ],
      steps: [
        "Access the portal online",
        "Create an account",
        "Fill the form: personal info, ID, contact, guardian info, academic background, choose nearby centers",
        "Check regularly to see if you got accepted",
        "Choose the course you want to follow",
        "Submit your physical file: school certificate, birth certificate, and more",
        "Pay the registration fees",
        "Show up, work hard, and secure a good future",
      ],
    },
    contact: {
      title: "Questions about ATFP or second chances?",
      note: "Send us anything you want to know about ATFP programs or second chance schools, and we will get back to you. Honest reviews are welcome too.",
    },
  },

  fr: {
    hero: {
      eyebrow: "Décrochés scolaires",
      chunks: [
        { t: "Quitter l'école à 16 ans n'est pas une fatalité. C'est le signe d'un " },
        { t: "nouveau départ", accent: true },
        { t: "." },
      ],
      sub: "Cette section s'adresse aux élèves qui veulent construire un avenir en dehors du lycée, grâce à de vraies filières professionnelles et aux programmes de seconde chance.",
    },
    anotherChance: {
      titleLead: "Offrez-vous",
      titleAccent: "une seconde chance.",
      body1:
        "Abandonner l'école mène souvent au chômage chez les jeunes, mais cela ne veut pas dire que vous ne pourrez pas construire un avenir stable et durable. Beaucoup de gens ont des talents extraordinaires et sont profondément créatifs.",
      body2:
        "La Tunisie a de vraies opportunités qui vous attendent. Grâce à la formation professionnelle et aux programmes de seconde chance, vous pouvez construire l'avenir que vous méritez.",
      imageAlt: "Des élèves qui construisent un nouveau chemin",
      quote:
        "Abandonner l'école n'est pas une fin, c'est le début d'un nouveau chemin.",
    },
    atfp: {
      agency: "Agence Tunisienne de la Formation Professionnelle",
      titleLead: "L'option la plus sûre : une qualification certifiée avec un",
      titleAccent: "poids réel",
      titleTail: "sur le marché du travail.",
      hint: "Faites glisser pour découvrir les quatre niveaux",
      fieldsLabel: "Domaines",
      levels: [
        {
          code: "CC",
          name: "Certificat de Compétence",
          body: "Elle enseigne des compétences pratiques qui pourront vous servir toute la vie.",
          fields:
            "Couture, Soudure à l'arc, Préparation automobile, Électricité du bâtiment, Maçonnerie, Carrelage, Boulangerie, Coiffure",
          duration: "3 à 6 mois",
        },
        {
          code: "CAP",
          name: "Certificat d'Aptitude Professionnelle",
          body: "Elle forme des travailleurs certifiés et bien formés, prêts à faire leurs premiers pas dans le monde du travail.",
          fields:
            "Mécanique, Automobile, Électricité, Électronique, Climatisation, Plomberie, Métallerie, Textile, Mode, Informatique, Administration, Hôtellerie, Cuisine, Esthétique, Artisanat",
          duration: "2 ans",
        },
        {
          code: "BTP",
          name: "Brevet de Technicien Professionnel",
          body: "Elle forme des techniciens bien préparés, capables de résoudre des problèmes techniques complexes et même de diriger une équipe.",
          fields:
            "Informatique, Électronique, Mécanique automobile, Génie civil, Comptabilité, Logistique, Mode, Hôtellerie",
          duration: "2 ans",
        },
        {
          code: "BTS",
          name: "Brevet de Technicien Supérieur",
          body: "Elle comble l'écart entre ingénieurs et techniciens de terrain, presque comme des études supérieures.",
          fields:
            "Informatique, Cybersécurité, Électronique biomédicale, Automatisation industrielle intelligente, Génie climatique, Dessin technique du bâtiment, Gestion d'entreprise, Commerce international, Logistique, Stylisme, Hôtellerie haut de gamme",
          duration: "2 ans",
        },
      ],
    },
    secondChance: {
      kicker: "Seconde chance",
      statement: "Il n'est jamais trop tard pour réintégrer.",
      body: "Certains peuvent regretter leur décrochage, en pensant qu'il n'y a pas de retour possible. Heureusement, le ministère de l'Éducation en Tunisie offre à tout jeune décroché la chance de se réintégrer dans les écoles de seconde chance. Cela ne vous laisse pas forcément reprendre exactement là où vous vous étiez arrêté, mais cela vous aide à vous sentir intégré et à construire un chemin vers un avenir lumineux.",
    },
    apply: {
      title: "Comment candidater.",
      sub: "Les deux portails officiels suivent la même démarche, de la création du compte à l'inscription.",
      portals: [
        {
          href: "https://www.atfp.tn",
          title: "Formations ATFP",
          domain: "takwin.atfp.tunis",
        },
        {
          href: "https://2emechance.education.tn/",
          title: "Centres de seconde chance",
          domain: "2emechance.education.tn",
        },
      ],
      steps: [
        "Accédez au portail en ligne",
        "Créez un compte",
        "Remplissez le formulaire : informations personnelles, pièce d'identité, contact, informations du tuteur, parcours scolaire, et choisissez les centres proches de chez vous",
        "Consultez régulièrement la plateforme pour savoir si vous êtes accepté",
        "Choisissez la formation que vous souhaitez suivre",
        "Déposez votre dossier papier : attestation de scolarité, acte de naissance, et autres pièces",
        "Payez les frais d'inscription",
        "Présentez-vous, donnez-vous à fond, et construisez un avenir stable",
      ],
    },
    contact: {
      title: "Des questions sur l'ATFP ou la seconde chance ?",
      note: "Écrivez-nous tout ce que vous souhaitez savoir sur les formations ATFP ou les écoles de seconde chance, nous vous répondrons. Vos avis honnêtes sont les bienvenus aussi.",
    },
  },

  ar: {
    hero: {
      eyebrow: "المتسربون من الدراسة",
      chunks: [
        { t: "الانقطاع عن الدراسة في سن السادسة عشرة ليس عقبة، بل هو بداية " },
        { t: "مسار جديد", accent: true },
        { t: "." },
      ],
      sub: "هذا القسم مخصص للتلاميذ الذين يريدون بناء مستقبلهم خارج المدرسة، عبر مسارات مهنية حقيقية وبرامج العودة إلى الدراسة.",
    },
    anotherChance: {
      titleLead: "امنح نفسك",
      titleAccent: "فرصة ثانية.",
      body1:
        "الانقطاع عن الدراسة يقود غالباً إلى البطالة لدى الشباب، لكنه لا يعني أنك عاجز عن بناء مستقبل ثابت ومستقر. فالكثير من الناس يملكون مواهب استثنائية وإبداعاً عميقاً.",
      body2:
        "في تونس فرص حقيقية بانتظارك. عبر التكوين المهني وبرامج العودة إلى الدراسة، يمكنك بناء المستقبل الذي تستحقه.",
      imageAlt: "تلاميذ يبنون مساراً جديداً",
      quote: "الانقطاع ليس النهاية، بل بداية طريق جديد.",
    },
    atfp: {
      agency: "الوكالة التونسية للتكوين المهني",
      titleLead: "الخيار الأسلم: مؤهل معتمد ذو",
      titleAccent: "ثقل حقيقي",
      titleTail: "في سوق الشغل.",
      hint: "اسحب لاستكشاف المستويات الأربعة",
      fieldsLabel: "المجالات",
      levels: [
        {
          code: "CC",
          name: "شهادة الكفاءة",
          body: "تمنحك مهارات عملية ترافقك في حياتك لاحقاً.",
          fields:
            "الخياطة، اللحام بالأرك، هيكلة السيارات، التمديدات الكهربائية للعمارات، البناء بالطوب، تبليط الجدران، الخبز، الحلاقة",
          duration: "من 3 إلى 6 أشهر",
        },
        {
          code: "CAP",
          name: "شهادة الكفاءة المهنية",
          body: "تكوّن عمالاً مؤهلين ومتكوّنين، جاهزين لاتخاذ خطواتهم الأولى في عالم الشغل.",
          fields:
            "الميكانيك، هندسة السيارات، الكهرباء، الإلكترونيات، التكييف والتهوية، السباكة، اللحام والمعدن، النسيج، الأزياء، الإعلام الآلي، الإدارة، الفندقة، الطبخ، التجميل، الحرف",
          duration: "سنتان",
        },
        {
          code: "BTP",
          name: "شهادة التقني المهني",
          body: "تكوّن تقنيين أكفء قادرين على حلّ المسائل التقنية المعقّدة وعلى قيادة فريق أيضاً.",
          fields:
            "الإعلام الآلي، الإلكترونيات، ميكانيك السيارات، الهندسة المدنية، المحاسبة، اللوجستيك، الأزياء، الفندقة",
          duration: "سنتان",
        },
        {
          code: "BTS",
          name: "شهادة التقني العالي",
          body: "يردم الفجوة بين المهندسين والفنيين الميدانيين، تقريباً كما يفعل التعليم العالي.",
          fields:
            "الإعلام الآلي، الأمن السيبراني، الإلكترونيات الطبية، الأتمتة الصناعية الذكية، هندسة التكييف والتهوية، الرسم المعماري، تسيير الأعمال، التجارة الدولية، اللوجستيك، تصميم الأزياء، الفندقة الراقية",
          duration: "سنتان",
        },
      ],
    },
    secondChance: {
      kicker: "فرص ثانية",
      statement: "لم يفت الأوان أبداً لتعود إلى الدراسة.",
      body: "قد يندم بعض من تسرّبوا على الدراسة ظنّاً منهم أنه لا مفرّ من ذلك. لكن وزارة التربية الوطنية في تونس تمنح كل متسرّب شاب فرصة العودة إلى الدراسة في مدارس الفرص الثانية. لن تعود بالضرورة إلى النقطة التي توقّفت عندها بالضبط، لكنك ستشعر بأنك مندمج من جديد، وستبني طريقك نحو مستقبل مشرق.",
    },
    apply: {
      title: "كيف تقدّم على الترشّح.",
      sub: "تسير البوابتان الرسميتان على المسار نفسه، من إنشاء الحساب إلى التسجيل.",
      portals: [
        {
          href: "https://www.atfp.tn",
          title: "تكوين ATFP",
          domain: "takwin.atfp.tunis",
        },
        {
          href: "https://2emechance.education.tn/",
          title: "مراكز الفرص الثانية",
          domain: "2emechance.education.tn",
        },
      ],
      steps: [
        "ادخل إلى البوابة الإلكترونية",
        "أنشئ حساباً",
        "املأ الاستمارة: المعلومات الشخصية ورقم الهوية وبيانات الاتصال ومعلومات وليّ الأمر والمسار الدراسي، ثم اختر المراكز القريبة منك",
        "تابع المنصة بانتظام لمعرفة ما إذا تمّ قبولك",
        "اختر التكوين الذي تريد الالتحاق به",
        "سلّم ملفك الورقي: الشهادة المدرسية وشهادة الميلاد ووثائق أخرى",
        "أدفع رسوم التسجيل",
        "احضر، اجتهد، وابنِ مستقبلاً جيداً",
      ],
    },
    contact: {
      title: "أسئلة حول التكوين المهني أو الفرص الثانية؟",
      note: "راسلنا بكل ما تريد معرفته عن برامج التكوين المهني أو مدارس الفرص الثانية، وسنجيبك. كما نرحّب بآرائك الصريحة.",
    },
  },
};