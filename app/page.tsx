import type { Metadata } from "next";
import HomeContent from "@/components/pages/HomeContent";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return <HomeContent />;
}
