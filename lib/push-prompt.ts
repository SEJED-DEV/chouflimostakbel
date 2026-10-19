"use client";

/**
 * When to ask for notification permission, and when to stop asking.
 *
 * The rule: ask, keep reminding for a day, then leave them alone. A reader
 * who says no is not asked again after that, so the prompt cannot become the
 * thing that drives people away from the site.
 *
 * The window starts at the first prompt, not at the first refusal. A reader
 * who never engages sees it a few times over a day, and then never again.
 */

export const PUSH_PROMPT_KEY = "cmb-push-prompt";

/** How long we keep asking. After this the reader is locked out. */
export const REMINDER_WINDOW_MS = 24 * 60 * 60 * 1000;

/** How long to wait between one reminder and the next. */
export const SNOOZE_MS = 4 * 60 * 60 * 1000;

export interface PushPromptState {
  /** When the prompt was first shown. The 24 hour window starts here. */
  firstShownAt: number | null;
  /** When it was last shown, for the snooze between reminders. */
  lastShownAt: number | null;
  /** When the reader closed it without answering. */
  dismissedAt: number | null;
  /** When the reader refused at the browser level. */
  deniedAt: number | null;
}

export const EMPTY_STATE: PushPromptState = {
  firstShownAt: null,
  lastShownAt: null,
  dismissedAt: null,
  deniedAt: null,
};

export function readState(): PushPromptState {
  try {
    const raw = window.localStorage.getItem(PUSH_PROMPT_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as Partial<PushPromptState>;
    return {
      firstShownAt: parsed.firstShownAt ?? null,
      lastShownAt: parsed.lastShownAt ?? null,
      dismissedAt: parsed.dismissedAt ?? null,
      deniedAt: parsed.deniedAt ?? null,
    };
  } catch {
    // Storage blocked. The prompt still works, it just cannot remember that
    // it asked, so it will ask again next visit.
    return EMPTY_STATE;
  }
}

export function writeState(state: PushPromptState): void {
  try {
    window.localStorage.setItem(PUSH_PROMPT_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

/**
 * Whether the prompt should be on screen.
 *
 * `permission` is the browser's Notification.permission.
 */
export function shouldShow(
  state: PushPromptState,
  now: number,
  permission: NotificationPermission | "unsupported",
): boolean {
  // Already on. Nothing to ask.
  if (permission === "granted") return false;

  // The browser has blocked notifications for this site. Asking again cannot
  // work, so say it once - with instructions - and then leave it alone.
  if (permission === "denied") return state.deniedAt === null;

  if (permission === "unsupported") return false;

  // Never asked: ask now. This starts the window.
  if (state.firstShownAt === null) return true;

  // The window has closed. Locked out for good.
  if (now - state.firstShownAt >= REMINDER_WINDOW_MS) return false;

  // Still inside the window, but not yet time to remind again.
  if (state.lastShownAt !== null && now - state.lastShownAt < SNOOZE_MS) return false;

  return true;
}

/** Records that the prompt was on screen. */
export function markShown(state: PushPromptState, now: number): PushPromptState {
  return { ...state, firstShownAt: state.firstShownAt ?? now, lastShownAt: now };
}

/** Records that the reader closed it without answering. */
export function markDismissed(state: PushPromptState, now: number): PushPromptState {
  return { ...state, lastShownAt: now, dismissedAt: now };
}

/** Records that the reader refused at the browser level. */
export function markDenied(state: PushPromptState, now: number): PushPromptState {
  return { ...state, lastShownAt: now, deniedAt: now };
}
