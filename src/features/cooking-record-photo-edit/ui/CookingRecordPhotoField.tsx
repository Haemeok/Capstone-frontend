"use client";

import { useEffect, useRef, useState } from "react";

import type { RecordPhotoCopy } from "@/shared/i18n/recordPhotoMessages";
import { triggerHaptic } from "@/shared/lib/bridge";
import { Image } from "@/shared/ui/image/Image";

import type {
  RecordPhotoCatalogState,
  RecordPhotoDraft,
  RecordPlateCategory,
} from "@/entities/recipe/model/recordPhoto.types";
import { toRecordPhotoView } from "@/entities/recipe/model/recordPhotoView";
import { CookingRecordPhoto } from "@/entities/recipe/ui/CookingRecordPhoto";
import { CookingRecordPhotoOptions } from "@/entities/recipe/ui/CookingRecordPhotoOptions";

import type { RecordStickerSession } from "../model/recordStickerPreview.types";
import { usePhotoEditorDraft } from "../model/usePhotoEditorDraft";
import { useRecordPhotoMode } from "../model/useRecordPhotoMode";
import { useRecordStickerPreview } from "../model/useRecordStickerPreview";
import { RecordPhotoEditorDialog } from "./RecordPhotoEditorDialog";
import { RecordPhotoModeSelector } from "./RecordPhotoModeSelector";
import { RecordStickerPreviewStatus } from "./RecordStickerPreviewStatus";

type Props = {
  fallbackImageUrl?: string;
  fallbackImageAlt?: string;
  requireUpload?: boolean;
  value: RecordPhotoDraft;
  catalog: RecordPhotoCatalogState;
  copy: RecordPhotoCopy;
  onChange: (value: RecordPhotoDraft) => void;
  onRetry: () => void;
  disabled?: boolean;
  error?: string;
  onBusyChange?: (busy: boolean) => void;
  stickerSession?: RecordStickerSession;
  stickerProcessingMode?: "preview" | "after-save";
};
export const CookingRecordPhotoField = ({
  value,
  catalog,
  copy,
  onChange,
  onRetry,
  disabled,
  error,
  onBusyChange,
  stickerSession,
  stickerProcessingMode = "preview",
  fallbackImageUrl,
  fallbackImageAlt,
  requireUpload = false,
}: Props) => {
  const input = useRef<HTMLInputElement>(null);
  const editButton = useRef<HTMLButtonElement>(null);
  const [category, setCategory] = useState<RecordPlateCategory | "all">("all");
  const editor = usePhotoEditorDraft(value, onChange);
  const { mode, selectMode } = useRecordPhotoMode(value, onChange);
  const needsUpload = requireUpload && !value.originalFile;
  const canCrop =
    !needsUpload && (mode === "dish" || stickerProcessingMode === "preview");
  const sticker = useRecordStickerPreview({
    photo: editor.draft ?? value,
    session: stickerSession,
    onChange: editor.draft ? editor.setDraft : onChange,
  });
  const isSaveBlocked =
    editor.isReading ||
    (stickerProcessingMode === "preview" && sticker.isBlocked);
  useEffect(() => {
    onBusyChange?.(isSaveBlocked);
    return () => onBusyChange?.(false);
  }, [isSaveBlocked, onBusyChange]);
  const plates = catalog.status === "ready" ? catalog.catalog.plates : [];
  const draft = editor.draft;
  const pickFile = () => {
    triggerHaptic("Light");
    input.current?.click();
  };
  return (
    <section className="min-w-0 space-y-3" aria-label={copy.photo}>
      <h3 className="text-sm font-semibold">{copy.photo}</h3>
      <RecordPhotoModeSelector
        mode={mode}
        onChange={selectMode}
        disabled={disabled || editor.isReading || needsUpload}
        copy={copy}
      />
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        tabIndex={-1}
        aria-label={copy.add}
        disabled={disabled || editor.isReading}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void editor.replace(file);
        }}
      />
      <div className="relative mx-auto w-44">
        {!value.originalUrl && fallbackImageUrl ? (
          <Image
            src={fallbackImageUrl}
            alt={fallbackImageAlt ?? copy.photo}
            aspectRatio={1}
            fit="contain"
          />
        ) : (
          <CookingRecordPhoto
            view={toRecordPhotoView(value, plates)}
            alt={copy.photo}
            emptyLabel=""
          />
        )}
        <div
          className={`absolute inset-x-0 flex justify-center ${value.originalUrl || fallbackImageUrl ? "bottom-0" : "inset-y-0 items-center"}`}
        >
          <button
            ref={editButton}
            type="button"
            disabled={disabled || editor.isReading}
            className="text-ink min-h-11 cursor-pointer rounded-full border border-gray-200 bg-white/95 px-4 text-sm font-medium shadow-sm disabled:opacity-50"
            onClick={() => {
              if (value.originalUrl && canCrop) {
                triggerHaptic("Light");
                editor.open();
              } else pickFile();
            }}
          >
            {value.originalUrl
              ? canCrop
                ? copy.edit
                : copy.editor.replace
              : copy.add}
          </button>
        </div>
      </div>
      {needsUpload ? (
        <p className="text-ink-muted text-center text-xs leading-5">
          {copy.uploadToStyle}
        </p>
      ) : null}
      {!draft && stickerProcessingMode === "preview" ? (
        <RecordStickerPreviewStatus
          {...sticker}
          onRetry={sticker.retry}
          copy={copy}
        />
      ) : null}
      {mode === "sticker" &&
      stickerProcessingMode === "after-save" &&
      !value.stickerUrl ? (
        <p className="text-ink-muted text-center text-xs leading-5">
          {copy.stickerAfterSave}
        </p>
      ) : null}
      {!draft && (editor.hasError || error) ? (
        <p role="alert" className="text-sm text-red-600">
          {editor.hasError ? copy.invalidFile : error}
        </p>
      ) : null}
      {mode === "dish" ? (
        <CookingRecordPhotoOptions
          value={value}
          catalog={catalog}
          copy={copy}
          category={category}
          onCategoryChange={setCategory}
          onChange={onChange}
          onRetry={onRetry}
          disabled={disabled || editor.isReading || needsUpload}
        />
      ) : null}
      <RecordPhotoEditorDialog
        draft={draft}
        editor={editor}
        sticker={sticker}
        copy={copy}
        stickerSession={stickerSession}
        stickerProcessingMode={stickerProcessingMode}
        onReplace={pickFile}
        onReturnFocus={() => editButton.current?.focus()}
      />
    </section>
  );
};
