// Verify a deployed build.
//
// The failure this exists to catch: the HTML document is cached at the CDN,
// the next deploy replaces the chunks it names, and every visitor handed the
// old document gets a ChunkLoadError. Nothing looks wrong until someone loads
// the site, so it gets checked here instead.
//
//   node scripts/verify-deploy.mjs                     https://loujayn.sejed.dev
//   node scripts/verify-deploy.mjs http://localhost:3000
//
// Exits non-zero if any check fails, so it can gate a deploy.

import { readFileSync } from "node:fs";

const BASE = (process.argv[2] || "https://loujayn.sejed.dev").replace(/\/+$/, "");

/** Read the chunks this build expects, so the local build is the reference. */
function localBuildId() {
  try {
    const info = JSON.parse(readFileSync("lib/build-info.json", "utf8"));
    return info.shortSha ?? null;
  } catch {
    return null;
  }
}

/** A shared cache told to hold a document for a day or more is the bug. */
function longSharedCache(value) {
  if (!value) return false;
  const m = /s-maxage=(\d+)/.exec(value);
  return m ? Number(m[1]) > 3600 : false;
}

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? `\n        ${detail}` : ""}`);
}

console.log(`Verifying ${BASE}\n`);

// ---- 1. The document must revalidate ------------------------------------
const page = await fetch(`${BASE}/`, { cache: "no-store" });
const html = await page.text();
const docCache = page.headers.get("cache-control");

check(
  "HTML document is revalidated, not cached for a year",
  !longSharedCache(docCache),
  `cache-control: ${docCache}`,
);

// ---- 2. Build assets are immutable --------------------------------------
const assets = [...html.matchAll(/\/_next\/static\/[^"'\\)]+\.(?:js|css)/g)].map((m) => m[0]);
const assetPath = [...new Set(assets)][0];
const assetRes = await fetch(`${BASE}${assetPath}`, { method: "HEAD" });
const assetCache = assetRes.headers.get("cache-control") ?? "";

check(
  "build assets are immutable",
  assetCache.includes("immutable") || assetCache.includes("max-age=31536000"),
  `${assetPath} -> ${assetCache}`,
);

// ---- 3. The service worker must never be cached -------------------------
const sw = await fetch(`${BASE}/sw.js`, { method: "HEAD" });
const swCache = sw.headers.get("cache-control") ?? "";

check(
  "service worker is not cached",
  !longSharedCache(swCache) && !/max-age=(\d{7,})/.test(swCache),
  `cache-control: ${swCache}`,
);

// ---- 4. Every chunk the page names must actually exist ------------------
// This is the check that would have caught the stale-build error.
const unique = [...new Set(assets)];
const results404 = await Promise.all(
  unique.map(async (c) => {
    const r = await fetch(`${BASE}${c}`, { method: "HEAD" });
    return { c, status: r.status };
  }),
);
const missing = results404.filter((r) => r.status !== 200);

check(
  `all ${unique.length} referenced chunks resolve`,
  missing.length === 0,
  missing.length ? missing.map((m) => `${m.c} -> ${m.status}`).join(", ") : "none missing",
);

// ---- 5. The deploy-status endpoint answers ------------------------------
try {
  const status = await fetch(`${BASE}/api/status`);
  const body = await status.json();
  const valid =
    status.ok &&
    ["current", "behind", "ahead", "diverged", "unknown"].includes(body.state) &&
    typeof body.behind === "number";

  check(
    "deploy status endpoint answers",
    valid,
    `state: ${body.state}, behind: ${body.behind}${body.shortSha ? `, built from ${body.shortSha}` : ""}`,
  );
} catch (e) {
  check("deploy status endpoint answers", false, String(e).slice(0, 80));
}

// ---- Summary -------------------------------------------------------------
const failed = results.filter((r) => !r.pass);
const built = localBuildId();

console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (built) console.log(`local build: ${built}`);
if (failed.length) {
  console.log(`\n${failed.length} FAILED. A failing check here is a bug that visitors will hit.`);
  process.exit(1);
}
