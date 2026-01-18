"use client";

import { useCallback, useEffect, useState } from "react";

export type ImageStatus = "idle" | "loading" | "loaded" | "error";

type UseImageWithFallbackParams = {
  src: string;
  lazy: boolean;
  priority: boolean;
  inView: boolean;
  onRetry?: () => void;
};

const MAX_RETRY_COUNT = 2;
const RETRY_DELAY_MS = 2000;
const DECODE_TIMEOUT_MS = 100;

export const useImageWithFallback = ({
  src,
  lazy,
  priority,
  inView,
  onRetry,
}: UseImageWithFallbackParams) => {
  const [status, setStatus] = useState<ImageStatus>("idle");
  const [retryCount, setRetryCount] = useState(0);

  const shouldLoadImmediately = priority;
  const shouldWaitForViewport = lazy && !inView;
  const shouldLoad = shouldLoadImmediately || !shouldWaitForViewport;

  const effectiveSrc = shouldLoad ? src : undefined;

  useEffect(() => {
    setRetryCount(0);

    if (shouldLoad) {
      setStatus("loading");
    } else {
      setStatus("idle");
    }
  }, [src, shouldLoad]);

  const handleLoad = useCallback(
    async (event: React.SyntheticEvent<HTMLImageElement>) => {
      const imageElement = event.currentTarget;
      try {
        if (typeof imageElement.decode === "function") {
          await Promise.race([
            imageElement.decode(),
            new Promise<void>((resolve) =>
              setTimeout(resolve, DECODE_TIMEOUT_MS)
            ),
          ]);
        }
      } catch {
        // decode 실패는 무시
      } finally {
        setStatus("loaded");
      }
    },
    []
  );

  const handleError = useCallback(() => {
    if (retryCount < MAX_RETRY_COUNT) {
      onRetry?.();
      setStatus("loading");
      setTimeout(() => {
        setRetryCount((prev) => prev + 1);
      }, RETRY_DELAY_MS);
    } else {
      setStatus("error");
    }
  }, [retryCount, onRetry]);

  const imgRef = useCallback(
    (img: HTMLImageElement | null) => {
      if (img && img.complete && img.naturalWidth > 0 && status === "loading") {
        setStatus("loaded");
      }
    },
    [status]
  );

  return {
    src: effectiveSrc,
    status,
    retryCount,
    imgRef,
    onLoad: handleLoad,
    onError: handleError,
  };
};
