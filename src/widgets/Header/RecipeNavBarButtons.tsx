"use client";

import { useChromeDict } from "@/shared/i18n";

import { RecipeSaveButton } from "@/features/recipe-save";

import ShareButton from "@/widgets/ShareButton";

type RecipeNavBarButtonsProps = {
  recipeId: string;
  initialIsFavorite: boolean;
};

const RecipeNavBarButtons = ({
  recipeId,
  initialIsFavorite,
}: RecipeNavBarButtonsProps) => {
  const nav = useChromeDict();

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
        aria-label={nav.shareAria}
      />
    </div>
  );
};

export default RecipeNavBarButtons;
