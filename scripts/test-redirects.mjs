// Checks that the .html redirect rule cannot swallow a real file.
//
//   node --experimental-strip-types scripts/test-redirects.mjs
//
// The bug it catches: a catch-all rule that redirected every URL ending in
// .html also caught /offline.html, which is a real file. The service worker
// precaches it, and caches.addAll is atomic, so one 404 meant the worker
// never installed - taking push notifications, the offline fallback and the
// install prompt with it.
//
// Any new .html file added to public/ has to be excluded from the rule too,
// and this is what says so.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const config = readFileSync("next.config.ts", "utf8");

// The catch-all rule. The explicit ones (/index.html and friends) are safe
// by construction; the one with a parameter is the one that can swallow a
// file, so that is the one to look at.
const rule = [...config.matchAll(/source:\s*"([^"]*\\\.html[^"]*)"/g)]
  .map((m) => m[1])
  .find((source) => source.includes(":"));

if (!rule) {
  console.log("No catch-all .html redirect rule found - nothing to check.");
  process.exit(0);
}

// Pull the negative lookahead out, if there is one.
const lookahead = (rule.match(/\(\?!([A-Za-z0-9_|-]+)\)/) || [])[1] || "";
const excluded = new Set(lookahead ? lookahead.split("|") : []);

// Every real .html file in public/.
const publicDir = "public";
const htmlFiles = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (name.endsWith(".html")) htmlFiles.push(p);
  }
}
try {
  walk(publicDir);
} catch {
  console.log("No public directory - nothing to check.");
  process.exit(0);
}

let failed = 0;

if (htmlFiles.length === 0) {
  console.log("No .html files in public/ - nothing to check.");
}

for (const file of htmlFiles) {
  // Normalise the separator: the path is built by the OS, not by us.
  const name = file.replace(/\\/g, "/").replace(/^public\//, "").replace(/\.html$/, "");
  const ok = excluded.has(name);
  if (!ok) failed++;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${file} ${ok ? "is excluded from the redirect rule" : "WOULD BE REDIRECTED"}`,
  );
}

if (failed > 0) {
  console.log(
    `\n${failed} file(s) would be swallowed by the redirect rule.\n` +
      "Add the name to the negative lookahead in next.config.ts, and keep the\n" +
      "file out of the path the service worker precaches.",
  );
  process.exit(1);
}

console.log("\nAll public files are safe from the redirect rule.");
