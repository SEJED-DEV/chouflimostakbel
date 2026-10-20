import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostContent from "@/components/pages/PostContent";
import { getPostBySlug } from "@/lib/posts";

/** Reads the session cookie, and a draft can only be resolved with one. */
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(decodeURIComponent(slug));

  // A draft is not a page the public has, so it gets no metadata of its own
  // and is kept out of the index. A post that does not exist is treated the
  // same way rather than advertising that the address was close.
  if (!post || post.status !== "published") {
    return {
      title: "Post",
      robots: { index: false, follow: false },
    };
  }

  const url = `/blogs/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt || `${post.author.name} on Choufli Mosta9bel`,
    alternates: { canonical: url },
    openGraph: {
      url,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      authors: [post.author.name],
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(decodeURIComponent(slug));

  // A draft the caller cannot see does not come back at all, so this is what
  // an ordinary 404 looks like whether the post never existed or is simply
  // not theirs - which is the point: it does not confirm either way.
  if (!post) notFound();

  return <PostContent post={post} />;
}
