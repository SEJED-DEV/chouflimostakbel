-- ============================================================
-- Choufli Mosta9bel - the author the post carries
-- ============================================================
--
-- A published post needs a byline, and it needs one that an anonymous
-- reader can see. Two things get in the way of reading it off `profiles`:
--
--   1. `profiles` grants nothing to `anon`, on purpose. A profile is private
--      by default, which is the right default for a site used by teenagers -
--      but a published post is public by definition, and its byline must be
--      too.
--
--   2. Even if it did grant something, the select policy says a person sees
--      their own row, so there would be no author on anyone else's post.
--
-- So the post carries its own copy: the handle, the display name and the
-- photo, at the moment of writing. The profiles migration said as much when
-- it explained why there is no public read - "when the blogs have authors,
-- the post carries the author's handle with it" - and this is that.
--
-- THE COPY IS NOT THE CLIENT'S TO SET
--
-- Nothing in the previous migration stops a client inserting
-- `author_handle = 'sejed.dev'` on a post it owns. Row level security governs
-- rows, not columns, exactly as it did for `profiles.roles`. So a trigger
-- writes these three fields from the profile row and discards whatever was
-- sent: the byline is a fact about the account, not a form field.

alter table posts
  add column if not exists author_handle citext,
  add column if not exists author_name   text not null default '',
  add column if not exists author_avatar text;

comment on column posts.author_handle is
  'Copied from profiles.handle at write time. Not settable by a client.';
comment on column posts.author_avatar is
  'Copied from profiles.avatar_url at write time. A data URL, so the same cap as the profile applies.';

-- The avatar is a data URL the same way the profile's is, and the same
-- reasoning applies: a column with no ceiling is a denial-of-service tool.
alter table posts drop constraint if exists posts_author_avatar_size;
alter table posts add constraint posts_author_avatar_size check (
  author_avatar is null or char_length(author_avatar) <= 262144
);

-- Backfill from the account, then make the byline mandatory.
--
-- The backfill matters even though the table is empty today: this migration
-- must also be the one that works if it is ever applied to a database where
-- posts already exist, and `set not null` on a column holding nulls is an
-- error rather than a surprise someone can read.
--
-- No rows are removed here, and none need to be: `author_id` references
-- profiles with on delete cascade, so a post cannot outlive its author.
update posts p
   set author_handle = pr.handle,
       author_name   = pr.display_name,
       author_avatar = pr.avatar_url
  from profiles pr
 where pr.id = p.author_id
   and (p.author_handle is distinct from pr.handle
        or p.author_name is distinct from pr.display_name
        or p.author_avatar is distinct from pr.avatar_url);

alter table posts alter column author_handle set not null;

-- ------------------------------------------------------------------
-- Keeping the copy true
-- ------------------------------------------------------------------

-- On write: take the byline from the account, whatever the client sent.
create or replace function public.posts_take_author() returns trigger
language plpgsql as $$
begin
  select handle, display_name, avatar_url
    into new.author_handle, new.author_name, new.author_avatar
    from profiles
   where id = new.author_id;

  if new.author_handle is null then
    raise exception 'no profile for this author';
  end if;

  return new;
end;
$$;

drop trigger if exists posts_take_author on posts;
create trigger posts_take_author
  before insert or update on posts
  for each row execute function public.posts_take_author();

-- On profile change: bring the older posts with it. A post written last
-- year should not still show the name and photo of whoever wrote it then.
--
-- Only when something the byline depends on actually moved, so an ordinary
-- profile save does not rewrite every post the person has.
create or replace function public.posts_follow_profile() returns trigger
language plpgsql as $$
begin
  if new.display_name is distinct from old.display_name
     or new.avatar_url is distinct from old.avatar_url then
    update posts
       set author_name   = new.display_name,
           author_avatar = new.avatar_url
     where author_id = new.id;
  end if;

  return new;
end;
$$;

drop trigger if exists posts_follow_profile on profiles;
create trigger posts_follow_profile
  after update on profiles
  for each row execute function public.posts_follow_profile();

-- ------------------------------------------------------------------
-- Grants
-- ------------------------------------------------------------------
-- Published posts are public, so the table is public - but only as far as
-- the select policy allows, which is `status = 'published'`. An anonymous
-- visitor gets an empty list rather than an error, and cannot reach a draft
-- because `auth.uid()` is null for them and the draft branch of the policy
-- is therefore never true.
--
-- `anon` gets no insert, update or delete. Writing is for accounts.

grant select on public.posts to anon;
