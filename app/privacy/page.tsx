import type { Metadata } from "next";
import PrivacyContent from "@/components/pages/PrivacyContent";

/**
 * The privacy policy. A server component, so the metadata is static; the
 * page body is a client component so it can switch language.
 *
 * The title and description stay in English on purpose: the site has one URL
 * per page and no per-locale routes, so there is nothing to vary them by.
 * Per-locale routes would be the only way to do it properly.
 */
export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Choufli Mosta9bel collects, uses and protects your personal data.",
  alternates: { canonical: "/privacy" },
  openGraph: { url: "/privacy" },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
