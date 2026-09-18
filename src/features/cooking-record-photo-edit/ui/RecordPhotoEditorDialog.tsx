"use client";

import type { RecordPhotoCopy } from "@/shared/i18n/recordPhotoMessages";
import { ImageCropEditor } from "@/shared/ui/image-crop-editor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/shadcn/dialog";

import {
  RECORD_MASK_PATHS,
  STICKER_MASK_PATH,
} from "@/entities/recipe/model/recordMaskShapes";
import type { RecordPhotoDraft } from "@/entities/recipe/model/recordPhoto.types";

import type { RecordStickerSession } from "../model/recordStickerPreview.types";
import type { usePhotoEditorDraft } from "../model/usePhotoEditorDraft";
import type { useRecordStickerPreview } from "../model/useRecordStickerPreview";
import { RecordStickerPreviewStatus } from "./RecordStickerPreviewStatus";

type PhotoEditorController = Pick<
  ReturnType<typeof usePhotoEditorDraft>,
  "cancel" | "complete" | "hasError" | "isReading" | "setDraft"
>;

type StickerPreviewController = Pick<
  ReturnType<typeof useRecordStickerPreview>,
  "hasError" | "isBlocked" | "isPending" | "isUnavailable" | "retry"
>;

type RecordPhotoEditorDialogProps = {
  draft: RecordPhotoDraft | null;
  editor: PhotoEditorController;
  sticker: StickerPreviewController;
  copy: RecordPhotoCopy;
  stickerSession?: RecordStickerSession;
  stickerProcessingMode: "preview" | "after-save";
  onReplace: () => void;
  onReturnFocus: () => void;
};

export const RecordPhotoEditorDialog = ({
  draft,
  editor,
  sticker,
  copy,
  stickerSession,
  stickerProcessingMode,
  onReplace,
  onReturnFocus,
}: RecordPhotoEditorDialogProps) => (
  <Dialog
    open={draft !== null}
    onOpenChange={(open) => {
      if (!open) editor.cancel();
    }}
  >
    <DialogContent
      showCloseButton={false}
      onCloseAutoFocus={(event) => {
        event.preventDefault();
        onReturnFocus();
      }}
      className="flex h-[min(760px,100dvh)] max-h-dvh max-w-full flex-col overflow-hidden rounded-none border-0 p-0 sm:max-w-md sm:rounded-2xl"
    >
      <DialogTitle className="sr-only">{copy.editor.title}</DialogTitle>
      <DialogDescription className="sr-only">
        {copy.editor.hint}
      </DialogDescription>
      {draft?.originalUrl ? (
        <ImageCropEditor
          src={
            (draft.shape.kind === "sticker" ? draft.stickerUrl : null) ??
            draft.originalUrl
          }
          imageSize={
            draft.shape.kind === "sticker"
              ? (draft.stickerImageSize ?? draft.imageSize)
              : draft.imageSize
          }
          crop={draft.crop}
          maskPath={
            draft.shape.kind === "mask"
              ? RECORD_MASK_PATHS[draft.shape.value]
              : STICKER_MASK_PATH
          }
          onChange={(crop) => editor.setDraft({ ...draft, crop })}
          onComplete={editor.complete}
          onCancel={editor.cancel}
          onReplace={onReplace}
          copy={copy.editor}
          isDisabled={editor.isReading}
          isCompleteDisabled={!!stickerSession && sticker.isBlocked}
        />
      ) : null}
      {stickerProcessingMode === "preview" ? (
        <RecordStickerPreviewStatus
          {...sticker}
          onRetry={sticker.retry}
          copy={copy}
        />
      ) : null}
      {editor.hasError ? (
        <p role="alert" className="px-5 pb-4 text-sm text-red-600">
          {copy.invalidFile}
        </p>
      ) : null}
    </DialogContent>
  </Dialog>
);
