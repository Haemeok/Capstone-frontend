import { format, plural, type UserPagesDict } from "@/shared/i18n";
import { Container } from "@/shared/ui/Container";

import { CookingRecordBoard } from "./CookingRecordBoard";
import { CookingRecordHeader } from "./CookingRecordHeader";
import { CookingRecordPageStatus } from "./CookingRecordPageStatus";
import { MonthlyCookingRecordSummarySection } from "./MonthlyCookingRecordSummarySection";
import type { useCookingRecordBackground } from "./useCookingRecordBackground";
import type { useCookingRecordMonth } from "./useCookingRecordMonth";
import type { useMonthlyCookingRecords } from "./useMonthlyCookingRecords";

type MonthlyCookingRecordContentProps = {
  copy: UserPagesDict["calendar"]["cookingRecord"];
  month: ReturnType<typeof useCookingRecordMonth>;
  records: ReturnType<typeof useMonthlyCookingRecords>;
  background: ReturnType<typeof useCookingRecordBackground>;
  isAuthReady: boolean;
  authGate: boolean;
  isRecordNameVisible: boolean;
  onSelectRecord: (recordId: string) => void;
  onAddRecord: () => void;
  onShareRecord: () => void;
  onLogin: () => void;
};

export const MonthlyCookingRecordContent = ({
  copy,
  month,
  records,
  background,
  isAuthReady,
  authGate,
  isRecordNameVisible,
  onSelectRecord,
  onAddRecord,
  onShareRecord,
  onLogin,
}: MonthlyCookingRecordContentProps) => (
  <Container
    padding={false}
    className="min-h-[calc(100dvh-var(--main-pb,var(--bottom-nav-h)))]"
  >
    <div className="mx-auto flex min-h-[calc(100dvh-var(--main-pb,var(--bottom-nav-h)))] max-w-lg flex-col bg-white">
      <CookingRecordHeader
        pageTitle={copy.pageTitle}
        monthLabel={month.monthLabel}
        monthCaption={
          month.isCurrentMonth ? copy.currentMonthCaption : undefined
        }
        backLabel={copy.backLabel}
        previousMonthLabel={copy.previousMonthLabel}
        nextMonthLabel={copy.nextMonthLabel}
        settingsLabel={copy.viewSettings}
        settingsShortLabel={copy.viewSettingsShort}
        onBack={month.router.back}
        onPreviousMonth={month.moveToPreviousMonth}
        onNextMonth={month.moveToNextMonth}
        onOpenSettings={background.open}
      />

      {records.isMonthComplete &&
      (records.items.length > 0 || month.isPastMonth) ? (
        <MonthlyCookingRecordSummarySection
          summary={records.summary}
          copy={copy.summary}
          locale={month.locale}
          monthLabel={month.monthLabel}
          isCurrentMonth={month.isCurrentMonth}
        />
      ) : null}

      <CookingRecordBoard
        ariaLabel={format(copy.boardLabel, { month: month.monthLabel })}
        records={records.records.map((item) => item.sticker)}
        background={records.background}
        recordCountLabel={format(
          plural(records.items.length, copy.recordCount),
          { count: records.items.length }
        )}
        addRecordLabel={copy.addRecord}
        shareRecordLabel={format(copy.shareRecord, {
          month: month.monthLabel,
        })}
        getRecordLabel={(record) =>
          format(copy.recordLabel, {
            date: record.cookedAtLabel,
            title: record.title,
          })
        }
        onSelectRecord={(record) => onSelectRecord(record.id)}
        onAddRecord={onAddRecord}
        onShareRecord={onShareRecord}
        showRecordNames={isRecordNameVisible}
        showRecordMeta={!authGate || records.items.length > 0}
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
          onLogin={onLogin}
        />
      </CookingRecordBoard>
    </div>
  </Container>
);
