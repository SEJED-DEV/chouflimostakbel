import type { Metadata } from "next";
import AuthPage from "@/components/pages/AuthPage";

export const metadata: Metadata = {
  title: "Log in",
  description: "Sign in to Choufli Mosta9bel.",
  alternates: { canonical: "/login" },
  openGraph: { url: "/login" },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return <AuthPage mode="signIn" />;
}
