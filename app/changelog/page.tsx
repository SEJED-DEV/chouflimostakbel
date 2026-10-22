import type { Metadata } from "next";
import ChangelogContent from "@/components/pages/ChangelogContent";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Changelog",
  description:
    "Every release of Choufli Mosta9bel, newest first: an admin panel, accounts, a community, and previews that say who wrote what.",
  path: "/changelog",
  subtitle: "Every release, newest first.",
  section: "Updates",
});

export default function ChangelogPage() {
  return <ChangelogContent />;
}