import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthPage from "@/components/pages/AuthPage";
import { currentProfile } from "@/lib/auth";

/** Reads the session cookie, so this cannot be statically rendered. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Log in",
  description: "Sign in to Choufli Mosta9bel.",
  alternates: { canonical: "/login" },
  openGraph: { url: "/login" },
  robots: { index: false, follow: true },
};

export default async function LoginPage() {
  // A signed-in reader has no business here.
  if (await currentProfile()) redirect("/profile");
  return <AuthPage mode="signIn" />;
}
