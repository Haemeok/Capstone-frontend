import ShareButton from "@/shared/ui/ShareButton";

import { RecipeSaveButton } from "@/features/recipe-save";

type RecipeNavBarButtonsProps = {
  recipeId: string;
  initialIsFavorite: boolean;
};

const RecipeNavBarButtons = ({
  recipeId,
  initialIsFavorite,
}: RecipeNavBarButtonsProps) => {
  return (
    <div className="flex shrink-0">
      <RecipeSaveButton
        recipeId={recipeId}
        initialIsFavorite={initialIsFavorite}
        buttonClassName="flex-shrink-0 rounded-full p-2 transition-colors duration-300 hover:bg-gray-200/30"
        defaultColorClass="text-current"
        selectedColorClass="fill-current text-current"
      />
      <ShareButton
        className="flex-shrink-0 rounded-full p-2 transition-colors duration-300 hover:bg-gray-200/30"
        aria-label="공유하기"
      />
    </div>
  );
};

export default RecipeNavBarButtons;
