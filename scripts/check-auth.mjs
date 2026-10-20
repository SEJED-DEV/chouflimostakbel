// End to end test of the account flow, against a running server.
//
//   node scripts/check-auth.mjs [url]
//
// Creates an account, signs in, signs out, and checks that the wrong things
// are refused: a weak password, a username already taken, a wrong password,
// and a session that has been ended.
//
// The email address is optional - the platform does not need one - so most of
// these accounts have none.
import { Client } from "pg";
import { readFileSync } from "node:fs";

const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/+$/, "");

let pass = 0;
let fail = 0;
function check(name, ok, detail) {
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
}

/** A tiny cookie jar, so each case starts from a known state. */
function jar() {
  const cookies = new Map();
  return {
    header: () => [...cookies].map(([k, v]) => `${k}=${v}`).join("; "),
    absorb(res) {
      for (const raw of res.headers.getSetCookie?.() ?? []) {
        const [pair] = raw.split(";");
        const idx = pair.indexOf("=");
        cookies.set(pair.slice(0, idx), pair.slice(idx + 1));
      }
    },
    get: (k) => cookies.get(k),
  };
}

const stamp = Date.now();
const handle = `e2e-${stamp}`;
const email = `e2e-${stamp}@example.test`;
const password = "a-good-long-password";

/**
 * A different user agent each run, so the rate limiter sees a different
 * device. Real people are on different browsers, and the limit is per
 * address and browser - a shared connection is fine.
 */
const UA = `chouflimostakbel-check/${stamp}`;

async function post(path, body, cookies) {
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": UA,
      ...(cookies ? { Cookie: cookies.header() } : {}),
    },
    body: JSON.stringify(body),
  });
  cookies?.absorb(res);
  const text = await res.text();
  let json = {};
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text.slice(0, 120) };
  }
  return { res, json };
}

async function get(path, cookies) {
  const res = await fetch(BASE + path, {
    headers: { "User-Agent": UA, ...(cookies ? { Cookie: cookies.header() } : {}) },
  });
  cookies?.absorb(res);
  const text = await res.text();
  let json = {};
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text.slice(0, 120) };
  }
  return { res, json };
}

// 1. Register, with no email at all. The platform does not need one.
const c1 = jar();
const reg = await post(
  "/api/auth/register",
  { handle, password, displayName: "E2E" },
  c1,
);
check("register succeeds without an email", reg.res.status === 200, `${reg.res.status} ${JSON.stringify(reg.json)}`);
check("the handle comes back", reg.json?.profile?.handle === handle, reg.json?.profile?.handle);
check("no email was asked for", reg.json?.profile?.email === null, String(reg.json?.profile?.email));
check("a session cookie is set", Boolean(c1.get("cmb-session")));

// The cookie must not be readable by script.
const setCookie = reg.res.headers.getSetCookie?.().find((c) => c.startsWith("cmb-session="));
check("the cookie is httpOnly", Boolean(setCookie && /HttpOnly/i.test(setCookie)), setCookie);
check("the cookie is sameSite lax", Boolean(setCookie && /SameSite=Lax/i.test(setCookie)));

// 2. The session works.
const me = await get("/api/auth/me", c1);
check("the session identifies the reader", me.json?.profile?.handle === handle, JSON.stringify(me.json?.profile));
check("the account starts unverified", me.json?.profile?.verified === false);
check("no password comes back", !JSON.stringify(me.json).includes(password));

// 3. A username already taken is refused.
const dupe = await post(
  "/api/auth/register",
  { handle, password, displayName: "E2E again" },
  jar(),
);
check("the same username is refused", dupe.res.status === 409, `${dupe.res.status} ${dupe.json.error}`);

// 4. A weak password is refused.
const weak = await post(
  "/api/auth/register",
  { handle: `weak-${stamp}`, password: "short", displayName: "Weak" },
  jar(),
);
check("a weak password is refused", weak.res.status === 400, `${weak.res.status} ${weak.json.error}`);

// 5. A username with the wrong shape is refused.
const badHandle = await post(
  "/api/auth/register",
  { handle: "No Spaces Here", password, displayName: "Bad" },
  jar(),
);
check("a bad username is refused", badHandle.res.status === 400, `${badHandle.res.status} ${badHandle.json.error}`);

