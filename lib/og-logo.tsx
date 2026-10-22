import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The site's logo mark, as a data URL the image renderer can draw.
 *
 * The generated preview images all carry the mark in their bottom-right
 * corner, so a shared link is recognisably this site's even before the name
 * is read. It is the same picture the navigation uses.
 *
 * It is read once at module load rather than per request: the file does not
 * change between two requests, and re-encoding it every time a chat app asks
 * for a card would be work for nothing. The path is resolved from the
 * project root so it works wherever the server was started from.
 *
 * The renderer reads PNG, JPEG, GIF and SVG - this is a PNG, which is what
 * makes it safe to hand over as-is.
 */
export const LOGO_DATA_URL = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public", "favicon.png"),
).toString("base64")}`;

/**
 * The mark, positioned in the bottom-right corner of a 1200x630 card.
 *
 * Kept as a component so all three image routes place it identically - a
 * logo that sits in a slightly different spot on the terms page than on a
 * post is the kind of detail that reads as broken.
 */
export function LogoMark({ size = 74 }: { size?: number }) {
  return (
    <img
      src={LOGO_DATA_URL}
      width={size}
      height={size}
      alt=""
      style={{
        width: size,
        height: size,
        objectFit: "contain",
      }}
    />
  );
}
