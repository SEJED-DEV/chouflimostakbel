/**
 * Generates the PWA icon set from public/favicon.png.
 *
 * Chrome requires 192px and 512px icons, and recommends a maskable variant
 * for adaptive launchers. Run after changing the favicon:
 *
 *   node scripts/generate-icons.mjs
 */

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(HERE, "..", "public");
const ICONS = join(PUBLIC, "icons");
const SOURCE = join(PUBLIC, "favicon.png");

await mkdir(ICONS, { recursive: true });

/** Standard icons: the mark centred on the light background, as-is. */
const targets = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

for (const { name, size } of targets) {
  await sharp(SOURCE)
    .resize(size, size, { fit: "contain", background: "#ffffff" })
    .png({ compressionLevel: 9 })
    .toFile(join(ICONS, name));
  console.log("wrote icons/" + name);
}

/**
 * Maskable icon: Android crops these to a circle/squircle, so the mark is
 * scaled down to ~60% and centred on an opaque field. Without this the logo
 * gets its edges clipped on many launchers.
 */
const maskableSizes = [192, 512];
for (const size of maskableSizes) {
  const inner = Math.round(size * 0.6);
  const mark = await sharp(SOURCE)
    .resize(inner, inner, { fit: "contain", background: "#ffffff" })
    .png()
    .toBuffer();

  const pad = Math.round((size - inner) / 2);
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: "#ffffff",
    },
  })
    .composite([{ input: mark, top: pad, left: pad }])
    .png({ compressionLevel: 9 })
    .toFile(join(ICONS, `maskable-${size}.png`));
  console.log(`wrote icons/maskable-${size}.png`);
}

console.log("Done.");