// 6. A malformed email is refused, when one is given.
const bad = await post(
  "/api/auth/register",
  { handle: `bademail-${stamp}`, email: "not-an-email", password, displayName: "Bad" },
  jar(),
);
check("a malformed address is refused", bad.res.status === 400, `${bad.res.status} ${bad.json.error}`);

// 7. The wrong password does not sign you in.
const wrong = await post(
  "/api/auth/login",
  { identifier: handle, password: "not-the-password" },
  jar(),
);
check("the wrong password is refused", wrong.res.status === 401, `${wrong.res.status} ${wrong.json.error}`);

// 8. A username that does not exist gives the same answer.
const nobody = await post(
  "/api/auth/login",
  { identifier: `nobody-${stamp}`, password },
  jar(),
);
check(
  "an unknown username gives the same answer",
  nobody.res.status === 401 && nobody.json.error === wrong.json.error,
  `${nobody.res.status} ${nobody.json.error}`,
);

// 9. The right password signs you in, in a fresh session.
const c2 = jar();
const login = await post("/api/auth/login", { identifier: handle, password }, c2);
check("the right password signs in", login.res.status === 200, `${login.res.status}`);
check("the new session works", (await get("/api/auth/me", c2)).json?.profile?.handle === handle);

// 10. Signing in with an address works too, for anyone who gave one.
const withEmail = `mail-${stamp}`;
const cEmail = jar();
await post(
  "/api/auth/register",
  { handle: withEmail, email: `mail-${stamp}@example.test`, password, displayName: "Mail" },
  cEmail,
);
const byEmail = await post(
  "/api/auth/login",
  { identifier: `mail-${stamp}@example.test`, password },
  jar(),
);
check("an address can be used to sign in", byEmail.res.status === 200, `${byEmail.res.status}`);

// 11. The name can be changed, and only the caller's own row.
const c3 = jar();
await post("/api/auth/login", { identifier: handle, password }, c3);
const renamed = await fetch(BASE + "/api/auth/profile", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    "User-Agent": UA,
    Cookie: c3.header(),
  },
  body: JSON.stringify({ displayName: "Renamed" }),
});
const renamedBody = await renamed.json();
check("the name can be changed", renamed.status === 200, `${renamed.status}`);
check("the new name comes back", renamedBody?.displayName === "Renamed", JSON.stringify(renamedBody));

// 12. Signing out ends the session, not just the cookie.
const url = readFileSync(".env.local", "utf8").match(/^DATABASE_URL=(.*)$/m)?.[1]?.trim();

/** Counts the session rows for this account, as the owner can see them. */
async function sessionCount() {
  if (!url) return null;
  const p = new URL(url);
  // Read as the owner. The application role cannot see these rows at all -
  // the policies hide them, which is the whole point, so the check has to
  // look with the owner's eyes to see whether anything changed.
  const db = new Client({
    host: p.hostname,
    port: Number(p.port || 5432),
    user: "chouflimostakbel",
    password: decodeURIComponent(p.password),
    database: p.pathname.slice(1),
  });
  await db.connect();
  const res = await db.query(
    "select count(*)::int as n from sessions where profile_id = (select id from profiles where handle = $1)",
    [handle],
  );
  await db.end();
  return res.rows[0].n;
}

const before = await sessionCount();

const out = await post("/api/auth/logout", {}, c2);
check("sign out succeeds", out.res.status === 200);
const after = await get("/api/auth/me", c2);
check("the session is gone", after.json?.profile === null, JSON.stringify(after.json));

// Signing out deletes that one session, and only that one.
const afterCount = await sessionCount();
check(
  "signing out deletes exactly one session",
  before !== null && afterCount !== null && afterCount === before - 1,
  `${before} -> ${afterCount}`,
);

// And the change is real. The url was read once, above.
if (url) {
  const p = new URL(url);
  const db = new Client({
    host: p.hostname,
    port: Number(p.port || 5432),
    user: "chouflimostakbel",
    password: decodeURIComponent(p.password),
    database: p.pathname.slice(1),
  });
  await db.connect();
  const named = await db.query("select display_name from profiles where handle = $1", [handle]);
  check("the new name was stored", named.rows[0]?.display_name === "Renamed", named.rows[0]?.display_name);

  const noEmail = await db.query("select email from profiles where handle = $1", [handle]);
  check(
    "an account with no address is allowed",
    noEmail.rows[0]?.email === null,
    String(noEmail.rows[0]?.email),
  );

  await db.query("delete from profiles where handle = any($1)", [[handle, withEmail]]);
  await db.end();
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
