-- ============================================================
-- Choufli Mosta9bel - the terms, and the moment they were agreed to
-- ============================================================
--
-- Signing in and signing up both ask the reader to agree to the terms of
-- service and the privacy policy. The asking happens in the form, but the
-- answer is worth keeping: a row that says when a reader agreed is the only
-- way to answer "did they?" months later.
--
-- The column is written by the platform at the moment of agreement, and by
-- nothing else. The `profiles_guard` trigger below is why: a reader may
-- update their own row - the row level security policy allows it - so
-- without the guard they could set the date to any moment they liked, or
-- backdate it past a change in the terms.
--
-- `service_role` and `postgres` are exempt, as they are everywhere else:
-- they are the only things that grant a role, confirm an address, or fix a
-- handle, and the sign-up route writes the profile row before there is a
-- session to write it as.
--
-- No rows are created or removed here. Existing accounts have no date, and
-- that is the truth: they agreed before there was a date to record. Their
-- first sign-in after this migration records one.

alter table profiles
  add column if not exists terms_accepted_at timestamptz;

comment on column profiles.terms_accepted_at is
  'When the reader agreed to the terms of service and the privacy policy. Set by the platform, once, at the moment of agreement. Not settable by the client.';

-- ------------------------------------------------------------------
-- The guard
-- ------------------------------------------------------------------
--
-- The same function, with one more rule. It is rewritten rather than
-- patched, because a trigger function is replaced whole in Postgres and
-- there is no way to add a condition to one that already exists.
--
-- The rule is that the date only moves from nothing to something, and only
-- for the platform. A reader may not set it, and may not move it once it
-- is there: the date is the record, and a record that can be rewritten is
-- not a record.

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

    if new.terms_accepted_at is not null then
      raise exception 'the terms can only be accepted by the platform';
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

  if new.terms_accepted_at is distinct from old.terms_accepted_at then
    raise exception 'the terms can only be accepted by the platform';
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_guard on profiles;
create trigger profiles_guard
  before insert or update on profiles
  for each row execute function public.profiles_guard();

-- ------------------------------------------------------------------
-- What the platform can see
-- ------------------------------------------------------------------
--
-- The public view lists what a stranger may read, and a date of birth and
-- an address are not on it. The date somebody agreed to the terms is not
-- on it either: it says when a person agreed to something, which is about
-- the person rather than about their public face, and nothing on the site
-- shows it.
