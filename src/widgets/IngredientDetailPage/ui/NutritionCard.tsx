import { getDictionary, type Locale } from "@/shared/i18n";

import type { IngredientNutrition } from "@/entities/ingredient";

type NutritionCardProps = {
  nutrition: IngredientNutrition | null;
  locale?: Locale;
};

type NutritionRowProps = {
  label: string;
  value: number;
  unit: string;
};

const NutritionRow = ({ label, value, unit }: NutritionRowProps) => (
  <div className="flex items-baseline justify-between border-b border-gray-100 py-2 last:border-b-0">
    <span className="text-ink-sub text-sm">{label}</span>
    <span className="text-ink text-sm font-semibold">
      {value}
      <span className="text-ink-muted ml-0.5 text-xs font-normal">{unit}</span>
    </span>
  </div>
);

const NutritionCard = ({ nutrition, locale = "ko" }: NutritionCardProps) => {
  if (!nutrition) return null;

  const t = getDictionary(locale).ingredientDetail;

  return (
    <section className="border-t border-gray-100 px-5 py-6">
      <h2 className="text-ink mb-1 text-lg font-bold">{t.nutritionHeader}</h2>
      <p className="text-ink-muted mb-4 text-sm">{t.nutritionBasis}</p>

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-ink text-3xl font-bold">{nutrition.kcal}</span>
          <span className="text-ink-muted text-sm">kcal</span>
        </div>

        <div className="flex flex-col">
          <NutritionRow
            label={t.nutritionProtein}
            value={nutrition.proteinG}
            unit="g"
          />
          <NutritionRow
            label={t.nutritionCarbs}
            value={nutrition.carbohydrateG}
            unit="g"
          />
          <NutritionRow
            label={t.nutritionFat}
            value={nutrition.fatG}
            unit="g"
          />
          {nutrition.sugarG !== undefined && (
            <NutritionRow
              label={t.nutritionSugar}
              value={nutrition.sugarG}
              unit="g"
            />
          )}
          {nutrition.sodiumMg !== undefined && (
            <NutritionRow
              label={t.nutritionSodium}
              value={nutrition.sodiumMg}
              unit="mg"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default NutritionCard;
