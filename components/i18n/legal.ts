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
        "{{site}} is a free, public information site. We do not sell your data, we do not run advertising, and we do not track you across other websites.",
        "You can use the whole site without an account. If you choose to make one - and most of the site does not need you to - we hold what you give us, and this page says what that is.",
      ],
    },
    {
      title: "What we collect",
      paragraphs: [
        "When you use the orientation score calculator, everything you type is processed entirely in your browser. Your marks are never transmitted to our servers and are never stored.",
        "If you send us a message through the contact form, we receive the name, email address and message you choose to provide, so that we can reply to you.",
        "If you make an account, we hold what the next four sections describe.",
      ],
    },
    {
      title: "The account you can make",
      paragraphs: [
        "An account is a username and a password. The username is called a handle, and it is how you appear and how you sign in. An email address is not required, and we never ask for one.",
        "If you make an account, we store: your handle, the display name you chose, the date you joined, your password (hashed by the authentication system - we cannot read it), and anything you add to your profile afterwards, such as a photograph, a banner or a date of birth.",
        "Your photograph and your banner are cropped and compressed in your own browser before they are sent, and they are stored on your profile row as part of the record. They are not uploaded to an image host.",
      ],
    },
    {
      title: "The address the site makes up for you",
      paragraphs: [
        "The authentication system insists on holding an email address, so the site gives it one built from your handle - something like `yourname@users.chouflimostakbel.tn`. You never see this address, nothing is ever sent to it, and it is not a real mailbox.",
        "If you give us a real address, it is optional and it is stored separately, under your profile rather than inside the account. The platform does not need it, and we do not send anything to it either.",
      ],
    },
    {
      title: "What you write",
      paragraphs: [
        "If you write a post, we store its title, its text, a short summary, any tags you put on it, whether it is a draft or published, and when it was written and published.",
        "A draft is visible to you and to nobody else. Once a post is published its date is fixed and does not move, so an edited post does not look freshly posted.",
        "The byline on a post - your name, your photograph, your badges - is copied from your account by the database itself, not by the page you are reading it on. This is why nobody can post under somebody else's name.",
      ],
    },
    {
      title: "Badges",
      paragraphs: [
        "Some accounts carry badges: leadership, developer, staff, contributor, and one marked secret. They are granted by the platform and they cannot be granted by the person holding the account. If a reader could write a badge into their own record, the badge would mean nothing.",
        "Your badges are shown next to your name on your public page and on your posts.",
      ],
    },
    {
      title: "The moment you agreed to these terms",
      paragraphs: [
        "When you sign in or sign up, you are asked to agree to these terms and the privacy policy. The moment you agreed is recorded once, on your account, and it is not shown anywhere on the site. It is recorded so that the question of whether you agreed can still be answered months later.",
      ],
    },
    {
      title: "What is public, and what is not",
      paragraphs: [
        "Your account row is closed to everyone else. An address, a date of birth and the record of your agreement are not public, and there is no public list that contains them.",
        "What is public is a separate, smaller view: your handle, your display name, your photograph, your banner, your badges, the date you joined, and how much you have published. A reader who asks that view for your email address gets an error, because the address is not in it.",
        "You appear in that view only once you have published something. Before that you have no public page, and nothing on the site links to you.",
      ],
    },
    {
      title: "What the staff can see",
      paragraphs: [
        "The people who run the platform have an admin panel. It shows every account, everything that has been written, and who holds which badge. The panel does not show an email address or a date of birth.",
        "We tell you the rest of it plainly: a staff member with access to the server's database can read those columns, because the panel reads the accounts table with a key that is not subject to the same access rules as everybody else. That is a fact about the system and not an intention, and you are entitled to know it.",
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
        "You can close your account. Closing it removes your profile, your posts and your handle, and it cannot be undone. The posts you published are removed with it.",
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
        "By signing in or signing up you agree to these terms and to the privacy policy. We ask for that agreement at the point where it means something, and we record when you gave it.",
        "If you do not agree, please stop using the site. Everything here - the guides, the score calculator, the community - can be read without an account.",
      ],
    },
    {
      title: "What this site is for",
      paragraphs: [
        "{{site}} is a free educational guidance resource for Tunisian students. It publishes information about vocational training, high school divisions and university orientation.",
        "It is also a place where readers write. The community is for people who have something to say about school, orientation and what comes after - and it is written by readers, not by us.",
        "It is an independent project. It is not affiliated with, endorsed by, or operated on behalf of the Tunisian Ministry of Education or the Ministry of Higher Education.",
      ],
    },
    {
      title: "Your account",
      paragraphs: [
        "Your handle is your identity here. It is how you appear, how you sign in, and how people find you - and it cannot be changed afterwards, because the address the platform built for it is tied to it. Choose it as if it were permanent, because it is.",
        "Your password is yours. We store it hashed and cannot read it.",
        "You are responsible for what happens under your account, and you are the only person who can write under your handle.",
      ],
    },
    {
      title: "What you publish",
      paragraphs: [
        "What you write stays yours. You keep ownership of it, and you grant us permission to publish it here - that is what makes it visible to other readers.",
        "You can delete a post at any time, and deleting one is permanent. There is no archive and no undelete.",
        "The byline on your post is a fact about your account, not a field you fill in. Nobody can post under somebody else's name, and you cannot remove your own name from what you wrote.",
      ],
    },
    {
      title: "Badges",
      paragraphs: [
        "Some accounts carry badges. They are granted by the platform, they cannot be granted by the account holder, and they can be taken away. A badge says the platform has decided something about who you are - it is not a decoration you chose for yourself.",
      ],
    },
    {
      title: "Private messages, and files on a post",
      paragraphs: [
        "Both of these are planned and neither is built yet. We say here what we have decided, because a promise about privacy is worth something when it is made before the feature exists, and worth nothing when it is made after.",
        "Messages between two people will be private, and nobody here will read them by default. A participant will be able to report a conversation, and a report will hand that one conversation to the moderators and nothing else. Private does not mean unaccountable - it means accountable to the person you are talking to, and to the law, and to nobody else.",
        "Images and files attached to a post will be stored with a size limit and a short list of allowed types. Video will come later, if the cost of carrying it is one the platform can carry.",
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
        "You may read, share and link to our content for personal, educational use. You may write and publish posts of your own. You may not:",
      ],
      bullets: [
        "present our content as your own;",
        "publish someone else's writing, or a photograph that is not yours, as if it were;",
        "impersonate another person, or publish a badge you were not granted;",
        "publish unlawful material, or material that harasses or threatens anyone;",
        "use the site for commercial resale;",
        "attempt to disrupt, overload or gain unauthorised access to the site.",
      ],
    },
    {
      title: "Moderation, and what is not built yet",
      paragraphs: [
        "At the moment anyone with an account may publish, with no approval queue. We have not built a report button yet, and we have not built the queue that would go with it, so there is currently no way for a reader to report a post to us.",
        "We would rather say that plainly than describe a moderation system that does not exist. It is on the published roadmap, and it will be built before anyone is told to rely on it.",
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
            "{{site}} est un site d'information gratuit et ouvert à tous. Nous ne vendons pas vos données, nous ne diffusons pas de publicité et nous ne vous suivons pas sur d'autres sites.",
            "Vous pouvez utiliser tout le site sans compte. Si vous choisissez d'en créer un - et l'essentiel du site n'en a pas besoin - nous conservons ce que vous nous donnez, et cette page dit quoi.",
          ],
        },
        {
          title: "Ce que nous collectons",
          paragraphs: [
            "Lorsque vous utilisez le calculateur de score d'orientation, tout ce que vous saisissez est traité entièrement dans votre navigateur. Vos notes ne sont jamais transmises à nos serveurs et ne sont jamais conservées.",
            "Si vous nous envoyez un message via le formulaire de contact, nous recevons le nom, l'adresse e-mail et le message que vous choisissez de fournir, afin de pouvoir vous répondre.",
            "Si vous créez un compte, nous conservons ce que décrivent les quatre sections suivantes.",
          ],
        },
        {
          title: "Le compte que vous pouvez créer",
          paragraphs: [
            "Un compte, c'est un nom d'utilisateur et un mot de passe. Le nom d'utilisateur s'appelle un identifiant, et c'est ainsi que vous apparaissez et que vous vous connectez. Une adresse e-mail n'est pas requise, et nous n'en demandons jamais.",
            "Si vous créez un compte, nous conservons : votre identifiant, le nom d'affichage que vous avez choisi, la date de votre inscription, votre mot de passe (haché par le système d'authentification - nous ne pouvons pas le lire), et ce que vous ajoutez ensuite à votre profil, comme une photo, une bannière ou une date de naissance.",
            "Votre photo et votre bannière sont recadrées et compressées dans votre propre navigateur avant d'être envoyées, et elles sont conservées sur la ligne de votre profil. Elles ne sont pas envoyées à un hébergeur d'images.",
          ],
        },
        {
          title: "L'adresse que le site invente pour vous",
          paragraphs: [
            "Le système d'authentification exige de détenir une adresse e-mail, alors le site lui en donne une construite à partir de votre identifiant - quelque chose comme `votrenom@users.chouflimostakbel.tn`. Vous ne voyez jamais cette adresse, rien n'y est jamais envoyé, et ce n'est pas une vraie boîte aux lettres.",
            "Si vous nous donnez une adresse réelle, elle est facultative et conservée à part, sous votre profil plutôt qu'à l'intérieur du compte. La plateforme n'en a pas besoin, et nous n'y envoyons rien non plus.",
          ],
        },
        {
          title: "Ce que vous écrivez",
          paragraphs: [
            "Si vous écrivez un article, nous conservons son titre, son texte, un court résumé, les étiquettes que vous y mettez, s'il est brouillon ou publié, et quand il a été écrit et publié.",
            "Un brouillon n'est visible que par vous. Une fois publié, sa date est fixée et ne bouge plus, pour qu'un article modifié ne paraisse pas chargé d'une relye.",
            "La signature d'un article - votre nom, votre photo, vos badges - est copiée depuis votre compte par la base de données elle-même, et non par la page que vous la lisez. C'est pourquoi personne ne peut publier sous le nom de quelqu'un d'autre.",
          ],
        },
        {
          title: "Les badges",
          paragraphs: [
            "Certains comptes portent des badges : direction, développeur, équipe, contributeur, et un autre marqué secret. Ils sont accordés par la plateforme et ne peuvent pas être accordés par la personne qui porte le compte. Si un lecteur pouvait écrire un badge dans son propre dossier, le badge ne voudrait plus rien dire.",
            "Vos badges apparaissent à côté de votre nom sur votre page publique et sur vos articles.",
          ],
        },
        {
          title: "Le moment où vous avez accepté ces conditions",
          paragraphs: [
            "Lors de la connexion et de l'inscription, on vous demande d'accepter ces conditions et la politique de confidentialité. Le moment de cet accord est enregistré une seule fois, sur votre compte, et il n'est montré nulle part sur le site. Il est conservé pour que la question de votre accord puisse encore recevoir une réponse des mois plus tard.",
          ],
        },
        {
          title: "Ce qui est public, et ce qui ne l'est pas",
          paragraphs: [
            "Votre dossier de compte est fermé à tous les autres. Une adresse, une date de naissance et la trace de votre accord ne sont pas publiques, et aucune liste publique ne les contient.",
            "Ce qui est public est une vue séparée, plus étroite : votre identifiant, votre nom d'affichage, votre photo, votre bannière, vos badges, la date de votre inscription, et le volume de ce que vous avez publié. Un lecteur qui demande à cette vue votre adresse e-mail obtient une erreur, parce que l'adresse n'y est pas.",
            "Vous n'apparaissez dans cette vue qu'une fois que vous avez publié quelque chose. Avant cela, vous n'avez pas de page publique, et rien sur le site ne pointe vers vous.",
          ],
        },
        {
          title: "Ce que l'équipe voit",
          paragraphs: [
            "Les personnes qui gèrent la plateforme disposent d'un panneau d'administration. Il montre tous les comptes, tout ce qui a été écrit, et qui porte quel badge. Le panneau ne montre ni adresse e-mail ni date de naissance.",
            "Nous vous disons le reste franchement : un membre de l'équipe ayant accès à la base de données du serveur peut lire ces colonnes, parce que le panneau lit la table des comptes avec une clé qui n'est pas soumise aux mêmes règles d'accès que tout le monde. C'est un fait du système et non une intention, et vous avez le droit de le savoir.",
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
            "Vous pouvez fermer votre compte. Le fermer supprime votre profil, vos articles et votre identifiant, et cela est irréversible. Les articles que vous avez publiés disparaissent avec lui.",
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
            "En vous connectant ou en vous inscrivant, vous acceptez ces conditions et la politique de confidentialité. Nous demandons cet accord là où il compte, et nous enregistrons le moment où vous l'avez donné.",
            "Si vous ne l'acceptez pas, veuillez cesser d'utiliser le site. Tout ce qui s'y trouve - les guides, le calculateur de score, la communauté - se lit sans compte.",
          ],
        },
        {
          title: "À quoi sert ce site",
          paragraphs: [
            "{{site}} est une ressource gratuite d'orientation éducative pour les étudiants tunisiens. Elle publie des informations sur la formation professionnelle, les filières du secondaire et l'orientation universitaire.",
            "C'est aussi un endroit où les lecteurs écrivent. La communauté est faite pour ceux qui ont quelque chose à dire sur l'école, l'orientation et la suite - et elle est écrite par des lecteurs, pas par nous.",
            "Il s'agit d'un projet indépendant. Il n'est ni affilié, ni validé, ni exploité au nom du ministère tunisien de l'Éducation nationale ou du ministère de l'Enseignement supérieur.",
          ],
        },
        {
          title: "Votre compte",
          paragraphs: [
            "Votre identifiant est votre identité ici. C'est ainsi que vous apparaissez, que vous vous connectez, et que l'on vous trouve - et il ne peut plus être changé ensuite, car l'adresse que la plateforme a construite pour lui y est liée. Choisissez-le comme s'il était définitif, parce qu'il l'est.",
            "Votre mot de passe est le vôtre. Nous le conservons haché et ne pouvons pas le lire.",
            "Vous êtes responsable de ce qui se passe avec votre compte, et vous êtes la seule personne qui puisse publier sous votre identifiant.",
          ],
        },
        {
          title: "Ce que vous publiez",
          paragraphs: [
            "Ce que vous écrivez reste le vôtre. Vous en restez propriétaire, et vous nous autorisez à le publier ici - c'est ce qui le rend visible aux autres lecteurs.",
            "Vous pouvez supprimer un article à tout moment, et la suppression est définitive. Il n'y a ni archive ni annulation.",
            "La signature de votre article est un fait sur votre compte, et non un champ que vous remplissez. Personne ne peut publier sous le nom de quelqu'un d'autre, et vous ne pouvez pas retirer votre propre nom de ce que vous avez écrit.",
          ],
        },
        {
          title: "Les badges",
          paragraphs: [
            "Certains comptes portent des badges. Ils sont accordés par la plateforme, ils ne peuvent pas être accordés par le détenteur du compte, et ils peuvent être retirés. Un badge dit que la plateforme a décidé quelque chose sur votre compte - ce n'est pas un décor que vous vous choisissez.",
          ],
        },
        {
          title: "Messages privés, et fichiers sur un article",
          paragraphs: [
            "Les deux sont prévus et aucun n'est construit. Nous écrivons ici ce que nous avons décidé, parce qu'une promesse sur la vie privée vaut quelque chose quand elle est faite avant que la fonction existe, et ne vaut plus rien quand elle est faite après.",
            "Les messages entre deux personnes seront privés, et personne ici ne les lira par défaut. Un participant pourra signaler une conversation, et un signalement remettra cette seule conversation aux modérateurs, rien d'autre. Privé ne veut pas dire sans compte rendu - cela veut dire responsable devant la personne à qui l'on parle, et devant la loi, et devant personne d'autre.",
            "Les images et les fichiers joints à un article seront conservés avec une limite de taille et une courte liste de types autorisés. La vidéo viendra plus tard, si le coût de la porter est un coût que la plateforme peut porter.",
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
            "Vous pouvez lire, partager et faire un lien vers notre contenu à des fins personnelles ou pédagogiques. Vous pouvez écrire et publier des articles qui vous appartiennent. Vous ne pouvez pas :",
          ],
          bullets: [
            "présenter notre contenu comme le vôtre ;",
            "publier l'écriture de quelqu'un d'autre, ou une photo qui n'est pas la vôtre, comme si elle l'était ;",
            "usurper l'identité d'une autre personne, ou afficher un badge qui ne vous a pas été accordé ;",
            "publier des contenus illicites, ou qui harcelent ou menacent qui que ce soit ;",
            "utiliser le site à des fins de revente commerciale ;",
            "tenter de perturber, de saturer le site ou d'y accéder sans autorisation.",
          ],
        },
        {
          title: "Modération, et ce qui n'est pas encore construit",
          paragraphs: [
            "Pour l'instant, quiconque a un compte peut publier, sans file d'approbation. Nous n'avons pas encore construit de bouton de signalement, ni la file qui irait avec, et il n'existe donc aucun moyen pour un lecteur de nous signaler un article.",
            "Nous préférons le dire clairement plutôt que décrire un système de modération qui n'existe pas. Il figure sur la feuille de route publiée, et il sera construit avant qu'on demande à qui que ce soit de compter dessus.",
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
            "{{site}} موقع معلوماتي مجاني ومتاح للجميع. لا نبيع بياناتك، ولا ندير إعلانات، ولا نتتبّعك على مواقع أخرى.",
            "يمكنك استعمال الموقع كلّه دون حساب. وإن اخترت إنشاء واحد - ومعظم الموقع لا يحتاجك إلى ذلك - نحتفظ بما تعطينا، وتقول هذه الصفحة ما هو.",
          ],
        },
        {
          title: "ما الذي نجمعه",
          paragraphs: [
            "عند استخدامك حاسبة نقاط التوجيه، تُعالَج كل ما تكتبه بالكامل داخل متصفحك. لا تُنقل درجتك أبدًا إلى خوادمنا، ولا تُخزَّن.",
            "وإذا أرسلت لنا رسالة عبر استمارة الاتصال، نتلقّى الاسم والبريد الإلكتروني ونصّ الرسالة التي تختار تقديمها، حتى نتمكن من الرد عليك.",
            "وإذا أنشأت حسابًا، فنحن نحتفظ بما تصفه الأقسام الأربعة التالية.",
          ],
        },
        {
          title: "الحساب الذي يمكنك إنشاءه",
          paragraphs: [
            "الحساب اسمُ مستخدم وكلمةُ سرّ. واسمُ المستخدم يسمّى معرّفًا، وهو كيف تظهر وكيف تسجّل الدخول. والبريد الإلكتروني ليس مطلوبًا، ولا نطلبه منك أبدًا.",
            "وإن أنشأت حسابًا، نحتفظ بـ: معرّفك، والاسم الظاهر الذي اخترته، وتاريخ انضمامك، وكلمة سرّك (مُعمَّاة عند نظام المصادقة - ولا نستطيع قراءتها)، وما تضيفه إلى ملفّك بعدها، مثل صورة أو شعار عريض أو تاريخ ميلاد.",
            "صورتُك وشعارُك يُقصّان ويُضغطان داخل متصفّحك قبل إرساله، ويُحفظان في صفّ ملفّك ضمن سجلّ الحساب. ولا يُرفعان إلى مضيف صور.",
          ],
        },
        {
          title: "العنوان الذي يختلقه الموقع لك",
          paragraphs: [
            "يشترط نظامُ المصادقة أن يحتفظ ببريد إلكتروني، فيعطيه الموقع واحدًا مبنيًّا من معرّفك - مثل `اسمك@users.chouflimostakbel.tn`. وأنت لا ترى هذا العنوان أبدًا، ولا يُرسَل إليه شيء أبدًا، وليس صندوق بريد حقيقيًّا.",
            "وإن أعطيتنا بريدًا حقيقيًّا، فهو اختياري ويُحفظ منفصلًا، تحت ملفّك لا في داخل الحساب. والمنصّة لا تحتاجه، ونحن لا نُرسِل إليه شيئًا أيضًا.",
          ],
        },
        {
          title: "ما تكتبه",
          paragraphs: [
            "إن كتبت مقالًا، نحتفظ بعنوانه ونصّه وبملخّص قصير وبأيّ وسوم تضعها عليه، وبكونه مسودّةً أو منشورًا، وبمتى كُتب ومتى نُشر.",
            "المسودّة لا يراها إلا أنت. ومتى نُشر المقال ثبت تاريخه ولم يتحرّك، فلا يبدو مقالٌ مُعدَّل وكأنه نُشر للتوّ.",
            "وتوقيع المقال - اسمُك وصورتُك وشاراتُك - تُنسخ من حسابك بواسطة قاعدة البيانات نفسها، لا بواسطة الصفحة التي تقرأ عليها. ولذلك لا يستطيع أحد أن ينشر باسم شخص آخر.",
          ],
        },
        {
          title: "الشارات",
          paragraphs: [
            "بعض الحسابات تحمل شارات: قيادة، ومطوّر، وفريق، ومُسهم، وشارةٌ أُخرى موسومة بسرّية. وتمنحها المنصّة، ولا يستطيع صاحبُ الحساب أن يمنحها لنفسه. ولو استطاع القارئ أن يكتب شارةً في سجلّه الخاصّ، لما كانت الشارة تعني شيئًا.",
            "وتظهر شاراتُك بجانب اسمك في صفّك العامّ وعلى مقالاتك.",
          ],
        },
        {
          title: "اللحظة التي قبلت فيها هذه الشروط",
          paragraphs: [
            "عند تسجيل الدخول وعند التسجيل، يُطلب منك الموافقة على هذه الشروط وعلى سياسة الخصوصية. وتُسجَّل لحظة موافقتك مرّة واحدة، على حسابك، ولا تُعرض في أيّ مكان من الموقع. وتُحفظ لتبقى أن يُجاب سؤال الموافقة بعد أشهر.",
          ],
        },
        {
          title: "ما هو علنيّ وما ليس كذلك",
          paragraphs: [
            "سجلّ حسابك مغلقٌ في وجه الجميع. فالبريد الإلكتروني وتاريخ الميلاد وسجلّ موافقتك ليست علنية، ولا توجد قائمة علنية تحتويها.",
            "والعلنيّ هو عرضٌ منفصل وأضيق: معرّفك، واسمُك الظاهر، وصورتُك، وشعارُك، وشاراتُك، وتاريخ انضمامك، وقدر ما نشرت. ومن يطلب من ذلك العرض بريدك الإلكتروني يحصل على خطأ، لأن البريد ليس فيه.",
            "ولا تظهر في ذلك العرض إلا بعد أن تنشر شيئًا. وقبل ذلك لا صفحتك عامة، ولا شيء في الموقع يشير إليك.",
          ],
        },
        {
          title: "ما يراه الفريق",
          paragraphs: [
            "لدى من يديرون المنصّة لوحة إدارة. تعرض كل الحسابات، وكل ما كُتب، ومن يحمل أيّ شارة. ولا تعرض اللوحة بريدًا إلكترونيًّا ولا تاريخ ميلاد.",
            "ونقول لك الباقي بصراحة: من يملك وصولًا إلى قاعدة بيانات الخادم يستطيع قراءة هذين العمودين، لأن اللوحة تقرأ جدول الحسابات بمفتاحٍ لا يخضع لقواعد الوصول نفسها التي يخضع لها الجميع. وهذه حقيقة في النظام لا نيّةٌ فيه، ومن حقّك أن تعرفها.",
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
            "يمكنك إغلاق حسابك. وإغلاقه يحذف ملفّك ومقالاتك ومعرّفك، ولا يمكن التراجع عن ذلك. والمقالات التي نشرتها تُحذف معه.",
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
