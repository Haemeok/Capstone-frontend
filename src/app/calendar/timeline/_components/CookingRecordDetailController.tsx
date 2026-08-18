"use client";

import type { UserPagesDict } from "@/shared/i18n";

import { useCookingRecordDetailQuery } from "@/entities/recipe";

import type { MonthlyCookingRecord } from "./cookingRecordPage.lib";
import { CookingRecordReadyDetail } from "./CookingRecordReadyDetail";

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

  return (
    <CookingRecordReadyDetail
      detail={detailQuery.data}
      fallback={selectedRecord.sticker}
      recordId={selectedRecord.record.recordId}
      sourceType={selectedRecord.record.sourceType}
      contentStatus={
        detailQuery.data ? "ready" : detailQuery.isError ? "error" : "loading"
      }
      copy={copy}
      onClose={onClose}
      onRetry={() => void detailQuery.refetch()}
    />
  );
};
