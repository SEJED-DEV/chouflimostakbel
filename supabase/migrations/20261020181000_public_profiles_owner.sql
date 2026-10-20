-- The public profile view has to run as its owner.
--
-- `security_invoker` defaults to off in PostgreSQL 15 and later, but the
-- previous migration set it explicitly to on, which was wrong: it makes the
-- view run with the reader's own privileges, and an anonymous reader has no
-- grant on `profiles`, so the view returned "permission denied" to the exact
-- people it exists for.
--
-- Off is the correct setting here and is not a loosening. The view is the
-- only thing `anon` has a grant on; `profiles` itself still has no anon
-- grant, no anon policy, and remains unreadable directly. The view runs as
-- its owner so it can read the table, and hands back only the eight columns
-- it selects. A reader cannot ask it for a column it does not have.

alter view public.public_profiles set (security_invoker = off);
