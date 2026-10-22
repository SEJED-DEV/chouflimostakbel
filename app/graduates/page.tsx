import type { Metadata } from "next";
import GraduatesContent from "@/components/pages/GraduatesContent";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Graduates",
  description:
    "University orientation for Tunisian high school graduates: admission scores, the official orientation guide, and opportunities in Tunisia and abroad.",
  path: "/graduates",
  subtitle: "Admission scores, and what comes after the Bac.",
  section: "Guides",
});

export default function GraduatesPage() {
  return <GraduatesContent />;
}