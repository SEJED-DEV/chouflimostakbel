// Proves the account flow actually works, end to end, over HTTP.
//
//   npm run check:auth
//
// This talks to the running site the way a browser does - no privileged
// connection, no shortcuts. It signs up, signs in, edits a profile, signs
// out, and checks the answers a real reader would get.
//
// It needs the site running: `npm run build && npm run start -- --port 3000`,
// and Supabase up: `npm run supabase:start && npm run db:migrate`.
import { readFileSync } from "node:fs";

const SITE = process.argv[2] || "http://localhost:3000";

const env = readFileSync(".env.local", "utf8");
const value = (name) => env.match(new RegExp(`^${name}=(.*)$`, "m"))?.[1]?.trim();
const AUTH = `${value("NEXT_PUBLIC_SUPABASE_URL")}/auth/v1`;

let pass = 0;
let fail = 0;
function check(name, ok, detail) {
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
}

/** POST to one of the site's own routes. */
async function route(path, body, cookie) {
  const res = await fetch(`${SITE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const setCookie = res.headers.getSetCookie?.() ?? [];
  const cookies = setCookie.map((c) => c.split(";")[0]).join("; ");

  let json = null;
  try {
    json = await res.json();
  } catch {
    /* not JSON */
  }

  return { status: res.status, json, cookie: cookies || cookie };
}

/** GET one of the site's own routes. */
async function get(path, cookie) {
  const res = await fetch(`${SITE}${path}`, { headers: cookie ? { Cookie: cookie } : {} });
  let json = null;
  try {
    json = await res.json();
  } catch {
    /* not JSON */
  }
  return { status: res.status, json };
}

/** PATCH, carrying the session cookie. */
async function patch(path, body, cookie) {
  const res = await fetch(`${SITE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(cookie ? { Cookie: cookie } : {}) },
    body: JSON.stringify(body),
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    /* not JSON */
  }
  return { status: res.status, json };
}

const stamp = Date.now();
// Hyphens are allowed, and are the case a naive regex gets wrong.
const handle = `auth-test-${stamp}`;
const password = "a-password-long-enough";
const email = `auth-test-${stamp}@example.test`;

// --- Sign up, with no email address -----------------------------------
// The whole point: a username and a password is enough.
const signed = await route("/api/auth/register", { handle, password, displayName: "Auth Test" });
check("signs up with a handle and no email", signed.status === 200 && signed.json?.ok === true, `HTTP ${signed.status}`);
check("the session cookie came back", Boolean(signed.cookie), signed.cookie?.slice(0, 24) || "none");

let me = await get("/api/auth/me", signed.cookie);
check("is signed in after signing up", me.json?.profile?.handle === handle, me.json?.profile?.handle);

check(
  "the profile carries the handle and no address",
  me.json?.profile?.email === null,
  String(me.json?.profile?.email),
);

// --- Edit the profile --------------------------------------------------
const renamed = `${signed.json?.profile?.displayName} II`;
const edited = await patch("/api/auth/profile", { displayName: renamed }, signed.cookie);
check("edits its own profile", edited.status === 200 && edited.json?.displayName === renamed, edited.json?.displayName);

me = await get("/api/auth/me", signed.cookie);
check("the edit survived", me.json?.profile?.displayName === renamed, me.json?.profile?.displayName);

// The address is optional, and adding one later works.
const withEmail = await patch("/api/auth/profile", { displayName: renamed, email }, signed.cookie);
check("can add an address later", withEmail.status === 200 && withEmail.json?.email === email, withEmail.json?.email);

// --- Sign out ----------------------------------------------------------
const out = await route("/api/auth/logout", undefined, signed.cookie);
check("signs out", out.status === 200, `HTTP ${out.status}`);

const after = await get("/api/auth/me", signed.cookie);
check("is signed out afterwards", after.json?.profile === null);

// --- Sign back in ------------------------------------------------------
const back = await route("/api/auth/login", { identifier: handle, password });
check("signs back in with the handle", back.status === 200 && back.json?.profile?.handle === handle, `HTTP ${back.status}`);

const backOut = await route("/api/auth/logout", undefined, back.cookie);

// The address given later also works.
const byEmail = await route("/api/auth/login", { identifier: email, password });
check("can sign in with the address it added", byEmail.status === 200, `HTTP ${byEmail.status}`);
await route("/api/auth/logout", undefined, byEmail.cookie);

// --- The same answer for every failure ---------------------------------
const wrongPassword = await route("/api/auth/login", { identifier: handle, password: "not-the-password" });
check(
  "a wrong password is refused",
  wrongPassword.status === 401 && wrongPassword.json?.error === "invalidCredentials",
  `HTTP ${wrongPassword.status} ${wrongPassword.json?.error}`,
);

const nobody = await route("/api/auth/login", { identifier: `nobody-${stamp}`, password });
check(
  "an unknown handle gives the same answer",
  nobody.status === wrongPassword.status && nobody.json?.error === wrongPassword.json?.error,
  `HTTP ${nobody.status} ${nobody.json?.error}`,
);

// --- What sign-up refuses ----------------------------------------------
const taken = await route("/api/auth/register", { handle, password, displayName: "Impostor" });
check("a taken handle is refused", taken.status === 409 && taken.json?.error === "handleTaken", `HTTP ${taken.status}`);

const shortPassword = await route("/api/auth/register", {
  handle: `short-${stamp}`,
  password: "short",
  displayName: "Short",
});
check("a short password is refused", shortPassword.status === 400 && shortPassword.json?.error === "weakPassword", `HTTP ${shortPassword.status}`);

const badHandle = await route("/api/auth/register", {
  handle: "-starts-with-a-dash",
  password,
  displayName: "Bad Handle",
});
check("a bad handle is refused", badHandle.status === 400 && badHandle.json?.error === "invalidHandle", `HTTP ${badHandle.status}`);

const badEmail = await route("/api/auth/register", {
  handle: `bemail-${stamp}`,
  email: "not-an-address",
  password,
  displayName: "Bad Email",
});
check("a malformed address is refused", badEmail.status === 400 && badEmail.json?.error === "invalidEmail", `HTTP ${badEmail.status}`);

// --- Editing without a session -----------------------------------------
const anonymous = await patch("/api/auth/profile", { displayName: "Nobody" });
check(
  "cannot edit a profile while signed out",
  anonymous.status === 401,
  `HTTP ${anonymous.status}`,
);

// --- The old account page is not a dead end -----------------------------
const moved = await fetch(`${SITE}/account`, { redirect: "manual" });
check(
  "/account still redirects rather than 404ing",
  moved.status === 307 && moved.headers.get("location") === "/login",
  `${moved.status} -> ${moved.headers.get("location")}`,
);

// --- Clean up -----------------------------------------------------------
// Delete the GoTrue user, which cascades to the profile row.
const SERVICE = value("SUPABASE_SERVICE_ROLE_KEY");
if (SERVICE) {
  const list = await fetch(`${AUTH}/admin/users?page=1&per_page=200`, {
    headers: { apikey: SERVICE, Authorization: `Bearer ${SERVICE}` },
  });
  const users = (await list.json()).users ?? [];
  for (const u of users) {
    if (u.email?.endsWith(`@users.chouflimostakbel.tn`) && u.email.startsWith("auth-test-")) {
      await fetch(`${AUTH}/admin/users/${u.id}`, {
        method: "DELETE",
        headers: { apikey: SERVICE, Authorization: `Bearer ${SERVICE}` },
      });
    }
  }
}

void backOut;
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
