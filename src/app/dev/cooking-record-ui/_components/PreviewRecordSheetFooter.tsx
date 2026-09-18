"use client";

import type { UserPagesDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";

import type { RecordPhotoDraft } from "@/entities/recipe/model/recordPhoto.types";

import type { PreviewSheetMode } from "./PreviewRecordSheet";

type PreviewRecordSheetFooterProps = {
  mode: PreviewSheetMode;
  copy: UserPagesDict["calendar"]["cookingRecord"];
  recordPhoto: RecordPhotoDraft;
  isPhotoPending: boolean;
  onPhoto: (photo: RecordPhotoDraft) => void;
  onMode: (mode: PreviewSheetMode) => void;
};

export const PreviewRecordSheetFooter = ({
  mode,
  copy,
  recordPhoto,
  isPhotoPending,
  onPhoto,
  onMode,
}: PreviewRecordSheetFooterProps) => {
  if (mode === "recipe") return null;

  return (
    <footer className="shrink-0 border-t border-gray-100 px-5 pt-3 pb-[max(16px,env(safe-area-inset-bottom))]">
      <button
        key={mode}
        type={mode === "create" || mode === "edit" ? "submit" : "button"}
        form={
          mode === "create"
            ? "preview-create"
            : mode === "edit"
              ? "preview-edit"
              : undefined
        }
        disabled={isPhotoPending}
        className="bg-olive-light disabled:text-ink-disabled min-h-12 w-full cursor-pointer rounded-xl px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-100"
        onClick={() => {
          if (mode === "view") {
            triggerHaptic("Light");
            onPhoto(recordPhoto);
            onMode("edit");
          } else if (mode === "success") {
            onMode(null);
          }
        }}
      >
        {mode === "create"
          ? copy.create.submit
          : mode === "edit"
            ? copy.detail.saveRecord
            : mode === "view"
              ? copy.detail.editRecord
              : copy.create.successClose}
      </button>
    </footer>
  );
};
