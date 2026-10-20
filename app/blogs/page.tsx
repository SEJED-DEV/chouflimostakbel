import type { Metadata } from "next";
import BlogsContent from "@/components/pages/BlogsContent";
import { listVisiblePosts } from "@/lib/posts";

/**
 * The blogs index.
 *
 * A server component because the query needs the session cookie: the list is
 * everything this reader may see, which is every published post plus their
 * own drafts. Without a session it is simply the published ones.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "What people have written about orientation, school and what comes next.",
  alternates: { canonical: "/blogs" },
  openGraph: { url: "/blogs" },
};

export default async function BlogsPage() {
  const posts = await listVisiblePosts();
  return <BlogsContent posts={posts} />;
}
