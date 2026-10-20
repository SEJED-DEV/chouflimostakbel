import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  authEmailForHandle,
  isHandle,
  normaliseHandle,
} from "@/lib/auth";
import { tooMany, callerKey } from "@/lib/rate-limit";

/**
 * Create an account.
 *
 * The handle is the identity: it is how you appear and how you sign in. The
 * email address is optional - the platform does not need one, and asking for
 * it when it is not needed is a good way to lose people.
 *
 * Supabase Auth is what actually makes the account. It insists on holding an
 * address, so it is given one built from the handle - a reader never sees it
 * and nothing is ever sent to it. Their real address, if they gave one, goes
 * into profiles.email instead.
 *
 * Two steps, in this order, because there is no session to write a row as:
 * GoTrue makes the user, then the profile row is written against that id.
 * If the second fails the first is undone, so an abandoned account cannot
 * block the handle.
 */

export const dynamic = "force-dynamic";

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

  const handle = normaliseHandle(
    typeof body.handle === "string" ? body.handle : "",
  );
  const emailRaw =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const email = emailRaw === "" ? null : emailRaw;
  const password = typeof body.password === "string" ? body.password : "";
  const displayName =
    typeof body.displayName === "string" ? body.displayName.trim() : "";

  if (!isHandle(handle)) return problem("invalidHandle", 400);
  if (email !== null && !EMAIL.test(email)) return problem("invalidEmail", 400);
  if (password.length < 10) return problem("weakPassword", 400);
  if (displayName.length < 1 || displayName.length > 80) {
    return problem("invalidName", 400);
  }

  // Creating accounts is rate limited: it is the one place a script can make
  // the database do a lot of work.
  if (tooMany(callerKey(request, "register"), 5, 60 * 60 * 1000)) {
    return problem("rate", 429);
  }

  const admin = createAdminClient();
  const authEmail = authEmailForHandle(handle);

  let createdUserId: string | null = null;

  try {
    // 1. GoTrue makes the user. email_confirm is true because there is no
    //    address to confirm - the one being handed over is not real, and
    //    a reader should not have to click a link before they can sign in.
    const { data: created, error: createError } =
      await admin.auth.admin.createUser({
        email: authEmail,
        password,
        email_confirm: true,
        user_metadata: { handle },
      });

    if (createError) {
      const message = createError.message?.toLowerCase() ?? "";
      if (
        message.includes("already registered") ||
        message.includes("already been registered")
      ) {
        return problem("handleTaken", 409);
      }
      console.error("register: createUser failed", createError);
      return problem("server", 500);
    }

    createdUserId = created.user?.id ?? null;
    if (!createdUserId) return problem("server", 500);

    // 2. The profile row. This is the reader's record; GoTrue's is the
    //    account. They are joined by id and nothing else.
    const { error: profileError } = await admin.from("profiles").insert({
      id: createdUserId,
      handle,
      email,
      display_name: displayName,
    });

    if (profileError) {
      // A duplicate handle surfaces here rather than in GoTrue, because two
      // different handles can never share a synthetic address.
      if (profileError.code === "23505") return problem("handleTaken", 409);
      throw profileError;
    }

    // 3. Sign them in. The admin call does not create a session, and a
    //    signed-up reader who has to sign in again has been let down.
    const supabase = await createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password,
    });

    if (signInError) {
      console.error("register: sign-in failed", signInError);
      return problem("server", 500);
    }

    return NextResponse.json({
      ok: true,
      profile: {
        id: createdUserId,
        handle,
        displayName,
        email,
        verified: false,
      },
    });
  } catch (error) {
    // The user was made but the profile was not: put the handle back so it
    // is not left taken by an account that cannot be used.
    if (createdUserId) {
      await admin.auth.admin
        .deleteUser(createdUserId)
        .catch((cleanup: unknown) => {
          console.error("register: cleanup failed", cleanup);
        });
    }

    console.error("register failed", error);
    return problem("server", 500);
  }
}
