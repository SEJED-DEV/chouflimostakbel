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
  // The clock is read once, here, and handed down. The cards render "14 min
  // ago" from this value, so the phrase is in the HTML and the browser's
  // hydration produces the same string rather than a second, later one.
  return <BlogsContent posts={posts} now={new Date().toISOString()} />;
}
