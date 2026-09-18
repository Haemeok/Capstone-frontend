"use client";

import { useEffect, useRef, useState } from "react";

import type { RecordPhotoDraft } from "@/entities/recipe/model/recordPhoto.types";

import { readPhotoFile } from "./readPhotoFile";

export const usePhotoEditorDraft = (
  value: RecordPhotoDraft,
  onChange: (value: RecordPhotoDraft) => void
) => {
  const [draft, setDraft] = useState<RecordPhotoDraft | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const version = useRef(0);
  useEffect(
    () => () => {
      version.current += 1;
    },
    []
  );
  const cancel = () => {
    version.current += 1;
    setIsReading(false);
    setHasError(false);
    setDraft(null);
  };
  const open = () => {
    setHasError(false);
    setDraft(value);
  };
  const complete = () => {
    if (draft && !isReading) {
      onChange(draft);
      cancel();
    }
  };
  const replace = async (file: File) => {
    const revision = ++version.current;
    setIsReading(true);
    setHasError(false);
    try {
      const result = await readPhotoFile(file);
      if (revision !== version.current) return;
      const next = {
        ...(draft ?? value),
        originalFile: file,
        originalUrl: result.url,
        stickerUrl: null,
        stickerImageSize: undefined,
        preparedImage: undefined,
        imageSize: result.size,
        crop: { centerX: 0.5, centerY: 0.5, zoom: 1 },
      };
      if (draft) setDraft(next);
      else onChange(next);
    } catch {
      if (revision === version.current) setHasError(true);
    } finally {
      if (revision === version.current) setIsReading(false);
    }
  };
  return {
    draft,
    setDraft,
    isReading,
    hasError,
    open,
    cancel,
    complete,
    replace,
  };
};
