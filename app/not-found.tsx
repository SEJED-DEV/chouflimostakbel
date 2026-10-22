import type { Metadata } from "next";
import NotFoundContent from "@/components/pages/NotFoundContent";
import { pageMetadata } from "@/lib/seo";

/**
 * The 404 page.
 *
 * A server component so it can export its own metadata - a link to a page
 * that no longer exists still gets shared, and a card with a name on it is
 * better than a blank one. The body is a client component, below, because
 * it has to speak the reader's language.
 *
 * `index: false`, because a page that does not exist should not be indexed
 * even when a reader lands on it.
 */
export const metadata: Metadata = pageMetadata({
  title: "Page not found",
  description:
    "That address does not lead anywhere on Choufli Mosta9bel. Here are the ways back.",
  path: "/404",
  subtitle: "That page is not here.",
  section: "Not found",
  index: false,
});

export default function NotFound() {
  return <NotFoundContent />;
}
