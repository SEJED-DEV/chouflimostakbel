import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostContent from "@/components/pages/PostContent";
import JsonLd from "@/components/JsonLd";
import { getPostBySlug } from "@/lib/posts";
import { postJsonLd, postMetadata } from "@/lib/seo";

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

  return postMetadata(post);
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(decodeURIComponent(slug));

  // A draft the caller cannot see does not come back at all, so this is what
  // an ordinary 404 looks like whether the post never existed or is simply
  // not theirs - which is the point: it does not confirm either way.
  if (!post) notFound();

  return (
    <>
      {/* The post, described as what it is: something a person wrote. A
          search engine reads this to decide that it is an article by an
          author rather than another page of the site. */}
      {post.status === "published" && <JsonLd data={postJsonLd(post)} />}
      <PostContent post={post} />
    </>
  );
}
