"use client";

import { useState } from "react";

import { format, plural, useUserPagesDict } from "@/shared/i18n";
import { Container } from "@/shared/ui/Container";
import { useToastStore } from "@/shared/ui/toast";

import { useAuthGate, useUserStore } from "@/entities/user";

import { useLoginEncourageDrawerStore } from "@/features/auth/ui/LoginEncourageDrawer/model/store";

import { CookingRecordBackgroundDrawer } from "./CookingRecordBackgroundDrawer";
import { CookingRecordBoard } from "./CookingRecordBoard";
import { CookingRecordDetailController } from "./CookingRecordDetailController";
import { CookingRecordHeader } from "./CookingRecordHeader";
import type { MonthlyCookingRecord } from "./cookingRecordPage.lib";
import { CookingRecordPageStatus } from "./CookingRecordPageStatus";
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
  const records = useMonthlyCookingRecords({
    enabled: authGate,
    monthKey: month.monthKey,
    locale: month.locale,
  });
  const background = useCookingRecordBackground({
    monthKey: month.monthKey,
    onApplied: () =>
      addToast({ message: copy.toast.backgroundChanged, variant: "success" }),
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
    month.router.push("/search");
  };

  return (
    <Container padding={false} className="min-h-dvh">
      <div className="mx-auto min-h-dvh max-w-lg bg-white">
        <CookingRecordHeader
          pageTitle={copy.pageTitle}
          monthLabel={month.monthLabel}
          monthCaption={
            month.isCurrentMonth ? copy.currentMonthCaption : undefined
          }
          recordCountLabel={format(
            plural(records.records.length, copy.recordCount),
            { count: records.records.length }
          )}
          backLabel={copy.backLabel}
          previousMonthLabel={copy.previousMonthLabel}
          nextMonthLabel={copy.nextMonthLabel}
          changeBackgroundLabel={copy.changeBackground}
          onBack={month.router.back}
          onPreviousMonth={month.moveToPreviousMonth}
          onNextMonth={month.moveToNextMonth}
          onOpenBackground={background.open}
        />

        <CookingRecordBoard
          ariaLabel={format(copy.boardLabel, { month: month.monthLabel })}
          records={records.records.map((item) => item.sticker)}
          background={background.appliedBackground}
          addRecordLabel={copy.addRecord}
          getRecordLabel={(record) =>
            format(copy.recordLabel, {
              date: record.cookedAtLabel,
              title: record.title,
            })
          }
          onSelectRecord={(record) => handleSelectRecord(record.id)}
          onAddRecord={handleAddRecord}
        >
          <CookingRecordPageStatus
            isAuthReady={isAuthReady}
            authGate={authGate}
            isPending={records.isPending}
            isError={records.isError}
            isFetchingNextPage={records.isFetchingNextPage}
            shouldFetchNext={records.shouldFetchNext}
            hasRecords={records.records.length > 0}
            sentinelRef={records.sentinelRef}
            copy={copy.state}
            onRetry={() => void records.retry()}
            onLogin={() =>
              openLoginDrawer({ message: copy.state.loginDescription })
            }
          />
        </CookingRecordBoard>
      </div>

      <CookingRecordBackgroundDrawer
        isOpen={background.isOpen}
        monthLabel={month.monthLabel}
        selectedBackground={background.pendingBackground}
        previewRecords={records.records.slice(0, 2).map((item) => item.sticker)}
        copy={{
          ...copy.background,
          monthOnlyLabel: format(copy.background.monthOnlyLabel, {
            month: month.monthLabel,
          }),
        }}
        onOpenChange={background.setIsOpen}
        onSelectBackground={background.setPendingBackground}
        onCustomImageChange={background.selectCustomImage}
        onApply={background.apply}
      />

      {selectedRecord ? (
        <CookingRecordDetailController
          selectedRecord={selectedRecord}
          copy={copy}
          onClose={() => setSelectedRecord(null)}
        />
      ) : null}
    </Container>
  );
};
