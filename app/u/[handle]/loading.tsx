import PageLoading from "@/components/PageLoading";

/**
 * A person's loading state.
 *
 * The profile is read from the database and revalidated, so a first visit
 * waits for it. The skeleton holds the page's shape meanwhile.
 */
export default function Loading() {
  return <PageLoading variant="page" lines={4} />;
}
