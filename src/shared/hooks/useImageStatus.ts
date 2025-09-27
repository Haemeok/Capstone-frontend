"use client";

import { useEffect, useState } from "react";

export type ImageStatus = "idle" | "loading" | "loaded" | "error";

export const useImageStatus = (src?: string) => {
  const [status, setStatus] = useState<ImageStatus>(src ? "loading" : "idle");

  useEffect(() => {
    setStatus(src ? "loading" : "idle");
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
    }
  };

  const handleImageError = () => setStatus("error");

  return { status, handleImageLoad, handleImageError };
};
