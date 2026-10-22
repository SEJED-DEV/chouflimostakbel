-- ============================================================
-- Choufli Mosta9bel - grants hardening
-- ============================================================
--
-- The upstream Supabase Postgres image ships DEFAULT PRIVILEGES on the
-- `postgres` role that grant every table to anon, authenticated and
-- service_role:
--
--   postgres=arwdDxtm/postgres,anon=arwdDxtm/postgres,
--   authenticated=arwdDxtm/postgres,service_role=arwdDxtm/postgres
--
-- Creating a table therefore hands `anon` a full grant even when the
-- migration that creates it never asked for one. RLS still held the line -
-- an anonymous reader got an empty list, never a row - but the grant itself
-- was there, and the rule for this database is that `anon` holds no grant
-- on `profiles` at all. This migration revokes what was never requested and
-- re-asserts exactly the grants each table is meant to have.
--
-- This only ever removes privileges. Nothing here opens a door.

-- profiles: a profile is private. `anon` gets nothing. An authenticated
-- user may read, create and edit - the row level security policies decide
-- whose - but may not delete a profile outright.
revoke all on public.profiles from anon;
revoke delete, truncate, references, trigger on public.profiles from authenticated;
grant select, insert, update on public.profiles to authenticated, service_role;
grant all on public.profiles to service_role;

-- posts: the blog is the one public surface. `anon` may read it and nothing
-- more. A signed-in user may write, edit and remove their own.
revoke all on public.posts from anon;
revoke truncate, references, trigger on public.posts from authenticated;
grant select on public.posts to anon;
grant select, insert, update, delete on public.posts to authenticated;
grant all on public.posts to service_role;

-- public_profiles: a view is a reading surface. No one writes through it.
revoke all on public.public_profiles from anon;
revoke all on public.public_profiles from authenticated;
grant select on public.public_profiles to anon, authenticated;
grant select on public.public_profiles to service_role;

-- push_state and push_subscriptions: the server writes these, behind the
-- service role. Neither a stranger nor a signed-in browser touches them.
revoke all on public.push_state from anon, authenticated;
revoke all on public.push_subscriptions from anon, authenticated;
grant select, insert, update, delete on public.push_subscriptions to service_role;
grant select, insert, update on public.push_state to service_role;
