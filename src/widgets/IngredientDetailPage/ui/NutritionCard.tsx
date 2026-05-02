import type { IngredientNutrition } from "@/entities/ingredient";

type NutritionCardProps = {
  nutrition: IngredientNutrition | null;
};

type MacroBarProps = {
  label: string;
  value: number;
  unit: string;
};

const MacroBar = ({ label, value, unit }: MacroBarProps) => (
  <div className="flex items-center gap-3">
    <span className="w-14 text-sm text-gray-700">{label}</span>
    <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
      <div
        className="h-full bg-olive-light"
        style={{ width: `${Math.min(value * 4, 100)}%` }}
      />
    </div>
    <span className="w-16 text-right text-sm font-semibold text-gray-900">
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
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-bold text-gray-900">
            {nutrition.calories}
          </span>
          <span className="text-sm text-gray-500">kcal</span>
        </div>

        <div className="flex flex-col gap-3">
          <MacroBar label="단백질" value={nutrition.protein} unit="g" />
          <MacroBar label="탄수화물" value={nutrition.carb} unit="g" />
          <MacroBar label="지방" value={nutrition.fat} unit="g" />
          {nutrition.fiber !== undefined && (
            <MacroBar label="식이섬유" value={nutrition.fiber} unit="g" />
          )}
          {nutrition.sugar !== undefined && (
            <MacroBar label="당류" value={nutrition.sugar} unit="g" />
          )}
          {nutrition.sodium !== undefined && (
            <MacroBar
              label="나트륨"
              value={nutrition.sodium / 100}
              unit="mg"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default NutritionCard;
