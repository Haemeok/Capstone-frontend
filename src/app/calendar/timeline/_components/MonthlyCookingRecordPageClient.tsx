"use client";

import { useState } from "react";

import { useUserPagesDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { useToastStore } from "@/shared/ui/toast";

import { useAuthGate, useUserStore } from "@/entities/user";

import { useLoginEncourageDrawerStore } from "@/features/auth/ui/LoginEncourageDrawer/model/store";

import type { MonthlyCookingRecord } from "./cookingRecordPage.lib";
import { MonthlyCookingRecordContent } from "./MonthlyCookingRecordContent";
import { MonthlyCookingRecordDrawers } from "./MonthlyCookingRecordDrawers";
import { useCookingRecordBackground } from "./useCookingRecordBackground";
import { useCookingRecordMonth } from "./useCookingRecordMonth";
import { useMonthlyCookingRecords } from "./useMonthlyCookingRecords";

export const MonthlyCookingRecordPageClient = () => {
  const copy = useUserPagesDict().calendar.cookingRecord;
  const authGate = useAuthGate();
  const isAuthReady = useUserStore((state) => state.isAuthReady);
  const openLoginDrawer = useLoginEncourageDrawerStore(
    (state) => state.openDrawer
  );
  const addToast = useToastStore((state) => state.addToast);
  const month = useCookingRecordMonth();
  const [selectedRecord, setSelectedRecord] =
    useState<MonthlyCookingRecord | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isRecordNameVisible, setIsRecordNameVisible] = useState(true);
  const records = useMonthlyCookingRecords({
    enabled: authGate,
    monthKey: month.monthKey,
    locale: month.locale,
  });
  const background = useCookingRecordBackground({
    enabled: authGate,
    currentBackground: records.background,
    onApplied: () =>
      addToast({ message: copy.toast.backgroundChanged, variant: "success" }),
    onError: () =>
      addToast({
        message: copy.toast.backgroundChangeFailed,
        variant: "error",
      }),
    onCustomAdded: () =>
      addToast({
        message: copy.toast.customBackgroundAdded,
        variant: "success",
      }),
    onCustomDeleted: () =>
      addToast({
        message: copy.toast.customBackgroundDeleted,
        variant: "success",
      }),
    onCustomDeleteError: () =>
      addToast({
        message: copy.toast.customBackgroundDeleteFailed,
        variant: "error",
      }),
  });

  const handleSelectRecord = (recordId: string) => {
    const record = records.records.find(
      (item) => item.record.recordId === recordId
    );
    if (record) setSelectedRecord(record);
  };

  const handleAddRecord = () => {
    if (!authGate) {
      openLoginDrawer({ message: copy.state.loginDescription });
      return;
    }
    triggerHaptic("Light");
    setIsCreateOpen(true);
  };

  const handleShareRecord = () => {
    if (!authGate) {
      openLoginDrawer({ message: copy.state.loginDescription });
      return;
    }
    month.router.push(`/calendar/timeline/share?month=${month.monthKey}`);
  };

  const handleRecordNameVisibilityChange = (visible: boolean) => {
    setIsRecordNameVisible(visible);
  };

  return (
    <>
      <MonthlyCookingRecordContent
        copy={copy}
        month={month}
        records={records}
        background={background}
        isAuthReady={isAuthReady}
        authGate={authGate}
        isRecordNameVisible={isRecordNameVisible}
        onSelectRecord={handleSelectRecord}
        onAddRecord={handleAddRecord}
        onShareRecord={handleShareRecord}
        onLogin={() =>
          openLoginDrawer({ message: copy.state.loginDescription })
        }
      />

      <MonthlyCookingRecordDrawers
        background={background}
        records={records}
        copy={copy}
        isCreateOpen={isCreateOpen}
        selectedRecord={selectedRecord}
        isRecordNameVisible={isRecordNameVisible}
        onCreateOpenChange={setIsCreateOpen}
        onRecordNameVisibilityChange={handleRecordNameVisibilityChange}
        onCloseRecord={() => setSelectedRecord(null)}
      />
    </>
  );
};
