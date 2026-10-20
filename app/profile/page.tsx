import type { Metadata } from "next";
import ProfileContent from "@/components/pages/ProfileContent";

export const metadata: Metadata = {
  title: "Your profile",
  description: "Your Choufli Mosta9bel profile.",
  alternates: { canonical: "/profile" },
  openGraph: { url: "/profile" },
  // A personal page has nothing to index.
  robots: { index: false, follow: true },
};

export default function ProfilePage() {
  return <ProfileContent />;
}
