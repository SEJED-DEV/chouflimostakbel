// Generates public/og-image.png - the picture that represents the whole site.
//
//   node scripts/generate-og-image.mjs
//
// Why a script and not a route: GitHub uses a file in the repository for the
// repository's own social preview, so there has to be a picture on disk. It
// is drawn here by the same engine that draws the per-post and per-profile
// previews, so the three of them are visibly one family - the same face, the
// same blue, the same type.
//
// The file is committed, and this script is what regenerates it. If the
// design changes, run the script rather than editing the picture.
//
// WHY createElement AND NOT JSX
//
// A script is run by node, and node does not read JSX. The markup is
// therefore written the long way, with a helper. It is duller to read than
// the same thing in a route file, and it runs anywhere node runs.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";
import { createElement as h } from "react";

// `next/og` is a CommonJS re-export, and its package exports map does not
// list it for ESM. Requiring it is the way in from a plain script.
const require = createRequire(import.meta.url);
const { ImageResponse } = require("next/og");

const ROOT = process.cwd();
const OUT = join(ROOT, "public", "og-image.png");

/** The same display face the hero headlines use. */
const font = readFileSync(join(ROOT, "app", "fonts", "MatchaStyle.ttf"));

const size = { width: 1200, height: 630 };

/** A short way to write one element. */
const el = (type, style, children) =>
  h(type, { style, children }, ...(Array.isArray(children) ? children : [children]));

const image = new ImageResponse(
  el(
    "div",
    {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      background: "#ffffff",
      padding: "72px 80px",
      fontFamily: "Matcha",
    },
    [
      // The mark, and the hairline above it.
      el("div", { display: "flex", flexDirection: "column", alignItems: "flex-start" }, [
        el("div", {
          width: 56,
          height: 6,
          borderRadius: 3,
          background: "#0071e3",
          display: "flex",
        }),
        el(
          "div",
          {
            marginTop: 26,
            fontSize: 30,
            color: "#0071e3",
            letterSpacing: 4,
            display: "flex",
          },
          "Choufli Mosta9bel",
        ),
      ]),

      // The promise, in the site's own voice.
      el("div", { display: "flex", flexDirection: "column" }, [
        el(
          "div",
          {
            fontSize: 84,
            lineHeight: 1.08,
            color: "#1d1d1f",
            letterSpacing: -1,
            display: "flex",
          },
          "Find your path",
        ),
        el(
          "div",
          {
            marginTop: 22,
            fontSize: 34,
            lineHeight: 1.3,
            color: "#6e6e73",
            display: "flex",
          },
          "School, branches, apprenticeships and university - for the young of Tunisia.",
        ),
      ]),

      // The address, in the same blue as the hairline.
      el(
        "div",
        {
          display: "flex",
          alignItems: "center",
          fontSize: 28,
          color: "#0071e3",
          letterSpacing: 3,
        },
        "www.chouflimostakbel.tn",
      ),
    ],
  ),
  {
    ...size,
    fonts: [{ name: "Matcha", data: font, style: "normal", weight: 400 }],
  },
);

const bytes = Buffer.from(await image.arrayBuffer());
writeFileSync(OUT, bytes);
console.log(`wrote ${OUT} (${bytes.length} bytes)`);
