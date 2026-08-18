"use client";

import { ArrowLeft, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";

export type CookingRecordHeaderProps = {
  pageTitle: string;
  monthLabel: string;
  monthCaption?: string;
  backLabel: string;
  previousMonthLabel: string;
  nextMonthLabel: string;
  changeBackgroundLabel: string;
  changeBackgroundShortLabel: string;
  isPreviousMonthDisabled?: boolean;
  isNextMonthDisabled?: boolean;
  onBack: () => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onOpenBackground: () => void;
};

export const CookingRecordHeader = (props: CookingRecordHeaderProps) => {
  const {
    pageTitle,
    monthLabel,
    monthCaption,
    backLabel,
    previousMonthLabel,
    nextMonthLabel,
    changeBackgroundLabel,
    changeBackgroundShortLabel,
    isPreviousMonthDisabled = false,
    isNextMonthDisabled = false,
    onBack,
    onPreviousMonth,
    onNextMonth,
    onOpenBackground,
  } = props;

  const handlePreviousMonth = () => {
    triggerHaptic("Light");
    onPreviousMonth();
  };

  const handleNextMonth = () => {
    triggerHaptic("Light");
    onNextMonth();
  };

  const handleOpenBackground = () => {
    triggerHaptic("Light");
    onOpenBackground();
  };

  return (
    <header className="sticky top-0 z-20 bg-white">
      <div className="grid h-15 grid-cols-[44px_1fr_44px] items-center px-2">
        <button
          type="button"
          aria-label={backLabel}
          onClick={onBack}
          className="text-ink focus-visible:outline-olive-dark flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
        </button>
        <h1 className="text-ink truncate text-center text-xl font-bold tracking-[-0.02em]">
          {pageTitle}
        </h1>
        <span aria-hidden="true" />
      </div>

      <nav
        aria-label={`${monthLabel} ${previousMonthLabel} ${nextMonthLabel}`}
        className="grid h-11 grid-cols-[64px_minmax(0,1fr)_64px] items-center"
      >
        <span aria-hidden="true" />
        <div className="col-start-2 row-start-1 grid grid-cols-[44px_auto_44px] items-center gap-0.5 justify-self-center">
          <button
            type="button"
            aria-label={previousMonthLabel}
            disabled={isPreviousMonthDisabled}
            onClick={handlePreviousMonth}
            className="text-ink focus-visible:outline-olive-dark disabled:text-ink-disabled flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed"
          >
            <ChevronLeft aria-hidden="true" className="size-[18px]" />
          </button>
          <div className="flex min-w-28 items-baseline justify-center gap-1.5 px-1 max-[359px]:min-w-24">
            <h2 className="text-ink text-sm font-bold">{monthLabel}</h2>
            {monthCaption ? (
              <span className="text-ink-muted text-[11px] max-[359px]:hidden">
                {monthCaption}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            aria-label={nextMonthLabel}
            disabled={isNextMonthDisabled}
            onClick={handleNextMonth}
            className="text-ink focus-visible:outline-olive-dark disabled:text-ink-disabled flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed"
          >
            <ChevronRight aria-hidden="true" className="size-[18px]" />
          </button>
        </div>
        <button
          type="button"
          aria-label={changeBackgroundLabel}
          onClick={handleOpenBackground}
          className="text-ink-sub focus-visible:outline-olive-dark col-start-3 row-start-1 flex min-h-11 min-w-15 cursor-pointer items-center justify-center gap-1 rounded-xl px-1 text-xs font-bold transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 max-[359px]:min-w-11"
        >
          <ImageIcon aria-hidden="true" className="size-4" />
          <span className="max-[359px]:sr-only">
            {changeBackgroundShortLabel}
          </span>
        </button>
      </nav>
    </header>
  );
};
