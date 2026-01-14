"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { NO_IMAGE_URL } from "@/shared/config/constants/user";

export type ImageStatus = "idle" | "loading" | "loaded" | "error";

type UseImageWithFallbackParams = {
  src: string | string[];
  lazy: boolean;
  priority: boolean;
  inView: boolean;
};

export const useImageWithFallback = ({
  src,
  lazy,
  priority,
  inView,
}: UseImageWithFallbackParams) => {
  const srcArray = useMemo(() => (Array.isArray(src) ? src : [src]), [src]);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  const currentSrc = srcArray[fallbackIndex];
  const hasMoreFallbacks = fallbackIndex < srcArray.length - 1;
  const isNoImageUrl = currentSrc === NO_IMAGE_URL;

  const shouldLoadImmediately = priority;
  const shouldWaitForViewport = lazy && !inView;
  const effectiveSrc =
    shouldLoadImmediately || !shouldWaitForViewport ? currentSrc : undefined;

  const [status, setStatus] = useState<ImageStatus>("idle");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setFallbackIndex(0);
    setRetryCount(0);
    if (effectiveSrc) {
      setStatus("loading");
    } else {
      setStatus("idle");
    }
  }, [src, effectiveSrc]);

  useEffect(() => {
    if (isNoImageUrl) {
      setFallbackIndex(0);
    }
  }, [isNoImageUrl]);

  const handleLoad = useCallback(
    async (event: React.SyntheticEvent<HTMLImageElement>) => {
      const imageElement = event.currentTarget;
      try {
        if (typeof imageElement.decode === "function") {
          await imageElement.decode();
        }
      } catch {
      } finally {
        setStatus("loaded");
      }
    },
    []
  );

  const handleError = useCallback(() => {
    if (hasMoreFallbacks) {
      setFallbackIndex((prev) => prev + 1);
    } else if (retryCount < 3) {
      setStatus("loading");
      const RETRY_DELAY_MS = 2000;
      setTimeout(() => {
        setRetryCount((prev) => prev + 1);
      }, RETRY_DELAY_MS);
    } else {
      setStatus("error");
    }
  }, [hasMoreFallbacks, retryCount]);

  return {
    src: effectiveSrc,
    status,
    retryCount,
    onLoad: handleLoad,
    onError: handleError,
  };
};
