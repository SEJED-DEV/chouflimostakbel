import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthPage from "@/components/pages/AuthPage";
import { currentProfile } from "@/lib/auth";

/** Reads the session cookie, so this cannot be statically rendered. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Create a Choufli Mosta9bel account. A username and a password is enough - an email address is optional.",
  alternates: { canonical: "/signup" },
  openGraph: { url: "/signup" },
  robots: { index: false, follow: true },
};

export default async function SignupPage() {
  // A signed-in reader has no business here either.
  if (await currentProfile()) redirect("/profile");
  return <AuthPage mode="signUp" />;
}
