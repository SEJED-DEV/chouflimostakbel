"use client";

import { useEffect } from "react";
import { isChunkLoadError, recoverFromChunkError } from "@/lib/chunk-error";

/**
 * Watches for failed dynamic imports and reloads once.
 *
 * Mounted in the root layout so it is live before any route renders. It
 * catches failures that escape React entirely - a lazy route, a dynamically
 * imported component in a client bundle - which an error boundary sitting
 * inside a route would never see.
 *
 * Renders nothing.
 */
export default function ChunkErrorRecovery() {
  useEffect(() => {
    function onError(event: ErrorEvent) {
      if (isChunkLoadError(event.error) || isChunkLoadError(event.message)) {
        recoverFromChunkError();
      }
    }

    function onRejection(event: PromiseRejectionEvent) {
      if (isChunkLoadError(event.reason)) {
        recoverFromChunkError();
      }
    }

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
