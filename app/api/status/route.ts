import { NextResponse } from "next/server";
import { classify, type CompareResult, type DeployState } from "@/lib/deploy-status";

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

// Runs per request; the GitHub call underneath is cached.
export const dynamic = "force-dynamic";

const BRANCH = "main";
const REPO_FALLBACK = "SEJED-DEV/chouflimostakbel";

/** How long the GitHub response is reused. */
const CACHE_SECONDS = 120;

/** How long a browser or CDN may reuse our answer. */
const EDGE_SECONDS = 300;

export type { DeployState };

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

export async function GET(request: Request) {
  const build = await readBuildInfo();
  const repo = build.repo || REPO_FALLBACK;
  const sha = build.sha ?? null;
  const shortSha = build.shortSha ?? (sha ? sha.slice(0, 7) : null);
  const repoUrl = `https://github.com/${repo}`;

  // ?fresh=1 skips every cache. Used by the deploy check, which needs the
  // truth right now rather than what was true two minutes ago.
  const fresh = new URL(request.url).searchParams.get("fresh") === "1";

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
        "Cache-Control": fresh
          ? "no-store"
          : `public, s-maxage=${EDGE_SECONDS}, stale-while-revalidate=86400`,
      },
    });

  // No commit recorded: this build did not come from a checkout we can name.
  if (!sha) return json(unknown(repo, null, null));

  let res: Response;
  try {
    res = await fetch(
      `https://api.github.com/repos/${repo}/compare/${sha}...${BRANCH}`,
      // A fresh request skips the cache, so the answer is not two minutes old.
      fresh
        ? { headers, cache: "no-store" }
        : { headers, next: { revalidate: CACHE_SECONDS } },
    );
  } catch {
    // Offline, DNS failure, GitHub down. Not the same as "behind".
    return json(unknown(repo, sha, shortSha));
  }

  // 404: the commit is not on the branch any more - a history rewrite, a
  // shallow clone, or a branch that moved. 403/429: rate limited.
  if (!res.ok) return json(unknown(repo, sha, shortSha));

  let data: CompareResult;
  try {
    data = await res.json();
  } catch {
    return json(unknown(repo, sha, shortSha));
  }

  const { state, behind, ahead } = classify(data);

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
