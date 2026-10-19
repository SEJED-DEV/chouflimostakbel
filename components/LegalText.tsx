"use client";

import { Fragment } from "react";
import { site } from "@/lib/site";

/**
 * Renders a line of legal copy.
 *
 * The translated strings are plain text with a little inline markup, so a
 * translator never has to touch code:
 *
 *   **bold**        emphasis
 *   {{site}}        the project's name, in bold
 *   {{email}}       the contact address, as a mailto link
 *   {{orientation}} the official orientation portal, as a link
 */
const TOKEN = /(\*\*[^*]+\*\*|\{\{site\}\}|\{\{email\}\}|\{\{orientation\}\})/g;

export default function LegalText({ text }: { text: string }) {
  const parts = text.split(TOKEN);

  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;

        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-ink">
              {part.slice(2, -2)}
            </strong>
          );
        }

        if (part === "{{site}}") {
          return (
            <strong key={i} className="font-semibold text-ink">
              {site.name}
            </strong>
          );
        }

        if (part === "{{email}}") {
          return (
            <a
              key={i}
              href={`mailto:${site.email}`}
              className="text-blue underline underline-offset-2"
            >
              {site.email}
            </a>
          );
        }

        if (part === "{{orientation}}") {
          return (
            <a
              key={i}
              href="https://www.orientation.tn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue underline underline-offset-2"
            >
              orientation.tn
            </a>
          );
        }

        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
