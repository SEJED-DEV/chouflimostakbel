// Exercise the chunk-error detector against the real error from the live site
// and the neighbouring cases it must NOT catch.
// Node strips the types natively; the module has no runtime imports.
import { isChunkLoadError } from "../lib/chunk-error.ts";

const shouldMatch = [
  [
    "the exact live error",
    Object.assign(
      new Error(
        "Loading chunk 177 failed.\n(error: https://loujayn.sejed.dev/_next/static/chunks/app/layout-eff3bf8b1f830c4b.js)",
      ),
      { name: "ChunkLoadError" },
    ),
  ],
  ["bare name only", Object.assign(new Error(""), { name: "ChunkLoadError" })],
  [
    "webpack message",
    new Error("Failed to fetch dynamically imported module: https://x/_next/static/chunks/177.js"),
  ],
  ["module script", new Error("Importing a module script failed.")],
  ["css chunk", new Error("Unable to preload CSS for /_next/static/css/abc.css")],
  ["string reason", "ChunkLoadError: Loading chunk 5 failed"],
  ["plain object with message", { message: "Loading chunk 12 failed." }],
];

const shouldNotMatch = [
  ["ordinary error", new Error("Cannot read properties of undefined")],
  ["network offline", new TypeError("Failed to fetch")],
  ["hydration warning", new Error("Hydration failed because the server rendered HTML")],
  ["image 404", new Error("Failed to load resource: 404")],
  ["null", null],
  ["undefined", undefined],
  ["empty string", ""],
];

let pass = 0;
let fail = 0;

for (const [name, input] of shouldMatch) {
  const got = isChunkLoadError(input);
  got ? pass++ : fail++;
  console.log(`${got ? "PASS" : "FAIL"}  catches: ${name}`);
}
for (const [name, input] of shouldNotMatch) {
  const got = isChunkLoadError(input);
  !got ? pass++ : fail++;
  console.log(`${!got ? "PASS" : "FAIL"}  ignores: ${name}`);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
