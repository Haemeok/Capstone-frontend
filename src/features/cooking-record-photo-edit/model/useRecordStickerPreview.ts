"use client";

import { useEffect, useRef, useState } from "react";

import type { RecordPhotoDraft } from "@/entities/recipe/model/recordPhoto.types";

import type { RecordStickerSession } from "./recordStickerPreview.types";

type Props = {
  photo: RecordPhotoDraft;
  session?: RecordStickerSession;
  onChange: (photo: RecordPhotoDraft) => void;
};

export const useRecordStickerPreview = ({
  photo,
  session,
  onChange,
}: Props) => {
  const [failure, setFailure] = useState<File | null>(null);
  const [attempt, setAttempt] = useState(0);
  const latest = useRef({ photo, onChange });
  useEffect(() => {
    latest.current = { photo, onChange };
  }, [photo, onChange]);

  const file = photo.originalFile;
  const needsSticker =
    photo.shape.kind === "sticker" && !!photo.originalUrl && !photo.stickerUrl;
  const hasError = needsSticker && file !== null && failure === file;
  const isUnavailable = needsSticker && (!session || !file);
  const isPending = needsSticker && !isUnavailable && !hasError;

  useEffect(() => {
    if (!needsSticker || !session || !file) return;
    let isCurrent = true;
    void session
      .prepare(file)
      .then((result) => {
        const current = latest.current;
        if (!isCurrent || current.photo.originalFile !== file) return;
        current.onChange({
          ...current.photo,
          stickerUrl: result.imageUrl,
          stickerImageSize: result.imageSize,
          preparedImage: {
            originalKey: result.originalKey,
            stickerKey: result.stickerKey,
          },
        });
      })
      .catch(() => {
        if (isCurrent) setFailure(file);
      });
    return () => {
      isCurrent = false;
    };
  }, [file, needsSticker, session, attempt]);

  return {
    isPending,
    hasError,
    isUnavailable,
    isBlocked: needsSticker,
    retry: () => {
      setFailure(null);
      setAttempt((value) => value + 1);
    },
  };
};
