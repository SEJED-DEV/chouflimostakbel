-- ============================================================
-- Choufli Mosta9bel - posts
-- ============================================================
--
-- The blogs, at last. One table, and the same rule everything else here
-- follows: the application never decides who may read or write a row. It
-- presents a signed-in user, and the database decides.
--
-- The shape of a post is deliberately boring - a title, a slug, an excerpt,
-- the body as markdown, some tags, and whether it is published. There is no
-- separate "revision" table yet and no read counter; those are phase two and
-- this is phase one, and a table that models a feature nobody has built is
-- worse than no table at all.
--
-- WHO MAY PUBLISH
--
-- Anyone with an account. A reader signs in, writes, and their post is on
-- the site - there is no approval queue, because a gate with nobody to open
-- it is not a gate, it is a dead end. The site says plainly that every post
-- is written by a reader and not by us, and this is that promise enforced.
--
-- If a moderation step is ever wanted, it belongs in the policies below -
-- specifically in the `with check` on posts_insert - and nowhere in the
-- application. That is the whole point of writing it here.
--
-- DRAFTS
--
-- A draft is visible to its author and to nobody else, which falls out of
-- the select policy rather than being enforced by the routes. There is no
-- "unlisted" state: a post is either published or it is not.

-- ------------------------------------------------------------------
-- Table
-- ------------------------------------------------------------------

create table if not exists posts (
  id             uuid primary key default gen_random_uuid(),
  -- The reader who wrote it. The join to profiles is what supplies the
  -- handle and the name shown on the post, because a profile is private by
  -- default and a published post needs a public author.
  author_id      uuid not null references profiles(id) on delete cascade,
  -- Lower-case, hyphenated, unique. Appears in the URL.
  slug           citext not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{0,79}$'),
  title          text not null check (char_length(title) between 1 and 160),
  -- Shown in the list. Optional, but the list reads badly without it.
  excerpt        text not null default '' check (char_length(excerpt) <= 400),
  -- Markdown. Capped well short of anything a browser would struggle with;
  -- an unbounded text column is a denial-of-service tool.
  body_md        text not null default '' check (char_length(body_md) <= 200000),
  -- Lower-case, trimmed, deduplicated by the application before it gets here.
  tags           text[] not null default '{}' check (cardinality(tags) <= 8),
  status         text not null default 'draft'
                   check (status in ('draft', 'published')),
  -- Set the moment it is first published, and never moved afterwards: it is
  -- the date readers see, so re-publishing an edited post does not make it
  -- look new. Null while it is still a draft.
  published_at   timestamptz,
  -- Word count divided by a reading speed, rounded up. Stored rather than
  -- computed on read because the body does not change between renders.
  reading_minutes integer not null default 1
                   check (reading_minutes between 1 and 600),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  -- A published post without a date cannot be ordered, and a draft with one
  -- has a date nobody chose.
  constraint posts_published_has_date check (
    (status = 'published') = (published_at is not null)
  )
);

comment on column posts.published_at is
  'Set once, on first publication, and never moved. The date readers see.';
comment on column posts.body_md is
  'Markdown. Escaped, never passed through as HTML - see lib/posts.ts.';

-- The feed is "published, newest first", and a partial index keeps drafts
-- out of it rather than paying for them on every read.
create index if not exists posts_published_idx
  on posts (published_at desc) where status = 'published';

-- The profile's "your posts" list, which includes drafts.
create index if not exists posts_author_idx
  on posts (author_id, updated_at desc);

-- Tag filtering, once the list has a tag to filter by.
create index if not exists posts_tags_idx on posts using gin (tags);

-- Reuses the trigger function the profiles migration created.
drop trigger if exists posts_touch_updated_at on posts;
create trigger posts_touch_updated_at
  before update on posts
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------------
-- Row level security
-- ------------------------------------------------------------------

alter table posts enable row level security;

-- Read: anything published, plus your own drafts.
--
-- This is the only policy on the table that governs what the public can see,
-- and it is why the routes never check ownership before showing a post.
drop policy if exists posts_select on posts;
create policy posts_select on posts
  for select using (
    status = 'published' or author_id = auth.uid()
  );

-- Insert: you may write, and you may only ever write as yourself.
drop policy if exists posts_insert on posts;
create policy posts_insert on posts
  for insert with check (author_id = auth.uid());

-- Update: your own rows, and still your own rows afterwards. `author_id` is
-- not editable through this - the `with check` is what stops a post being
-- moved onto somebody else's byline.
drop policy if exists posts_update on posts;
create policy posts_update on posts
  for update using (author_id = auth.uid())
  with check (author_id = auth.uid());

-- Delete: your own posts. There is no undelete and no archive, so the
-- application asks before it calls this.
drop policy if exists posts_delete on posts;
create policy posts_delete on posts
  for delete using (author_id = auth.uid());

-- ------------------------------------------------------------------
-- Privileges
-- ------------------------------------------------------------------
-- The same split as profiles: row level security picks the rows, and these
-- decide whether the API may ask at all. `anon` gets nothing, which is what
-- makes an unauthenticated request come back empty rather than refused.

grant select, insert, update, delete on public.posts
  to authenticated;
