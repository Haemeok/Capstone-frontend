import type { Locale, UserPagesDict } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";

import type {
  DailyCookingSummary,
  DailySummaryMetric,
} from "../lib/buildDailyCookingSummary";
import { getSodiumStatus } from "../lib/getSodiumStatus";

type DailyCookingRecordSummaryDetailsProps = {
  summary: DailyCookingSummary;
  locale: Locale;
  copy: UserPagesDict["calendar"]["dailyRecord"]["summary"];
  sodiumStatusCopy: UserPagesDict["calendar"]["sodiumStatus"];
};

type MacroRowProps = {
  label: string;
  metric: DailySummaryMetric;
  target: number;
  locale: Locale;
};

const localeTag: Record<Locale, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
};

const formatNumber = (value: number, locale: Locale) =>
  value.toLocaleString(localeTag[locale]);

const MacroRow = ({ label, metric, target, locale }: MacroRowProps) => {
  if (metric.value === null) {
    return null;
  }

  const percentage = Math.min((metric.value / target) * 100, 100);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
        <span className="text-ink-sub font-medium">{label}</span>
        <span className="text-ink-muted">
          {formatNumber(metric.value, locale)}g / {target}g
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div
          aria-hidden="true"
          className="bg-olive-dark h-full rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const DailyCookingRecordSummaryDetails = ({
  summary,
  locale,
  copy,
  sodiumStatusCopy,
}: DailyCookingRecordSummaryDetailsProps) => {
  const sodiumStatus =
    summary.sodium.value === null
      ? null
      : getSodiumStatus(summary.sodium.value);
  const costRows = [
    { label: copy.outsideCost, metric: summary.marketPrice },
    { label: copy.homeCost, metric: summary.ingredientCost },
  ].flatMap(({ label, metric }) =>
    metric.value === null ? [] : [{ label, value: metric.value }]
  );

  return (
    <div className="mt-6 space-y-5 border-t border-gray-100 pt-5">
      <div className="space-y-4">
        <MacroRow
          label={copy.carbs}
          metric={summary.carbohydrate}
          target={300}
          locale={locale}
        />
        <MacroRow
          label={copy.protein}
          metric={summary.protein}
          target={100}
          locale={locale}
        />
        <MacroRow
          label={copy.fat}
          metric={summary.fat}
          target={70}
          locale={locale}
        />
      </div>

      {sodiumStatus && summary.sodium.value !== null ? (
        <div className="flex items-start justify-between gap-4 border-t border-gray-100 pt-4">
          <div>
            <p className="text-ink-sub text-sm font-medium">{copy.sodium}</p>
            <p
              className={cn(
                "text-ink-muted mt-1 text-xs",
                sodiumStatus.tone === "caution" && "text-amber-700"
              )}
            >
              {sodiumStatusCopy[sodiumStatus.key].label} ·{" "}
              {sodiumStatusCopy[sodiumStatus.key].description}
            </p>
          </div>
          <span className="text-ink-sub shrink-0 text-sm font-medium">
            {formatNumber(summary.sodium.value, locale)}mg
          </span>
        </div>
      ) : null}

      {locale === "ko" && costRows.length > 0 ? (
        <dl className="space-y-3 border-t border-gray-100 pt-4">
          {costRows.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4"
            >
              <dt className="text-ink-muted text-sm">{label}</dt>
              <dd className="text-ink text-sm font-bold">
                {formatNumber(value, locale)}
                {copy.currencySuffix}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
};
