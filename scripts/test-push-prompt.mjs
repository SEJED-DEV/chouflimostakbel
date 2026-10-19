// Tests the push-permission reminder schedule.
//
//   node --experimental-strip-types scripts/test-push-prompt.mjs
//
// The rule being pinned: ask, remind for 24 hours, then leave the reader
// alone. Getting it wrong in either direction is bad - nagging forever
// drives people away, and never asking means the feature is never used.
import {
  shouldShow,
  markShown,
  markDismissed,
  markDenied,
  EMPTY_STATE,
  REMINDER_WINDOW_MS,
  SNOOZE_MS,
} from "../lib/push-prompt.ts";

const HOUR = 60 * 60 * 1000;
const T0 = 1_700_000_000_000;

let pass = 0;
let fail = 0;

function check(name, got, want) {
  const ok = got === want;
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `  (got ${got}, want ${want})`}`);
}

// 1. A reader who has never been asked is asked.
check(
  "asks a reader who has never been asked",
  shouldShow(EMPTY_STATE, T0, "default"),
  true,
);

// 2. Not asked again immediately - the snooze.
const shown = markShown(EMPTY_STATE, T0);
check(
  "does not ask again straight away",
  shouldShow(shown, T0 + HOUR, "default"),
  false,
);

// 3. Asked again once the snooze has passed.
check(
  "asks again after the snooze",
  shouldShow(shown, T0 + SNOOZE_MS + 1000, "default"),
  true,
);

// 4. Still asking, four hours in.
check(
  "still asking four hours in",
  shouldShow(shown, T0 + 4 * HOUR, "default"),
  true,
);

// 5. Locked out once the window closes.
check(
  "locked out after 24 hours",
  shouldShow(shown, T0 + REMINDER_WINDOW_MS, "default"),
  false,
);

// 6. Still locked out a week later.
check(
  "still locked out a week later",
  shouldShow(shown, T0 + 7 * 24 * HOUR, "default"),
  false,
);

// 7. A reader who granted permission is never asked again.
check(
  "never asks a reader who already granted",
  shouldShow(shown, T0, "granted"),
  false,
);

// 8. A reader who refused at the browser level is told once, then left alone.
const denied = markDenied(shown, T0);
check(
  "tells a blocked reader once",
  shouldShow(denied, T0, "denied"),
  false,
);
check(
  "does not tell a blocked reader twice",
  shouldShow(denied, T0 + HOUR, "denied"),
  false,
);
check(
  "shows the blocked notice the first time",
  shouldShow(EMPTY_STATE, T0, "denied"),
  true,
);

// 9. A dismissal is not a refusal, but it starts the snooze.
const dismissed = markDismissed(shown, T0 + HOUR);
check(
  "a dismissal starts the snooze",
  shouldShow(dismissed, T0 + HOUR + 1000, "default"),
  false,
);

// 10. The window is measured from the first prompt, not the first refusal.
const late = markShown(EMPTY_STATE, T0 + 20 * HOUR);
check(
  "the window starts at the first prompt",
  shouldShow(late, T0 + 20 * HOUR + SNOOZE_MS + 1000, "default"),
  true,
);
check(
  "and closes 24 hours after the first prompt",
  shouldShow(late, T0 + 20 * HOUR + REMINDER_WINDOW_MS, "default"),
  false,
);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
