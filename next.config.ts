import type { NextConfig } from "next";

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
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
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
