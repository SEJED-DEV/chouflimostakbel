-- ============================================================
-- Choufli Mosta9bel - the badges a byline carries
-- ============================================================
--
-- A post shows who wrote it. It now also shows what that account is: the
-- same badges the profile page renders, next to the name, so a post by
-- someone on the team reads differently from a post by a passer-by.
--
-- The previous migration already established why the byline is a copy
-- rather than a join, and the roles inherit every word of it: `profiles`
-- grants an anonymous reader nothing, and its select policy only ever
-- returns your own row, so there is no reading someone else's roles off it.
-- The post carries them instead.
--
-- `roles` is `text[]` here, not a foreign key or an enum table, because that
-- is what `profiles.roles` is and this is a copy of it. The same check
-- vocabulary is repeated so a copy cannot hold a role the platform does not
-- define - the copy is constrained to the same words as the original.
--
-- Written by the same two triggers as the rest of the byline:
--   * `posts_take_author` re-takes it on every insert and update, so a
--     client still cannot award itself a badge by writing one into the post
--   * `posts_follow_profile` brings older posts with it when an account is
--     granted or loses a role, because a badge that was true last year and
--     is not true now should not still be printed

alter table posts
  add column if not exists author_roles text[] not null default '{}';

comment on column posts.author_roles is
  'The author''s roles at the time of writing, copied from profiles.roles by trigger. Not client-writable.';

-- The same vocabulary as `profiles.roles`, so a copied badge is always a
-- real one. `@>` is containment: every element of `author_roles` must exist
-- in the allowed set.
alter table posts drop constraint if exists posts_author_roles_known;
alter table posts add constraint posts_author_roles_known check (
  author_roles <@ array['leadership','dev','contributor','staff','secret']::text[]
);

-- An account holds at most one of each, so an array with repeats is a bug
-- rather than a preference.
--
-- A check cannot contain a subquery, and every obvious way to ask "does this
-- array repeat itself" needs one, so the question is asked in a function
-- instead. It is IMMUTABLE, which is what lets it sit in a check at all:
-- the database must be able to evaluate it from the row alone.
create or replace function public.array_has_duplicates(arr text[])
returns boolean
language sql
immutable
as $$
  select cardinality(arr) <> (select count(distinct x) from unnest(arr) as x);
$$;

comment on function public.array_has_duplicates(text[]) is
  'True if the array contains the same value twice. Exists so the posts check on author_roles can be written without a subquery.';

alter table posts drop constraint if exists posts_author_roles_distinct;
alter table posts add constraint posts_author_roles_distinct check (
  not public.array_has_duplicates(author_roles)
);

-- ------------------------------------------------------------------
-- Backfill
-- ------------------------------------------------------------------

-- Existing posts take the roles their author holds right now. This is a
-- correction rather than a loss: the column is new, so nothing that was
-- stored is being overwritten. No rows are deleted here or anywhere else in
-- this file - the posts that exist stay exactly as they are, plus a badge.
update posts p
   set author_roles = coalesce(pr.roles, '{}')
  from profiles pr
 where pr.id = p.author_id
   and p.author_roles is distinct from coalesce(pr.roles, '{}');

-- ------------------------------------------------------------------
-- Keeping the copy true
-- ------------------------------------------------------------------

-- On write. The three byline fields were already taken here; the roles come
-- from the same row and the same select, so this is one more target in the
-- INTO list rather than a second lookup.
create or replace function public.posts_take_author() returns trigger
language plpgsql as $$
begin
  select handle, display_name, avatar_url, coalesce(roles, '{}')
    into new.author_handle, new.author_name, new.author_avatar, new.author_roles
    from profiles
   where id = new.author_id;

  if new.author_handle is null then
    raise exception 'no profile for this author';
  end if;

  return new;
end;
$$;

-- On profile change. The previous version only woke up for a name or a
-- photo; a badge change was invisible to it, so promoting someone left
-- every post they had written showing the old role set forever. Roles join
-- the list of things that count as a change.
--
-- `is distinct from` on the array does an element-wise comparison, so a
-- grant of a role nobody had is a change and a re-save that changes
-- nothing is not.
create or replace function public.posts_follow_profile() returns trigger
language plpgsql as $$
begin
  if new.display_name is distinct from old.display_name
     or new.avatar_url is distinct from old.avatar_url
     or new.roles is distinct from old.roles then
    update posts
       set author_name   = new.display_name,
           author_avatar = new.avatar_url,
           author_roles  = coalesce(new.roles, '{}')
     where author_id = new.id;
  end if;

  return new;
end;
$$;
