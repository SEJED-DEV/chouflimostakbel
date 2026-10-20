import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { startSession } from "@/lib/auth";
import { tooMany, callerKey } from "@/lib/rate-limit";

/**
 * Create an account.
 *
 * The handle is the identity: it is how you appear and how you sign in. The
 * email address is optional - the platform does not need one, and asking for
 * it when it is not needed is a good way to lose people.
 *
 * The password goes straight to the database, which hashes it with bcrypt.
 * The application never stores or compares a password itself.
 */

export const dynamic = "force-dynamic";

const HANDLE = /^[a-z0-9][a-z0-9._-]{2,29}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function problem(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(request: Request) {
  let body: {
    handle?: unknown;
    email?: unknown;
    password?: unknown;
    displayName?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return problem("invalid", 400);
  }

  const handle = typeof body.handle === "string" ? body.handle.trim().toLowerCase() : "";
  const emailRaw = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const email = emailRaw === "" ? null : emailRaw;
  const password = typeof body.password === "string" ? body.password : "";
  const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";

  if (!HANDLE.test(handle)) return problem("invalidHandle", 400);
  if (email !== null && !EMAIL.test(email)) return problem("invalidEmail", 400);
  if (password.length < 10) return problem("weakPassword", 400);
  if (displayName.length < 1 || displayName.length > 80) return problem("invalidName", 400);

  // Creating accounts is rate limited: it is the one place a script can make
  // the database do a lot of work.
  if (tooMany(callerKey(request, "register"), 5, 60 * 60 * 1000)) {
    return problem("rate", 429);
  }

  try {
    const result = await db().query("select * from app.register($1, $2, $3, $4)", [
      handle,
      email,
      password,
      displayName,
    ]);

    const id = result.rows[0].profile_id as string;
    await startSession(id, request);

    return NextResponse.json({
      ok: true,
      profile: { id, handle, displayName, email, verified: false },
    });
  } catch (error) {
    const e = error as { code?: string; message?: string; constraint?: string };
    if (e.code === "23505") return problem("handleTaken", 409);
    if (e.message && e.message.includes("password too short")) {
      return problem("weakPassword", 400);
    }
    if (e.message && e.message.includes("handle not allowed")) {
      return problem("invalidHandle", 400);
    }
    console.error("register failed", error);
    return problem("server", 500);
  }
}
