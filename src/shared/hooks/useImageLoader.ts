"use client";
import { useEffect, useRef,useState } from "react";

type ImageStatus = "loading" | "loaded" | "error";

export const useImageLoader = (src: string) => {
  const [status, setStatus] = useState<ImageStatus>("loading");
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!src) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    const img = new Image();
    imageRef.current = img;

    const handleLoad = () => {
      if (imageRef.current === img) {
        setStatus("loaded");
      }
    };

    const handleError = () => {
      if (imageRef.current === img) {
        setStatus("error");
      }
    };

    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = src;

    if (img.complete && img.naturalWidth !== 0) {
      handleLoad();
    }

    return () => {
      if (imageRef.current === img) {
        img.onload = null;
        img.onerror = null;
        imageRef.current = null;
      }
    };
  }, [src]);

  return {
    status,
    isLoading: status === "loading",
    isLoaded: status === "loaded",
    hasError: status === "error"
  };
};
