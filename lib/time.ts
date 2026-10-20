/**
 * "3 hours ago", in the reader's language.
 *
 * Kept apart from the copy slices because the wording depends on the size of
 * the gap, not on the page: every slice would otherwise carry the same five
 * strings and have to be kept in step.
 *
 * HYDRATION
 *
 * Everything here is a pure function of the two timestamps it is given. The
 * "now" is passed in rather than read from the clock, because a component
 * that calls `Date.now()` renders differently on the server than it does a
 * moment later in the browser, and React treats that difference as a bug. A
 * caller that wants the live clock must supply it from an effect, where it
 * is allowed to change.
 */

/** The strings a relative time needs, in one language. */
export interface RelativeWords {
  justNow: string;
  minutesAgo: string;
  hoursAgo: string;
  daysAgo: string;
}

export type RelativeUnit = "justNow" | "minutesAgo" | "hoursAgo" | "daysAgo";

export interface RelativeTime {
  unit: RelativeUnit;
  /** Filled into `{n}` in the matching string. Absent for "just now". */
  n?: number;
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Which phrase fits the gap, and how big the number is.
 *
 * Past a week the number stops being useful - "23 days ago" is a date the
 * reader has to do arithmetic on - so callers that need longer than that
 * should fall back to a formatted date. `isOlderThan` is here to say when.
 */
export function relativeTime(from: Date | string, now: Date | string): RelativeTime {
  const then = typeof from === "string" ? new Date(from) : from;
  const at = typeof now === "string" ? new Date(now) : now;

  const gap = at.getTime() - then.getTime();

  // A clock that disagrees with the server, or a post written moments ago,
  // should read as "just now" rather than as a negative number of minutes.
  if (gap < MINUTE) return { unit: "justNow" };
  if (gap < HOUR) return { unit: "minutesAgo", n: Math.floor(gap / MINUTE) };
  if (gap < DAY) return { unit: "hoursAgo", n: Math.floor(gap / HOUR) };
  return { unit: "daysAgo", n: Math.floor(gap / DAY) };
}

/** Fill the `{n}` in a phrase. */
export function relativeLabel(words: RelativeWords, rel: RelativeTime): string {
  const template = words[rel.unit];
  if (rel.n === undefined) return template;
  return template.replace("{n}", String(rel.n));
}

/**
 * Is this far enough back that a date reads better than a count?
 *
 * Seven days. A week is where "6 d ago" stops being an improvement on the
 * date itself.
 */
export function isOlderThan(from: Date | string, now: Date | string, ms = 7 * DAY): boolean {
  const then = typeof from === "string" ? new Date(from) : from;
  const at = typeof now === "string" ? new Date(now) : now;
  return at.getTime() - then.getTime() > ms;
}
