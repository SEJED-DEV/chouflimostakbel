import PageLoading from "@/components/PageLoading";

/**
 * The admin panel's loading state.
 *
 * The panel reads the whole platform through the service role, so it is the
 * slowest page here. It is deliberately not shaped like the content - a
 * skeleton of other people's rows would be a strange thing to draw - so it
 * keeps the site mark and a line, and the panel arrives whole.
 */
export default function Loading() {
  return <PageLoading variant="page" lines={3} />;
}
