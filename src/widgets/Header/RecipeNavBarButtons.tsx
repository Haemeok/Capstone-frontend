import ShareButton from "@/shared/ui/ShareButton";

import RecipeLikeButton from "@/features/recipe-like/ui/RecipeLikeButton";

type RecipeNavBarButtonsProps = {
  recipeId: string;
  initialIsLiked: boolean;
  initialLikeCount: number;
};

const RecipeNavBarButtons = ({
  recipeId,
  initialIsLiked,
  initialLikeCount,
}: RecipeNavBarButtonsProps) => {
  return (
    <div className="flex shrink-0">
      <RecipeLikeButton
        isOnNavbar
        recipeId={recipeId}
        initialIsLiked={initialIsLiked}
        initialLikeCount={initialLikeCount}
        buttonClassName="flex-shrink-0 transition-colors duration-300 hover:bg-gray-200/30 rounded-full"
        aria-label="좋아요"
        iconClassName="opacity-80"
        defaultColorClass="text-current"
      />
      <ShareButton
        className={`flex-shrink-0 rounded-full p-2 transition-colors duration-300 hover:bg-gray-200/30`}
        aria-label="공유하기"
      />
    </div>
  );
};

export default RecipeNavBarButtons;
