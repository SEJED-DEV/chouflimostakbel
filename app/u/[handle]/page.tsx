import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PersonContent from "@/components/pages/PersonContent";
import { getPublicProfile, listPublishedByAuthor } from "@/lib/people";

/**
 * A person's public page, at `/u/handle`.
 *
 * WHY NOT `@handle`
 *
 * The nicer URL was tried first and does not exist in this framework. A
 * directory whose name begins with `@` is a parallel route slot, not a page:
 * `app/@handle/` and `app/[@handle]/` were both built and neither produced a
 * route at all - the built route table simply omitted them. `@` is spoken for
 * by the router before a path ever gets a say, so `/@name` cannot be served
 * from the App Router at all.
 *
 * A redirect from `/@name` to here was considered and not built. It would
 * need middleware, which runs on every request for the whole site, to serve
 * an address that nothing links to: every link this site emits points here.
 * The only way to reach `/@name` would be to type it, and typing it is not
 * worth a permanent cost paid by every other request.
 *
 * WHY THIS IS NOT A CATCH-ALL
 *
 * It sits under a literal `u`, so it matches one segment after `/u/` and
 * nothing else. Every other unknown address still reaches the 404, and a
 * request for a page that happens to look like a name is not quietly turned
 * into a profile lookup.
 *
 * Only people who have published something have a page - the view this reads
 * contains nobody else - so a handle that has never posted 404s here. That is
 * consistent rather than unfortunate: no byline links to such a person, so
 * the address is only ever typed by hand, and a 404 is the honest answer.
 *
 * Not `force-dynamic`: nothing here depends on the session, so the page is
 * cached and revalidated rather than rebuilt per reader.
 */
export const revalidate = 300;

type Params = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  const person = await getPublicProfile(decodeURIComponent(handle));

  if (!person) {
    return { title: "Profile", robots: { index: false, follow: false } };
  }

  const url = `/u/${person.handle}`;
  return {
    title: person.name,
    description: `${person.name} (@${person.handle}) on Choufli Mosta9bel.`,
    alternates: { canonical: url },
    openGraph: { url, type: "profile", title: person.name },
  };
}

export default async function PersonPage({ params }: Params) {
  const { handle } = await params;
  const person = await getPublicProfile(decodeURIComponent(handle));

  if (!person) notFound();

  const posts = await listPublishedByAuthor(person.id);

  return <PersonContent person={person} posts={posts} now={new Date().toISOString()} />;
}
