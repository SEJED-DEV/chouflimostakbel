-- ============================================================
-- Choufli Mosta9bel - the profile a stranger may read
-- ============================================================
--
-- A post's byline now links to the person who wrote it, so there has to be
-- somewhere for that link to land. Until now `profiles` had no public read
-- at all, and that was deliberate: the row holds an address, a date of birth
-- and a verification time, and the site is used by teenagers. Opening the
-- table to anonymous readers would have published all three.
--
-- So the table stays closed and a view opens instead. It exposes the six
-- fields that are already on public display every time the person writes
-- something - handle, name, photo, banner, badges, join date - and nothing
-- else. There is no way to `select *` an address out of it, because the
-- address is not in it. That is the whole reason it is a view rather than a
-- grant: a grant is a permission to read whatever is there, and a view is a
-- statement of what is publishable.
--
-- The alternative was a column-level grant, which PostgreSQL does support.
-- It was not taken because it leaves the table itself readable and every
-- future column a fresh question of whether it leaks. A view makes the
-- public surface something you extend on purpose.
--
-- Because the view filters on `published`, it shows a person only once they
-- have written something. An account that has never posted has no public
-- page - and its byline appears nowhere, so nothing links to it either.
--
-- No rows are created or removed here.

create or replace view public.public_profiles as
  select
    p.id,
    p.handle,
    p.display_name,
    p.avatar_url,
    p.banner_url,
    p.roles,
    p.created_at,
    -- How much they have written, and the newest thing they wrote. Both are
    -- about published posts only: a draft is nobody's business but its
    -- author's, and a count that included one would quietly announce it.
    (
      select count(*)
        from posts po
       where po.author_id = p.id
         and po.status = 'published'
    ) as post_count,
    (
      select max(po.published_at)
        from posts po
       where po.author_id = p.id
         and po.status = 'published'
    ) as last_published_at
  from profiles p
 where exists (
   select 1
     from posts po
    where po.author_id = p.id
      and po.status = 'published'
 );

comment on view public.public_profiles is
  'The publishable part of a profile: name, photo, banner, badges, join date, and their published post count. Never the address, the birthday or the verification time. A person appears here once they have published something.';

-- Runs as its owner, not as the caller. `security_invoker = on` would run the
-- view as whoever is reading it, and an anonymous reader cannot read
-- `profiles` - so the view would return nothing to exactly the people it is
-- for. Running as the owner instead means the view can read the table, and
-- the grant above is still the only way in: `anon` has no grant on `profiles`
-- itself, so the view is a window and not a door.
alter view public.public_profiles set (security_invoker = off);

grant select on public.public_profiles to anon, authenticated;

-- The lookups the view does per row want these to exist.
create index if not exists posts_published_author_idx
  on posts (author_id, published_at desc)
  where status = 'published';
