import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getPostBySlug } from "@/lib/posts";
import { LogoMark } from "@/lib/og-logo";

/**
 * The preview image for one post.
 *
 * A post is the kind of thing that gets pasted into a group chat, and a
 * preview is the first thing the chat shows. A picture of the site for
 * every post says nothing about which post it is, so each one gets its own
 * image with its own title on it.
 *
 * The image is generated, not stored: a post can be edited, and an edited
 * post with an old picture on it is a lie.
 *
 * This is an ordinary route rather than the `opengraph-image.tsx` file
 * convention. The convention injects its own `og:image` tags into the page,
 * and it emits `og:image:alt` and `og:image:type` BEFORE `og:image` - a
 * shape a chat app's parser can read as properties with no image to hang
 * them on, and the preview then comes out empty. Declaring the image in the
 * page's own metadata puts the tags in the order every parser expects.
 *
 * The type is the site's own display face - the one the hero headlines use,
 * because a preview is a headline.
 */

/** Satori reads TTF, OTF and WOFF. It cannot read WOFF2. */
const font = readFileSync(
  join(process.cwd(), "app", "fonts", "MatchaStyle.ttf"),
);

export const runtime = "nodejs";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(decodeURIComponent(slug));

  // A post that does not exist still gets an image, because a chat app
  // asked for one and an error would be a broken image in a conversation.
  const title = post?.title ?? "Choufli Mosta9bel";
  const author = post?.author.name ?? "";
  const date = post?.publishedAt
    ? new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(
        new Date(post.publishedAt),
      )
    : "";
  const read = post?.readingMinutes
    ? `${post.readingMinutes} min read`
    : "";

  return new ImageResponse(
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

        {/* The title. The lines are cut by Satori, so the size is set to
            fit the longest titles without the box overflowing. */}
        <div
          style={{
            display: "flex",
            fontSize: title.length > 80 ? 54 : title.length > 45 ? 66 : 78,
            lineHeight: 1.12,
            color: "#1d1d1f",
            letterSpacing: -1,
          }}
        >
          {title}
        </div>

        {/* Who wrote it, and when, with the site's mark in the corner. */}
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
            }}
          >
            {author}
            {author && date ? (
              <span style={{ margin: "0 14px" }}>·</span>
            ) : null}
            {date}
            {date && read ? (
              <span style={{ margin: "0 14px" }}>·</span>
            ) : null}
            {read}
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
}
