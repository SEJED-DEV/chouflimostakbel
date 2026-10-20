-- ============================================================
-- Choufli Mosta9bel - profiles
-- ============================================================
--
-- Supabase's Postgres, run locally by `supabase start`. Applied with
-- `npm run db:migrate`, which runs only the files in this folder that have
-- not been applied yet. The database is never dropped or recreated: this is
-- real data now, and the way to add a column is to add a column.
--
-- GoTrue - Supabase Auth - owns the account: the password, the sessions, the
-- refresh tokens, the recovery flow. Everything it already does well. What
-- lives here is the part Supabase knows nothing about: the handle people
-- choose, and what they put on their profile.
--
-- The rule is unchanged: the application never decides who may read a row.
-- It presents a signed-in user, and the database decides. A rule that says
-- "only your own rows" cannot be bypassed, because the browser never talks
-- to the database directly - the API presents the caller's JWT, and
-- auth.uid() is what the policies below are written against.
--
-- Roles, in Supabase's terms:
--
--   anon        no session. Can reach nothing here.
--   authenticated   a signed-in user. Sees their own row, and nothing else.
--   service_role    the server, on the one route that creates an account.
--                   Bypasses RLS, by design, because there is no user yet.

-- citext is what makes a handle case-insensitive without every query having
-- to remember to lower() it.
create extension if not exists citext;

-- ------------------------------------------------------------------
-- Tables
-- ------------------------------------------------------------------

-- A person. The account's own record: what Supabase Auth cannot hold.
--
-- id is not generated here. It is the GoTrue user, which is why there is no
-- password column - GoTrue stores the hash, and it is not readable from SQL.
create table if not exists profiles (
  -- The GoTrue user. The join is the whole relationship between the two.
  id             uuid primary key references auth.users(id) on delete cascade,
  -- The public name, and the thing you sign in with. Required.
  handle         citext not null unique,
  -- Optional. The platform does not need an address to work: a reader can
  -- have an account, write, and never hear from us. It is here for
  -- notifications and for finding your way back in.
  --
  -- This is NOT the address GoTrue signs in with. See lib/auth.ts: a reader
  -- chooses a username, and GoTrue is given a synthetic address behind the
  -- scenes so that it has something to hold. This column is the real one,
  -- if they offered it.
  email          citext unique,
  display_name   text not null default '' check (char_length(display_name) <= 80),
  -- Set once the address is confirmed. Posting is gated on it.
  verified_at    timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  -- A handle is a name people can type: letters, digits, dot, dash, underscore.
  constraint profiles_handle_format check (
    handle ~ '^[a-z0-9][a-z0-9._-]{2,29}$'
  )
);

comment on column profiles.handle is
  'The public name, and the sign-in identifier. Required.';
comment on column profiles.email is
  'Optional. The platform does not need it; notifications and recovery do.';
comment on column profiles.id is
  'The Supabase Auth user. Not generated here.';

create index if not exists profiles_created_at_idx on profiles (created_at desc);

-- updated_at is maintained by the database, so no route has to remember.
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on profiles;
create trigger profiles_touch_updated_at
  before update on profiles
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------------
-- Row level security
-- ------------------------------------------------------------------

alter table profiles enable row level security;

-- Read: your own row, and nobody else's.
--
-- There is deliberately no public read. When the blogs have authors, the
-- post carries the author's handle with it, so a reader never needs to look
-- a person up. That keeps a profile private by default, which is the right
-- default for a site used by teenagers.
drop policy if exists profiles_select_own on profiles;
create policy profiles_select_own on profiles
  for select using (auth.uid() = id);

-- Write: your own row, and only if the new row is still yours.
drop policy if exists profiles_update_own on profiles;
create policy profiles_update_own on profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

-- Insert: you may create your own record, and only your own. The sign-up
-- route uses the service role because at that moment there is no session
-- yet, but this policy means the flow also works from the client, and
-- nobody can ever write a row with someone else's id.
drop policy if exists profiles_insert_own on profiles;
create policy profiles_insert_own on profiles
  for insert with check (auth.uid() = id);

-- There is no delete policy. Accounts are closed from the server, which is
-- the only place that can also close the GoTrue user.

-- ------------------------------------------------------------------
-- Push subscriptions
-- ------------------------------------------------------------------
-- Written by the server on behalf of a visitor, signed in or not: the
-- browser hands over an endpoint, and the server stores it. There is no
-- anon policy for the same reason there is no public read on profiles -
-- these rows are only ever touched from one route, with the service role.

create table if not exists push_subscriptions (
  endpoint     text primary key,
  p256dh       text not null,
  auth         text not null,
  user_agent   text,
  created_at   timestamptz not null default now()
);

-- Which changelog release was last pushed. One row, id 1, forever.
create table if not exists push_state (
  id            integer primary key default 1,
  last_version  text
);

alter table push_subscriptions enable row level security;
alter table push_state enable row level security;

-- ------------------------------------------------------------------
-- Privileges
-- ------------------------------------------------------------------
-- Row level security decides *which rows*. These decide *whether the API may
-- ask at all* - PostgREST checks table privileges first, and answers
-- "permission denied" rather than deferring to the policies.
--
-- `anon` deliberately gets no table grants. It may reach the schema, and
-- finds nothing in it. That is what makes an unauthenticated request return
-- an empty list instead of an error.

grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update on public.profiles
  to authenticated, service_role;

grant select, insert, update, delete on public.push_subscriptions
  to service_role;

grant select, insert, update on public.push_state
  to service_role;
