"use client";

import { useState } from "react";

import type { UserPagesDict } from "@/shared/i18n";
import { format } from "@/shared/i18n";

import type { CookingRecordDetailResponse } from "@/entities/recipe";

import { CookingRecordDeleteDialog } from "./CookingRecordDeleteDialog";
import { CookingRecordDetailDrawer } from "./CookingRecordDetailDrawer";
import type {
  CookingRecordDetail,
  CookingRecordStickerItem,
} from "./cookingRecordUi.types";
import { useCookingRecordActions } from "./useCookingRecordActions";

type CookingRecordReadyDetailProps = {
  detail: CookingRecordDetailResponse;
  fallback: CookingRecordStickerItem;
  copy: UserPagesDict["calendar"]["cookingRecord"];
  onClose: () => void;
};

type DeleteSnapshot = {
  recordId: string;
  title: string;
};

export const CookingRecordReadyDetail = ({
  detail,
  fallback,
  copy,
  onClose,
}: CookingRecordReadyDetailProps) => {
  const [mode, setMode] = useState<"view" | "review-edit">("view");
  const [currentReview, setCurrentReview] = useState(detail.recordMemo ?? "");
  const [reviewDraft, setReviewDraft] = useState(detail.recordMemo ?? "");
  const [deleteSnapshot, setDeleteSnapshot] = useState<DeleteSnapshot | null>(
    null
  );
  const actions = useCookingRecordActions({
    recordId: detail.recordId,
    sourceType: detail.sourceType,
    copy: copy.toast,
    onReviewSaved: (review) => {
      setCurrentReview(review);
      setMode("view");
    },
    onDeleted: () => {
      setDeleteSnapshot(null);
      onClose();
    },
  });

  const uiDetail: CookingRecordDetail = {
    id: detail.recordId,
    title: detail.displayTitle,
    cookedAtLabel: fallback.cookedAtLabel,
    imageUrl:
      detail.originalImageUrl ?? detail.stickerImageUrl ?? fallback.imageUrl,
    imageAlt: detail.displayTitle,
    review: currentReview,
    ...(detail.recipeAvailable && detail.recipeId
      ? { recipeHref: `/recipes/${encodeURIComponent(detail.recipeId)}` }
      : null),
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
        contentStatus="ready"
        loadingLabel={copy.detail.loading}
        errorLabel={copy.detail.error}
        retryLabel={copy.detail.retry}
        reviewDraft={reviewDraft}
        isReviewSaving={actions.isReviewSaving}
        isPhotoReplacing={actions.isPhotoReplacing}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
        onReviewDraftChange={setReviewDraft}
        onStartReviewEdit={() => setMode("review-edit")}
        onSaveReview={(recordMemo) => void actions.saveReview(recordMemo)}
        onPhotoChange={(file) => void actions.changePhoto(file)}
        onDeleteRequest={() =>
          setDeleteSnapshot({
            recordId: detail.recordId,
            title: detail.displayTitle,
          })
        }
        onRetry={() => undefined}
      />

      <CookingRecordDeleteDialog
        isOpen={deleteSnapshot !== null}
        isPending={actions.isDeleting}
        copy={{
          title: copy.delete.title,
          description: format(copy.delete.description, {
            title: deleteSnapshot?.title ?? detail.displayTitle,
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
