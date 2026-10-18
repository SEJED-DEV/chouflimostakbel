import type { Metadata } from "next";
import DivisionsContent from "@/components/pages/DivisionsContent";

export const metadata: Metadata = {
  title: "HS Divisions",
  description:
    "Understand every Tunisian high school division before choosing: Sciences, Computer Science, Economics, Literature, and the 3rd year science tracks.",
  alternates: { canonical: "/divisions" },
  openGraph: { url: "/divisions" },
};

export default function DivisionsPage() {
  return <DivisionsContent />;
}