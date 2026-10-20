import type { Metadata } from "next";
import BlogsContent from "@/components/pages/BlogsContent";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "What people have written about orientation, school and what comes next.",
  alternates: { canonical: "/blogs" },
  openGraph: { url: "/blogs" },
};

export default function BlogsPage() {
  return <BlogsContent />;
}
