import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "./db";

/**
 * Sessions.
 *
 * The cookie carries a random token. Only its hash is stored, so a copy of
 * the sessions table does not hand anyone a working session - the same
 * reasoning as a password hash.
 *
 * SERVER ONLY: it reads and writes the session cookie.
 */

export const SESSION_COOKIE = "cmb-session";

const SESSION_DAYS = 30;

export interface SessionProfile {
  profile_id: string;
  profile_display_name: string;
  profile_email: string;
  profile_verified_at: string | null;
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** The caller's address, for the session record. Best effort. */
function callerIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "";
}

/** Starts a session and sets the cookie. */
export async function startSession(profileId: string, request: Request): Promise<void> {
  const token = randomBytes(32).toString("base64url");

  await db().query("select app.create_session($1, $2, now() + $3::interval, $4, $5)", [
    profileId,
    hashToken(token),
    `${SESSION_DAYS} days`,
    request.headers.get("user-agent"),
    callerIp(request),
  ]);

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

/**
 * The signed-in reader, or null.
 *
 * The session is looked up through the schema's own function, which ignores
 * expired sessions and tidies them up on the way past.
 */
export async function currentProfile(): Promise<SessionProfile | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const result = await db().query("select * from app.session_profile($1)", [hashToken(token)]);
    return (result.rows[0] as SessionProfile) ?? null;
  } catch {
    // A database that is down must not look like a signed-in reader.
    return null;
  }
}

/** Ends the session and clears the cookie. */
export async function endSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (token) {
    await db().query("select app.delete_session($1)", [hashToken(token)]).catch(() => undefined);
  }

  store.delete(SESSION_COOKIE);
}
