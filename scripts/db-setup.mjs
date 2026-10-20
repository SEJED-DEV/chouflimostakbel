// Creates the roles and the database the app uses, and applies the schema.
//
//   node scripts/db-setup.mjs
//
// Safe to run again: everything here is idempotent.
//
// Two roles, on purpose:
//
//   chouflimostakbel       owns the tables. Used for migrations.
//   chouflimostakbel_app   runs the application. NOT the owner, so the row
//                           level security policies apply to it.
//
// The password is read from DATABASE_URL, and generated and written to
// .env.local if it is not there yet.
import { Client } from "pg";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { randomBytes } from "node:crypto";

const DB_NAME = "chouflimostakbel";
const OWNER = "chouflimostakbel";
const APP_ROLE = "chouflimostakbel_app";

const admin = new Client({
  host: "127.0.0.1",
  port: 5433,
  user: "postgres",
  database: "postgres",
  connectionTimeoutMillis: 8000,
});

function readUrl() {
  if (existsSync(".env.local")) {
    const m = readFileSync(".env.local", "utf8").match(/^DATABASE_URL=(.*)$/m);
    if (m) return m[1].trim();
  }
  return null;
}

function writeUrl(url) {
  let s = existsSync(".env.local") ? readFileSync(".env.local", "utf8") : "";
  if (/^DATABASE_URL=/m.test(s)) {
    s = s.replace(/^DATABASE_URL=.*$/m, `DATABASE_URL=${url}`);
  } else {
    s = s.trimEnd() + `\n\n# The project's own Postgres. Created by npm run db:setup.\nDATABASE_URL=${url}\n`;
  }
  writeFileSync(".env.local", s, "utf8");
}

let url = readUrl();
let password;

if (url) {
  password = decodeURIComponent(url.split("://")[1].split("@")[0].split(":")[1] || "");
  console.log("using the DATABASE_URL already in .env.local");
} else {
  password = randomBytes(18).toString("base64url");
  url = `postgresql://${APP_ROLE}:${password}@127.0.0.1:5433/${DB_NAME}`;
  console.log("generated a password for " + APP_ROLE);
}

try {
  await admin.connect();
} catch (e) {
  console.error("Could not reach Postgres on 127.0.0.1:5433.");
  console.error("Start it with: npm run db:start");
  console.error(e.message);
  process.exit(1);
}

// The owner role owns the tables; the app role is a plain login.
for (const [role, pw] of [
  [OWNER, password],
  [APP_ROLE, password],
]) {
  await admin.query(
    `DO $$ BEGIN
       IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${role}') THEN
         CREATE ROLE ${role} LOGIN PASSWORD '${pw.replace(/'/g, "''")}';
         RAISE NOTICE 'created role ${role}';
       END IF;
     END $$;`,
  );
}

// CREATE DATABASE cannot run inside a transaction block.
const exists = await admin.query("select 1 from pg_database where datname = $1", [DB_NAME]);
if (exists.rowCount === 0) {
  await admin.query(`CREATE DATABASE ${DB_NAME} OWNER ${OWNER}`);
  console.log("created database " + DB_NAME);
} else {
  console.log("database " + DB_NAME + " already exists");
}

await admin.end();

// The schema, applied as the owner so the tables belong to it.
const owner = new Client({
  host: "127.0.0.1",
  port: 5433,
  user: OWNER,
  password,
  database: DB_NAME,
  connectionTimeoutMillis: 8000,
});
await owner.connect();

// A schema change cannot be applied by CREATE TABLE IF NOT EXISTS, so
// --reset drops the tables and builds them again. Safe while the data is
// only test data; not something to run against real accounts.
if (process.argv.includes("--reset")) {
  await owner.query(
    "drop table if exists sessions, email_verifications, profiles cascade",
  );
  console.log("dropped the old tables");
}

await owner.query(readFileSync("db/schema.sql", "utf8"));
console.log("applied db/schema.sql");

// The application role gets the ordinary table rights, and the right to call
// the functions. It is not the owner, so the policies bind it.
await owner.query(`GRANT USAGE ON SCHEMA public, app TO ${APP_ROLE}`);
await owner.query(
  `GRANT SELECT, INSERT, UPDATE, DELETE ON profiles, sessions, email_verifications TO ${APP_ROLE}`,
);
await owner.query(
  `GRANT EXECUTE ON FUNCTION
     app.register(citext, citext, text, text),
     app.verify_password(citext, text),
     app.create_session(uuid, text, timestamptz, text, text),
     app.session_profile(text),
     app.delete_session(text),
     app.create_email_verification(uuid, text, timestamptz),
     app.confirm_email(text)
   TO ${APP_ROLE}`,
);// No sequences: every id comes from gen_random_uuid(), which needs none.
console.log("granted the application role its rights");

const tables = await owner.query(
  "select table_name from information_schema.tables where table_schema = 'public' order by table_name",
);
const policies = await owner.query("select tablename, policyname from pg_policies order by tablename");
console.log("tables:  " + tables.rows.map((r) => r.table_name).join(", "));
console.log("policies: " + policies.rows.map((r) => `${r.tablename}.${r.policyname}`).join(", "));

await owner.end();

if (!readUrl()) {
  writeUrl(url);
  console.log("wrote DATABASE_URL to .env.local");
}
console.log("\ndone.");
