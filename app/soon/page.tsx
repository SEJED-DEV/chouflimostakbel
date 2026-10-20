import type { Metadata } from "next";
import SoonContent from "@/components/pages/SoonContent";

export const metadata: Metadata = {
  title: "Coming Soon",
  description:
    "What we are building next for Choufli Mosta9bel: accounts, community, custom profiles, and a feed that learns what you came here for.",
  alternates: { canonical: "/soon" },
  openGraph: { url: "/soon" },
};

export default function SoonPage() {
  return <SoonContent />;
}
