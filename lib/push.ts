/**
 * Web push.
 *
 * SERVER ONLY. Nothing here may be imported by a client component - it reads
 * the VAPID private key and talks to the database. The browser side gets the
 * public key from NEXT_PUBLIC_VAPID_PUBLIC_KEY and nothing else.
 *
 * The model is deliberately small: a subscription is a device token, not a
 * contact. We never ask for an email address, and the endpoint is the only
 * thing we keep. A visitor can turn it off at any time, and turning it off
 * deletes the row.
 *
 * Storage is Postgres when DATABASE_URL is set - the self-hosted Supabase
 * that the platform is planned on - and a local file otherwise, so the feature
 * can be exercised before that database exists.
 */

import webpush from "web-push";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

/* ------------------------------------------------------------------ *
 * Configuration
 * ------------------------------------------------------------------ */

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";
const SUBJECT = process.env.VAPID_SUBJECT || "mailto:contact@chouflimostakbel.tn";

/** True when push can actually be sent. */
export function isPushConfigured(): boolean {
  return Boolean(PUBLIC_KEY && PRIVATE_KEY);
}

/** The public key the browser needs. Empty when push is not set up. */
export function publicKey(): string {
  return PUBLIC_KEY;
}

/* ------------------------------------------------------------------ *
 * Records
 * ------------------------------------------------------------------ */

export interface PushSubscriptionRecord {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  userAgent: string | null;
  createdAt: string;
}

export interface PushPayload {
  /**
   * The title. Either one string, or one string per language - the service
   * worker picks the one matching the reader's saved language, so a single
   * push reaches every reader in their own language.
   */
  title: string | Record<string, string>;
  /** The body. Same shape as the title. */
  body: string | Record<string, string>;
  /** Where the notification should take you. Defaults to the changelog. */
  url?: string;
  /** The release this notification is about. */
  version?: string;
}

/* ------------------------------------------------------------------ *
 * Storage
 * ------------------------------------------------------------------ */

interface Store {
  list(): Promise<PushSubscriptionRecord[]>;
  save(record: PushSubscriptionRecord): Promise<void>;
  remove(endpoint: string): Promise<void>;
  lastNotifiedVersion(): Promise<string | null>;
  setLastNotifiedVersion(version: string): Promise<void>;
}

/* --- Postgres --- */

const SCHEMA = `
CREATE TABLE IF NOT EXISTS push_subscriptions (
  endpoint     TEXT PRIMARY KEY,
  p256dh       TEXT NOT NULL,
  auth         TEXT NOT NULL,
  user_agent   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS push_state (
  id            INTEGER PRIMARY KEY DEFAULT 1,
  last_version  TEXT
);
`;

function postgresStore(url: string): Store {
  // Imported lazily and dynamically so this module loads as ESM, and so the
  // file store works on a machine with no database driver at all.
  let poolPromise: Promise<import("pg").Pool> | null = null;
  let ready: Promise<void> | null = null;

  function pool(): Promise<import("pg").Pool> {
    if (!poolPromise) {
      poolPromise = import("pg").then((pg) => new pg.Pool({ connectionString: url, max: 4 }));
    }
    return poolPromise;
  }

  async function ensureSchema() {
    if (!ready) {
      const p = await pool();
      ready = p
        .query(SCHEMA)
        .then(() => undefined)
        .catch((error) => {
          // Let the next call try again rather than caching the failure.
          ready = null;
          throw error;
        });
    }
    return ready;
  }

  return {
    async list() {
      await ensureSchema();
      const res = await (await pool()).query(
        "SELECT endpoint, p256dh, auth, user_agent, created_at FROM push_subscriptions",
      );
      return res.rows.map((r) => ({
        endpoint: r.endpoint as string,
        keys: { p256dh: r.p256dh as string, auth: r.auth as string },
        userAgent: (r.user_agent as string) ?? null,
        createdAt: new Date(r.created_at as string).toISOString(),
      }));
    },

    async save(record) {
      await ensureSchema();
      await (await pool()).query(
        `INSERT INTO push_subscriptions (endpoint, p256dh, auth, user_agent)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (endpoint) DO UPDATE
           SET p256dh = EXCLUDED.p256dh,
               auth = EXCLUDED.auth,
               user_agent = EXCLUDED.user_agent`,
        [record.endpoint, record.keys.p256dh, record.keys.auth, record.userAgent],
      );
    },

    async remove(endpoint) {
      await ensureSchema();
      await (await pool()).query("DELETE FROM push_subscriptions WHERE endpoint = $1", [endpoint]);
    },

    async lastNotifiedVersion() {
      await ensureSchema();
      const res = await (await pool()).query("SELECT last_version FROM push_state WHERE id = 1");
      return (res.rows[0]?.last_version as string) ?? null;
    },

    async setLastNotifiedVersion(version) {
      await ensureSchema();
      await (await pool()).query(
        `INSERT INTO push_state (id, last_version) VALUES (1, $1)
         ON CONFLICT (id) DO UPDATE SET last_version = EXCLUDED.last_version`,
        [version],
      );
    },
  };
}

