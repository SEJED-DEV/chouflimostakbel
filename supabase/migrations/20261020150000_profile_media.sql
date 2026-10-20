-- ============================================================
-- Choufli Mosta9bel - profile media, and the keys to the roles
-- ============================================================
--
-- Two things this adds, and they are not really the same thing.
--
-- The first is a photo and a banner: two nullable text columns holding data
-- URLs. Storage is deliberately not used - the local stack runs without it,
-- and an image host is one more thing that can be down. The browser resizes
-- and compresses to WebP before it uploads, so these stay small, and the
-- check constraints below are the backstop that keeps that promise true
-- even if a client does not.
--
-- The second is the reason this file exists at all. `profiles.roles` was
-- written by nobody but the platform, and the row level security policy on
-- profiles says a person may update their own row - which is true, and which
-- meant a signed-in reader could have written `'{leadership}'` into their
-- own roles and worn the badge. Row level security governs rows; the guard
-- below governs columns.

-- ------------------------------------------------------------------
-- Profile media
-- ------------------------------------------------------------------

alter table profiles
  add column if not exists avatar_url text,
  add column if not exists banner_url text;

comment on column profiles.avatar_url is
  'A data URL. Resized and compressed by the browser before it gets here.';
comment on column profiles.banner_url is
  'A data URL. Resized and compressed by the browser before it gets here.';

-- ~256 KB for a square avatar, ~1 MB for a wide banner. Both are well past
-- what the client sends and far short of what a row should be allowed to
-- carry; an unbounded text column is a denial-of-service tool.
alter table profiles drop constraint if exists profiles_avatar_size;
alter table profiles add constraint profiles_avatar_size check (
  avatar_url is null or char_length(avatar_url) <= 262144
);

alter table profiles drop constraint if exists profiles_banner_size;
alter table profiles add constraint profiles_banner_size check (
  banner_url is null or char_length(banner_url) <= 1048576
);

-- ------------------------------------------------------------------
-- What a person may not grant themselves
-- ------------------------------------------------------------------
--
-- Written as a trigger rather than as column-level privileges, because it
-- can say *why* a write was refused instead of "permission denied", and
-- because it holds however the write arrives - a REST call, a migration, a
-- future route that forgets to check.
--
-- The service role is exempt: it is the only thing that grants a role, sets
-- a verification, or fixes a handle. `postgres` is exempt for the same
-- reason, so the migration can still be run and repaired by hand.

create or replace function public.profiles_guard() returns trigger
language plpgsql as $$
begin
  if current_user in ('service_role', 'postgres') then
    return new;
  end if;

  if TG_OP = 'INSERT' then
    if new.roles <> '{}'::text[] then
      raise exception 'roles can only be granted by the platform';
    end if;
    return new;
  end if;

  if new.roles is distinct from old.roles then
    raise exception 'roles can only be granted by the platform';
  end if;

  if new.handle is distinct from old.handle then
    raise exception 'a handle is the account and cannot be changed';
  end if;

  if new.verified_at is distinct from old.verified_at then
    raise exception 'a verified address can only be confirmed by the platform';
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_guard on profiles;
create trigger profiles_guard
  before insert or update on profiles
  for each row execute function public.profiles_guard();
