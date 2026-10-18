import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Web app manifest. Combined with the service worker (public/sw.js) this makes
 * the site installable on iOS, Android and desktop.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Choufli Mosta9bel",
    description:
      "Real, practical paths to a stable future for Tunisian youth, with or without a Bac.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    lang: site.locale,
    dir: "auto",
    categories: ["education", "productivity"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      // Adaptive icons: Android crops these, so the mark is inset.
      {
        src: "/icons/maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