/* --- File, for development and for before Postgres exists --- */

const FILE = join(process.cwd(), "data", "push.json");

interface FileShape {
  subscriptions: PushSubscriptionRecord[];
  lastVersion: string | null;
}

function readFile(): FileShape {
  try {
    if (!existsSync(FILE)) return { subscriptions: [], lastVersion: null };
    const parsed = JSON.parse(readFileSync(FILE, "utf8")) as FileShape;
    return {
      subscriptions: Array.isArray(parsed.subscriptions) ? parsed.subscriptions : [],
      lastVersion: parsed.lastVersion ?? null,
    };
  } catch {
    return { subscriptions: [], lastVersion: null };
  }
}

function writeFile(state: FileShape) {
  mkdirSync(dirname(FILE), { recursive: true });
  writeFileSync(FILE, JSON.stringify(state, null, 2) + "\n", "utf8");
}

function fileStore(): Store {
  return {
    async list() {
      return readFile().subscriptions;
    },
    async save(record) {
      const state = readFile();
      const next = state.subscriptions.filter((s) => s.endpoint !== record.endpoint);
      next.push(record);
      writeFile({ ...state, subscriptions: next });
    },
    async remove(endpoint) {
      const state = readFile();
      writeFile({
        ...state,
        subscriptions: state.subscriptions.filter((s) => s.endpoint !== endpoint),
      });
    },
    async lastNotifiedVersion() {
      return readFile().lastVersion;
    },
    async setLastNotifiedVersion(version) {
      writeFile({ ...readFile(), lastVersion: version });
    },
  };
}

let store: Store | null = null;

export function getStore(): Store {
  if (store) return store;
  const url = process.env.DATABASE_URL;
  store = url ? postgresStore(url) : fileStore();
  return store;
}

/* ------------------------------------------------------------------ *
 * Sending
 * ------------------------------------------------------------------ */

export interface SendResult {
  sent: number;
  failed: number;
  removed: number;
}

/** Push notifications expire rather than queue forever. A week is plenty. */
const TTL_SECONDS = 7 * 24 * 60 * 60;

/**
 * Sends to every subscription, dropping the ones the browser has thrown away.
 *
 * A push endpoint that returns 404 or 410 is dead - the browser unsubscribed
 * or the token expired - and is deleted rather than retried.
 */
export async function sendToAll(payload: PushPayload): Promise<SendResult> {
  if (!isPushConfigured()) {
    throw new Error("push is not configured: set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY");
  }

  webpush.setVapidDetails(SUBJECT, PUBLIC_KEY, PRIVATE_KEY);

  const subscriptions = await getStore().list();
  const body = JSON.stringify(payload);
  const options = { TTL: TTL_SECONDS, urgency: "normal" as const };

  let sent = 0;
  let failed = 0;
  let removed = 0;

  // A handful at a time: enough to be quick, few enough not to look like an
  // attack on the push service.
  const BATCH = 10;
  for (let i = 0; i < subscriptions.length; i += BATCH) {
    const batch = subscriptions.slice(i, i + BATCH);

    const results = await Promise.allSettled(
      batch.map((sub) =>
        webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          body,
          options,
        ),
      ),
    );

    for (let n = 0; n < results.length; n++) {
      const result = results[n];
      if (result.status === "fulfilled") {
        sent++;
        continue;
      }
      const status = (result.reason as { statusCode?: number })?.statusCode;
      if (status === 404 || status === 410) {
        await getStore().remove(batch[n].endpoint);
        removed++;
      } else {
        failed++;
      }
    }
  }

  return { sent, failed, removed };
}

/**
 * Sends only if this version has not been announced yet.
 *
 * Without this, deploying five times in a day pings everyone five times.
 */
export async function sendOnce(
  version: string,
  payload: PushPayload,
): Promise<{ sent: boolean; result: SendResult }> {
  const store = getStore();
  const last = await store.lastNotifiedVersion();
  if (last === version) {
    return { sent: false, result: { sent: 0, failed: 0, removed: 0 } };
  }

  const result = await sendToAll({ ...payload, version });
  await store.setLastNotifiedVersion(version);
  return { sent: true, result };
}
