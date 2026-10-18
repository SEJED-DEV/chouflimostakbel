import type { Metadata } from "next";
import AboutContent from "@/components/pages/AboutContent";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Choufli Mosta9bel is a Tunisian guidance project helping dropouts, undecided students, and graduates find real, practical paths forward.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

export default function AboutPage() {
  return <AboutContent />;
}
