"use client";

import type { UserPagesDict } from "@/shared/i18n";

import { useCookingRecordDetailQuery } from "@/entities/recipe";

import { CookingRecordDetailDrawer } from "./CookingRecordDetailDrawer";
import type { MonthlyCookingRecord } from "./cookingRecordPage.lib";
import { CookingRecordReadyDetail } from "./CookingRecordReadyDetail";
import type { CookingRecordDetail } from "./cookingRecordUi.types";

type CookingRecordDetailControllerProps = {
  selectedRecord: MonthlyCookingRecord;
  copy: UserPagesDict["calendar"]["cookingRecord"];
  onClose: () => void;
};

export const CookingRecordDetailController = ({
  selectedRecord,
  copy,
  onClose,
}: CookingRecordDetailControllerProps) => {
  const detailQuery = useCookingRecordDetailQuery({
    recordId: selectedRecord.record.recordId,
    enabled: true,
  });

  if (detailQuery.data) {
    return (
      <CookingRecordReadyDetail
        key={`${detailQuery.data.recordId}:${detailQuery.data.recordMemo ?? ""}`}
        detail={detailQuery.data}
        fallback={selectedRecord.sticker}
        copy={copy}
        onClose={onClose}
      />
    );
  }

  const fallbackDetail: CookingRecordDetail = {
    ...selectedRecord.sticker,
    review: "",
  };
  const contentStatus = detailQuery.isError ? "error" : "loading";

  return (
    <CookingRecordDetailDrawer
      isOpen
      mode="view"
      detail={fallbackDetail}
      copy={copy.detail}
      contentStatus={contentStatus}
      loadingLabel={copy.detail.loading}
      errorLabel={copy.detail.error}
      retryLabel={copy.detail.retry}
      reviewDraft=""
      isReviewSaving={false}
      isPhotoReplacing={false}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      onReviewDraftChange={() => undefined}
      onStartReviewEdit={() => undefined}
      onSaveReview={() => undefined}
      onPhotoChange={() => undefined}
      onDeleteRequest={() => undefined}
      onRetry={() => void detailQuery.refetch()}
    />
  );
};
