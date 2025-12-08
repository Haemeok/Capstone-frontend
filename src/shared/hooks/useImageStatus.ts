"use client";

import { useEffect, useState } from "react";

export type ImageStatus = "idle" | "loading" | "loaded" | "error";

export const useImageStatus = (src?: string) => {
  const [status, setStatus] = useState<ImageStatus>(src ? "loading" : "idle");
  const [retryCount, setRetryCount] = useState(0);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    setStatus(src ? "loading" : "idle");
    setRetryCount(0);
    setRetrying(false);
  }, [src]);

  const handleImageLoad = async (
    event: React.SyntheticEvent<HTMLImageElement>
  ) => {
    const imageElement = event.currentTarget;
    try {
      if (typeof imageElement.decode === "function") {
        await imageElement.decode();
      }
    } catch {
    } finally {
      setStatus("loaded");
      setRetrying(false);
    }
  };

  const handleImageError = () => {
    if (retryCount < 1) {
      setRetrying(true);
      setStatus("loading");

      const delay = 1000 + Math.random() * 1000;
      setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        setRetrying(false);
      }, delay);
    } else {
      setStatus("error");
      setRetrying(false);
    }
  };

  return { status, handleImageLoad, handleImageError, retryCount, retrying };
};
