import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import SuspenseImage from '../Image/SuspenseImage';
import RecipeLikeButton from '../RecipeLikeButton';
import { BaseRecipeGridItem } from '@/type/recipe';
import { useNavigate } from 'react-router';
import { EllipsisVertical } from 'lucide-react';

type SimpleRecipeGridItemProps = {
  recipe: BaseRecipeGridItem;
  height: number;
  setIsDrawerOpen: (id: number) => void;
};

const SimpleRecipeGridItem = ({
  recipe,
  height,
  setIsDrawerOpen,
}: SimpleRecipeGridItemProps) => {
  const navigate = useNavigate();

  const handleItemClick = (e: React.MouseEvent) => {
    navigate(`/recipes/${recipe.id}`);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDrawerOpen(recipe.id);
  };

  return (
    <>
      <div
        className={cn(`relative min-h-${height} rounded-2xl`)}
        onClick={handleItemClick}
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
            iconClassName="fill-gray-300 opacity-80"
          />
        </div>

        <div className="absolute right-0 bottom-0 left-0 flex h-1/3 items-end rounded-2xl bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="max-w-4/5 truncate text-[17px] font-semibold text-white">
            {recipe.title}
          </p>
        </div>
        <div className="absolute right-0 bottom-1 p-2">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full text-white"
            onClick={handleMenuClick}
          >
            <EllipsisVertical size={20} />
          </button>
        </div>
      </div>
    </>
  );
};

export default SimpleRecipeGridItem;
