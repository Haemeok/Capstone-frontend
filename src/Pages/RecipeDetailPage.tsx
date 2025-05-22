import { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import UserProfile from '@/components/UserProfile';
import CollapsibleP from '@/components/CollapsibleP';

import RecipeStepList from '@/components/RecipeStepList';
import SuspenseImage from '@/components/Image/SuspenseImage';
import Ratings from '@/components/Ratings';
import SaveButton from '@/components/Button/SaveButton';
import ShareButton from '@/components/Button/ShareButton';
import LockButton from '@/components/Button/LockButton';
import Box from '@/components/ui/Box';
import CommentBox from '@/components/CommentBox';
import { Button } from '@/components/ui/button';
import TransformingNavbar from '@/components/NavBar/TransformingNavBar';
import useRecipeDetailQuery from '@/hooks/useRecipeDetailQuery';
import RecipeLikeButton from '@/components/RecipeLikeButton';
import RecipeNavBarButtons from '@/components/NavBar/RecipeNavBarButtons';
import { formatPrice } from '@/utils/recipe';
import RequiredAmountDisplay from './RequiredAmountDisplay';
import useScrollAnimate from '@/hooks/useScrollAnimate';
import { useToggleRecipeFavorite } from '@/hooks/useToggleMutations';
import { useToastStore } from '@/store/useToastStore';

const RecipeDetailPage = () => {
  const navigate = useNavigate();
  const imageRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  const { id } = useParams();
  const { recipeData: recipe } = useRecipeDetailQuery(Number(id));

  const { mutate: toggleFavorite } = useToggleRecipeFavorite(recipe.id);
  const { addToast } = useToastStore();
  const { targetRef: cookButtonRef } = useScrollAnimate<HTMLButtonElement>({
    triggerRef: observerRef,
    start: 'top bottom-=100px',
    toggleActions: 'play none none reset',
    yOffset: 10,
    duration: 0.2,
    delay: 0,
  });

  const handleNavigateToComments = () => {
    navigate(`comments`, {
      state: {
        author: recipe.author,
      },
    });
  };

  const handleNavigateToRating = () => {
    navigate(`/recipes/${recipe.id}/rate`);
  };

  const handleToggleFavorite = () => {
    const message = recipe.favoriteByCurrentUser
      ? '즐겨찾기에서 삭제했습니다.'
      : '즐겨찾기에 추가했습니다.';
    toggleFavorite(undefined, {
      onSuccess: () => {
        addToast({
          message,
          variant: 'success',
        });
      },
      onError: () => {
        addToast({
          message,
          variant: 'error',
        });
      },
    });
  };

  const totalPrice = formatPrice(
    recipe.ingredients.reduce(
      (acc, ingredient) => acc + (ingredient.price ?? 0),
      0,
    ),
  );

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
      <div ref={imageRef} className="h-64 w-full">
        <SuspenseImage
          src={recipe.imageUrl}
          alt={recipe.title}
          className="h-full w-full object-cover"
          blackOverlay={true}
        />
      </div>
      <div className="px-2">
        <Box className="flex flex-col items-center justify-center gap-3">
          <h1 className="text-center text-2xl font-bold">{recipe.title}</h1>
          <div className="cursor-pointer" onClick={handleNavigateToRating}>
            <Ratings
              precision={0.1}
              allowHalf={true}
              value={recipe.ratingInfo.avgRating || 0}
              readOnly={true}
              className="w-full justify-center"
              showValue={true}
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
            />
            <LockButton />
          </div>
        </Box>
        <Box>
          <UserProfile user={recipe.author} />
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
            <CommentBox
              comment={recipe.comments[0]}
              recipeId={recipe.id}
              hideReplyButton={true}
            />
          )}
        </Box>
        <Box className="flex flex-col gap-2">
          <h2 className="mb-2 text-xl font-semibold">재료</h2>
          <RequiredAmountDisplay totalPrice={totalPrice} />
          <ul className="flex flex-col gap-1">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="grid grid-cols-3 gap-4">
                <p className="text-left font-bold">{ingredient.name}</p>
                <p className="text-left">
                  {ingredient.quantity}
                  {ingredient.unit}
                </p>
                <p className="text-left">{formatPrice(ingredient.price)}원</p>
              </li>
            ))}
          </ul>
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
          onClick={() => navigate(`/recipes/${recipe.id}/slideShow`)}
        >
          요리하기
        </Button>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
