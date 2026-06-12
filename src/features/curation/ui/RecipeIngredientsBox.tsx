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
      <h3 className="text-ink-sub text-sm font-bold tracking-wide">재료</h3>
      <ul className="text-ink mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[15px]">
        {recipe.ingredients.map((ing, i) => {
          const qty = formatQty(ing);
          return (
            <li key={ing.id ?? i} className="leading-relaxed">
              <span>{ing.name}</span>
              {qty && <span className="text-ink-muted ml-1">{qty}</span>}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
