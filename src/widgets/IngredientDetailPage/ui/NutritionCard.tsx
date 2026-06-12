import type { IngredientNutrition } from "@/entities/ingredient";

type NutritionCardProps = {
  nutrition: IngredientNutrition | null;
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

const NutritionCard = ({ nutrition }: NutritionCardProps) => {
  if (!nutrition) return null;

  return (
    <section className="border-t border-gray-100 px-5 py-6">
      <h2 className="text-ink mb-1 text-lg font-bold">영양정보</h2>
      <p className="text-ink-muted mb-4 text-sm">100g 기준이에요</p>

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-ink text-3xl font-bold">{nutrition.kcal}</span>
          <span className="text-ink-muted text-sm">kcal</span>
        </div>

        <div className="flex flex-col">
          <NutritionRow label="단백질" value={nutrition.proteinG} unit="g" />
          <NutritionRow
            label="탄수화물"
            value={nutrition.carbohydrateG}
            unit="g"
          />
          <NutritionRow label="지방" value={nutrition.fatG} unit="g" />
          {nutrition.sugarG !== undefined && (
            <NutritionRow label="당류" value={nutrition.sugarG} unit="g" />
          )}
          {nutrition.sodiumMg !== undefined && (
            <NutritionRow label="나트륨" value={nutrition.sodiumMg} unit="mg" />
          )}
        </div>
      </div>
    </section>
  );
};

export default NutritionCard;
