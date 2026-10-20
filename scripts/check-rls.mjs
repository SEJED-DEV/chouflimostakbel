// Proves the row level security policies actually bind.
//
//   node --experimental-strip-types scripts/check-rls.mjs
//
// The point of RLS is that the application cannot read or change a row it
// should not. This checks that by trying, as the application role, to do
// exactly that - and then confirming through the owner that nothing moved.
import { Client } from "pg";
import { readFileSync } from "node:fs";

const url = readFileSync(".env.local", "utf8").match(/^DATABASE_URL=(.*)$/m)?.[1]?.trim();
if (!url) {
  console.error("No DATABASE_URL in .env.local. Run npm run db:setup first.");
  process.exit(1);
}

const parsed = new URL(url);
const base = {
  host: parsed.hostname,
  port: Number(parsed.port || 5432),
  password: decodeURIComponent(parsed.password),
  database: parsed.pathname.slice(1),
  connectionTimeoutMillis: 8000,
};

/** The application role. Not the owner, so the policies bind it. */
const app = new Client({ ...base, user: decodeURIComponent(parsed.username) });
/** The owner. Owns the tables, so it sees everything - which is how we check
 *  that the application really did not change anything. */
const owner = new Client({ ...base, user: "chouflimostakbel" });

let pass = 0;
let fail = 0;
function check(name, ok, detail) {
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
}

await app.connect();
await owner.connect();

const stamp = Date.now();
const handleA = `rls-a-${stamp}`;
const handleB = `rls-b-${stamp}`;

const a = await app.query("select * from app.register($1, $2, $3, $4)", [
  handleA,
  null,
  "a-password-long-enough",
  "Account A",
]);
const b = await app.query("select * from app.register($1, $2, $3, $4)", [
  handleB,
  `rls-b-${stamp}@example.test`,
  "b-password-long-enough",
  "Account B",
]);
const idA = a.rows[0].profile_id;
const idB = b.rows[0].profile_id;

// 1. With no identity set, the application role sees nothing.
const anon = await app.query("select count(*)::int as n from profiles");
check("sees no profiles without an identity", anon.rows[0].n === 0, `${anon.rows[0].n} visible`);

// 2. It cannot insert directly either - only the register function may.
let insertBlocked = false;
try {
  await app.query(
    "insert into profiles (email, password_hash, display_name) values ($1, 'x', $2)",
    [`rls-direct-${stamp}@example.test`, "Sneaky"],
  );
} catch (e) {
  insertBlocked = /row-level security|permission denied/i.test(e.message);
}
check("cannot insert a profile directly", insertBlocked);

// 3. As A, it sees itself.
await app.query("begin");
await app.query("select set_config('app.profile_id', $1, true)", [idA]);
const asA = await app.query("select id, display_name from profiles order by id");
check(
  "sees only its own profile",
  asA.rows.length === 1 && asA.rows[0].id === idA,
  `${asA.rows.length} visible`,
);

// 4. It cannot see B.
const seesB = await app.query("select id from profiles where id = $1", [idB]);
check("cannot see another profile", seesB.rows.length === 0);

// 5. It cannot change B. A filtered update updates nothing rather than
// raising, so the row count is the thing to check.
const update = await app.query(
  "update profiles set display_name = 'Taken' where id = $1",
  [idB],
);
check("the update touched no rows", update.rowCount === 0, `${update.rowCount} rows`);
await app.query("commit");

// And the row really is unchanged, read by the owner who can see it.
const bNow = await owner.query("select display_name from profiles where id = $1", [idB]);
check(
  "another profile is unchanged",
  bNow.rows[0]?.display_name === "Account B",
  bNow.rows[0]?.display_name,
);

// 6. The password is stored as a hash, never as the password.
const stored = await owner.query("select password_hash from profiles where id = $1", [idA]);
check(
  "the password is stored as a hash",
  !stored.rows[0].password_hash.includes("a-password-long-enough") &&
    /^\$2[aby]\$/.test(stored.rows[0].password_hash),
  stored.rows[0].password_hash.slice(0, 10) + "...",
);

// 7. The right password verifies, the wrong one does not.
const good = await app.query("select * from app.verify_password($1, $2)", [
  handleA,
  "a-password-long-enough",
]);
const bad = await app.query("select * from app.verify_password($1, $2)", [
  handleA,
  "wrong-password-here",
]);
const unknown = await app.query("select * from app.verify_password($1, $2)", [
  `nobody-${stamp}@example.test`,
  "a-password-long-enough",
]);
check("the right password verifies", good.rows.length === 1);
check("the wrong password does not", bad.rows.length === 0);
check("an unknown address does not", unknown.rows.length === 0);

// 8. A short password is refused.
let tooShort = false;
try {
  await app.query("select * from app.register($1, $2, $3, $4)", [
    `short-${stamp}`,
    null,
    "short",
    "Short",
  ]);
} catch (e) {
  tooShort = /password too short/i.test(e.message);
}
check("a short password is refused", tooShort);

// 9. A session can be started, found, and ended.
const token = "test-token-" + stamp;
await app.query("select app.create_session($1, $2, now() + interval '1 hour', $3, $4)", [
  idA,
  token,
  "test-agent",
  "127.0.0.1",
]);
const sess = await app.query("select * from app.session_profile($1)", [token]);
check("a session finds its profile", sess.rows.length === 1 && sess.rows[0].profile_id === idA);
await app.query("select app.delete_session($1)", [token]);
const gone = await app.query("select * from app.session_profile($1)", [token]);
check("a deleted session is gone", gone.rows.length === 0);

// 10. An expired session is not honoured.
const expired = "expired-token-" + stamp;
await app.query("select app.create_session($1, $2, now() - interval '1 hour', $3, $4)", [
  idA,
  expired,
  "test-agent",
  "127.0.0.1",
]);
const stale = await app.query("select * from app.session_profile($1)", [expired]);
check("an expired session is not honoured", stale.rows.length === 0);

// Clean up.
await owner.query("delete from sessions where profile_id = any($1)", [[idA, idB]]);
await owner.query("delete from profiles where id = any($1)", [[idA, idB]]);

await app.end();
await owner.end();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
