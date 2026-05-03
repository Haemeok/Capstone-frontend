import type { StaticRecipe } from "@/entities/recipe/model/types";

type RecipeIngredient = StaticRecipe["ingredients"][number];

type RecipeIngredientsBoxProps = {
  recipe: StaticRecipe | null | undefined;
};

const formatQty = (ing: RecipeIngredient): string => {
  const quantity = ing.quantity?.trim();
  const unit = ing.unit?.trim();
  if (quantity && unit) return `${quantity}${unit}`;
  if (quantity) return quantity;
  if (unit) return unit;
  return "";
};

export const RecipeIngredientsBox = ({ recipe }: RecipeIngredientsBoxProps) => {
  if (!recipe?.ingredients?.length) return null;

  return (
    <aside className="my-8 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-5">
      <h3 className="text-sm font-bold tracking-wide text-gray-700">재료</h3>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[15px] text-gray-800">
        {recipe.ingredients.map((ing, i) => {
          const qty = formatQty(ing);
          return (
            <li key={ing.id ?? i} className="leading-relaxed">
              <span>{ing.name}</span>
              {qty && <span className="ml-1 text-gray-500">{qty}</span>}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
