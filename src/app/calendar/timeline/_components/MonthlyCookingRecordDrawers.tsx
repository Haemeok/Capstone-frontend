"use client";

import type { UserPagesDict } from "@/shared/i18n";

import { ManualCookingRecordDrawer } from "@/features/cooking-record-create";

import { CookingRecordBackgroundDrawer } from "./CookingRecordBackgroundDrawer";
import { CookingRecordDetailController } from "./CookingRecordDetailController";
import type { MonthlyCookingRecord } from "./cookingRecordPage.lib";
import type { useCookingRecordBackground } from "./useCookingRecordBackground";
import type { useMonthlyCookingRecords } from "./useMonthlyCookingRecords";

type MonthlyCookingRecordDrawersProps = {
  background: ReturnType<typeof useCookingRecordBackground>;
  records: ReturnType<typeof useMonthlyCookingRecords>;
  copy: UserPagesDict["calendar"]["cookingRecord"];
  isCreateOpen: boolean;
  selectedRecord: MonthlyCookingRecord | null;
  onCreateOpenChange: (open: boolean) => void;
  onCloseRecord: () => void;
};

export const MonthlyCookingRecordDrawers = ({
  background,
  records,
  copy,
  isCreateOpen,
  selectedRecord,
  onCreateOpenChange,
  onCloseRecord,
}: MonthlyCookingRecordDrawersProps) => (
  <>
    <CookingRecordBackgroundDrawer
      isOpen={background.isOpen}
      backgrounds={background.backgrounds}
      previewBackground={background.previewBackground}
      selectedBackgroundKey={background.selectedBackgroundKey}
      previewRecords={records.records.slice(0, 2).map((item) => item.sticker)}
      copy={copy.background}
      isListPending={background.isListPending}
      isListError={background.isListError}
      isApplying={background.isApplying}
      onOpenChange={background.onOpenChange}
      onSelectBackground={background.selectBackground}
      onRetry={() => void background.retryList()}
      onApply={() => void background.apply()}
    />

    <ManualCookingRecordDrawer
      isOpen={isCreateOpen}
      copy={copy.create}
      onOpenChange={onCreateOpenChange}
    />

    {selectedRecord ? (
      <CookingRecordDetailController
        selectedRecord={selectedRecord}
        copy={copy}
        onClose={onCloseRecord}
      />
    ) : null}
  </>
);
