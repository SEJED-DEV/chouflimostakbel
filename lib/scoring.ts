/**
 * Tunisian Baccalaureat scoring - average (MG) and orientation score (FG).
 *
 * SOURCES (the Ministry publishes these as a PDF every year; there is no API):
 *   - Guide officiel de l'orientation universitaire, Universite de Tunis el Manar
 *     https://uma.rnu.tn  (score T = FG + formule specifique de la filiere)
 *   - Arrete du 24 avril 2008 (moyenne, matiere optionnelle, dispense de sport,
 *     session de controle) as amended.
 *
 * We are a *reference* reimplementation of the published formula - NOT an
 * official tool. The Ministry does not publish a calculator.
 *
 * NEXT YEAR'S UPDATE: everything below lives in this one file. Change the
 * coefficients / formulas and the UI follows automatically.
 */

/** Guide edition these coefficients were taken from. */
export const SCORE_GUIDE_YEAR = 2026;

export const GUIDE_URL = "https://uma.rnu.tn";

export type SectionId =
  | "math"
  | "science"
  | "eco"
  | "technique"
  | "informatique"
  | "lettres"
  | "sport";

/**
 * Subjects that can contribute to the global formula, with the display name
 * and short label shown in the calculator.
 */
export interface SubjectDef {
  key: string;
  label: string;
  short: string;
  /** Arabic label, used when the site runs in Arabic. */
  ar: string;
}

export const SUBJECTS: Record<string, SubjectDef> = {
  M: { key: "M", label: "Mathematics", short: "Math", ar: "الرياضيات" },
  SP: { key: "SP", label: "Physics", short: "Physics", ar: "الفيزياء" },
  SVT: { key: "SVT", label: "Life & Earth Sciences", short: "SVT", ar: "العلوم الطبيعية" },
  F: { key: "F", label: "French", short: "French", ar: "الفرنسية" },
  ANG: { key: "ANG", label: "English", short: "English", ar: "الإنجليزية" },
  PH: { key: "PH", label: "Philosophy", short: "Philo", ar: "الفلسفة" },
  HG: { key: "HG", label: "History & Geography", short: "H-G", ar: "التاريخ والجغرافيا" },
  EC: { key: "EC", label: "Economics", short: "Econ", ar: "الاقتصاد" },
  GE: { key: "GE", label: "Management", short: "Mgmt", ar: "التصرف" },
  TE: { key: "TE", label: "Technology", short: "Tech", ar: "التكنولوجيا" },
  ALGO: { key: "ALGO", label: "Computer Science", short: "CS", ar: "الإعلامية" },
  STI: { key: "STI", label: "Info Sci. & Tech.", short: "STI", ar: "المعلوميات" },
  A: { key: "A", label: "Arabic", short: "Arabic", ar: "العربية" },
  SB: { key: "SB", label: "Biological Sciences", short: "Bio", ar: "الأحياء" },
  SPORT: { key: "SPORT", label: "Sport", short: "Sport", ar: "الرياضة" },
  EP: { key: "EP", label: "Physical Education", short: "PE", ar: "التربية البدنية" },
};

/** One weighted term in the global formula. */
export interface FormulaTerm {
  subject: keyof typeof SUBJECTS;
  coefficient: number;
}

export interface SectionDef {
  id: SectionId;
  label: string;
  labelFr: string;
  labelAr: string;
  /** Subjects the student must enter a mark for. */
  inputs: (keyof typeof SUBJECTS)[];
  /**
   * FG = MG_COEFFICIENT * average + sum(coefficient * grade)
   * The average itself is entered directly by the student.
   */
  mgCoefficient: number;
  terms: FormulaTerm[];
  /** Human-readable formula, shown under the result. */
  formula: string;
}

