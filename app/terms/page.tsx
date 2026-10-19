import type { Metadata } from "next";
import TermsContent from "@/components/pages/TermsContent";

/**
 * The terms of service. A server component, so the metadata is static; the
 * page body is a client component so it can switch language.
 *
 * The title and description stay in English on purpose: the site has one URL
 * per page and no per-locale routes, so there is nothing to vary them by.
 * Per-locale routes would be the only way to do it properly.
 */
export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of the Choufli Mosta9bel website.",
  alternates: { canonical: "/terms" },
  openGraph: { url: "/terms" },
};

export default function TermsPage() {
  return <TermsContent />;
}
