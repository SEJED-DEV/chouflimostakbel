import PageLoading from "@/components/PageLoading";

/**
 * A post's loading state.
 *
 * Opening a post is a database read behind a session check, so it arrives
 * after a beat. The skeleton is a narrow column, matching the article that
 * follows, so the text does not shift when it lands.
 */
export default function Loading() {
  return <PageLoading variant="article" lines={5} />;
}
