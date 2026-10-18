import type { Metadata } from "next";
import GraduatesContent from "@/components/pages/GraduatesContent";

export const metadata: Metadata = {
  title: "Graduates",
  description:
    "University orientation for Tunisian high school graduates: admission scores, the official orientation guide, and opportunities in Tunisia and abroad.",
  alternates: { canonical: "/graduates" },
  openGraph: { url: "/graduates" },
};

export default function GraduatesPage() {
  return <GraduatesContent />;
}