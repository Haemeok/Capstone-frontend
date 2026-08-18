import type { UserPagesDict } from "@/shared/i18n";

import type { CookingRecordCalendarDateItem } from "@/entities/recipe";

type DailyCookingRecordNutritionProps = {
  record: CookingRecordCalendarDateItem;
  copy: UserPagesDict["calendar"]["dailyRecord"]["list"];
};

export const DailyCookingRecordNutrition = ({
  record,
  copy,
}: DailyCookingRecordNutritionProps) => {
  const metrics = [
    record.calories === null
      ? null
      : { label: copy.calories, value: `${Math.round(record.calories)} kcal` },
    record.nutrition === null
      ? null
      : {
          label: copy.carbs,
          value: `${Math.round(record.nutrition.carbohydrate)}g`,
        },
    record.nutrition === null
      ? null
      : {
          label: copy.protein,
          value: `${Math.round(record.nutrition.protein)}g`,
        },
    record.nutrition === null
      ? null
      : {
          label: copy.fat,
          value: `${Math.round(record.nutrition.fat)}g`,
        },
  ].filter(
    (metric): metric is { label: string; value: string } => metric !== null
  );

  if (metrics.length === 0) return null;

  return (
    <div
      aria-label={copy.nutritionAria.replace("{title}", record.displayTitle)}
      className="mt-[17px] grid auto-cols-fr grid-flow-col border-t border-gray-200 pt-3.5"
    >
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="border-l border-gray-200 px-2 first:border-l-0 first:pl-0"
        >
          <span className="text-ink-muted block text-[10px]">
            {metric.label}
          </span>
          <strong className="text-ink mt-1 block text-xs font-bold">
            {metric.value}
          </strong>
        </div>
      ))}
    </div>
  );
};
