"use client";

import { ArrowLeft } from "lucide-react";

import { useUserPagesDict } from "@/shared/i18n";
import { Container } from "@/shared/ui/Container";

import { useAuthGate, useUserStore } from "@/entities/user";

import { useLoginEncourageDrawerStore } from "@/features/auth/ui/LoginEncourageDrawer/model/store";

import { useCookingRecordMonth } from "../../_components/useCookingRecordMonth";
import { MonthlyCookingRecordShareData } from "./MonthlyCookingRecordShareData";
import { MonthlyCookingRecordShareStatus } from "./MonthlyCookingRecordShareStatus";
import { useMonthlyCookingRecordShareRecords } from "./useMonthlyCookingRecordShareRecords";

export const MonthlyCookingRecordSharePageClient = () => {
  const copy = useUserPagesDict().calendar.cookingRecord;
  const shareCopy = copy.share;
  const authGate = useAuthGate();
  const isAuthReady = useUserStore((state) => state.isAuthReady);
  const openLoginDrawer = useLoginEncourageDrawerStore(
    (state) => state.openDrawer
  );
  const month = useCookingRecordMonth();
  const records = useMonthlyCookingRecordShareRecords({
    enabled: authGate,
    monthKey: month.monthKey,
    locale: month.locale,
  });

  return (
    <Container padding={false} className="min-h-dvh">
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col bg-white">
        <header className="grid h-15 shrink-0 grid-cols-[44px_1fr_44px] items-center px-2">
          <button
            type="button"
            aria-label={shareCopy.backLabel}
            onClick={month.router.back}
            className="text-ink focus-visible:outline-olive-dark flex h-11 w-11 items-center justify-center rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <ArrowLeft aria-hidden="true" className="size-5" />
          </button>
          <h1 className="text-ink truncate text-center text-lg font-bold tracking-[-0.02em]">
            {shareCopy.pageTitle}
          </h1>
          <span aria-hidden="true" />
        </header>
        {!isAuthReady ? (
          <MonthlyCookingRecordShareStatus
            description={shareCopy.state.loading}
          />
        ) : !authGate ? (
          <MonthlyCookingRecordShareStatus
            title={shareCopy.state.loginTitle}
            description={shareCopy.state.loginDescription}
            actionLabel={shareCopy.state.loginAction}
            onAction={() =>
              openLoginDrawer({
                message: shareCopy.state.loginDescription,
              })
            }
          />
        ) : (
          <MonthlyCookingRecordShareData
            monthKey={month.monthKey}
            monthLabel={month.monthLabel}
            copy={copy}
            records={records}
          />
        )}
      </div>
    </Container>
  );
};
