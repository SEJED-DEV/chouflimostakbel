import type { Metadata } from "next";
import DropoutsContent from "@/components/pages/DropoutsContent";

export const metadata: Metadata = {
  title: "School Dropouts",
  description:
    "ATFP programs and second chance schools for school dropouts in Tunisia: CC, CAP, BTP, BTS, and how to apply.",
  alternates: { canonical: "/dropouts" },
  openGraph: { url: "/dropouts" },
};

export default function DropoutsPage() {
  return <DropoutsContent />;
}