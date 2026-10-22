"use client";

import { useEffect, useState } from "react";

/**
 * The tone of a profile photo, read from the photo itself.
 *
 * The account button shows the reader's picture, and a picture has a light
 * end and a dark end. A button drawn only in the interface's own colours can
 * end up with a white photo on a pale ring, or a dark photo on a dark ring,
 * and the picture stops reading as a picture and starts reading as a hole.
 *
 * So the photo is sampled - sixteen pixels across is enough - and the button
 * takes its ring from the average. A light photo gets a light ring, a dark
 * one gets a dark ring, and either way the picture sits on something that
 * belongs to it.
 *
 * Best effort, and never a failure: a photo that cannot be read - a broken
 * image, a canvas the browser will not give us, an avatar stored as
 * something other than an image - leaves the button exactly as it was.
 */
export interface AvatarTheme {
  /** The average colour of the photo, as an rgb string. */
  colour: string;
  /** True when the photo is mostly light. */
  light: boolean;
}

export function useAvatarTheme(
  src: string | null | undefined,
): AvatarTheme | null {
  const [theme, setTheme] = useState<AvatarTheme | null>(null);

  useEffect(() => {
    if (!src) {
      setTheme(null);
      return;
    }

    let cancelled = false;
    const image = new Image();

    // A data URL is same-origin by construction, so this cannot taint the
    // canvas. The crossOrigin attribute is set anyway for the case where a
    // photo ever comes from elsewhere: a tainted canvas throws on
    // getImageData, and the try/catch below is the answer to that.
    if (!src.startsWith("data:")) image.crossOrigin = "anonymous";

    image.onload = () => {
      if (cancelled) return;

      try {
        const size = 16;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;

        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) return;

        context.drawImage(image, 0, 0, size, size);
        const { data } = context.getImageData(0, 0, size, size);

        let red = 0;
        let green = 0;
        let blue = 0;
        let weight = 0;

        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3] / 255;
          if (alpha < 0.5) continue;
          red += data[i] * alpha;
          green += data[i + 1] * alpha;
          blue += data[i + 2] * alpha;
          weight += alpha;
        }

        if (!weight) {
          setTheme(null);
          return;
        }

        const r = Math.round(red / weight);
        const g = Math.round(green / weight);
        const b = Math.round(blue / weight);

        // Perceived brightness. The coefficients are the usual ones, and they
        // are here because a photo of a pale wall and a photo of a dark coat
        // have very different averages but the same relative luminance.
        const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

        setTheme({ colour: `rgb(${r}, ${g}, ${b})`, light: luminance > 0.55 });
      } catch {
        // A canvas that will not give us its pixels is not a reason to
        // break the button.
        setTheme(null);
      }
    };

    image.onerror = () => {
      if (!cancelled) setTheme(null);
    };

    image.src = src;

    return () => {
      cancelled = true;
    };
  }, [src]);

  return theme;
}
