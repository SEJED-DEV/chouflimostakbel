// Tests the reading of GitHub's compare endpoint.
//
//   node --experimental-strip-types scripts/test-deploy-status.mjs
//
// The bug this catches: GitHub's compare endpoint is relative to its BASE,
// so ahead_by counts the commits the branch has that the base does not. Read
// the other way round, the counts come back as zero, the state reads
// "current", and a deployment nine commits stale looks perfectly fine.
import { classify } from "../lib/deploy-status.ts";

let pass = 0;
let fail = 0;

function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  ok ? pass++ : fail++;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `  (got ${JSON.stringify(got)}, want ${JSON.stringify(want)})`}`,
  );
}

// The live case that was wrong: a build two commits behind main.
// GitHub says status "ahead", ahead_by 2, behind_by 0.
check(
  "a build two commits behind main reads as behind",
  classify({ status: "ahead", ahead_by: 2, behind_by: 0 }),
  { state: "behind", behind: 2, ahead: 0 },
);

// Nine commits behind, as measured against the real repository.
check(
  "a build nine commits behind main reads as behind",
  classify({ status: "ahead", ahead_by: 9, behind_by: 0 }),
  { state: "behind", behind: 9, ahead: 0 },
);

// The same commit: identical.
check(
  "a build on the branch head reads as current",
  classify({ status: "identical", ahead_by: 0, behind_by: 0 }),
  { state: "current", behind: 0, ahead: 0 },
);

// A build that is ahead of the branch - the branch was moved back.
check(
  "a build ahead of the branch reads as ahead",
  classify({ status: "behind", ahead_by: 0, behind_by: 3 }),
  { state: "ahead", behind: 0, ahead: 3 },
);

// Both sides moved.
check(
  "a build that has diverged reads as diverged",
  classify({ status: "diverged", ahead_by: 4, behind_by: 2 }),
  { state: "diverged", behind: 4, ahead: 2 },
);

// Missing fields must not throw or invent a number.
check(
  "an empty response reads as current",
  classify({}),
  { state: "current", behind: 0, ahead: 0 },
);

// The label is never derived from GitHub's status field alone, because
// "ahead" is what GitHub calls the state in which the deployment is behind.
const behindCase = classify({ status: "ahead", ahead_by: 1, behind_by: 0 });
check("the state is not taken from GitHub's word for it", behindCase.state, "behind");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
