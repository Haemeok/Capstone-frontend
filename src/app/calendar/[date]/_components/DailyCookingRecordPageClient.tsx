"use client";

import { useUserPagesDict, useUserPagesLocale } from "@/shared/i18n";
import { Container } from "@/shared/ui/Container";

import { useCookingRecordCalendarDateQuery } from "@/entities/recipe";
import { useAuthGate, useUserStore } from "@/entities/user";

import { useLoginEncourageDrawerStore } from "@/features/auth/ui/LoginEncourageDrawer/model/store";

import { formatDailyCookingRecordDate } from "../lib/formatDailyCookingRecordDate";
import { DailyCookingRecordHeader } from "./DailyCookingRecordHeader";
import { DailyCookingRecordList } from "./DailyCookingRecordList";
import { DailyCookingRecordStatus } from "./DailyCookingRecordStatus";
import { DailyCookingRecordSummary } from "./DailyCookingRecordSummary";

type DailyCookingRecordPageClientProps = {
  date: string;
};

export const DailyCookingRecordPageClient = ({
  date,
}: DailyCookingRecordPageClientProps) => {
  const calendarCopy = useUserPagesDict().calendar;
  const copy = calendarCopy.dailyRecord;
  const locale = useUserPagesLocale();
  const authGate = useAuthGate();
  const isAuthReady = useUserStore((state) => state.isAuthReady);
  const openLoginDrawer = useLoginEncourageDrawerStore(
    (state) => state.openDrawer
  );
  const dateQuery = useCookingRecordCalendarDateQuery({
    date,
    enabled: authGate,
  });
  const records = dateQuery.data ?? [];
  const showRecords =
    isAuthReady &&
    authGate &&
    !dateQuery.isPending &&
    !dateQuery.isError &&
    records.length > 0;

  return (
    <Container
      padding={false}
      className="min-h-[calc(100dvh-var(--main-pb,var(--bottom-nav-h)))]"
    >
      <div className="mx-auto min-h-[calc(100dvh-var(--main-pb,var(--bottom-nav-h)))] max-w-lg bg-white">
        <DailyCookingRecordHeader title={copy.pageTitle} />
        <div className="z-sticky sticky-optimized sticky top-0 flex h-12 items-center bg-white px-[18px] before:pointer-events-none before:absolute before:inset-x-0 before:-top-px before:h-px before:bg-white before:content-['']">
          <h2 className="text-ink text-2xl font-bold">
            {formatDailyCookingRecordDate(date, locale)}
          </h2>
        </div>

        <DailyCookingRecordStatus
          isAuthReady={isAuthReady}
          authGate={authGate}
          isPending={dateQuery.isPending}
          isError={dateQuery.isError}
          hasRecords={records.length > 0}
          copy={copy.state}
          onRetry={() => void dateQuery.refetch()}
          onLogin={() =>
            openLoginDrawer({ message: copy.state.loginDescription })
          }
        />

        {showRecords ? (
          <>
            <DailyCookingRecordSummary
              records={records}
              locale={locale}
              copy={copy.summary}
              sodiumStatusCopy={calendarCopy.sodiumStatus}
            />
            <DailyCookingRecordList
              records={records}
              detailEnabled={authGate}
              copy={copy.list}
            />
          </>
        ) : null}
      </div>
    </Container>
  );
};
