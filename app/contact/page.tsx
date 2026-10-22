import type { Metadata } from "next";
import ContactContent from "@/components/pages/ContactContent";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Send Choufli Mosta9bel a question about orientation, school, or what to do next.",
  path: "/contact",
  subtitle: "Ask a question, and a person answers.",
  section: "Contact",
});

export default function ContactPage() {
  return <ContactContent />;
}
