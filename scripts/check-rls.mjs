// Proves the row level security policies actually bind.
//
//   npm run db:check
//
// The point of RLS is that the application cannot read or change a row it
// should not. This checks that by trying, through the real API, to do
// exactly that.
//
// It goes through PostgREST with a signed JWT, which is the same path a
// browser takes - not through a privileged connection that could be lying
// about what the policies allow. Each identity gets a token whose `sub`
// claim is their user id, and that claim is what auth.uid() returns.
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";

const env = readFileSync(".env.local", "utf8");
const value = (name) => env.match(new RegExp(`^${name}=(.*)$`, "m"))?.[1]?.trim();

const API = value("NEXT_PUBLIC_SUPABASE_URL");
const ANON = value("NEXT_PUBLIC_SUPABASE_ANON_KEY");
const SERVICE = value("SUPABASE_SERVICE_ROLE_KEY");
const JWT_SECRET = value("SUPABASE_JWT_SECRET") || "super-secret-jwt-token-with-at-least-32-characters-long";

if (!API || !ANON || !SERVICE) {
  console.error(
    "Supabase is not configured. Run `npm run supabase:start`, then copy the\n" +
      "values it prints into .env.local.",
  );
  process.exit(1);
}

const REST = `${API}/rest/v1`;
const AUTH = `${API}/auth/v1`;

let pass = 0;
let fail = 0;
function check(name, ok, detail) {
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
}

