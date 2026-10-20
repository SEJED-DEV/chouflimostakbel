-- ============================================================
-- Choufli Mosta9bel - profile detail
-- ============================================================
--
-- What a profile can hold beyond a name: a birthday, and the roles a person
-- has on the platform.
--
-- Roles live here rather than in a file so that granting one is an ordinary
-- database write and not a deploy. Which roles exist is still fixed - the
-- constraint below is the vocabulary, and anything else is refused.

-- A birthday, for "how old are you" and for nothing else. Nullable, because
-- a reader may not want to say, and because asking for it is not a condition
-- of having an account.
alter table profiles
  add column if not exists date_of_birth date;

comment on column profiles.date_of_birth is
  'Optional. Shown on the profile as an age; the date itself stays private.';

-- The roles a person holds. An array rather than a join table: nobody has
-- more than a handful, and every read of a profile wants them in the same
-- query. GIN-indexed so "all the contributors" is still cheap.
alter table profiles
  add column if not exists roles text[] not null default '{}';

comment on column profiles.roles is
  'Platform roles. The vocabulary is fixed by the constraint below.';

-- The vocabulary. Anything outside this list is a mistake, and a mistake
-- should be refused by the database rather than silently rendered as a badge
-- nobody defined.
alter table profiles drop constraint if exists profiles_roles_known;
alter table profiles add constraint profiles_roles_known check (
  roles <@ array[
    'leadership', 'dev', 'contributor', 'staff', 'secret'
  ]::text[]
);

-- "Everyone with this role" is a question the profile page will ask once the
-- blogs have authors. Without this it is a full scan.
create index if not exists profiles_roles_idx on profiles using gin (roles);

-- The order badges appear in is the order of this list, not the order they
-- were granted in. A stable hierarchy beats a stable timestamp here.
create or replace function public.profile_badges(p_roles text[])
returns text[]
language sql immutable as $$
  select array(
    select r
    from unnest(array[
      'leadership', 'dev', 'staff', 'contributor', 'secret'
    ]::text[]) with ordinality as t(r, i)
    where r = any(p_roles)
    order by i
  );
$$;
