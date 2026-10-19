// Records the commit this build was made from, so the deployed site can be
// compared against GitHub at runtime and say whether it is up to date.
//
// Runs automatically before `next build` (see the prebuild script). It never
// fails the build: without git - a tarball export, a CI image that stripped
// .git - it writes a null sha and the status line simply stays quiet rather
// than claiming something it cannot know.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const OUT = "lib/build-info.json";
const REPO = "SEJED-DEV/chouflimostakbel";

/** Short sha, or null when git is unavailable or this is not a checkout. */
function gitSha() {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

/** True when the working tree has changes not yet committed. */
function gitDirty() {
  try {
    const out = execFileSync("git", ["status", "--porcelain"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return out.length > 0;
  } catch {
    return false;
  }
}

const info = {
  repo: REPO,
  sha: gitSha(),
  shortSha: null,
  dirty: false,
  builtAt: new Date().toISOString(),
};

if (info.sha) {
  info.shortSha = info.sha.slice(0, 7);
  info.dirty = gitDirty();
}

writeFileSync(OUT, JSON.stringify(info, null, 2) + "\n", "utf8");

console.log(
  info.sha
    ? `build-info: ${info.shortSha}${info.dirty ? " (dirty tree)" : ""}`
    : "build-info: no git sha available - status line will stay quiet",
);
