"use client";

import Icon from "@/components/Icons";
import { useEffect, useState } from "react";

import { useLanguage, type Lang } from "./LanguageProvider";
import { useSlice } from "@/components/i18n/slice";
import { changelog, type PluralKey } from "@/components/i18n/changelog";

interface DeployStatus {
  state: "current" | "behind" | "ahead" | "diverged" | "unknown";
  behind: number;
  ahead: number;
  branch: string;
  repoUrl: string;
  sha: string | null;
  shortSha: string | null;
}

/** Apple system colours, so the dot reads as native rather than web-ish. */
const DOT: Record<string, string> = {
  current: "#34c759",
  behind: "#ff9f0a",
  ahead: "#ff9f0a",
  diverged: "#ff453a",
};

function pluralise(forms: Record<PluralKey, string>, n: number, lang: Lang): string {
  const category = new Intl.PluralRules(lang).select(n);
  const key = (category in forms ? category : "other") as PluralKey;
  return forms[key].replace("{n}", String(n));
}

/**
 * Whether the code running here is the newest code on the branch.
 *
 * The changelog claims nothing ships quietly, so it should be able to say
 * when it is out of date. It asks the server, which compares this build's
 * commit against GitHub - see app/api/status/route.ts.
 *
 * When the answer is "I do not know" - no network, rate limited, or a commit
 * that is no longer on the branch - it renders nothing. A status line that
 * guesses is worse than one that stays quiet.
 */
export default function DeployStatusLine() {
  const { lang } = useLanguage();
  const t = useSlice(changelog);
  const [status, setStatus] = useState<DeployStatus | null>(null);

  useEffect(() => {
    let cancelled = false;

    // No cache override: the route sets CDN headers, and letting them work is
    // the difference between one GitHub call and one per page view.
    fetch("/api/status")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: DeployStatus | null) => {
        if (!cancelled && data) setStatus(data);
      })
      .catch(() => {
        /* offline or the route is unavailable - stay quiet */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!status || status.state === "unknown" || !status.sha) return null;

  const copy =
    status.state === "current"
      ? t.status.current
      : status.state === "behind"
        ? pluralise(t.status.behind, status.behind, lang)
        : status.state === "ahead"
          ? t.status.ahead
          : t.status.diverged;

  const commitUrl = `${status.repoUrl}/commit/${status.sha}`;
  const diffUrl = `${status.repoUrl}/compare/${status.sha}...${status.branch}`;
  const isBehind = status.state === "behind" || status.state === "diverged";

  return (
    <div
      className="mt-7 inline-flex max-w-full flex-wrap items-center gap-x-2.5 gap-y-1.5 rounded-full border border-sep bg-bg-alt px-4 py-2 text-[13.5px] text-gray-2"
      role="status"
      aria-label={t.status.label}
    >
      <span
        aria-hidden
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: DOT[status.state] }}
      />

      <span>{copy}</span>

      <span aria-hidden className="text-sep">
        &middot;
      </span>

      {status.shortSha && (
        <a
          href={commitUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[12.5px] text-gray-2 transition-colors hover:text-ink"
        >
          {status.shortSha}
        </a>
      )}

      <a
        href={isBehind ? diffUrl : status.repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 font-medium text-blue transition-opacity hover:opacity-70"
      >
        {isBehind ? t.status.seeDiff : t.status.openRepo}
        <Icon name="external-link" size={13} />
      </a>
    </div>
  );
}
