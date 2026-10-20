-- ============================================================
-- Choufli Mosta9bel - the database
-- ============================================================
--
-- Plain Postgres with row level security. That is what the self-hosted
-- Supabase is underneath, so this moves to it without changing.
--
-- The rule: the application never decides who may read a row. It says who
-- the caller is, and the database decides. A rule that says "only your own
-- rows" cannot be bypassed, because the browser never talks to the database
-- at all - only the server does, and the server tells the database who it is
-- acting for.
--
-- Two roles, on purpose:
--
--   chouflimostakbel       owns the tables. Used for migrations only.
--   chouflimostakbel_app   runs the application. Not the owner, so the
--                           policies below apply to it.
--
-- The operations that happen before we know who the caller is - creating
-- an account, checking a password, finding a session - are SECURITY
-- DEFINER functions. They are the only way in, and they decide for
-- themselves.

create extension if not exists pgcrypto;
create extension if not exists citext;

create schema if not exists app;

-- ------------------------------------------------------------------
-- Who the caller is
-- ------------------------------------------------------------------
-- The application sets this once per transaction, after it has checked the
-- session cookie. It is the only way a row can know who is asking.
create or replace function app.current_profile_id() returns uuid
language sql stable as $$
  select nullif(current_setting('app.profile_id', true), '')::uuid
$$;

-- ------------------------------------------------------------------
-- Tables
-- ------------------------------------------------------------------

-- A person. The account.
create table if not exists profiles (
  id             uuid primary key default gen_random_uuid(),
  -- The public name, and the thing you sign in with. Required.
  handle         citext not null unique,
  -- Optional. The platform does not need an address to work: a reader can
  -- have an account, write, and never hear from us. It is here for
  -- notifications and for finding your way back in.
  email          citext unique,
  -- A bcrypt hash. The password itself is never stored, and never leaves
  -- the database in a form the application handles.
  password_hash  text not null,
  display_name   text not null check (char_length(display_name) between 1 and 80),
  -- Set once the address is confirmed. Posting is gated on it.
  verified_at    timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  -- A handle is a name people can type: letters, digits, underscore and dot.
  constraint profiles_handle_format check (
    handle ~ '^[a-z0-9][a-z0-9._-]{2,29}$'
  )
);

comment on column profiles.handle is
  'The public name, and the sign-in identifier. Required.';
comment on column profiles.email is
  'Optional. The platform does not need it; notifications and recovery do.';
comment on column profiles.password_hash is
  'bcrypt, via pgcrypto. The plaintext password is never stored.';

-- A signed-in session.
--
-- The cookie carries a random token; only its hash is stored, so a copy of
-- this table does not hand anyone a working session.
create table if not exists sessions (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references profiles(id) on delete cascade,
  token_hash  text not null unique,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null,
  user_agent  text,
  ip          text
);

create index if not exists sessions_profile_idx on sessions(profile_id);
create index if not exists sessions_expiry_idx on sessions(expires_at);

-- A pending email confirmation.
create table if not exists email_verifications (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references profiles(id) on delete cascade,
  code_hash   text not null unique,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null,
  used_at     timestamptz
);

create index if not exists email_verifications_profile_idx
  on email_verifications(profile_id);

-- ------------------------------------------------------------------
-- Row level security
-- ------------------------------------------------------------------

alter table profiles enable row level security;
alter table sessions enable row level security;
alter table email_verifications enable row level security;

-- A profile is visible to its owner, and to nobody else. There is no
-- insert policy: accounts are created only through app.register.
drop policy if exists profiles_own on profiles;
create policy profiles_own on profiles
  for select using (id = app.current_profile_id());

drop policy if exists profiles_update_own on profiles;
create policy profiles_update_own on profiles
  for update using (id = app.current_profile_id())
  with check (id = app.current_profile_id());

drop policy if exists sessions_own on sessions;
create policy sessions_own on sessions
  for all using (profile_id = app.current_profile_id())
  with check (profile_id = app.current_profile_id());

drop policy if exists email_verifications_own on email_verifications;
create policy email_verifications_own on email_verifications
  for all using (profile_id = app.current_profile_id())
  with check (profile_id = app.current_profile_id());

-- ------------------------------------------------------------------
-- The ways in
-- ------------------------------------------------------------------
-- These run as the table owner, so they are not subject to the policies
-- above. Each one checks its own conditions.
--
-- They are dropped first, not replaced: CREATE OR REPLACE cannot change a
-- function's return type, and these change as the schema settles.

drop function if exists app.register(citext, citext, text, text);
drop function if exists app.verify_password(citext, text);
drop function if exists app.create_session(uuid, text, timestamptz, text, text);
drop function if exists app.session_profile(text);
drop function if exists app.delete_session(text);
drop function if exists app.create_email_verification(uuid, text, timestamptz);
drop function if exists app.confirm_email(text);

