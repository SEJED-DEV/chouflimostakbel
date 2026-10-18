import type { MetadataRoute } from "next";

/**
 * Sitemap for the whole site. Clean slate: we own every URL, so this is the
 * single source of truth for which pages exist.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.chouflimostakbel.tn";

  const routes = [
    { path: "", priority: 1.0, freq: "weekly" as const },
    { path: "/dropouts", priority: 0.9, freq: "monthly" as const },
    { path: "/divisions", priority: 0.9, freq: "monthly" as const },
    { path: "/graduates", priority: 0.9, freq: "monthly" as const },
    { path: "/about", priority: 0.6, freq: "yearly" as const },
    { path: "/privacy", priority: 0.2, freq: "yearly" as const },
    { path: "/terms", priority: 0.2, freq: "yearly" as const },
    { path: "/soon", priority: 0.5, freq: "monthly" as const },
    { path: "/changelog", priority: 0.3, freq: "monthly" as const },
  ];

  const lastModified = new Date();

  return routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified,
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
