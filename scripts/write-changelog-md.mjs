// Writes CHANGELOG.md at the root, from the changelog slice.
//
//   node --experimental-strip-types scripts/write-changelog-md.mjs
//
// The slice in components/i18n/changelog.ts is the single source. This file
// is generated so GitHub and the site can never disagree about what shipped.
// It runs automatically before every build.
//
// The English is used here, because a file on GitHub is read by people who
// have not chosen a language yet. The site carries all three.
import { readFileSync, writeFileSync } from "node:fs";
import { changelog } from "../components/i18n/changelog.ts";

const OUT = "CHANGELOG.md";

/** The order the kinds appear in, and the icon each one gets. */
const KIND_ORDER = ["added", "fixed", "changed", "removed"];
const KIND_LABEL = {
  added: "Added",
  fixed: "Fixed",
  changed: "Changed",
  removed: "Removed",
};

const lines = [];

lines.push("# Changelog");
lines.push("");
lines.push(
  "Every release of [Choufli Mosta9bel](https://www.chouflimostakbel), newest first.",
);
lines.push("");
lines.push(
  "Nothing ships quietly: if it is on the site, it is written down here. This file is",
);
lines.push(
  "generated from `components/i18n/changelog.ts`, which is the single source - do not",
);
lines.push(
  "edit it by hand. The site carries the same record in English, French and Arabic at",
);
lines.push("[/changelog](https://www.chouflimostakbel/changelog).",
);
lines.push("");

for (const entry of changelog.en.entries) {
  lines.push(`## ${entry.version} - ${entry.date}`);
  lines.push("");
  lines.push(entry.summary);
  lines.push("");

  for (const kind of KIND_ORDER) {
    const items = entry.changes.filter((c) => c.kind === kind);
    if (!items.length) continue;
    lines.push(`### ${KIND_LABEL[kind]}`);
    lines.push("");
    for (const item of items) {
      lines.push(`- ${item.text}`);
    }
    lines.push("");
  }

  if (entry.commits?.length) {
    lines.push("### Commits");
    lines.push("");
    for (const commit of entry.commits) {
      lines.push(
        `- [\`${commit.hash}\`](https://github.com/SEJED-DEV/chouflimostakbel/commit/${commit.hash}) - ${commit.summary}`,
      );
    }
    lines.push("");
  }
}

lines.push("---");
lines.push("");
lines.push(
  "Licensed under Apache 2.0. The bundled fonts keep their own licences.",
);
lines.push("");

writeFileSync(OUT, lines.join("\n"), "utf8");

const written = readFileSync(OUT, "utf8");
console.log(
  `${OUT}: ${changelog.en.entries.length} releases, ` +
    `${changelog.en.entries.reduce((n, e) => n + e.changes.length, 0)} changes, ` +
    `${written.split("\n").length} lines`,
);
