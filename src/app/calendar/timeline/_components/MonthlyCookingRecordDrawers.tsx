"use client";

import type { UserPagesDict } from "@/shared/i18n";

import { ManualCookingRecordDrawer } from "@/features/cooking-record-create";

import { CookingRecordDetailController } from "./CookingRecordDetailController";
import type { MonthlyCookingRecord } from "./cookingRecordPage.lib";
import { CookingRecordViewSettingsDrawer } from "./CookingRecordViewSettingsDrawer";
import type { useCookingRecordBackground } from "./useCookingRecordBackground";
import type { useMonthlyCookingRecords } from "./useMonthlyCookingRecords";

type MonthlyCookingRecordDrawersProps = {
  background: ReturnType<typeof useCookingRecordBackground>;
  records: ReturnType<typeof useMonthlyCookingRecords>;
  copy: UserPagesDict["calendar"]["cookingRecord"];
  isCreateOpen: boolean;
  selectedRecord: MonthlyCookingRecord | null;
  isRecordNameVisible: boolean;
  onCreateOpenChange: (open: boolean) => void;
  onRecordNameVisibilityChange: (visible: boolean) => void;
  onCloseRecord: () => void;
};

export const MonthlyCookingRecordDrawers = ({
  background,
  records,
  copy,
  isCreateOpen,
  selectedRecord,
  isRecordNameVisible,
  onCreateOpenChange,
  onRecordNameVisibilityChange,
  onCloseRecord,
}: MonthlyCookingRecordDrawersProps) => (
  <>
    <CookingRecordViewSettingsDrawer
      isOpen={background.isOpen}
      isRecordNameVisible={isRecordNameVisible}
      backgrounds={background.backgrounds}
      previewBackground={background.previewBackground}
      selectedBackgroundKey={background.selectedBackgroundKey}
      previewRecords={records.records.slice(0, 2).map((item) => item.sticker)}
      copy={copy.viewSettingsCopy}
      isListPending={background.isListPending}
      isListError={background.isListError}
      isApplying={background.isApplying}
      onOpenChange={background.onOpenChange}
      onRecordNameVisibilityChange={onRecordNameVisibilityChange}
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