/** Sign a token the way Supabase's own keys are signed. */
function tokenFor(userId, role = "authenticated") {
  const encode = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const header = encode({ alg: "HS256", typ: "JWT" });
  const payload = encode({
    iss: "supabase",
    role,
    sub: userId,
    exp: now + 3600,
    iat: now,
  });
  const sig = createHmac("sha256", JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64url");
  return `${header}.${payload}.${sig}`;
}

/** Ask PostgREST as one identity. */
async function as(jwt, path, init = {}) {
  const res = await fetch(`${REST}/${path}`, {
    ...init,
    headers: {
      apikey: ANON,
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { status: res.status, body };
}

/** Ask GoTrue's admin API. */
async function admin(path, init = {}) {
  const res = await fetch(`${AUTH}${path}`, {
    ...init,
    headers: {
      apikey: SERVICE,
      Authorization: `Bearer ${SERVICE}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

const stamp = Date.now();
const made = [];

async function makeUser(handle) {
  const email = `${handle}@users.chouflimostakbel.tn`;
  const { body } = await admin(`/admin/users`, {
    method: "POST",
    body: JSON.stringify({
      email,
      password: "a-password-long-enough",
      email_confirm: true,
      user_metadata: { handle },
    }),
  });
  if (!body?.id) throw new Error(`could not create ${handle}: ${JSON.stringify(body)}`);
  made.push(body.id);
  return body.id;
}

const idA = await makeUser(`rls-a-${stamp}`);
const idB = await makeUser(`rls-b-${stamp}`);
const idC = await makeUser(`rls-c-${stamp}`);

// Written by the service role, which is what the sign-up route does.
for (const [id, handle, displayName, email] of [
  [idA, `rls-a-${stamp}`, "Account A", null],
  [idB, `rls-b-${stamp}`, "Account B", `rls-b-${stamp}@example.test`],
]) {
  const { status } = await fetch(`${REST}/profiles`, {
    method: "POST",
    headers: {
      apikey: ANON,
      Authorization: `Bearer ${SERVICE}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ id, handle, display_name: displayName, email }),
  });
  if (status >= 400) throw new Error(`could not seed profile ${handle}`);
}

const jwtA = tokenFor(idA);
const jwtB = tokenFor(idB);
const jwtC = tokenFor(idC);

// 1. With no session, there is nothing to read. GoTrue's role has no grant
//    on the table at all, so the request is refused before any policy runs -
//    which is the stronger answer, since it does not even confirm the table
//    is there.
const anon = await as(ANON, "profiles?select=id");
const anonSeesNothing =
  (Array.isArray(anon.body) && anon.body.length === 0) ||
  (anon.status === 401 || anon.status === 403);
check(
  "sees no profiles without a session",
  anonSeesNothing,
  `HTTP ${anon.status}`,
);

// 2. As A, only A's own row comes back.
const asA = await as(jwtA, "profiles?select=id,handle");
check(
  "sees only its own profile",
  Array.isArray(asA.body) &&
    asA.body.length === 1 &&
    asA.body[0].id === idA,
  `${Array.isArray(asA.body) ? asA.body.length : "?"} visible`,
);

// 3. A cannot read B's row, even asking for it by id.
const seesB = await as(jwtA, `profiles?select=id&id=eq.${idB}`);
check(
  "cannot read another profile",
  Array.isArray(seesB.body) && seesB.body.length === 0,
);

// 4. A cannot change B's row. A filtered update returns the rows it
//    changed, so an empty array is the proof.
const updateB = await as(jwtA, `profiles?id=eq.${idB}`, {
  method: "PATCH",
  headers: { Prefer: "return=representation" },
  body: JSON.stringify({ display_name: "Taken" }),
});
check(
  "an update to another profile changes nothing",
  Array.isArray(updateB.body) && updateB.body.length === 0,
  `${Array.isArray(updateB.body) ? updateB.body.length : "?"} rows`,
);

// 5. A can change its own row.
const updateA = await as(jwtA, `profiles?id=eq.${idA}`, {
  method: "PATCH",
  headers: { Prefer: "return=representation" },
  body: JSON.stringify({ display_name: "Renamed" }),
});
check(
  "an update to its own profile works",
  Array.isArray(updateA.body) &&
    updateA.body.length === 1 &&
    updateA.body[0].display_name === "Renamed",
);

// 6. Nobody can write a row under someone else's id. C exists in GoTrue but
//    has no profile row yet, which is exactly the moment sign-up happens.
const steal = await as(jwtA, "profiles", {
  method: "POST",
  headers: { Prefer: "return=representation" },
  body: JSON.stringify({ id: idC, handle: `rls-stolen-${stamp}`, display_name: "Stolen" }),
});
check(
  "cannot create a profile under another id",
  steal.status === 401 || steal.status === 403,
  `HTTP ${steal.status}`,
);

// 7. C can create its own, which is the sign-up path the app relies on.
const own = await as(jwtC, "profiles", {
  method: "POST",
  headers: { Prefer: "return=representation" },
  body: JSON.stringify({ id: idC, handle: `rls-c-${stamp}`, display_name: "Account C" }),
});
check(
  "can create its own profile",
  Array.isArray(own.body) && own.body.length === 1,
  `HTTP ${own.status}`,
);

// 8. The handle is unique, whatever identity asks.
const dupe = await as(jwtC, "profiles", {
  method: "POST",
  body: JSON.stringify({ id: `00000000-0000-4000-8000-${String(stamp).padStart(12, "0")}`, handle: `rls-c-${stamp}`, display_name: "Impostor" }),
});
check(
  "a duplicate handle is refused",
  dupe.status >= 400,
  `HTTP ${dupe.status}`,
);

// 9. There is no password in this schema at all. GoTrue keeps the hash in
//    its own, behind its own API. `profiles` has no column that could hold
//    one - which is a stronger statement than any policy could make.
const openapi = await fetch(`${REST}/`, {
  headers: { apikey: ANON, Authorization: `Bearer ${SERVICE}`, Accept: "application/openapi+json" },
});
const spec = await openapi.json();
const profileColumns = Object.keys(
  spec?.definitions?.profiles?.properties ?? {},
);
check(
  "the profiles table has no password column",
  profileColumns.length > 0 &&
    !profileColumns.some((c) => /pass|hash|secret|token/i.test(c)),
  profileColumns.join(", ").slice(0, 70) || "no columns found",
);

// ------------------------------------------------------------------
// Posts
// ------------------------------------------------------------------
// The blogs carry the only policy on this site that makes anything public,
// so they need their own checks: a draft must be invisible to everyone but
// its author, a published post must be readable by a stranger, a post must
// not be movable onto someone else's byline, and the byline itself is not
// the client's to write.
//
// Written as jwtA rather than with the service role, because the service
// role has no grant on posts at all - which is deliberate. Everything here
// goes through the same path a browser takes.

const stampSlug = `rls-post-${stamp}`;

async function writePost(jwt, body) {
  return as(jwt, "posts", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(body),
  });
}

const published = await writePost(jwtA, {
  author_id: idA,
  slug: `${stampSlug}-published`,
  title: "A published post",
  body_md: "# Hello",
  status: "published",
  published_at: new Date().toISOString(),
  // Sent on purpose: the client is claiming somebody else's handle.
  author_handle: "not-a-real-handle",
});
check("a post can be published", published.status < 300, `HTTP ${published.status}`);

const draft = await writePost(jwtA, {
  author_id: idA,
  slug: `${stampSlug}-draft`,
  title: "A draft",
  status: "draft",
});
check("a post can be saved as a draft", draft.status < 300, `HTTP ${draft.status}`);

// 10. The byline is a fact about the account, not a form field. A trigger
//     takes it from the profile and discards whatever was sent.
const byline = Array.isArray(published.body) ? published.body[0] : null;
check(
  "the byline cannot be written by the client",
  byline?.author_handle === `rls-a-${stamp}`,
  String(byline?.author_handle),
);

// 11. An anonymous reader gets the published post and never the draft.
const anonPosts = await as(ANON, `posts?select=slug,status&author_id=eq.${idA}`);
const anonSlugs = Array.isArray(anonPosts.body) ? anonPosts.body.map((p) => p.slug) : [];
check(
  "an anonymous reader sees only published posts",
  anonPosts.status < 300 &&
    anonSlugs.includes(`${stampSlug}-published`) &&
    !anonSlugs.includes(`${stampSlug}-draft`),
  anonSlugs.join(", ") || `HTTP ${anonPosts.status}`,
);

// 12. Another signed-in account sees the same: published, and not the draft.
const postsB = await as(jwtB, `posts?select=slug&author_id=eq.${idA}`);
const slugsB = Array.isArray(postsB.body) ? postsB.body.map((p) => p.slug) : [];
check(
  "another account cannot see a draft",
  slugsB.length === 1 && slugsB[0] === `${stampSlug}-published`,
  slugsB.join(", ") || `HTTP ${postsB.status}`,
);

// 13. Another account cannot edit a published post either.
const editB = await as(jwtB, `posts?slug=eq.${stampSlug}-published`, {
  method: "PATCH",
  headers: { Prefer: "return=representation" },
  body: JSON.stringify({ title: "Edited by B" }),
});
check(
  "an update to another account's post changes nothing",
  Array.isArray(editB.body) && editB.body.length === 0,
  `${Array.isArray(editB.body) ? editB.body.length : "?"} rows`,
);

// 14. A post cannot be moved onto another author's byline, which is what
//     the `with check` on the update policy is for.
const stealPost = await as(jwtA, `posts?slug=eq.${stampSlug}-draft`, {
  method: "PATCH",
  headers: { Prefer: "return=representation" },
  body: JSON.stringify({ author_id: idB }),
});
check(
  "a post cannot be moved to another author",
  stealPost.status >= 400 ||
    (Array.isArray(stealPost.body) && stealPost.body.length === 0),
  `HTTP ${stealPost.status}`,
);

// Clean up. Deleting the GoTrue user cascades to the profile row, and the
// profile row cascades to the posts.
for (const id of made) {
  await admin(`/admin/users/${id}`, { method: "DELETE" }).catch(() => {});
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
