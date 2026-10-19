// Encoding guard.
//
// Arabic has been corrupted more than once in this project by round trips
// through tools that mangle non-ASCII, so every file carrying translated text
// is checked for U+FFFD before it can ship.
//
//   npm run check:encoding
//
// Exits non-zero if any file contains a replacement character.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const BAD = "\uFFFD";

/** Directories that hold user-facing text in more than one language. */
const ROOTS = ["components/i18n", "components"];
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "fonts", "public"]);
const EXTS = new Set([".ts", ".tsx"]);

const files = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (EXTS.has(extname(path))) files.push(path);
  }
}
for (const root of ROOTS) {
  try {
    walk(root);
  } catch {
    /* directory missing */
  }
}

// Deduplicate: components/ would also catch components/i18n.
const unique = [...new Set(files)];

let bad = 0;
let arabic = 0;

for (const file of unique.sort()) {
  const src = readFileSync(file, "utf8");
  const count = (src.match(new RegExp(BAD, "g")) || []).length;
  const ar = (src.match(/[\u0600-\u06FF]/g) || []).length;
  arabic += ar;

  if (count > 0) {
    bad += count;
    const line = src.slice(0, src.indexOf(BAD)).split("\n").length;
    console.log(`FAIL  ${file}: ${count} replacement character(s), first on line ${line}`);
  }
}

console.log(`\n${unique.length} files scanned, ${arabic} Arabic characters, ${bad} corrupted`);
if (bad > 0) {
  console.log("A replacement character means text was destroyed in transit, not that a font is missing.");
  process.exit(1);
}
