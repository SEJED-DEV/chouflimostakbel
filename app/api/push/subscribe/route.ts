import { NextResponse } from "next/server";
import { getStore, isPushConfigured, publicKey } from "@/lib/push";

/**
 * Push subscription management.
 *
 * POST    store or refresh a subscription
 * DELETE  forget one
 * GET     whether push is available, and the public key to use
 *
 * A subscription is a device token. No email address, no identifier, no
 * tracking - just an endpoint the push service hands the browser, and the two
 * keys that authenticate it. Deleting it is immediate and complete.
 */

export const dynamic = "force-dynamic";

function isHttps(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("https://");
}

function parseSubscription(body: unknown, userAgent: string | null) {
  if (!body || typeof body !== "object") return null;

  const candidate = body as {
    endpoint?: unknown;
    keys?: { p256dh?: unknown; auth?: unknown };
  };

  if (!isHttps(candidate.endpoint)) return null;
  if (!candidate.keys) return null;
  if (typeof candidate.keys.p256dh !== "string" || !candidate.keys.p256dh) return null;
  if (typeof candidate.keys.auth !== "string" || !candidate.keys.auth) return null;

  return {
    endpoint: candidate.endpoint,
    keys: { p256dh: candidate.keys.p256dh, auth: candidate.keys.auth },
    userAgent,
    createdAt: new Date().toISOString(),
  };
}

export async function GET() {
  return NextResponse.json({
    configured: isPushConfigured(),
    publicKey: publicKey(),
  });
}

export async function POST(request: Request) {
  if (!isPushConfigured()) {
    return NextResponse.json({ ok: false, error: "notConfigured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const record = parseSubscription(body, request.headers.get("user-agent"));
  if (!record) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  await getStore().save(record);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const endpoint = (body as { endpoint?: unknown })?.endpoint;
  if (!isHttps(endpoint)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  await getStore().remove(endpoint);
  return NextResponse.json({ ok: true });
}
