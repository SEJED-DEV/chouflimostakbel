import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthPage from "@/components/pages/AuthPage";
import { currentProfile } from "@/lib/auth";
import { pageMetadata } from "@/lib/seo";

/** Reads the session cookie, so this cannot be statically rendered. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Create an account",
  description:
    "Create a Choufli Mosta9bel account. A username and a password is enough - an email address is optional.",
  path: "/signup",
  subtitle: "A username and a password is enough.",
  section: "Account",
  index: false,
});

export default async function SignupPage() {
  // A signed-in reader has no business here either.
  if (await currentProfile()) redirect("/profile");
  return <AuthPage mode="signUp" />;
}
