import { NextResponse } from "next/server";
import { getStore, isPushConfigured, sendToAll } from "@/lib/push";

/**
 * Send a push notification to every subscriber.
 *
 * Operator-facing, not a public endpoint: it requires the shared secret in
 * PUSH_SEND_SECRET, sent as a bearer token. Without the secret configured the
 * route refuses to run at all, so a misconfigured deployment is not an open
 * relay.
 *
 * The scheduled command (npm run notify:push) calls the same code directly
 * and does not go through here.
 */

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.PUSH_SEND_SECRET;

  // No secret configured means no way to authorise a caller. Refuse rather
  // than accept anything.
  if (!secret) {
    return NextResponse.json({ ok: false, error: "notConfigured" }, { status: 503 });
  }

  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (provided !== secret) {
    return NextResponse.json({ ok: false, error: "unauthorised" }, { status: 401 });
  }

  if (!isPushConfigured()) {
    return NextResponse.json({ ok: false, error: "pushNotConfigured" }, { status: 503 });
  }

  let body: { title?: unknown; body?: unknown; url?: unknown; version?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const text = typeof body.body === "string" ? body.body.trim() : "";

  if (!title || !text) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const subscribers = (await getStore().list()).length;
  const result = await sendToAll({
    title,
    body: text,
    url: typeof body.url === "string" ? body.url : "/changelog",
    version: typeof body.version === "string" ? body.version : undefined,
  });

  return NextResponse.json({ ok: true, subscribers, ...result });
}
