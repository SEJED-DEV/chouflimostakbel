import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminContent from "@/components/pages/AdminContent";
import { currentProfile } from "@/lib/auth";
import { isStaff, normaliseRoles } from "@/lib/roles";
import { readAdminData } from "@/lib/admin";

/**
 * The admin panel, at `/admin`.
 *
 * The guard is here, in the server, and not in the navigation. The link is a
 * courtesy - it tells staff that the panel exists and keeps it out of a
 * reader's way - but a reader who types the address gets the same answer
 * from the same check. Hiding a link is not access control, and pretending
 * otherwise is how an admin page ends up being read by everybody.
 *
 * The check reads the roles from the signed-in reader's own profile row,
 * which the `profiles_guard` trigger makes unforgeable: a reader cannot
 * write a role into their own row, whatever the client sends.
 *
 * `force-dynamic`, because the panel shows the platform as it is now and
 * there is nothing about it worth caching.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  description: "Staff view of the platform.",
  // A staff page should not be in a search engine's index.
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const profile = await currentProfile();

  if (!profile) {
    // Not signed in: the sign-in page, and then back here.
    redirect("/login");
  }

  if (!isStaff(normaliseRoles(profile.roles))) {
    // Signed in, but not staff. Their own profile is the nearest thing that
    // is actually theirs.
    redirect("/profile");
  }

  // Read only after the guard, so a reader who is turned away never causes
  // the database to be read at all.
  const { overview, people, posts } = await readAdminData();

  return <AdminContent overview={overview} people={people} posts={posts} />;
}
