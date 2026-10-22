import type { Metadata } from "next";
import AboutContent from "@/components/pages/AboutContent";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Us",
  description:
    "Choufli Mosta9bel is a Tunisian guidance project helping dropouts, undecided students, and graduates find real, practical paths forward.",
  path: "/about",
  subtitle: "Who we are, and why this exists.",
  section: "About",
});

export default function AboutPage() {
  return <AboutContent />;
}
