import type { Metadata } from "next";
import AuthPage from "@/components/pages/AuthPage";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Create a Choufli Mosta9bel account. A username and a password is enough - an email address is optional.",
  alternates: { canonical: "/signup" },
  openGraph: { url: "/signup" },
  robots: { index: false, follow: true },
};

export default function SignupPage() {
  return <AuthPage mode="signUp" />;
}
