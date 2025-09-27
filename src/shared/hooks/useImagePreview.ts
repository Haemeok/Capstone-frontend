import { useEffect, useState } from "react";

export const useImagePreview = (value: File | string | null | undefined) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let created: string | null = null;
    if (value instanceof File) {
      created = URL.createObjectURL(value);
      setUrl(created);
    } else {
      setUrl(typeof value === "string" ? value : null);
    }
    return () => {
      if (created) URL.revokeObjectURL(created);
    };
  }, [value]);

  return url;
};