-- Create an account. The address must not already be taken.
--
-- The output columns are named profile_* because RETURNS TABLE creates
-- variables with those names, and a variable called "id" would be ambiguous
-- with the id column in the same statement.
create or replace function app.register(
  p_handle       citext,
  p_email        citext,
  p_password     text,
  p_display_name text
) returns table (profile_id uuid, profile_verified_at timestamptz)
language plpgsql security definer set search_path = public as $$
declare
  v_id uuid;
  v_verified timestamptz;
  v_handle citext := lower(trim(p_handle));
  v_email citext := nullif(lower(trim(coalesce(p_email, ''))), '');
begin
  if char_length(p_password) < 10 then
    raise exception 'password too short' using errcode = '22023';
  end if;

  if v_handle !~ '^[a-z0-9][a-z0-9._-]{2,29}$' then
    raise exception 'handle not allowed' using errcode = '22023';
  end if;

  insert into profiles (handle, email, password_hash, display_name)
  values (v_handle, v_email, crypt(p_password, gen_salt('bf', 10)), p_display_name)
  returning id, verified_at into v_id, v_verified;

  return query select v_id, v_verified;
end;
$$;

-- Check a password. The identifier is the handle, or the address if there is
-- one. Returns nothing if the identifier or the password is wrong - the
-- caller cannot tell the two apart, which is the point.
create or replace function app.verify_password(
  p_identifier citext,
  p_password   text
) returns table (profile_id uuid, profile_handle citext, profile_display_name text, profile_email citext, profile_verified_at timestamptz)
language sql security definer set search_path = public as $$
  select p.id, p.handle, p.display_name, p.email, p.verified_at
  from profiles p
  where (p.handle = lower(trim(p_identifier))
         or (p.email is not null and p.email = lower(trim(p_identifier))))
    and p.password_hash = crypt(p_password, p.password_hash);
$$;

-- Start a session.
create or replace function app.create_session(
  p_profile_id uuid,
  p_token_hash text,
  p_expires_at timestamptz,
  p_user_agent text,
  p_ip text
) returns uuid
language sql security definer set search_path = public as $$
  insert into sessions (profile_id, token_hash, expires_at, user_agent, ip)
  values (p_profile_id, p_token_hash, p_expires_at, p_user_agent, p_ip)
  returning id;
$$;

-- Find the profile a session token belongs to. Only an unexpired session
-- counts, and expired rows are tidied up on the way past.
create or replace function app.session_profile(
  p_token_hash text
) returns table (profile_id uuid, profile_handle citext, profile_display_name text, profile_email citext, profile_verified_at timestamptz)
language plpgsql security definer set search_path = public as $$
begin
  delete from sessions where expires_at < now();

  return query
  select p.id, p.handle, p.display_name, p.email, p.verified_at
  from sessions s
  join profiles p on p.id = s.profile_id
  where s.token_hash = p_token_hash and s.expires_at > now();
end;
$$;

-- End a session.
create or replace function app.delete_session(p_token_hash text) returns void
language sql security definer set search_path = public as $$
  delete from sessions where token_hash = p_token_hash;
$$;

-- Issue an email confirmation code.
create or replace function app.create_email_verification(
  p_profile_id uuid,
  p_code_hash   text,
  p_expires_at  timestamptz
) returns uuid
language sql security definer set search_path = public as $$
  insert into email_verifications (profile_id, code_hash, expires_at)
  values (p_profile_id, p_code_hash, p_expires_at)
  returning id;
$$;

-- Redeem a confirmation code, and mark the address verified.
create or replace function app.confirm_email(p_code_hash text)
returns table (profile_id uuid, profile_email citext)
language plpgsql security definer set search_path = public as $$
declare
  v_profile uuid;
  v_email citext;
begin
  update email_verifications
     set used_at = now()
   where code_hash = p_code_hash
     and used_at is null
     and expires_at > now()
  returning profile_id into v_profile;

  if v_profile is null then
    return;
  end if;

  update profiles set verified_at = now(), updated_at = now()
   where id = v_profile
  returning id, email into v_profile, v_email;

  return query select v_profile, v_email;
end;
$$;

-- Only the owner and the application role may use these.
revoke all on function app.register(citext, text, text) from public;
revoke all on function app.verify_password(citext, text) from public;
revoke all on function app.create_session(uuid, text, timestamptz, text, text) from public;
revoke all on function app.session_profile(text) from public;
revoke all on function app.delete_session(text) from public;
revoke all on function app.create_email_verification(uuid, text, timestamptz) from public;
revoke all on function app.confirm_email(text) from public;
