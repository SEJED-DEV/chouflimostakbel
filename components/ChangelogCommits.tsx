"use client";

import { REPO_URL } from "@/lib/site";
import type { ChangelogEntry } from "@/components/i18n/changelog";

/**
 * The commits a release was built from, as short-hash links to GitHub.
 *
 * Renders nothing for releases without commit references, so older entries
 * need no filler.
 */
export default function ChangelogCommits({
  entry,
  label,
}: {
  entry: ChangelogEntry;
  label: string;
}) {
  if (!entry.commits || entry.commits.length === 0) return null;

  return (
    <div className="mt-6 border-t border-sep pt-5">
      <p className="text-[12px] font-semibold tracking-[0.06em] text-gray-2 uppercase">
        {label}
      </p>
      <ul className="mt-3 space-y-2">
        {entry.commits.map((c) => (
          <li key={c.hash}>
            <a
              href={`${REPO_URL}/commit/${c.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 text-[14px] leading-relaxed text-gray-2 transition-colors hover:text-ink"
            >
              <code className="mt-px shrink-0 rounded-md bg-bg-alt px-2 py-0.5 font-mono text-[12px] text-gray-2 transition-colors group-hover:bg-bg group-hover:text-blue">
                {c.hash}
              </code>
              <span className="min-w-0">{c.summary}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
