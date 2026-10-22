import type { Metadata } from "next";
import ProfileContent from "@/components/pages/ProfileContent";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Your profile",
  description: "Your Choufli Mosta9bel profile.",
  path: "/profile",
  subtitle: "Your account, your posts, your choices.",
  section: "Account",
  // A personal page has nothing to index.
  index: false,
});

export default function ProfilePage() {
  return <ProfileContent />;
}
