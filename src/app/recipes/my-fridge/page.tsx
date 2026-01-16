"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Info, Star } from "lucide-react";

import { useSort } from "@/shared/hooks/useSort";
import BadgeButton from "@/shared/ui/BadgeButton";
import { Container } from "@/shared/ui/Container";
import { Image } from "@/shared/ui/image/Image";
import PrevButton from "@/shared/ui/PrevButton";
import RecipeSortButton from "@/shared/ui/RecipeSortButton";
import SortPicker from "@/shared/ui/SortPicker";

import { useMyIngredientRecipesInfiniteQuery } from "@/entities/recipe/model/hooks";
import UserName from "@/entities/user/ui/UserName";
import UserProfileImage from "@/entities/user/ui/UserProfileImage";

import { RecipeLikeButton } from "@/features/recipe-like";

const MyFridgePage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { currentSort, setSort, getSortParam, availableSorts } =
    useSort("recipe");

  const {
    recipes,
    ref,
    isFetchingNextPage,
    hasNextPage,
    noResults,
    lastPageMessage,
    isPending,
    totalCount,
  } = useMyIngredientRecipesInfiniteQuery(getSortParam());

  const router = useRouter();

  const handleSortChange = (newSort: string) => {
    setSort(newSort as any);
    setIsDrawerOpen(false);
  };

  return (
    <Container>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <PrevButton />
          <h1 className="text-2xl font-bold">요리 가능한 레시피</h1>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <p className="text-sm text-gray-500">{totalCount}개의 레시피</p>
            <BadgeButton
              badgeText="현재 내 냉장고에 있는 재료로 만들 수 있는 레시피를 찾아보세요."
              badgeIcon={<Info size={16} className="text-gray-500" />}
            />
          </div>
          <div className="flex flex-col items-start">
            <RecipeSortButton
              currentSort={currentSort}
              onClick={() => setIsDrawerOpen(true)}
            />
            <SortPicker
              open={isDrawerOpen}
              onOpenChange={setIsDrawerOpen}
              currentSort={currentSort}
              availableSorts={availableSorts}
              onSortChange={handleSortChange}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {isPending ? (
            <div className="flex items-center justify-center py-20">
              <div className="border-t-olive-light h-12 w-12 animate-spin rounded-full border-4 border-gray-200"></div>
            </div>
          ) : noResults ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
              <div className="text-6xl">🍳</div>
              <p className="text-lg font-semibold text-gray-700">
                요리 가능한 레시피가 없습니다
              </p>
              <p className="text-center text-sm text-gray-500">
                냉장고에 재료를 추가하면
                <br />더 많은 레시피를 찾을 수 있어요!
              </p>
            </div>
          ) : (
            <>
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="relative flex cursor-pointer items-start gap-3"
                  onClick={() => router.push(`/recipes/${recipe.id}`)}
                >
                  <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl">
                    <Image
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="h-full w-full object-cover"
                      width={128}
                      height={128}
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

                  <div className="flex min-w-0 flex-1 flex-col gap-1 py-1">
                    <p className="line-clamp-2 text-base font-bold">
                      {recipe.title}
                    </p>
                    <div className="flex items-center gap-[2px]">
                      <Star size={15} className="fill-gray-800" />
                      <p className="text-mm text-gray-800">
                        {recipe.avgRating}
                      </p>
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
                    <div className="mt-2 flex flex-wrap gap-1">
                      {recipe.matchedIngredients.map((ingredient, index) => (
                        <span
                          key={index}
                          className="bg-olive-mint/10 text-olive-mint rounded-lg px-2 py-1 text-xs leading-none font-bold"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <div
                ref={ref}
                className="mt-2 flex h-10 items-center justify-center"
              >
                {isFetchingNextPage ? (
                  <div className="border-t-olive-light h-8 w-8 animate-spin rounded-full border-4 border-gray-200"></div>
                ) : (
                  !hasNextPage &&
                  recipes.length > 0 && (
                    <p className="text-sm text-gray-500">{lastPageMessage}</p>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Container>
  );
};

export default MyFridgePage;
