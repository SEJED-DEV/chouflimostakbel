import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * The Supabase client for a route handler or a server component.
 *
 * It reads the session out of the cookies Supabase set in the browser and
 * refreshes them when they have expired, so every query below runs as the
 * signed-in reader - which is what makes the row level security policies in
 * db/schema.sql mean anything. Nothing here reaches around them.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component, where writing cookies is not
            // allowed. The middleware refreshes the session instead, so
            // failing quietly here is correct rather than a swallowed error.
          }
        },
      },
    },
  );
}
