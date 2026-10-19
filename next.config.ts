import type { NextConfig } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The commit this build was made from, read at BUILD time and inlined.
 *
 * The prebuild script writes lib/build-info.json before `next build` starts,
 * and this file is evaluated when the build starts, so the value below is
 * frozen into the bundle.
 *
 * It has to be frozen. Reading the file at request time looks equivalent and
 * is not: a server whose files have been updated but whose process has not
 * been restarted would read the NEW sha and report itself as current, while
 * still serving the OLD prerendered pages. That is exactly the situation the
 * status line exists to detect, so it must not be able to hide it.
 */
function buildInfo() {
  try {
    return JSON.parse(
      readFileSync(join(process.cwd(), "lib", "build-info.json"), "utf8"),
    ) as {
      repo?: string;
      sha?: string | null;
      shortSha?: string | null;
      dirty?: boolean;
      builtAt?: string;
    };
  } catch {
    return {};
  }
}

const info = buildInfo();

/**
 * Cache policy, stated explicitly because the default is wrong for a site
 * that ships often.
 *
 * Next.js serves prerendered pages with `s-maxage=31536000`, which tells a CDN
 * to hold the HTML document for a year. That is fine until the next deploy:
 * every visitor the CDN hands the old document to is holding HTML that names
 * chunks the new build deleted, and the page dies on a ChunkLoadError. The
 * assets themselves are content-hashed and genuinely immutable - it is only
 * the document that must be revalidated.
 *
 * The two rules below are deliberately disjoint (the first excludes
 * _next/static) so that which one wins cannot depend on array order.
 */
const nextConfig: NextConfig = {
  // Inlined at build time, so a stale process keeps reporting its own sha.
  env: {
    BUILD_REPO: info.repo || "SEJED-DEV/chouflimostakbel",
    BUILD_SHA: info.sha || "",
    BUILD_SHORT_SHA: info.shortSha || "",
    BUILD_DIRTY: info.dirty ? "true" : "false",
    BUILD_AT: info.builtAt || "",
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },

  async redirects() {
    return [
      // The old site was four hand-written HTML pages. Those URLs sit in
      // bookmarks and in links people shared, and a 404 for them is the
      // first thing a returning reader sees. They redirect to the routes
      // that replaced them.
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/dropouts.html", destination: "/dropouts", permanent: true },
      { source: "/divisions.html", destination: "/divisions", permanent: true },
      { source: "/graduates.html", destination: "/graduates", permanent: true },
      // Any other page that ended in .html drops the suffix.
      { source: "/:file([^/]+)\\.html", destination: "/:file", permanent: true },
      // The old site sent people to a third-party score calculator. The
      // built-in one replaced it, and lives on the graduates page.
      { source: "/calculator", destination: "/graduates", permanent: true },
      { source: "/score", destination: "/graduates", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        // Documents, and everything else that is not a build asset: always
        // revalidate. This also covers sw.js, which must never be cached or a
        // new service worker cannot reach anyone.
        //
        // /api is excluded because those routes set their own Cache-Control.
        // Revalidating the status endpoint on every view would mean a GitHub
        // request per page view, which is the rate limit it exists to avoid.
        source: "/:path((?!_next/static|_next/image|api/).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      {
        // Build output is content-hashed: the name changes when the bytes do,
        // so it can be cached forever.
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
