import { useEffect, useState } from "react";

import type { ImageSize } from "@/shared/lib/image-crop";

import type { RecordPhotoDraft } from "@/entities/recipe/model/recordPhoto.types";

import { readPhotoDimensions } from "./readPhotoFile";

export const usePhotoSourceDimensions = (photo: RecordPhotoDraft) => {
  const source =
    photo.imageSize.width === 1 && photo.imageSize.height === 1
      ? photo.originalUrl
      : null;
  const [loaded, setLoaded] = useState<{
    source: string;
    size: ImageSize | null;
  } | null>(null);

  useEffect(() => {
    if (!source) return;
    let active = true;
    readPhotoDimensions(source).then(
      (size) => {
        if (active) setLoaded({ source, size });
      },
      () => {
        if (active) setLoaded({ source, size: null });
      }
    );
    return () => {
      active = false;
    };
  }, [source]);

  const result = loaded?.source === source ? loaded : null;
  return {
    photo: result?.size ? { ...photo, imageSize: result.size } : photo,
    isLoading: !!source && !result,
    hasError: !!result && !result.size,
  };
};
