"use client";

import { useRef } from "react";

import type { RecordPhotoDraft } from "@/entities/recipe/model/recordPhoto.types";

type Mode = "dish" | "sticker";
type SavedStyle = Pick<
  RecordPhotoDraft,
  "shape" | "plateId" | "crop" | "originalUrl"
>;

export const useRecordPhotoMode = (
  value: RecordPhotoDraft,
  onChange: (photo: RecordPhotoDraft) => void
) => {
  const styles = useRef<Partial<Record<Mode, SavedStyle>>>({});
  const mode: Mode = value.shape.kind === "sticker" ? "sticker" : "dish";
  const selectMode = (nextMode: Mode) => {
    if (mode === nextMode) return;
    styles.current[mode] = {
      shape: value.shape,
      plateId: value.plateId,
      crop: value.crop,
      originalUrl: value.originalUrl,
    };
    const saved = styles.current[nextMode];
    onChange({
      ...value,
      shape:
        nextMode === "sticker"
          ? { kind: "sticker" }
          : (saved?.shape ?? { kind: "mask", value: "CIRCLE" }),
      plateId: nextMode === "sticker" ? null : (saved?.plateId ?? null),
      crop:
        saved?.originalUrl === value.originalUrl
          ? saved.crop
          : { centerX: 0.5, centerY: 0.5, zoom: 1 },
    });
  };
  return { mode, selectMode };
};
