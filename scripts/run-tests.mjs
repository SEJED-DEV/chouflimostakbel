// Runs the test suites.
//
//   npm test
//
// Each suite is a separate file, run in a child process because they strip
// TypeScript themselves and one of them deliberately evaluates source text.
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));

const SUITES = ["check-chunk-error.mjs", "test-push-prompt.mjs"];

function run(file) {
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      ["--experimental-strip-types", "--no-warnings", join(here, file)],
      { stdio: "inherit" },
    );
    child.on("close", (code) => resolve(code ?? 1));
  });
}

let failed = 0;

for (const suite of SUITES) {
  console.log(`\n=== ${suite} ===`);
  const code = await run(suite);
  if (code !== 0) failed++;
}

if (failed > 0) {
  console.log(`\n${failed} suite(s) failed.`);
  process.exit(1);
}

console.log("\nAll suites passed.");
