import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { LogoMark } from "@/lib/og-logo";

/**
 * The preview image for a page of the site itself.
 *
 * Posts and people have their own drawn images. The rest of the site - the
 * roadmap, the changelog, the legal pages, the guides - used to fall back to
 * the one picture that represents the whole site, so a link to the terms of
 * service and a link to the changelog showed the same thing. This route
 * draws one per page instead, from the title the page already has, so a
 * shared link shows the page that was shared.
 *
 * It is a route rather than a file per page because the pages are static:
 * `opengraph-image.tsx` next to a page draws at build time and cannot read
 * that page's own metadata without being written a second time by hand. A
 * route lets every page point at the same engine and hand it its title.
 *
 * The result is cached hard, because the title does not change between two
 * requests for the same page.
 */

/** Satori reads TTF, OTF and WOFF. It cannot read WOFF2. */
const font = readFileSync(
  join(process.cwd(), "app", "fonts", "MatchaStyle.ttf"),
);

export const runtime = "nodejs";

/** Cap a title so a very long one cannot push the layout off the canvas. */
function clip(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const title = clip(searchParams.get("title") || "Choufli Mosta9bel", 90);
  const kicker = clip(searchParams.get("kicker") || "", 40);
  const subtitle = clip(searchParams.get("subtitle") || "", 120);

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "64px 72px",
          fontFamily: "Matcha",
        }}
      >
        {/* A hairline in the site's blue, and the name above it. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              width: 56,
              height: 6,
              borderRadius: 3,
              background: "#0071e3",
              display: "flex",
            }}
          />
          <div
            style={{
              marginTop: 26,
              fontSize: 30,
              color: "#0071e3",
              letterSpacing: 4,
              display: "flex",
            }}
          >
            Choufli Mosta9bel
          </div>
        </div>

        {/* The page's own title, so the preview names the page. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 60 ? 58 : title.length > 34 ? 72 : 84,
              lineHeight: 1.12,
              color: "#1d1d1f",
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                marginTop: 22,
                fontSize: 32,
                lineHeight: 1.3,
                color: "#6e6e73",
                display: "flex",
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        {/* The section, when the page belongs to one, and the site's own mark
            in the corner, so a shared card is recognisable before it is read. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 28,
              color: "#6e6e73",
              letterSpacing: 1,
            }}
          >
            {kicker}
          </div>
          <LogoMark />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Matcha", data: font, style: "normal", weight: 400 }],
    },
  );

  return image;
}
