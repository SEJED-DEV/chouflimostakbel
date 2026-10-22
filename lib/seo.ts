import type { Metadata } from "next";
import { site } from "./site";
import type { Post } from "./posts";
import type { PublicProfile } from "./people";

/**
 * The SEO of the two things on this site that are made by readers.
 *
 * Every post and every person is a page that a search engine and a chat
 * app will both ask about, and both ask the same questions: what is this,
 * who wrote it, and when. The answers are built here, once, so a post and a
 * profile are described in the same way and a third page type does not end
 * up with a different one by accident.
 *
 * What is deliberately absent: `hreflang`. The site speaks three languages
 * but serves one address and switches the words in the browser, so there is
 * no second URL to point at. Declaring three languages for one URL would be
 * a claim the site cannot keep.
 */

/** How long a description may be before a search engine stops reading it. */
const DESCRIPTION_LIMIT = 200;

/**
 * The preview image for a page of the site itself.
 *
 * The site draws one picture per page from that page's own title, so a link
 * to the terms and a link to the changelog do not show the same thing. The
 * route lives at /og and takes the title, a short subtitle and the section
 * as query parameters, which is what makes one engine serve every static
 * page without a file next to each of them.
 */
function pageImage(title: string, subtitle?: string, kicker?: string): string {
  const params = new URLSearchParams({ title });
  if (subtitle) params.set("subtitle", clamp(subtitle));
  if (kicker) params.set("kicker", kicker);
  return `/og?${params.toString()}`;
}

/**
 * The metadata for a static page of the site.
 *
 * Every page that is not a post or a person is described here, once, so the
 * title, the canonical URL, the preview image and the Twitter card are the
 * same shape everywhere. A page that set only `openGraph.url` of its own
 * used to lose the site's image, because a page's `openGraph` replaces the
 * layout's rather than merging with it; going through this keeps the image.
 */
export function pageMetadata(options: {
  title: string;
  description: string;
  path: string;
  /** A short line under the title on the preview image. */
  subtitle?: string;
  /** The section name shown at the foot of the preview image. */
  section?: string;
  /** Set false for pages that should not be indexed, such as /profile. */
  index?: boolean;
}): Metadata {
  const description = clamp(options.description);
  const image = pageImage(options.title, options.subtitle, options.section);
  const robots =
    options.index === false
      ? { index: false, follow: true }
      : undefined;

  return {
    title: options.title,
    description,
    alternates: { canonical: options.path },
    robots,
    openGraph: {
      type: "website",
      url: options.path,
      title: options.title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: options.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: options.title,
      description,
      images: [image],
    },
  };
}

/** A description, trimmed to what a search engine will actually show. */
function clamp(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= DESCRIPTION_LIMIT) return clean;
  return `${clean.slice(0, DESCRIPTION_LIMIT - 1).trimEnd()}…`;
}

/**
 * A post's metadata.
 *
 * The author is given a URL as well as a name, so a reader who finds the
 * post in a search can go from the post to the person. The tags become
 * keywords, because a post about a specific thing is findable by that thing
 * and not only by its title.
 */
export function postMetadata(post: Post): Metadata {
  const url = `/community/${post.slug}`;
  const description = clamp(
    post.excerpt ||
      `${post.title} — written by ${post.author.name} on Choufli Mosta9bel.`,
  );

  return {
    title: post.title,
    description,
    keywords: post.tags.length ? post.tags : undefined,
    authors: [
      {
        name: post.author.name,
        url: `/u/${post.author.handle}`,
      },
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags.length ? post.tags : undefined,
      section: "Community",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
    },
  };
}

/**
 * A post as a schema.org Article.
 *
 * `BlogPosting` rather than `Article`, because that is what a post is, and
 * the type is what tells a search engine this is something a person wrote
 * rather than a page of the site.
 */
export function postJsonLd(post: Post) {
  const url = `${site.domain}/community/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: post.title,
    description: clamp(post.excerpt || post.title),
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt,
    inLanguage: "en",
    keywords: post.tags.length ? post.tags.join(", ") : undefined,
    articleSection: "Community",
    wordCount: post.readingMinutes * 220,
    author: {
      "@type": "Person",
      name: post.author.name,
      url: `${site.domain}/u/${post.author.handle}`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${site.domain}/#organization`,
      name: site.name,
      logo: {
        "@type": "ImageObject",
        url: `${site.domain}/logo.svg`,
      },
    },
  };
}

/**
 * A person's metadata.
 *
 * The description says what the site is and who the person is on it, rather
 * than inventing a biography nobody wrote. A profile here is a public page
 * of a reader's posts, and the honest description of one is that.
 */
export function personMetadata(person: PublicProfile): Metadata {
  const url = `/u/${person.handle}`;
  const description = clamp(
    `${person.name} (@${person.handle}) on Choufli Mosta9bel${
      person.postCount
        ? ` — ${person.postCount} ${person.postCount === 1 ? "post" : "posts"}`
        : ""
    }.`,
  );

  return {
    title: `${person.name} (@${person.handle})`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "profile",
      url,
      title: `${person.name} (@${person.handle})`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${person.name} (@${person.handle})`,
      description,
    },
  };
}

/**
 * A person as a ProfilePage, with the Person inside it.
 *
 * `ProfilePage` is the page; `Person` is who it is about. A search engine
 * that finds this page should be able to say what kind of thing it is and
 * whose it is, which is what the two types together say.
 */
export function personJsonLd(person: PublicProfile) {
  const url = `${site.domain}/u/${person.handle}`;

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#profilepage`,
    url,
    mainEntity: {
      "@type": "Person",
      "@id": `${url}#person`,
      name: person.name,
      alternateName: `@${person.handle}`,
      url,
      description: clamp(
        `${person.name} writes on Choufli Mosta9bel, a guidance site for Tunisian students.`,
      ),
      image: person.avatar ?? undefined,
      memberSince: person.joinedAt,
    },
  };
}
