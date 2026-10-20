import { NextResponse } from "next/server";
import { endSession } from "@/lib/auth";

/** Sign out. The session row is deleted, not just the cookie cleared. */
export const dynamic = "force-dynamic";

export async function POST() {
  await endSession();
  return NextResponse.json({ ok: true });
}
