import PageLoading from "@/components/PageLoading";

/**
 * The community's loading state.
 *
 * The page reads the session before it can answer, so navigation to it is a
 * server round-trip with nothing on screen until it lands. This holds the
 * page's shape, with the mark and a line from the project, so the wait is a
 * fill-in rather than a jump.
 */
export default function Loading() {
  return <PageLoading variant="page" lines={4} />;
}
