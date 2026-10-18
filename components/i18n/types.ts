/**
 * Shape shared by every per-page translation slice.
 *
 * Each page owns one slice file (`components/i18n/<page>.ts`) holding the same
 * structure in English, French and Arabic. Keeping them separate lets pages be
 * translated independently without touching a single shared dictionary.
 */
export interface Slice<L> {
  en: L;
  fr: L;
  ar: L;
}
