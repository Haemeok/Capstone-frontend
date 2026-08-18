import { format, type Locale, plural, type UserPagesDict } from "@/shared/i18n";

import type { MonthlyCookingRecordSummary as Summary } from "./buildMonthlyCookingRecordSummary";
import { MonthlyCookingRecordSummary } from "./MonthlyCookingRecordSummary";

type SummaryCopy = UserPagesDict["calendar"]["cookingRecord"]["summary"];

type MonthlyCookingRecordSummarySectionProps = {
  summary: Summary;
  copy: SummaryCopy;
  locale: Locale;
  monthLabel: string;
  isCurrentMonth: boolean;
};

export const MonthlyCookingRecordSummarySection = ({
  summary,
  copy,
  locale,
  monthLabel,
  isCurrentMonth,
}: MonthlyCookingRecordSummarySectionProps) => (
  <MonthlyCookingRecordSummary
    ariaLabel={copy.ariaLabel}
    title={format(
      plural(
        summary.cookingCount,
        isCurrentMonth ? copy.currentTitle : copy.selectedMonthTitle
      ),
      { count: summary.cookingCount, month: monthLabel }
    )}
    cookingDays={{
      value: format(plural(summary.cookingDayCount, copy.cookingDaysValue), {
        count: summary.cookingDayCount,
      }),
      label: copy.cookingDaysLabel,
    }}
    savings={{
      value: getSavingsValue(summary, copy, locale),
      label: copy.savingsLabel,
    }}
    uniqueDishes={{
      value: format(plural(summary.uniqueDishCount, copy.uniqueDishesValue), {
        count: summary.uniqueDishCount,
      }),
      label: copy.uniqueDishesLabel,
    }}
  />
);

const getSavingsValue = (
  summary: Summary,
  copy: SummaryCopy,
  locale: Locale
): string => {
  if (summary.savings.isUnavailable) return copy.unavailable;
  return format(copy.savingsValue, {
    amount: new Intl.NumberFormat(locale).format(summary.savings.value),
  });
};
