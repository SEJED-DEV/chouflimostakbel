import type { Metadata } from "next";
import ChangelogContent from "@/components/pages/ChangelogContent";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Every release of Choufli Mosta9bel, newest first: PWA install and offline support, light and dark themes, and the first public version of the site.",
  alternates: { canonical: "/changelog" },
  openGraph: { url: "/changelog" },
};

export default function ChangelogPage() {
  return <ChangelogContent />;
}