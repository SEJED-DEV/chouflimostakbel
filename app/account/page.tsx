import { redirect } from "next/navigation";

/**
 * The old account page.
 *
 * Signing in and signing up are separate pages now, and the profile is a
 * third. This redirects rather than 404ing, because the link was in the
 * navigation for a while and someone may still have it.
 */
export default function AccountPage() {
  redirect("/login");
}
