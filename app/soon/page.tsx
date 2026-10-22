import type { Metadata } from "next";
import SoonContent from "@/components/pages/SoonContent";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Coming Soon",
  description:
    "What we are building next for Choufli Mosta9bel: security updates, attachments, reactions and comments, direct messages, and a feed that learns what you came here for.",
  path: "/soon",
  subtitle: "The roadmap, written in the open.",
  section: "Roadmap",
});

export default function SoonPage() {
  return <SoonContent />;
}
