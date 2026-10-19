import { NextResponse } from "next/server";

/**
 * Deploy status: is the code running on this server the newest code on GitHub?
 *
 * The comparison happens HERE, on the server, rather than in the browser, for
 * two reasons: GitHub's REST API is rate limited to 60 requests an hour per
 * address for anonymous callers - which a shared mobile IP exhausts in
 * minutes - and a token, if there is one, should never reach the client.
 *
 * Every failure mode answers with a state rather than an exception. A status
 * line that lies about freshness is worse than one that says nothing, so an
 * unreachable GitHub, a rate limit and an unknown commit all read as "unknown"
 * and render nothing.
 */

// Runs per request; the GitHub call underneath is cached for ten minutes.
export const dynamic = "force-dynamic";

const BRANCH = "main";
const REPO_FALLBACK = "SEJED-DEV/chouflimostakbel";
const CACHE_SECONDS = 600;

export type DeployState = "current" | "behind" | "ahead" | "diverged" | "unknown";

export interface DeployStatus {
  state: DeployState;
  /** Commits on the branch that this build does not contain. 0 when current. */
  behind: number;
  /** Commits this build has that the branch does not. */
  ahead: number;
  repo: string;
  branch: string;
  repoUrl: string;
  sha: string | null;
  shortSha: string | null;
  checkedAt: string;
}

async function readBuildInfo() {
  // These are inlined at build time by next.config.ts, so a process that is
  // still running an older build reports the OLD sha - which is the truth
  // about what it is serving. Reading lib/build-info.json at request time
  // would report the NEW sha for a process still serving the old pages,
  // hiding exactly the failure this endpoint exists to catch.
  const sha = process.env.BUILD_SHA || "";
  const shortSha = process.env.BUILD_SHORT_SHA || (sha ? sha.slice(0, 7) : "");

  return {
    repo: process.env.BUILD_REPO || "SEJED-DEV/chouflimostakbel",
    sha: sha || null,
    shortSha: shortSha || null,
  };
}

function unknown(repo: string, sha: string | null, shortSha: string | null): DeployStatus {
  return {
    state: "unknown",
    behind: 0,
    ahead: 0,
    repo,
    branch: BRANCH,
    repoUrl: `https://github.com/${repo}`,
    sha,
    shortSha,
    checkedAt: new Date().toISOString(),
  };
}

export async function GET() {
  const build = await readBuildInfo();
  const repo = build.repo || REPO_FALLBACK;
  const sha = build.sha ?? null;
  const shortSha = build.shortSha ?? (sha ? sha.slice(0, 7) : null);
  const repoUrl = `https://github.com/${repo}`;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "chouflimostakbel-deploy-status",
  };
  // Optional. Raises the rate limit and lets us read private repositories,
  // but the site must work without it.
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const json = (body: DeployStatus) =>
    NextResponse.json(body, {
      headers: {
        // Cached at the edge so a page view does not become a GitHub request.
        "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=86400`,
      },
    });

  // No commit recorded: this build did not come from a checkout we can name.
  if (!sha) return json(unknown(repo, null, null));

  let res: Response;
  try {
    res = await fetch(
      `https://api.github.com/repos/${repo}/compare/${sha}...${BRANCH}`,
      { headers, next: { revalidate: CACHE_SECONDS } },
    );
  } catch {
    // Offline, DNS failure, GitHub down. Not the same as "behind".
    return json(unknown(repo, sha, shortSha));
  }

  // 404: the commit is not on the branch any more - a history rewrite, a
  // shallow clone, or a branch that moved. 403/429: rate limited.
  if (!res.ok) return json(unknown(repo, sha, shortSha));

  let data: {
    status?: string;
    ahead_by?: number;
    behind_by?: number;
    commits?: { sha: string; commit?: { message?: string } }[];
  };
  try {
    data = await res.json();
  } catch {
    return json(unknown(repo, sha, shortSha));
  }

  const behind = data.behind_by ?? 0;
  const ahead = data.ahead_by ?? 0;

  // GitHub reports "identical", "behind", "ahead" or "diverged".
  const state: DeployState =
    data.status === "behind" || (behind > 0 && ahead === 0)
      ? "behind"
      : data.status === "ahead" || (ahead > 0 && behind === 0)
        ? "ahead"
        : data.status === "diverged"
          ? "diverged"
          : "current";

  return json({
    state,
    behind,
    ahead,
    repo,
    branch: BRANCH,
    repoUrl,
    sha,
    shortSha,
    checkedAt: new Date().toISOString(),
  });
}
