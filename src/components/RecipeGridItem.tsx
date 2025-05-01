import React from 'react';
import SuspenseImage from './Image/SuspenseImage';
import HeartButton from './Button/HeartButton';
import { useNavigate } from 'react-router';
import { RecipeGridItem as RecipeGridItemType } from '@/type/recipe';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { cn } from '@/lib/utils';
import RecipeLikeButton from './RecipeLikeButton';
type RecipeGridItemProps = {
  recipe: RecipeGridItemType;
  isSimple: boolean;
  height: number;
};
const RecipeGridItem = ({ recipe, isSimple, height }: RecipeGridItemProps) => {
  const navigate = useNavigate();

  console.log(recipe);
  return (
    <div
      key={recipe.id}
      className="overflow-hidden shadow-sm"
      onClick={() => {
        navigate(`/recipes/${recipe.id}`);
      }}
    >
      {isSimple && (
        <div className={cn(`relative min-h-${height} rounded-2xl`)}>
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
            />
          </div>

          <div className="absolute right-0 bottom-0 left-0 flex h-1/3 items-end rounded-2xl bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-sm font-semibold text-white">{recipe.title}</p>
          </div>
        </div>
      )}
      {!isSimple && (
        <div
          className={cn(
            `relative flex min-h-${height} flex-col gap-2 rounded-2xl`,
          )}
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
            />
          </div>

          <div className="font-noto-sans-kr flex flex-col px-2 pb-2">
            <p className="truncate font-semibold">{recipe.title}</p>
            <div className="flex items-center gap-[2px]">
              <Star size={15} className="fill-gray-800" />
              <p className="text-mm text-gray-800">{recipe.rating}</p>
              <p className="text-mm text-gray-800">{`(${recipe.commentCount})`}</p>
              <p className="text-mm text-gray-800">·</p>
              <p className="text-mm text-gray-800">{`${recipe.cookingTime}분`}</p>
            </div>
            <div className="flex items-center gap-1">
              <Avatar className="h-8 w-8 rounded-full">
                <img
                  src={'/meat.png'}
                  alt={recipe.authorName}
                  className="h-full w-full rounded-full object-cover"
                />
              </Avatar>
              <p className="text-sm font-bold text-gray-800">
                {recipe.authorName}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeGridItem;
