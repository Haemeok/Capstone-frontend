import { cn } from '@/lib/utils';
import React from 'react';
import SuspenseImage from '../Image/SuspenseImage';
import RecipeLikeButton from '../RecipeLikeButton';
import { BaseRecipeGridItem } from '@/type/recipe';
import { useNavigate } from 'react-router';

type SimpleRecipeGridItemProps = {
  recipe: BaseRecipeGridItem;
  height: number;
};

const SimpleRecipeGridItem = ({
  recipe,
  height,
}: SimpleRecipeGridItemProps) => {
  const navigate = useNavigate();
  return (
    <div
      className={cn(`relative min-h-${height} rounded-2xl`)}
      onClick={() => navigate(`/recipes/${recipe.id}`)}
    >
      <SuspenseImage
        src={recipe.imageUrl}
        alt={recipe.title}
        className="h-full w-full rounded-2xl object-cover"
      />
      <div className="absolute top-0 right-0 p-2 text-right">
        <RecipeLikeButton
          recipeId={recipe.id}
          initialIsLiked={recipe.likedByCurrentUser}
          initialLikeCount={recipe.likeCount}
          buttonClassName="text-white"
        />
      </div>

      <div className="absolute right-0 bottom-0 left-0 flex h-1/3 items-end rounded-2xl bg-gradient-to-t from-black/70 to-transparent p-4">
        <p className="text-[17px] font-semibold text-white">{recipe.title}</p>
      </div>
    </div>
  );
};

export default SimpleRecipeGridItem;
