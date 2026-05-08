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
  <div className="flex items-baseline justify-between py-2 border-b border-gray-100 last:border-b-0">
    <span className="text-sm text-gray-700">{label}</span>
    <span className="text-sm font-semibold text-gray-900">
      {value}
      <span className="text-xs font-normal text-gray-500 ml-0.5">{unit}</span>
    </span>
  </div>
);

const NutritionCard = ({ nutrition }: NutritionCardProps) => {
  if (!nutrition) return null;

  return (
    <section className="px-5 py-6 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-1">영양정보</h2>
      <p className="text-sm text-gray-500 mb-4">100g 기준이에요</p>

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-bold text-gray-900">
            {nutrition.kcal}
          </span>
          <span className="text-sm text-gray-500">kcal</span>
        </div>

        <div className="flex flex-col">
          <NutritionRow label="단백질" value={nutrition.proteinG} unit="g" />
          <NutritionRow label="탄수화물" value={nutrition.carbohydrateG} unit="g" />
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
