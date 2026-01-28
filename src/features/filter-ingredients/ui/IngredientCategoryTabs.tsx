import { INGREDIENT_CATEGORIES } from "@/shared/config/constants/recipe";
import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

type Props = {
  selected: string;
  onSelect: (category: string) => void;
};

export const IngredientCategoryTabs = ({ selected, onSelect }: Props) => {
  const handleClick = (category: string) => {
    triggerHaptic("Light");
    onSelect(category);
  };

  return (
    <div className="scrollbar-hide flex flex-nowrap gap-2 pb-2 overflow-x-auto sm:flex-wrap sm:overflow-x-visible">
      {INGREDIENT_CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => handleClick(category)}
          className={cn(
            "flex-shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-all sm:px-4 sm:py-2",
            selected === category
              ? "bg-olive-light text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
};
