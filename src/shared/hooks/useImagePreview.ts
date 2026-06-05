import { useEffect, useMemo } from "react";

export const useImagePreview = (value: File | string | null | undefined) => {
  const url = useMemo(() => {
    if (value instanceof File) return URL.createObjectURL(value);
    return typeof value === "string" ? value : null;
  }, [value]);

  useEffect(() => {
    if (value instanceof File && url) {
      return () => URL.revokeObjectURL(url);
    }
  }, [value, url]);

  return url;
};
