import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PostEditor from "@/components/pages/PostEditor";
import { currentProfile } from "@/lib/auth";

/** Reads the session cookie, so this cannot be statically rendered. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New post",
  description: "Write a post for the Choufli Mosta9bel blogs.",
  alternates: { canonical: "/blogs/new" },
  openGraph: { url: "/blogs/new" },
  robots: { index: false, follow: false },
};

export default async function NewPostPage() {
  // Writing is for accounts. There is no half-signed-in state to render
  // here, and pretending otherwise would put a form on screen that could
  // not save.
  if (!(await currentProfile())) redirect("/login");
  return <PostEditor />;
}