export const SECTIONS: Record<SectionId, SectionDef> = {
  math: {
    id: "math",
    label: "Mathematics",
    labelFr: "Mathematiques",
    labelAr: "الرياضيات",
    inputs: ["M", "SP", "SVT", "F", "ANG"],
    mgCoefficient: 4,
    terms: [
      { subject: "M", coefficient: 2 },
      { subject: "SP", coefficient: 1.5 },
      { subject: "SVT", coefficient: 0.5 },
      { subject: "F", coefficient: 1 },
      { subject: "ANG", coefficient: 1 },
    ],
    formula: "FG = 4 x MG + 2 x Maths + 1.5 x Physique + 0.5 x SVT + Francais + Anglais",
  },
  science: {
    id: "science",
    label: "Experimental Sciences",
    labelFr: "Sciences experimentales",
    labelAr: "العلوم التجريبية",
    inputs: ["M", "SP", "SVT", "F", "ANG"],
    mgCoefficient: 4,
    terms: [
      { subject: "M", coefficient: 1 },
      { subject: "SP", coefficient: 1.5 },
      { subject: "SVT", coefficient: 1.5 },
      { subject: "F", coefficient: 1 },
      { subject: "ANG", coefficient: 1 },
    ],
    formula: "FG = 4 x MG + Maths + 1.5 x Physique + 1.5 x SVT + Francais + Anglais",
  },
  eco: {
    id: "eco",
    label: "Economics & Management",
    labelFr: "Economie et gestion",
    labelAr: "الاقتصاد والتصرف",
    inputs: ["EC", "GE", "M", "HG", "F", "ANG"],
    mgCoefficient: 4,
    terms: [
      { subject: "EC", coefficient: 1.5 },
      { subject: "GE", coefficient: 1.5 },
      { subject: "M", coefficient: 0.5 },
      { subject: "HG", coefficient: 0.5 },
      { subject: "F", coefficient: 1 },
      { subject: "ANG", coefficient: 1 },
    ],
    formula: "FG = 4 x MG + 1.5 x Eco + 1.5 x Gestion + 0.5 x Maths + 0.5 x H-G + Francais + Anglais",
  },
  technique: {
    id: "technique",
    label: "Technical Sciences",
    labelFr: "Sciences techniques",
    labelAr: "العلوم التقنية",
    inputs: ["TE", "M", "SP", "F", "ANG"],
    mgCoefficient: 4,
    terms: [
      { subject: "TE", coefficient: 1.5 },
      { subject: "M", coefficient: 1.5 },
      { subject: "SP", coefficient: 1 },
      { subject: "F", coefficient: 1 },
      { subject: "ANG", coefficient: 1 },
    ],
    formula: "FG = 4 x MG + 1.5 x Technologie + 1.5 x Maths + Physique + Francais + Anglais",
  },
  informatique: {
    id: "informatique",
    label: "Computer Science",
    labelFr: "Sciences de l'informatique",
    labelAr: "علوم الإعلامية",
    inputs: ["M", "ALGO", "SP", "STI", "F", "ANG"],
    mgCoefficient: 4,
    terms: [
      { subject: "M", coefficient: 1.5 },
      { subject: "ALGO", coefficient: 1.5 },
      { subject: "SP", coefficient: 0.5 },
      { subject: "STI", coefficient: 0.5 },
      { subject: "F", coefficient: 1 },
      { subject: "ANG", coefficient: 1 },
    ],
    formula: "FG = 4 x MG + 1.5 x Maths + 1.5 x Algo + 0.5 x Physique + 0.5 x STI + Francais + Anglais",
  },
  lettres: {
    id: "lettres",
    label: "Letters & Humanities",
    labelFr: "Lettres",
    labelAr: "الآداب",
    inputs: ["A", "PH", "HG", "F", "ANG"],
    mgCoefficient: 4,
    terms: [
      { subject: "A", coefficient: 1.5 },
      { subject: "PH", coefficient: 1.5 },
      { subject: "HG", coefficient: 1 },
      { subject: "F", coefficient: 1 },
      { subject: "ANG", coefficient: 1 },
    ],
    formula: "FG = 4 x MG + 1.5 x Arabe + 1.5 x Philosophie + H-G + Francais + Anglais",
  },
  sport: {
    id: "sport",
    label: "Sport",
    labelFr: "Sport",
    labelAr: "الرياضة",
    inputs: ["SB", "SPORT", "EP", "SP", "PH", "F", "ANG"],
    mgCoefficient: 4,
    terms: [
      { subject: "SB", coefficient: 1.5 },
      { subject: "SPORT", coefficient: 1 },
      { subject: "EP", coefficient: 0.5 },
      { subject: "SP", coefficient: 0.5 },
      { subject: "PH", coefficient: 0.5 },
      { subject: "F", coefficient: 1 },
      { subject: "ANG", coefficient: 1 },
    ],
    formula:
      "FG = 4 x MG + 1.5 x SVT + Sport + 0.5 x EPS + 0.5 x Physique + 0.5 x Philo + Francais + Anglais",
  },
};

export const SECTION_ORDER: SectionId[] = [
  "math",
  "science",
  "eco",
  "technique",
  "informatique",
  "lettres",
  "sport",
];

/** Geographic bonus applied to eligible filieres available in your governorate. */
export const GEOGRAPHIC_BONUS = 0.07;

/**
 * Filieres that never receive the geographic bonus, even when offered locally.
 * Medicine and the engineering preparatory tracks are capped centrally.
 */
export const NO_BONUS_FILIERES = [
  "medicine",
  "dentistry",
  "pharmacy",
  "prepa-ingenieur",
  "education",
];

export type Grades = Record<string, number | null | undefined>;

export interface ScoreResult {
  /** Global formula (FG) - the base every filiere builds on. */
  fg: number;
  /** FG with the 7% geographic bonus applied. */
  fgWithBonus: number;
  /** True once every required mark is present. */
  complete: boolean;
  /** Subjects still missing. */
  missing: string[];
}

/**
 * Computes the global formula.
 *
 * @param average  the weighted general average (MG) from the transcript
 * @param grades   marks out of 20, keyed by subject key
 */
export function computeScore(
  section: SectionId,
  average: number | null,
  grades: Grades
): ScoreResult {
  const def = SECTIONS[section];
  const missing: string[] = [];

  if (average === null || Number.isNaN(average)) missing.push("MG");

  for (const key of def.inputs) {
    const g = grades[key];
    if (g === null || g === undefined || Number.isNaN(g)) missing.push(key);
  }

  if (missing.length > 0) {
    return { fg: 0, fgWithBonus: 0, complete: false, missing };
  }

  let fg = def.mgCoefficient * (average as number);
  for (const term of def.terms) {
    fg += term.coefficient * ((grades[term.subject] as number) ?? 0);
  }

  return {
    fg: round(fg),
    fgWithBonus: round(fg * (1 + GEOGRAPHIC_BONUS)),
    complete: true,
    missing: [],
  };
}

/** Tunisian grading uses 3 decimals, matching how the Ministry publishes scores. */
export function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

/** Mentions: the official passing bands. */
export function mention(average: number): string | null {
  if (average >= 18) return "Excellent";
  if (average >= 16) return "Tres bien";
  if (average >= 14) return "Bien";
  if (average >= 12) return "Assez bien";
  if (average >= 10) return "Passable";
  return null;
}

/** Admitted to the session de controle when the main-session average is in [7, 10). */
export function needsSessionControle(average: number | null): boolean {
  if (average === null) return false;
  return average >= 7 && average < 10;
}
