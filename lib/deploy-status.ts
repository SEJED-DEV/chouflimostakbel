/**
 * Reading GitHub's compare endpoint.
 *
 * The endpoint is relative to its BASE. For `compare/{base}...{head}`:
 *
 *   ahead_by   commits in head that base does not have
 *   behind_by  commits in base that head does not have
 *   status     "ahead" when head is ahead of base
 *
 * The deployed build is the BASE and the branch is the HEAD. So `ahead_by` is
 * the number of commits the deployment is missing - the thing the status line
 * exists to report - and "ahead" is what GitHub calls the state in which the
 * deployment is behind.
 *
 * Getting this backwards is easy and silent: the counts come back as zero,
 * the state reads "current", and a deployment that is nine commits stale
 * looks fine. So the mapping lives here, on its own, with tests.
 */

export type DeployState = "current" | "behind" | "ahead" | "diverged" | "unknown";

export interface CompareResult {
  /** Commits the branch has that the deployed build does not. */
  ahead_by?: number;
  /** Commits the deployed build has that the branch does not. */
  behind_by?: number;
  status?: string;
}

export interface Classification {
  state: DeployState;
  /** Commits the deployment is missing. */
  behind: number;
  /** Commits the deployment has that the branch does not. */
  ahead: number;
}

export function classify(data: CompareResult): Classification {
  // ahead_by counts what the branch has that the build lacks.
  const missing = data.ahead_by ?? 0;
  // behind_by counts what the build has that the branch lacks.
  const extra = data.behind_by ?? 0;

  if (missing > 0 && extra > 0) return { state: "diverged", behind: missing, ahead: extra };
  if (missing > 0) return { state: "behind", behind: missing, ahead: 0 };
  if (extra > 0) return { state: "ahead", behind: 0, ahead: extra };
  return { state: "current", behind: 0, ahead: 0 };
}
