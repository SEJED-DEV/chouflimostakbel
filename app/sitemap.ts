import type { MetadataRoute } from "next";
import { publicBaseUrl } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

/**
 * Sitemap for the whole site. Clean slate: we own every URL, so this is the
 * single source of truth for which pages exist.
 *
 * The fixed pages are listed below, and the two things that actually change -
 * posts and the people who wrote them - are read from the database. A sitemap
 * that only held the static half would be advertising the pages that never
 * move and omitting the ones that do.
 *
 * Only published posts and only people who have published appear. A draft is
 * not a URL anyone may fetch, and naming it here would be handing a search
 * engine an address that answers 404.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = publicBaseUrl();
  const lastModified = new Date();

  const routes = [
    { path: "", priority: 1.0, freq: "weekly" as const },
    { path: "/dropouts", priority: 0.9, freq: "monthly" as const },
    { path: "/divisions", priority: 0.9, freq: "monthly" as const },
    { path: "/graduates", priority: 0.9, freq: "monthly" as const },
    { path: "/community", priority: 0.8, freq: "daily" as const },
    { path: "/about", priority: 0.6, freq: "yearly" as const },
    { path: "/contact", priority: 0.5, freq: "yearly" as const },
    { path: "/privacy", priority: 0.2, freq: "yearly" as const },
    { path: "/terms", priority: 0.2, freq: "yearly" as const },
    { path: "/soon", priority: 0.5, freq: "monthly" as const },
    { path: "/changelog", priority: 0.3, freq: "monthly" as const },
  ];

  const fixed: MetadataRoute.Sitemap = routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified,
    changeFrequency: r.freq,
    priority: r.priority,
  }));

  // A sitemap that fails to reach the database should still be a sitemap, so
  // the dynamic half is best-effort rather than fatal.
  try {
    const supabase = await createClient();

    const { data: posts } = await supabase
      .from("posts")
      .select("slug, updated_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(5000);

    const { data: people } = await supabase
      .from("public_profiles")
      .select("handle")
      .limit(5000);

    const postUrls: MetadataRoute.Sitemap = (
      Array.isArray(posts) ? (posts as { slug: string; updated_at: string }[]) : []
    ).map((p) => ({
      url: `${base}/community/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const personUrls: MetadataRoute.Sitemap = (
      Array.isArray(people) ? (people as { handle: string }[]) : []
    ).map((p) => ({
      url: `${base}/u/${p.handle}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    }));

    return [...fixed, ...postUrls, ...personUrls];
  } catch {
    return fixed;
  }
}
