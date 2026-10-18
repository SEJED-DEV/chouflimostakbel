import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://www.chouflimostakbel.tn/sitemap.xml",
    host: "https://www.chouflimostakbel.tn",
  };
}
