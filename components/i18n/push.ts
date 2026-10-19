import type { Slice } from "./types";

/**
 * Copy for update notifications.
 *
 * The notification is sent in all three languages at once and the service
 * worker picks the one matching the reader's saved language, so a single
 * push reaches every reader in their own language.
 */
export interface PushCopy {
  /** Notification title when the site has been updated. */
  updatedTitle: string;
  /** Notification body. The release summary is usually better. */
  updatedBody: string;
  /** Button that asks for permission. */
  enable: string;
  /** Why it is worth turning on. */
  explain: string;
  /** The reader has blocked notifications. */
  denied: string;
  /** Already on. */
  on: string;
  /** Turn it back off. */
  disable: string;
  /** This browser cannot do push at all. */
  unsupported: string;
  /** Something went wrong. */
  error: string;
  /** Title of the site-wide prompt asking for permission. */
  promptTitle: string;
  /** Why it is worth allowing. */
  promptBody: string;
  /** Closing the prompt without answering. */
  later: string;
}

export const push: Slice<PushCopy> = {
  en: {
    updatedTitle: "Choufli Mosta9bel was updated",
    updatedBody: "There is a new version. Tap to see what changed.",
    enable: "Turn on update alerts",
    explain:
      "Get a notification when the site is updated. No email address, no tracking - just a message on this device.",
    denied:
      "Notifications are blocked for this site. You can turn them back on in your browser settings.",
    on: "Update alerts are on",
    disable: "Turn off",
    unsupported: "This browser cannot send notifications.",
    error: "That did not work. Try again.",
    promptTitle: "Get a note when the site is updated.",
    promptBody:
      "One message when a new version ships, in your own language. No email address, no tracking.",
    later: "Later",
  },

  fr: {
    updatedTitle: "Choufli Mosta9bel a été mis à jour",
    updatedBody: "Une nouvelle version est disponible. Touchez pour voir ce qui a changé.",
    enable: "Activer les alertes de mise à jour",
    explain:
      "Recevez une notification quand le site est mis à jour. Pas d'adresse e-mail, pas de suivi - seulement un message sur cet appareil.",
    denied:
      "Les notifications sont bloquées pour ce site. Vous pouvez les réactiver dans les réglages de votre navigateur.",
    on: "Les alertes de mise à jour sont activées",
    disable: "Désactiver",
    unsupported: "Ce navigateur ne peut pas envoyer de notifications.",
    error: "Cela n'a pas fonctionné. Réessayez.",
    promptTitle: "Soyez prévenu quand le site est mis à jour.",
    promptBody:
      "Un message à chaque nouvelle version, dans votre langue. Pas d'adresse e-mail, pas de suivi.",
    later: "Plus tard",
  },

  ar: {
    updatedTitle: "تم تحديث شوفلي مستقبلك",
    updatedBody: "يوجد إصدار جديد. اضغط لمعرفة ما تغيّر.",
    enable: "تفعيل تنبيهات التحديث",
    explain:
      "يصلك إشعار عند تحديث الموقع. لا بريد إلكتروني ولا تتبّع - رسالة واحدة على هذا الجهاز فقط.",
    denied: "الإشعارات محظورة لهذا الموقع. يمكنك تفعيلها من إعدادات المتصفح.",
    on: "تنبيهات التحديث مفعّلة",
    disable: "إيقاف",
    unsupported: "هذا المتصفح لا يدعم إرسال الإشعارات.",
    error: "لم ينجح ذلك. أعد المحاولة.",
    promptTitle: "صلك إشعار عند تحديث الموقع.",
    promptBody:
      "رسالة واحدة عند صدور كل إصدار جديد، وبلغتك. لا بريد إلكتروني ولا تتبّع.",
    later: "لاحقًا",
  },
};
