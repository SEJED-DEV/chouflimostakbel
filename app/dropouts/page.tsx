import type { Metadata } from "next";
import DropoutsContent from "@/components/pages/DropoutsContent";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "School Dropouts",
  description:
    "ATFP programs and second chance schools for school dropouts in Tunisia: CC, CAP, BTP, BTS, and how to apply.",
  path: "/dropouts",
  subtitle: "ATFP programs and second-chance schools.",
  section: "Guides",
});

export default function DropoutsPage() {
  return <DropoutsContent />;
}