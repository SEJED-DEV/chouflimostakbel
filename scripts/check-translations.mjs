// Translation completeness check.
//
//   npm run check:translations
//
// Two things it catches that a type check cannot:
//
//   1. Placeholders left behind. Some translation slices were built with
//      "FR:" and "AR:" markers, so an untranslated string is obvious.
//   2. Untranslated text. A French or Arabic block that still contains a
//      long run of English words usually means one string was missed.
//
// Some strings are deliberately the same in every language - the commit
// summaries in the changelog are literal commit messages, and the ranking
// formula is a set of identifiers that must not drift. Those are recognised
// by being identical in ALL three languages, which is different from being
// identical only in the one that was missed.
//
// Exits non-zero if anything is left untranslated.
import { readdirSync, readFileSync } from "node:fs";
import { join, extname } from "node:path";

const DIR = "components/i18n";

/** Markers used to seed a slice that still needs translating. */
const PLACEHOLDERS = ["FR:", "AR:"];

/**
 * Words allowed to stay Latin inside an Arabic string: proper nouns and the
 * inline markup the renderer understands.
 */
const ALLOWED_LATIN = [
  "Supabase",
  "Postgres",
  "pgvector",
  "Drizzle",
  "Google",
  "GitHub",
  "Markdown",
  "orientation.tn",
  "{{site}}",
  "{{email}}",
  "{{orientation}}",
  "**",
];

/** A run of this many English words in a row is a missed translation. */
const ENGLISH_RUN = 6;

/**
 * Words that are English and not French. A French string that happens to
 * match the English one is usually a proper noun - the official names of
 * Tunisian diplomas, for instance, which stay in French in every language.
 * Those carry no English function words, so requiring one separates the two
 * cases.
 */
const ENGLISH_WORDS = new Set([
  "the", "and", "for", "with", "that", "this", "your", "you", "are", "was",
  "were", "our", "we", "it", "its", "have", "has", "will", "can", "from",
  "they", "them", "their", "there", "then", "when", "where", "which", "who",
  "would", "could", "should", "been", "being", "does", "did", "each", "any",
  "all", "more", "most", "other", "some", "such", "only", "own", "same",
  "what", "why", "how", "but", "if", "not", "nor", "too", "very", "must",
]);

/** True when the text contains at least one distinctly English word. */
function hasEnglishWords(text) {
  const words = text.toLowerCase().match(/[a-zà-ÿ']+/g) || [];
  return words.some((w) => ENGLISH_WORDS.has(w));
}

const files = readdirSync(DIR)
  .filter((f) => extname(f) === ".ts" && f !== "types.ts" && f !== "slice.ts")
  .map((f) => join(DIR, f));

let problems = 0;

/** Pull a language block out of a slice by locating its key. */
function block(source, lang) {
  const at = source.indexOf(`\n  ${lang}: {`);
  if (at === -1) return null;
  const end = source.indexOf("\n  },", at);
  return source.slice(at, end === -1 ? undefined : end);
}

/** Every double-quoted string in a block. */
function strings(chunk) {
  return [...chunk.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]);
}

for (const file of files) {
  const source = readFileSync(file, "utf8");

  const en = block(source, "en");
  const fr = block(source, "fr");
  const ar = block(source, "ar");
  if (!en || !fr || !ar) continue;

  const enSet = new Set(strings(en));
  const frSet = new Set(strings(fr));
  const arSet = new Set(strings(ar));

  for (const [lang, chunk] of [
    ["fr", fr],
    ["ar", ar],
  ]) {
    // 1. Placeholders still in place.
    for (const marker of PLACEHOLDERS) {
      const count = chunk.split(`"${marker}"`).length - 1;
      if (count > 0) {
        console.log(
          `FAIL  ${file} [${lang}]: ${count} untranslated placeholder(s) ("${marker}")`,
        );
        problems += count;
      }
    }
  }

  // 2. A French string left in English is identical to the English one but
  //    not to the Arabic one - the Arabic was translated, the French was
  //    not. A string identical in all three was left deliberately.
  for (const text of strings(fr)) {
    if (text.length < 25) continue;
    if (!enSet.has(text)) continue;
    if (arSet.has(text)) continue;
    if (!hasEnglishWords(text)) continue;
    console.log(`FAIL  ${file} [fr]: still English - "${text.slice(0, 90)}..."`);
    problems++;
  }

  // 3. Arabic is a different script, so a run of Latin words there really is
  //    untranslated text.
  for (const text of strings(ar)) {
    if (enSet.has(text) && frSet.has(text)) continue;

    let stripped = text;
    for (const allowed of ALLOWED_LATIN) {
      stripped = stripped.split(allowed).join(" ");
    }
    const words = stripped.match(/[A-Za-z]{2,}/g) || [];
    if (words.length >= ENGLISH_RUN) {
      console.log(
        `FAIL  ${file} [ar]: untranslated text - "${text.slice(0, 90)}..."`,
      );
      problems++;
    }
  }
}

if (problems === 0) {
  console.log(`${files.length} translation slices checked, nothing untranslated.`);
} else {
  console.log(`\n${problems} problem(s) found.`);
  process.exit(1);
}
