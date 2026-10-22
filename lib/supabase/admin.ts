import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * The client that bypasses row level security.
 *
 * Two places need it, and both are places where there is no reader to
 * present:
 *
 *   1. Sign-up. Nobody is signed in yet, so there is no session for the
 *      policies to read and no `auth.uid()` to compare against.
 *   2. The admin panel. `profiles` is closed to `anon` and to every signed-in
 *      reader, on purpose - it holds an address, a birthday and a
 *      verification time. Staff are no exception to that promise: they are
 *      given a panel that reads the table with this client, rather than
 *      being given a grant that would let them read it from anywhere.
 *
 * Everything else goes through `lib/supabase/server.ts`, which presents the
 * reader instead of overriding them. A route that reaches for this when it
 * does not need to is a route that quietly stops asking the database
 * anything.
 */
let cached: SupabaseClient | null = null;

export function createAdminClient(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. NEXT_PUBLIC_SUPABASE_URL and " +
        "SUPABASE_SERVICE_ROLE_KEY must both be set. Run `supabase start`, " +
        "then copy the values it prints into .env.local.",
    );
  }

  cached = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return cached;
}
