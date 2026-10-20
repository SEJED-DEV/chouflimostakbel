import { Pool, type PoolClient } from "pg";

/**
 * The database.
 *
 * SERVER ONLY. The browser never talks to Postgres - it talks to the server,
 * and the server tells the database who it is acting for. That is what makes
 * the row level security policies worth having.
 */

const globalForDb = globalThis as unknown as { cmbPool?: Pool };

function pool(): Pool {
  if (!globalForDb.cmbPool) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "DATABASE_URL is not set. Copy .env.example to .env.local and run: npm run db:setup",
      );
    }
    globalForDb.cmbPool = new Pool({
      connectionString: url,
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 8000,
    });
  }
  return globalForDb.cmbPool;
}

export function db(): Pool {
  return pool();
}

/**
 * Runs a query on behalf of a signed-in reader.
 *
 * The identity is set for the transaction, so the policies in the schema
 * decide what the query may see. The client cannot bypass them, because the
 * client never runs the query.
 */
export async function asProfile<T>(
  profileId: string,
  work: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool().connect();
  try {
    await client.query("begin");
    await client.query("select set_config('app.profile_id', $1, true)", [profileId]);
    const result = await work(client);
    await client.query("commit");
    return result;
  } catch (error) {
    await client.query("rollback").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}
