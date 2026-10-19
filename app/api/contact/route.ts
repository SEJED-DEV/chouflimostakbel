import { NextResponse } from "next/server";
import { site } from "@/lib/site";

/**
 * Contact form endpoint.
 *
 * The form used to pretend to work - it set a "sent" flag and dropped the
 * message. This is the real thing: validate, rate limit, and hand off to a
 * transactional email provider.
 *
 * If no provider is configured the endpoint says so with 503 rather than
 * reporting a success that never happened. The form then falls back to
 * showing the address, so a visitor is never left thinking a message was
 * delivered when it was not.
 *
 * Required environment:
 *   RESEND_API_KEY     the provider key; without it the endpoint reports
 *                      unavailable and the form shows the email address
 *   CONTACT_FROM_EMAIL a sender on a verified domain (Resend's onboarding
 *                      address works while the domain is being verified)
 * Optional:
 *   CONTACT_TO_EMAIL   where messages land. Defaults to the site's address.
 */

export const dynamic = "force-dynamic";

const LIMITS = { name: 80, email: 200, message: 4000 };

/** Per address. Deliberately generous - real people do send several. */
const RATE = { max: 5, windowMs: 60 * 60 * 1000 };

/**
 * In-memory rate limiting.
 *
 * This is a spam control, not a security boundary: it resets on redeploy and
 * does not coordinate across instances. A shared store would be needed if
 * this ever sits behind more than one process.
 */
const hits = new Map<string, number[]>();

function rateLimited(key: string, now: number): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE.windowMs);

  if (recent.length >= RATE.max) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing without bound on a long-running server.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (!times.some((t) => now - t < RATE.windowMs)) hits.delete(k);
    }
  }

  return false;
}

/** Identifies the caller well enough to rate limit them. */
function callerKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const agent = request.headers.get("user-agent") ?? "";
  return `${ip}|${agent.slice(0, 40)}`;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function problem(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(request: Request) {
  const now = Date.now();

  let body: {
    name?: unknown;
    email?: unknown;
    message?: unknown;
    /** Honeypot. Real people never see this field, so it is always empty. */
    website?: unknown;
  };

  try {
    body = await request.json();
  } catch {
    return problem("invalid", 400);
  }

  // Honeypot filled means a bot. Report success so it learns nothing, and
  // drop the message on the floor.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (rateLimited(callerKey(request), now)) {
    return problem("rate", 429);
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) return problem("missing", 400);
  if (name.length > LIMITS.name) return problem("tooLong", 400);
  if (email.length > LIMITS.email || !EMAIL.test(email)) return problem("invalidEmail", 400);
  if (message.length > LIMITS.message) return problem("tooLong", 400);

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;

  // No transport configured. Say so plainly instead of pretending to deliver.
  if (!apiKey || !from) {
    return NextResponse.json({ ok: false, unavailable: true }, { status: 503 });
  }

  const to = process.env.CONTACT_TO_EMAIL || site.email;
  const subject = `Choufli Mosta9bel - message from ${name}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject,
        text: `From: ${name} <${email}>\n\n${message}`,
        html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
      }),
      // A hung provider should not hold the request open.
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      // Log the provider's own error, not the visitor's message.
      console.error("contact: provider rejected the message", res.status, await res.text());
      return problem("provider", 502);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("contact: could not reach provider", error);
    return problem("provider", 502);
  }
}

/** Anything other than POST is a mistake, not a form submission. */
export async function GET() {
  return problem("method", 405);
}
