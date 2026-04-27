import type { IngredientNutrition } from "@/entities/ingredient";

type NutritionCardProps = {
  nutrition: IngredientNutrition | null;
};

type MacroBarProps = {
  label: string;
  value: number;
  unit: string;
  colorClass: string;
};

const MacroBar = ({ label, value, unit, colorClass }: MacroBarProps) => (
  <div className="flex items-center gap-3">
    <span className="w-14 text-xs text-gray-500">{label}</span>
    <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
      <div
        className={`h-full ${colorClass}`}
        style={{ width: `${Math.min(value * 4, 100)}%` }}
      />
    </div>
    <span className="w-16 text-right text-sm font-medium text-gray-800">
      {value}
      {unit}
    </span>
  </div>
);

const NutritionCard = ({ nutrition }: NutritionCardProps) => {
  if (!nutrition) return null;

  return (
    <section className="px-5 py-6 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-3">영양정보</h2>
      <p className="text-xs text-gray-400 mb-4">100g 기준</p>

      <div className="rounded-2xl border border-gray-200 p-5">
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-bold text-gray-900">
            {nutrition.calories}
          </span>
          <span className="text-sm text-gray-500">kcal</span>
        </div>

        <div className="flex flex-col gap-3">
          <MacroBar
            label="단백질"
            value={nutrition.protein}
            unit="g"
            colorClass="bg-rose-300"
          />
          <MacroBar
            label="탄수화물"
            value={nutrition.carb}
            unit="g"
            colorClass="bg-amber-300"
          />
          <MacroBar
            label="지방"
            value={nutrition.fat}
            unit="g"
            colorClass="bg-sky-300"
          />
          {nutrition.fiber !== undefined && (
            <MacroBar
              label="식이섬유"
              value={nutrition.fiber}
              unit="g"
              colorClass="bg-emerald-300"
            />
          )}
          {nutrition.sugar !== undefined && (
            <MacroBar
              label="당류"
              value={nutrition.sugar}
              unit="g"
              colorClass="bg-pink-300"
            />
          )}
          {nutrition.sodium !== undefined && (
            <MacroBar
              label="나트륨"
              value={nutrition.sodium / 100}
              unit="mg"
              colorClass="bg-violet-300"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default NutritionCard;
