"use client";

import Contact from "@/components/Contact";

/**
 * The standalone contact page.
 *
 * The same contact section appears at the foot of every page; this gives it
 * a URL of its own, which is where people look for it and where a link to
 * "contact" can point.
 */
export default function ContactContent() {
  return <Contact className="pt-32 sm:pt-40" headingLevel="h1" />;
}
