import type { Metadata } from "next";
import BlogsContent from "@/components/pages/BlogsContent";
import { listVisiblePosts } from "@/lib/posts";
import { listPublicPeople } from "@/lib/people";

/**
 * The community.
 *
 * A server component because the query needs the session cookie: the list is
 * everything this reader may see, which is every published post plus their
 * own drafts. Without a session it is simply the published ones.
 *
 * The people are read here too, so the search can find a writer and not only
 * a post. They are read unfiltered and filtered in the component, for the
 * reason given on `listPublicPeople`.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Community",
  description:
    "What people have written about orientation, school and what comes next.",
  alternates: { canonical: "/community" },
  openGraph: { url: "/community" },
};

export default async function CommunityPage() {
  const [posts, people] = await Promise.all([
    listVisiblePosts(),
    listPublicPeople(),
  ]);

  // The clock is read once, here, and handed down. The cards render "14 min
  // ago" from this value, so the phrase is in the HTML and the browser's
  // hydration produces the same string rather than a second, later one.
  return (
    <BlogsContent posts={posts} people={people} now={new Date().toISOString()} />
  );
}
