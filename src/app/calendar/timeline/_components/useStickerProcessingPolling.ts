"use client";

import { useEffect, useRef } from "react";

const STICKER_POLL_INTERVAL_MS = 2000;
const STICKER_POLL_TIMEOUT_MS = 30_000;

export const useStickerProcessingPolling = ({
  enabled,
  hasProcessingSticker,
  isFetching,
  refetch,
}: {
  enabled: boolean;
  hasProcessingSticker: boolean;
  isFetching: boolean;
  refetch: () => unknown;
}) => {
  const startedAtRef = useRef<number | null>(null);
  const isExhaustedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !hasProcessingSticker) {
      startedAtRef.current = null;
      isExhaustedRef.current = false;
      return;
    }
    if (isFetching || isExhaustedRef.current) return;

    startedAtRef.current ??= Date.now();
    const intervalId = window.setInterval(() => {
      const startedAt = startedAtRef.current;
      if (
        startedAt === null ||
        Date.now() - startedAt >= STICKER_POLL_TIMEOUT_MS
      ) {
        isExhaustedRef.current = true;
        window.clearInterval(intervalId);
        return;
      }
      void refetch();
    }, STICKER_POLL_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [enabled, hasProcessingSticker, isFetching, refetch]);
};
