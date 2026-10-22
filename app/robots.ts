import type { MetadataRoute } from "next";
import { publicBaseUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = publicBaseUrl();
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
