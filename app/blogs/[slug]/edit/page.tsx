import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import PostEditor from "@/components/pages/PostEditor";
import { currentProfile } from "@/lib/auth";
import { getPostBySlug } from "@/lib/posts";

/** Reads the session cookie, and so does knowing whose post this is. */
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata(): Promise<Metadata> {
  // The title is filled in by the editor itself once it knows the post, and
  // either way this page must not be indexed: it is a form over one
  // person's draft.
  return {
    title: "Edit post",
    robots: { index: false, follow: false },
  };
}

export default async function EditPostPage({ params }: Params) {
  const profile = await currentProfile();
  if (!profile) redirect("/login");

  const { slug } = await params;
  const post = await getPostBySlug(decodeURIComponent(slug));

  // Not there, or not theirs. The two are deliberately the same answer: a
  // post you may not edit should not even be confirmed to exist.
  if (!post || post.authorId !== profile.id) notFound();

  return <PostEditor post={post} />;
}
