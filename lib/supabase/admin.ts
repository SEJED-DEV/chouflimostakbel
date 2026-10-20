import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * The client that creates accounts.
 *
 * Sign-up is the one moment where nobody is signed in yet, so there is no
 * session for the policies to read and no `auth.uid()` to compare against.
 * This client carries the service role, which bypasses row level security.
 *
 * It is used on exactly one route, and only to call GoTrue's admin API and
 * insert the matching row in `profiles`. Nothing else in the codebase may
 * import it - every other path goes through `lib/supabase/server.ts`, which
 * presents the reader instead of overriding them.
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
