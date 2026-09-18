"use client";

import { useState } from "react";

import type { UserPagesDict } from "@/shared/i18n";
import { format } from "@/shared/i18n";

import type {
  CookingRecordDetailResponse,
  RecordSourceType,
} from "@/entities/recipe";
import { SavedCookingRecordPhoto } from "@/entities/recipe/ui/SavedCookingRecordPhoto";

import { ConnectedCookingRecordPhotoField } from "@/features/cooking-record-photo-edit";

import { CookingRecordDeleteDialog } from "./CookingRecordDeleteDialog";
import { CookingRecordDetailDrawer } from "./CookingRecordDetailDrawer";
import type {
  CookingRecordDetail,
  CookingRecordEditValues,
  CookingRecordStickerItem,
} from "./cookingRecordUi.types";
import { useCookingRecordActions } from "./useCookingRecordActions";
import { useCookingRecordPhotoEdit } from "./useCookingRecordPhotoEdit";

type CookingRecordReadyDetailProps = {
  detail?: CookingRecordDetailResponse;
  fallback: CookingRecordStickerItem;
  recordId: string;
  sourceType: RecordSourceType;
  contentStatus: "ready" | "loading" | "error";
  copy: UserPagesDict["calendar"]["cookingRecord"];
  onClose: () => void;
  onRetry: () => void;
};

type DeleteSnapshot = {
  recordId: string;
  title: string;
};

export const CookingRecordReadyDetail = ({
  detail,
  fallback,
  recordId,
  sourceType,
  contentStatus,
  copy,
  onClose,
  onRetry,
}: CookingRecordReadyDetailProps) => {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const photoEditor = useCookingRecordPhotoEdit(detail);
  const [savedTitle, setSavedTitle] = useState<string>();
  const [savedReview, setSavedReview] = useState<string>();
  const [deleteSnapshot, setDeleteSnapshot] = useState<DeleteSnapshot | null>(
    null
  );
  const actions = useCookingRecordActions({
    recordId,
    sourceType,
    copy: copy.toast,
    onMetadataSaved: ({ title, review }) => {
      setSavedTitle(title);
      setSavedReview(review);
      setMode("view");
    },
    onDeleted: () => {
      setDeleteSnapshot(null);
      onClose();
    },
  });
  const currentReview = savedReview ?? detail?.recordMemo ?? "";

  const uiDetail: CookingRecordDetail = {
    id: recordId,
    title: savedTitle ?? detail?.displayTitle ?? fallback.title,
    cookedAtLabel: fallback.cookedAtLabel,
    imageUrl:
      detail?.stickerImageUrl ?? detail?.originalImageUrl ?? fallback.imageUrl,
    imageAlt: detail?.displayTitle ?? fallback.imageAlt,
    review: currentReview,
    ...(detail?.recipeAvailable && detail.recipeId
      ? { recipeHref: `/recipes/${encodeURIComponent(detail.recipeId)}` }
      : null),
  };

  const startEdit = async () => {
    if (await photoEditor.start()) setMode("edit");
  };
  const saveRecord = async (values: CookingRecordEditValues) => {
    if (!(await photoEditor.save())) return false;
    return actions.saveMetadata(values);
  };

  const handleConfirmDelete = () => {
    if (!deleteSnapshot) return;
    void actions.deleteRecord(deleteSnapshot.recordId);
  };

  return (
    <>
      <CookingRecordDetailDrawer
        isOpen
        mode={mode}
        detail={uiDetail}
        copy={copy.detail}
        contentStatus={contentStatus}
        loadingLabel={copy.detail.loading}
        errorLabel={copy.detail.error}
        retryLabel={copy.detail.retry}
        isReviewSaving={
          actions.isReviewSaving ||
          photoEditor.isSaving ||
          photoEditor.isReading
        }
        isPhotoReplacing={actions.isPhotoReplacing || photoEditor.isReading}
        photoView={
          mode === "edit" ? null : detail ? (
            <div className="flex h-64 items-center justify-center bg-gray-50">
              <div className="h-52 w-52">
                <SavedCookingRecordPhoto
                  record={detail}
                  alt={uiDetail.imageAlt}
                />
              </div>
            </div>
          ) : undefined
        }
        editPhotoField={
          photoEditor.photo ? (
            <ConnectedCookingRecordPhotoField
              value={photoEditor.photo}
              requireUpload={!detail?.imageEdit?.originalKey}
              onChange={photoEditor.setPhoto}
              disabled={photoEditor.isSaving || actions.isReviewSaving}
              onBusyChange={photoEditor.setIsReading}
            />
          ) : undefined
        }
        onEditPhoto={() => void startEdit()}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
        onStartEdit={() => void startEdit()}
        onSaveRecord={(values: CookingRecordEditValues) => saveRecord(values)}
        onPhotoChange={(file) => void actions.changePhoto(file)}
        onDeleteRequest={() =>
          setDeleteSnapshot({
            recordId,
            title: uiDetail.title,
          })
        }
        onRetry={onRetry}
      />

      <CookingRecordDeleteDialog
        isOpen={deleteSnapshot !== null}
        isPending={actions.isDeleting}
        copy={{
          title: copy.delete.title,
          description: format(copy.delete.description, {
            title: deleteSnapshot?.title ?? uiDetail.title,
          }),
          cancel: copy.delete.cancel,
          confirm: copy.delete.confirm,
        }}
        onOpenChange={(open) => {
          if (!open && !actions.isDeleting) setDeleteSnapshot(null);
        }}
        onCancel={() => setDeleteSnapshot(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
