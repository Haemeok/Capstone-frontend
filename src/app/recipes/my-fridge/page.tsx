"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Info, Star } from "lucide-react";

import { useSort } from "@/shared/hooks/useSort";
import { cn } from "@/shared/lib/utils";
import BadgeButton from "@/shared/ui/BadgeButton";
import PrevButton from "@/shared/ui/PrevButton";
import RecipeSortButton from "@/shared/ui/RecipeSortButton";
import RecipeSortDrawer from "@/shared/ui/RecipeSortDrawer";

import { useMyIngredientRecipesInfiniteQuery } from "@/entities/recipe/model/hooks";
import UserName from "@/entities/user/ui/UserName";
import UserProfileImage from "@/entities/user/ui/UserProfileImage";

import { RecipeLikeButton } from "@/features/recipe-like";
import SuspenseImage from "@/shared/ui/image/SuspenseImage";

const MyFridgePage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { currentSort, setSort, getSortParam, availableSorts } =
    useSort("recipe");

  const {
    recipes,
    ref,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    noResults,
    lastPageMessage,
  } = useMyIngredientRecipesInfiniteQuery(getSortParam());

  const router = useRouter();

  const handleSortChange = (newSort: string) => {
    setSort(newSort as any);
    setIsDrawerOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-4 items-center">
        <PrevButton />
        <h1 className="text-2xl font-bold">요리 가능한 레시피</h1>
      </div>
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-1 items-center">
          <p className="text-sm text-gray-500">{recipes.length}개의 레시피</p>
          <BadgeButton
            badgeText="현재 내 냉장고에 있는 재료로 만들 수 있는 레시피를 찾아보세요."
            badgeIcon={<Info size={16} className="text-gray-500" />}
          />
        </div>
        <RecipeSortButton
          currentSort={currentSort}
          onClick={() => setIsDrawerOpen(true)}
        />
      </div>

      <div className="flex flex-col gap-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="flex justify-between items-center relative cursor-pointer gap-2"
            onClick={() => router.push(`/recipes/${recipe.id}`)}
          >
            <div className="relative h-40 w-40 rounded-2xl">
              <SuspenseImage
                src={recipe.imageUrl}
                alt={recipe.title}
                className={cn(
                  `h-full w-full relative object-cover rounded-2xl`
                )}
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
            </div>

            <div className="flex grow flex-col gap-1 px-2 pb-2">
              <p className="truncate font-semibold">{recipe.title}</p>
              <div className="flex items-center gap-[2px]">
                <Star size={15} className="fill-gray-800" />
                <p className="text-mm text-gray-800">{recipe.avgRating}</p>
                <p className="text-mm text-gray-800">{`(${recipe.ratingCount})`}</p>
                <p className="text-mm text-gray-800">·</p>
                <p className="text-mm text-gray-800">{`${recipe.cookingTime}분`}</p>
              </div>
              <div className="flex items-center gap-1">
                <UserProfileImage
                  profileImage={recipe.profileImage}
                  userId={recipe.authorId}
                />
                <UserName
                  username={recipe.authorName}
                  userId={recipe.authorId}
                />
              </div>
              <p className="text-sm text-olive-mint font-semibold truncate mt-2">
                {recipe.matchedIngredients.join(", ")}
              </p>
            </div>
          </div>
        ))}
        <div ref={ref} className="mt-2 flex h-10 items-center justify-center">
          {!isFetchingNextPage &&
            !hasNextPage &&
            recipes &&
            recipes.length > 0 &&
            !error &&
            !noResults && (
              <p className="text-sm text-gray-500">{lastPageMessage}</p>
            )}
        </div>
      </div>

      <RecipeSortDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        currentSort={currentSort}
        availableSorts={availableSorts}
        onSortChange={handleSortChange}
      />
    </div>
  );
};

export default MyFridgePage;
