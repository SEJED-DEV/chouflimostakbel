/**
 * Syncs the developer/publisher profile from sejed.dev into this repo.
 *
 * sejed.dev is the single source of truth for the author's public links.
 * When a new profile is added there (Instagram, LinkedIn, X, ...), it lands in
 * the JSON-LD `sameAs` array and this script picks it up automatically.
 *
 *   node scripts/sync-site.mjs          # refresh lib/site.generated.json
 *   node scripts/sync-site.mjs --check  # fail if the checked-in file is stale
 *
 * The generated file is committed so builds never depend on the network.
 */

import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SOURCE = "https://sejed.dev";
const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "lib", "site.generated.json");

/** Platforms we recognise, mapped to a stable key we render icons for. */
const NETWORKS = [
  ["instagram", /instagram\.com\/(?!p\/|reel\/|explore\/)([\w.]+)/i, (u) => `https://instagram.com/${u[1]}`],
  ["linkedin", /linkedin\.com\/(in|company)\/([\w.-]+)/i, (u) => `https://linkedin.com/${u[1]}/${u[2]}`],
  ["github", /github\.com\/([\w-]+)$/i, (u) => `https://github.com/${u[1]}`],
  ["x", /(?:twitter|x)\.com\/([\w_]+)$/i, (u) => `https://x.com/${u[1]}`],
  ["facebook", /facebook\.com\/([\w.]+)/i, (u) => `https://facebook.com/${u[1]}`],
  ["tiktok", /tiktok\.com\/@([\w.]+)/i, (u) => `https://tiktok.com/@${u[1]}`],
  ["youtube", /youtube\.com\/(@[\w.]+|c\/[\w.-]+|channel\/[\w-]+)/i, (u) => `https://youtube.com/${u[1]}`],
  ["discord", /discord\.(?:gg|com\/invite)\/([\w-]+)/i, (u) => `https://discord.gg/${u[1]}`],
  ["telegram", /t\.me\/([\w_]+)/i, (u) => `https://t.me/${u[1]}`],
  ["linkedin_company", /linkedin\.com\/company\/([\w.-]+)/i, (u) => `https://linkedin.com/company/${u[1]}`],
];

async function main() {
  const check = process.argv.includes("--check");

  const res = await fetch(SOURCE, {
    headers: { "User-Agent": "chouflimostakbel-sync (+https://www.chouflimostakbel.tn)" },
  });
  if (!res.ok) throw new Error(`sejed.dev responded ${res.status}`);
  const html = await res.text();

  // --- 1. Structured data: the reliable, canonical fields -------------------
  let person = {};
  const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (ld) {
    try {
      const data = JSON.parse(ld[1]);
      const graph = data["@graph"] || [];
      person = graph.find((n) => n["@type"] === "Person") || {};
    } catch {
      console.warn("! could not parse JSON-LD, falling back to markup scraping");
    }
  }

  // --- 2. Collect every profile URL on the page ----------------------------
  const found = new Map();
  const candidates = [
    ...(Array.isArray(person.sameAs) ? person.sameAs : person.sameAs ? [person.sameAs] : []),
    ...html.matchAll(/https?:\/\/[A-Za-z0-9._:/-]+/g),
  ].map((c) => (typeof c === "string" ? c : c[0]));

  for (const raw of candidates) {
    for (const [key, re, build] of NETWORKS) {
      const m = raw.match(re);
      if (!m) continue;
      // Ignore profile-card image hosts / repo URLs that aren't the profile
      const url = build(m);
      if (!found.has(key)) found.set(key, url);
    }
  }

  const socials = Object.fromEntries(found);

  // --- 3. Build the record --------------------------------------------------
  const record = {
    _source: SOURCE,
    _syncedAt: new Date().toISOString(),
    name: person.name || "Sejed Trabelsi",
    role: person.jobTitle || "Full Stack Developer",
    url: person.url || SOURCE,
    image: person.image || null,
    email: person.email || null,
    phone: person.telephone || null,
    location: person.address?.addressLocality
      ? `${person.address.addressLocality}, ${person.address.addressCountry}`
      : null,
    socials,
  };

  const json = JSON.stringify(record, null, 2) + "\n";

  if (check) {
    const current = await readFile(OUT, "utf8").catch(() => "");
    const a = JSON.parse(current || "{}");
    const b = JSON.parse(json);
    delete a._syncedAt;
    delete b._syncedAt;
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      console.error("site.generated.json is out of date. Run: node scripts/sync-site.mjs");
      process.exit(1);
    }
    console.log("site.generated.json is up to date.");
    return;
  }

  await writeFile(OUT, json, "utf8");
  console.log("Synced from sejed.dev ->", OUT);
  console.log(
    "  socials:",
    Object.keys(socials).length ? Object.entries(socials).map(([k, v]) => `${k}=${v}`).join(", ") : "(none found)"
  );
}

main().catch((e) => {
  console.error("sync-site failed:", e.message);
  process.exit(1);
});
