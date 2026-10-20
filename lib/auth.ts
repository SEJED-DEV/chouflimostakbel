import { createClient } from "./supabase/server";

/**
 * Who the signed-in reader is.
 *
 * Supabase Auth owns the account. What it cannot own is the reason this
 * platform exists: you sign in with a **username**, not an address. GoTrue
 * has no concept of that - it holds an email and a password, and nothing
 * else will do.
 *
 * So a reader chooses a handle, and behind their back GoTrue is handed an
 * address built from it. They never see it, never type it, and nothing is
 * ever sent to it: the domain has no mail exchanger, so there is nowhere for
 * a message to go. The handle is what they know; the address is the form
 * GoTrue insists on.
 *
 * The real address, if they offered one, lives in `profiles.email`. That is
 * for notifications and for recovery - it is not the key.
 *
 * SERVER ONLY: it reads the session cookie.
 */

/**
 * The domain the synthetic addresses live on.
 *
 * Deliberately a subdomain rather than the apex: `contact@chouflimostakbel.tn`
 * is the project's published address, and this must never be confused with
 * it or accidentally used to send from.
 */
export const AUTH_EMAIL_DOMAIN = "users.chouflimostakbel.tn";

/** Letters, digits, dot, dash, underscore. 3-30 characters, must start alnum. */
export const HANDLE_RE = /^[a-z0-9][a-z0-9._-]{2,29}$/;

export interface Profile {
  id: string;
  handle: string;
  display_name: string;
  email: string | null;
  verified_at: string | null;
  created_at: string;
}

/** Lower-case and trim, which is what the database stores anyway. */
export function normaliseHandle(raw: string): string {
  return raw.trim().toLowerCase();
}

/** The address GoTrue holds for a handle. Never shown to a reader. */
export function authEmailForHandle(handle: string): string {
  return `${normaliseHandle(handle)}@${AUTH_EMAIL_DOMAIN}`;
}

/**
 * The handle behind a synthetic address, or null if this address is not one
 * of ours. Used when someone signs in with a username: GoTrue needs the
 * address, and this is the only way to get from one to the other.
 */
export function handleFromAuthEmail(email: string): string | null {
  const suffix = `@${AUTH_EMAIL_DOMAIN}`;
  const value = email.trim().toLowerCase();
  if (!value.endsWith(suffix)) return null;
  return value.slice(0, -suffix.length) || null;
}

/** Is this a plausible handle? The same rule the database enforces. */
export function isHandle(raw: string): boolean {
  return HANDLE_RE.test(normaliseHandle(raw));
}

/**
 * The signed-in reader's profile, or null.
 *
 * `getUser()` asks GoTrue to validate the session token rather than trusting
 * what is in the cookie, which is the whole reason not to read the cookie
 * yourself.
 */
export async function currentProfile(): Promise<Profile | null> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("id, handle, display_name, email, verified_at, created_at")
      .eq("id", user.id)
      .maybeSingle();

    // The GoTrue user can exist a moment before its profile row does.
    // Treat that as signed out rather than as an error.
    if (error || !data) return null;

    return data as Profile;
  } catch {
    // A database that is down must not look like a signed-in reader.
    return null;
  }
}
