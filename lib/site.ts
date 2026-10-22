/**
 * Single source of truth for site-wide constants and contact details.
 *
 * There are two distinct identities here, and they are deliberately separate:
 *
 *   1. THE PROJECT  - Choufli Mosta9bel. Its own email, domain and socials.
 *                     Shown in the footer and the contact section.
 *                     >>> Edit the PROJECT block below to change these. <<<
 *
 *   2. THE PUBLISHER - Sejed Trabelsi, who built and publishes the project.
 *                     Synced from sejed.dev, and shown ONLY in the legal
 *                     notices. Never mixed into the project's contact details.
 */

import author from "./site.generated.json";

/* ------------------------------------------------------------------ *
 * 1. THE PROJECT - edit these by hand
 * ------------------------------------------------------------------ */
export const site = {
  name: "Choufli Mosta9bel",
  tagline: "Find your path",
  /** Change this in ONE place when the domain moves - sitemap/robots/SEO use it. */
  domain: "https://www.chouflimostakbel.tn",
  /**
   * The hostnames that mean "this is the real site".
   *
   * The contact form opens itself on these and stays closed everywhere else,
   * so a half-finished build on a preview domain never collects messages it
   * cannot deliver. Both the apex and the www form count.
   */
  liveHosts: ["chouflimostakbel.tn", "www.chouflimostakbel.tn"],
  email: "contact@chouflimostakbel.tn",
  /** For tel: links - digits with a leading +, no spaces. */
  phoneHref: "",
  phoneDisplay: "",
  locale: "en_US",
} as const;

/**
 * The project's own social accounts.
 *
 * Accepts EITHER a bare handle ("choufli_mostakbel") or a full profile URL
 * ("https://www.instagram.com/choufli_mostakbel/") - both are normalised.
 * Set a value to "" to hide that icon entirely.
 */
export const projectSocials: { network: string; handle: string }[] = [
  { network: "instagram", handle: "https://www.instagram.com/choufli_mostakbel/" },
  { network: "linkedin", handle: "https://www.linkedin.com/company/choufli-mostakbel" },
  { network: "github", handle: "" },
  { network: "x", handle: "" },
];

/** Where each network's profile lives. */
const SOCIAL_BASES: Record<string, string> = {
  instagram: "https://instagram.com/",
  linkedin: "https://linkedin.com/in/",
  github: "https://github.com/",
  x: "https://x.com/",
  facebook: "https://facebook.com/",
  tiktok: "https://tiktok.com/@",
  youtube: "https://youtube.com/@",
  discord: "https://discord.gg/",
  telegram: "https://t.me/",
};

const SOCIAL_HOSTS = new Set([
  "instagram.com",
  "linkedin.com",
  "github.com",
  "twitter.com",
  "x.com",
  "facebook.com",
  "tiktok.com",
  "youtube.com",
  "discord.gg",
  "t.me",
]);

/**
 * Normalise a pasted value into a clean profile URL.
 *
 * Accepts all three shapes people actually type:
 *   "choufli_mostakbel"                                    bare handle
 *   "www.instagram.com/choufli_mostakbel/"                 protocol-less URL
 *   "https://www.linkedin.com/company/choufli-mostakbel"   absolute URL
 *
 * A LinkedIn /company/ slug stays under /company/ - company pages are not
 * personal profiles.
 */
function normaliseHandle(network: string, raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;

  const segments = value
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/+$/, "")
    .split("/")
    .filter(Boolean);

  if (segments.length === 0) return null;

  if (SOCIAL_HOSTS.has(segments[0].toLowerCase())) segments.shift();
  if (segments.length === 0) return null;

  const kind = segments[0].toLowerCase();
  const slug = segments[segments.length - 1].replace(/^@/, "");
  if (!slug) return null;

  if (network === "linkedin" && kind === "company") {
    return `https://linkedin.com/company/${slug}`;
  }
  return (SOCIAL_BASES[network] ?? SOCIAL_BASES.github) + slug;
}

/** Resolve entries into full URLs, dropping empties and duplicates. */
function resolveSocials(
  entries: { network: string; handle: string }[]
): { network: string; href: string; handle: string }[] {
  const seen = new Set<string>();
  const out: { network: string; href: string; handle: string }[] = [];
  for (const e of entries) {
    if (!SOCIAL_BASES[e.network]) continue;
    const href = normaliseHandle(e.network, e.handle);
    if (!href || seen.has(href)) continue;
    seen.add(href);
    out.push({ network: e.network, href, handle: e.handle });
  }
  return out;
}

/** The project's contact links, ready to render. */
export const socialLinks = resolveSocials(projectSocials);

/* ------------------------------------------------------------------ *
 * 2. THE PUBLISHER - synced from sejed.dev, legal notices only
 * ------------------------------------------------------------------ */
export const authorProfile = {
  name: author.name,
  role: author.role,
  url: author.url,
  image: author.image,
  email: author.email,
  /** Not published on sejed.dev yet - hardcoded until it is. */
  phone: "+216 94 155 000",
  location: author.location,
  socials: author.socials as Record<string, string>,
} as const;

export const authorSocialLinks = Object.entries(authorProfile.socials).map(
  ([network, href]) => ({ network, href })
);

/* ------------------------------------------------------------------ *
 * Hosting - referenced by the legal notices
 * ------------------------------------------------------------------ */
export const hosting = {
  /** Provider network. */
  provider: "CortexHQ",
  url: "https://cortexhq.net",
  domain: "cortexhq.net",
  /** Data centre location. */
  city: "Gravelines",
  code: "GRA",
  country: "France",
  countryCode: "FR",
} as const;

/** Public contact addresses for the project. */
export const contact = {
  email: site.email,
  phoneHref: site.phoneHref,
  phoneDisplay: site.phoneDisplay,
} as const;

/** Source repository, used to link changelog entries to their commits. */
export const REPO_URL = "https://github.com/SEJED-DEV/chouflimostakbel";

/**
 * True when the given hostname is one of the project's real domains.
 *
 * Used to decide whether the contact form should be open. A preview build
 * hosted somewhere else stays closed, because a form that quietly swallows
 * messages is worse than no form at all.
 */
export function isLiveHost(hostname: string): boolean {
  const host = hostname.toLowerCase().split(":")[0];
  return (site.liveHosts as readonly string[]).includes(host);
}

/**
 * The base URL every absolute link is built from - canonical URLs, Open
 * Graph images, the sitemap, the structured data.
 *
 * `site.domain` is the address the project intends to live at. The site is
 * currently served from a preview host, and the two are not the same
 * machine: the domain still answers with an older deployment. Building
 * preview and canonical URLs from the intended domain while the site is
 * served somewhere else is how a shared link ends up pointing at a picture
 * that is not there.
 *
 * So the base is taken from `SITE_URL` when it is set - which is what the
 * deployment sets, to the host it is actually reachable at - and from
 * `site.domain` otherwise. The trailing slash is stripped so a base and a
 * path cannot meet as `//`.
 */
export function publicBaseUrl(): string {
  const configured = process.env.SITE_URL?.trim();
  const raw = configured && configured.length > 0 ? configured : site.domain;
  return raw.replace(/\/+$/, "");
}
