import type { Metadata } from "next";
import DivisionsContent from "@/components/pages/DivisionsContent";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "HS Divisions",
  description:
    "Understand every Tunisian high school division before choosing: Sciences, Computer Science, Economics, Literature, and the 3rd year science tracks.",
  path: "/divisions",
  subtitle: "Every branch, before you choose.",
  section: "Guides",
});

export default function DivisionsPage() {
  return <DivisionsContent />;
}