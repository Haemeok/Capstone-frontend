import { useEffect,useRef } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation"; // react-router 대체

import useScrollAnimate from "@/shared/hooks/useScrollAnimate";
import { formatPrice } from "@/shared/lib/format";
import AIBadgeButton from "@/shared/ui/AIBadgeButton";
import Box from "@/shared/ui/Box";
import CollapsibleP from "@/shared/ui/CollapsibleP";
import Ratings from "@/shared/ui/Ratings";
import RequiredAmountDisplay from "@/shared/ui/RequiredAmountDisplay";
import SaveButton from "@/shared/ui/SaveButton";
// 5. Shared: 프로젝트 전반에서 재사용되는 범용 코드
import { Button } from "@/shared/ui/shadcn/button";

import { RecipeStepList, useRecipeDetailQuery } from "@/entities/recipe";
// 4. Entities: 핵심 데이터(레시피, 유저, 댓글)와 관련된 코드
import { UserProfile, useUserStore } from "@/entities/user";

import { CommentCard } from "@/features/comment-card";
import { useToggleRecipeFavorite } from "@/features/recipe-favorite";
// 3. Features: 사용자의 특정 행동(액션)과 관련된 기능들
import { RecipeLikeButton } from "@/features/recipe-like";
import { LockButton } from "@/features/recipe-visibility";
import ShareButton from "@/features/share-content/ui/ShareButton";

import RecipeNavBarButtons from "@/widgets/Header/RecipeNavBarButtons";
// 2. Widgets: 여러 기능을 조합한 독립적인 UI 블록
import TransformingNavbar from "@/widgets/Header/TransformingNavbar";
import { useToastStore } from "@/widgets/Toast";

const RecipeDetailPage = () => {
  const router = useRouter();
  const imageRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  const { recipeId } = useParams();
  const { recipeData: recipe } = useRecipeDetailQuery(Number(recipeId));

  const { mutate: toggleFavorite } = useToggleRecipeFavorite(recipe.id);
  const { addToast } = useToastStore();
  const { user } = useUserStore();

  const { targetRef: cookButtonRef } = useScrollAnimate<HTMLButtonElement>({
    triggerRef: observerRef,
    start: "top bottom-=100px",
    toggleActions: "play none none reset",
    yOffset: 10,
    duration: 0.2,
    delay: 0,
  });

  const handleNavigateToComments = () => {
    router.push(`/recipes/${recipe.id}/comments`);
  };

  const handleNavigateToRating = () => {
    router.push(`/recipes/${recipe.id}/rate`);
  };

  const handleToggleFavorite = () => {
    const message = recipe.favoriteByCurrentUser
      ? "즐겨찾기에서 삭제했습니다."
      : "즐겨찾기에 추가했습니다.";

    toggleFavorite(undefined, {
      onSuccess: () => {
        addToast({
          message,
          variant: "success",
          position: "bottom",
        });
      },
      onError: () => {
        addToast({
          message,
          variant: "error",
          position: "bottom",
        });
      },
    });
  };

  return (
    <div className="relative mx-auto flex flex-col bg-[#ffffff] text-[#2a2229]">
      <TransformingNavbar
        title={recipe.title}
        targetRef={imageRef}
        titleThreshold={0.7}
        textColorThreshold={0.5}
        shadowThreshold={0.8}
        rightComponent={
          <RecipeNavBarButtons
            recipeId={recipe.id}
            initialIsLiked={recipe.likedByCurrentUser}
            initialLikeCount={recipe.likeCount}
          />
        }
      />
      <div ref={imageRef} className="h-112 w-full">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="px-2">
        <Box className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-center text-2xl font-bold">{recipe.title}</h1>
            {recipe.aiGenerated && <AIBadgeButton />}
          </div>
          <div className="cursor-pointer" onClick={handleNavigateToRating}>
            <Ratings
              precision={0.1}
              allowHalf={true}
              value={recipe.ratingInfo.avgRating || 0}
              readOnly={true}
              className="w-full justify-center"
              showValue={true}
              ratingCount={recipe.ratingInfo.ratingCount}
            />
          </div>
          <div className="flex justify-center gap-4">
            <RecipeLikeButton
              recipeId={recipe.id}
              initialIsLiked={recipe.likedByCurrentUser}
              initialLikeCount={recipe.likeCount}
              buttonClassName="flex h-14 w-14 items-center justify-center rounded-full border-2 p-2"
              isOnNavbar={false}
              isCountShown={true}
            />
            <SaveButton
              className="flex h-14 w-14 items-center justify-center rounded-full border-2 p-2"
              label="저장"
              isFavorite={recipe.favoriteByCurrentUser}
              onClick={handleToggleFavorite}
            />
            <ShareButton
              className="flex h-14 w-14 items-center justify-center rounded-full border-2 p-2"
              label="공유"
              text={`${recipe.title} 를 확인해보세요!`}
            />
            {recipe.author.id === user?.id && (
              <LockButton
                recipeId={recipe.id}
                initialIsLocked={recipe.private}
              />
            )}
          </div>
        </Box>

        <Box>
          <UserProfile user={recipe.author} className="text-xl" />
          <CollapsibleP content={recipe.description} />
        </Box>
        <Box>
          <div className="flex items-center justify-between">
            <h2 className="mb-2 text-xl font-semibold">코멘트</h2>
            <Button
              variant="ghost"
              className="text-olive-medium cursor-pointer font-semibold"
              onClick={handleNavigateToComments}
            >
              더 읽기
            </Button>
          </div>
          {recipe.comments.length > 0 && (
            <CommentCard
              comment={recipe.comments[0]}
              recipeId={recipe.id}
              hideReplyButton={true}
            />
          )}
        </Box>
        <Box className="flex flex-col gap-2">
          <h2 className="mb-2 text-xl font-semibold">재료</h2>
          <RequiredAmountDisplay
            pointText={`${formatPrice(recipe.totalIngredientCost)}원`}
            prefix="이 레시피에 약"
            suffix="필요해요!"
          />
          <ul className="flex flex-col gap-1">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="grid grid-cols-3 gap-4">
                <p className="text-left font-bold">{ingredient.name}</p>
                <p className="text-left">
                  {ingredient.quantity}
                  {ingredient.unit}
                </p>
                <p className="text-left text-sm text-slate-500">
                  {formatPrice(ingredient.price)}원
                </p>
              </li>
            ))}
          </ul>
          <RequiredAmountDisplay
            pointText={`${formatPrice(
              recipe.marketPrice - recipe.totalIngredientCost
            )}원`}
            prefix="배달 물가 대비"
            suffix="절약해요!"
            containerClassName="mt-2 flex items-center border-0 text-gray-400 p-0 font-semibold"
            textClassName="text-purple-500"
          />
        </Box>

        <div ref={observerRef} className="h-1 w-full" />
        <Box>
          <RecipeStepList RecipeSteps={recipe.steps} />
        </Box>
      </div>

      <div className="fixed bottom-20 z-50 flex w-full justify-center">
        <Button
          ref={cookButtonRef}
          className="bg-olive-light rounded-full p-4 text-white shadow-lg"
          onClick={() => router.push(`/recipes/${recipe.id}/slideShow`)}
        >
          요리하기
        </Button>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
