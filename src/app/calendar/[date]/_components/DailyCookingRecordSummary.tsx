"use client";

import { useState } from "react";

import { ChevronDown } from "lucide-react";

import type { Locale, UserPagesDict } from "@/shared/i18n";
import { format } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

import type { CookingRecordCalendarDateItem } from "@/entities/recipe";

import { buildDailyCookingSummary } from "../lib/buildDailyCookingSummary";
import { DailyCookingRecordSummaryDetails } from "./DailyCookingRecordSummaryDetails";

type DailyCookingRecordSummaryProps = {
  records: CookingRecordCalendarDateItem[];
  locale: Locale;
  copy: UserPagesDict["calendar"]["dailyRecord"]["summary"];
  sodiumStatusCopy: UserPagesDict["calendar"]["sodiumStatus"];
};

const localeTag: Record<Locale, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
};

const formatValue = (value: number | null, locale: Locale) =>
  value === null ? "—" : value.toLocaleString(localeTag[locale]);

export const DailyCookingRecordSummary = ({
  records,
  locale,
  copy,
  sodiumStatusCopy,
}: DailyCookingRecordSummaryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const summary = buildDailyCookingSummary(records);
  const caloriePercentage =
    summary.calories.value === null
      ? null
      : Math.round((summary.calories.value / 2000) * 100);

  const toggleExpanded = () => {
    triggerHaptic("Light");
    setIsExpanded((current) => !current);
  };

  return (
    <section
      aria-label={copy.title}
      className="mx-[18px] border-b border-gray-200 pt-[18px] pb-[26px]"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-ink text-lg font-bold">{copy.title}</h2>
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={toggleExpanded}
          className="text-ink-sub focus-visible:ring-olive-light flex min-h-11 cursor-pointer items-center gap-1 rounded-md px-1 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {isExpanded ? copy.collapse : copy.expand}
          <ChevronDown
            aria-hidden="true"
            size={17}
            className={cn("transition-transform", isExpanded && "rotate-180")}
          />
        </button>
      </div>

      <div
        className={cn(
          "mt-4 grid gap-5",
          locale === "ko" ? "grid-cols-[1.15fr_1fr]" : "grid-cols-1"
        )}
      >
        <div>
          <p className="text-ink-muted text-xs">{copy.totalCalories}</p>
          <p className="text-ink mt-1 flex items-baseline gap-1">
            <strong className="text-2xl font-bold">
              {formatValue(summary.calories.value, locale)}
            </strong>
            {summary.calories.value === null ? null : (
              <span className="text-ink-muted text-sm">kcal</span>
            )}
          </p>
          {caloriePercentage === null ? null : (
            <p className="text-ink-muted mt-1 text-xs">
              {format(copy.recommendedRatio, {
                percentage: caloriePercentage,
              })}
            </p>
          )}
        </div>

        {locale === "ko" ? (
          <div>
            <p className="text-ink-muted text-xs">{copy.totalSavings}</p>
            <p className="text-olive-dark mt-1 text-[21px] font-bold">
              {summary.savings.value === null
                ? "—"
                : `${formatValue(summary.savings.value, locale)}${copy.currencySuffix}`}
            </p>
            <p className="text-ink-muted mt-1 text-xs">{copy.savedCaption}</p>
          </div>
        ) : null}
      </div>

      {summary.hasPartialData ? (
        <p className="text-ink-muted mt-3 text-xs">{copy.partial}</p>
      ) : null}

      {isExpanded ? (
        <DailyCookingRecordSummaryDetails
          summary={summary}
          locale={locale}
          copy={copy}
          sodiumStatusCopy={sodiumStatusCopy}
        />
      ) : null}
    </section>
  );
};
