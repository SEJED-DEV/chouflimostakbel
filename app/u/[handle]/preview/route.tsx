import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { getPublicProfile } from "@/lib/people";
import { LogoMark } from "@/lib/og-logo";

/**
 * The preview image for one person.
 *
 * A person's photo is the best preview of their page there is, so the image
 * is their photograph on the site's background with their name beside it. A
 * person with no photo gets their initials instead, which is better than an
 * empty box and better than the site's generic picture, which would say
 * nothing about whose page this is.
 *
 * This is an ordinary route rather than the `opengraph-image.tsx` file
 * convention. The convention injects its own `og:image` tags into the page,
 * and it emits `og:image:alt` and `og:image:type` BEFORE `og:image` - a
 * shape a chat app's parser can read as properties with no image to hang
 * them on, and the preview then comes out empty. Declaring the image in the
 * page's own metadata puts the tags in the order every parser expects.
 *
 * ONE CONVERSION, AND WHY
 *
 * The browser compresses a photo to WebP, which is small and which nothing
 * that draws images can read: the image renderer behind this reads PNG,
 * JPEG, GIF and SVG. So a WebP photo is converted to PNG before it is
 * handed over. A photo that cannot be converted is not a reason to fail -
 * the initials are drawn instead.
 */

/** The image renderer runs on Node, because it needs the converter. */
export const runtime = "nodejs";

/** Satori reads TTF, OTF and WOFF. It cannot read WOFF2. */
const font = readFileSync(
  join(process.cwd(), "app", "fonts", "MatchaStyle.ttf"),
);

/** The formats the renderer can draw without being told to convert them. */
const READABLE = new Set(["png", "jpeg", "jpg", "gif", "svg+xml"]);

/**
 * The photograph, in a form the renderer can draw.
 *
 * Null when there is no photograph, or when it cannot be read - and null
 * means the initials are drawn instead, which is a fine answer.
 */
async function drawableAvatar(
  dataUrl: string | null | undefined,
): Promise<string | null> {
  if (!dataUrl) return null;

  try {
    const match = dataUrl.match(/^data:image\/([a-z+]+);base64,(.*)$/i);
    if (!match) return null;

    const [, kind, base64] = match;
    if (READABLE.has(kind.toLowerCase())) return dataUrl;

    const png = await sharp(Buffer.from(base64, "base64"))
      .png()
      .toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    return null;
  }
}

type Params = { params: Promise<{ handle: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { handle } = await params;
  const person = await getPublicProfile(decodeURIComponent(handle));
  const avatar = await drawableAvatar(person?.avatar);

  const name = person?.name ?? "Choufli Mosta9bel";
  const at = person ? `@${person.handle}` : "";
  const posts = person?.postCount
    ? `${person.postCount} ${person.postCount === 1 ? "post" : "posts"}`
    : "";

  // The initials, for a person with no photograph.
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 56,
          background: "#ffffff",
          padding: "0 88px",
          fontFamily: "Matcha",
          position: "relative",
        }}
      >
        {/* The photograph, or the initials in its place. */}
        {avatar ? (
          <img
            src={avatar}
            width={260}
            height={260}
            alt=""
            style={{
              width: 260,
              height: 260,
              borderRadius: 130,
              objectFit: "cover",
              display: "flex",
            }}
          />
        ) : (
          <div
            style={{
              width: 260,
              height: 260,
              borderRadius: 130,
              background: "#f5f5f7",
              color: "#86868b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 96,
            }}
          >
            {initials}
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            flex: 1,
          }}
        >
          <div
            style={{
              width: 48,
              height: 6,
              borderRadius: 3,
              background: "#0071e3",
              display: "flex",
            }}
          />

          <div
            style={{
              marginTop: 26,
              fontSize: name.length > 24 ? 62 : 76,
              lineHeight: 1.1,
              color: "#1d1d1f",
              letterSpacing: -1,
              display: "flex",
            }}
          >
            {name}
          </div>

          <div
            style={{
              marginTop: 16,
              fontSize: 32,
              color: "#6e6e73",
              display: "flex",
            }}
          >
            {at}
            {at && posts ? (
              <span style={{ margin: "0 14px" }}>·</span>
            ) : null}
            {posts}
          </div>

          <div
            style={{
              marginTop: 34,
              fontSize: 28,
              color: "#0071e3",
              letterSpacing: 3,
              display: "flex",
            }}
          >
            Choufli Mosta9bel
          </div>
        </div>

        {/* The site's mark, in the corner of the card. */}
        <div style={{ position: "absolute", bottom: 48, right: 72, display: "flex" }}>
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
}
