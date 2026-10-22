import type { Metadata } from "next";
import TermsContent from "@/components/pages/TermsContent";
import { pageMetadata } from "@/lib/seo";

/**
 * The terms of service. A server component, so the metadata is static; the
 * page body is a client component so it can switch language.
 *
 * The title and description stay in English on purpose: the site has one URL
 * per page and no per-locale routes, so there is nothing to vary them by.
 * Per-locale routes would be the only way to do it properly.
 */
export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "The terms that govern your use of the Choufli Mosta9bel website.",
  path: "/terms",
  subtitle: "The rules for using Choufli Mosta9bel.",
  section: "Legal",
});

export default function TermsPage() {
  return <TermsContent />;
}
