import { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import UserProfile from '@/components/UserProfile';
import CollapsibleP from '@/components/CollapsibleP';

import { comments } from '@/mock';
import RecipeStepList from '@/components/RecipeStepList';
import SuspenseImage from '@/components/Image/SuspenseImage';
import Ratings from '@/components/Ratings';
import HeartButton from '@/components/Button/HeartButton';
import SaveButton from '@/components/Button/SaveButton';
import ShareButton from '@/components/Button/ShareButton';
import LockButton from '@/components/Button/LockButton';
import Box from '@/components/ui/Box';
import CommentBox from '@/components/CommentBox';
import { Button } from '@/components/ui/button';
import TransformingNavbar from '@/components/NavBar/TransformingNavBar';
import useRecipeDetailQuery from '@/hooks/useRecipeDetailQuery';
import RecipeLikeButton from '@/components/RecipeLikeButton';

const RecipeDetailPage = () => {
  const navigate = useNavigate();
  const [halfRating, setHalfRating] = useState<number>(3.5);
  const imageRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  const { id } = useParams();
  const { recipeData: recipe } = useRecipeDetailQuery(Number(id));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsButtonVisible(entry.isIntersecting);
      },
      {
        threshold: 0.5,
        rootMargin: '0px',
      },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, []);

  const handleNavigateToComments = () => {
    navigate(`comments`, {
      state: {
        author: recipe.author,
      },
    });
  };

  return (
    <div className="relative mx-auto flex flex-col bg-[#ffffff] pb-16 text-[#2a2229]">
      <TransformingNavbar
        title={recipe.title}
        targetRef={imageRef}
        titleThreshold={0.7}
        textColorThreshold={0.5}
        shadowThreshold={0.8}
      />
      <div ref={imageRef} className="h-64 w-full">
        <SuspenseImage
          src={recipe.imageURL}
          alt={recipe.title}
          className="h-full w-full object-cover"
          blackOverlay={true}
        />
      </div>
      <div className="px-2">
        <Box className="flex flex-col items-center justify-center gap-4">
          <h1 className="mb-4 text-center text-2xl font-bold">
            {recipe.title}
          </h1>
          <Ratings
            precision={0.5}
            allowHalf={true}
            value={halfRating}
            onChange={(value) => setHalfRating(value)}
            className="w-full"
            showValue={true}
          />
          <div className="flex justify-center gap-4">
            <RecipeLikeButton
              recipeId={recipe.id}
              initialIsLiked={recipe.likedByCurrentUser}
              initialLikeCount={recipe.likeCount}
            />
            <SaveButton
              className="flex h-14 w-14 items-center justify-center rounded-full border-2 p-2"
              label="저장"
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
          <CollapsibleP />
        </Box>
        <Box>
          <div className="flex items-center justify-between">
            <h2 className="mb-2 text-xl font-semibold">코멘트</h2>
            <Button
              variant="ghost"
              className="cursor-pointer font-semibold text-[#526c04]"
              onClick={handleNavigateToComments}
            >
              더 읽기
            </Button>
          </div>
          <CommentBox comment={comments[0]} />
        </Box>
        <Box>
          <h2 className="mb-2 text-xl font-semibold">재료</h2>
          <ul className="flex flex-col gap-1">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="grid grid-cols-2 gap-4">
                <p className="text-left font-bold">{ingredient.name}</p>
                <p className="text-left">{ingredient.quantity}</p>
              </li>
            ))}
          </ul>
        </Box>
        <div ref={observerRef} className="h-1 w-full" />
        <Box>
          <RecipeStepList RecipeSteps={recipe.steps} />
        </Box>
      </div>

      {isButtonVisible && (
        <div className="fixed bottom-20 z-50 flex w-full justify-center">
          <Button
            className="rounded-full bg-[#526c04] p-4 text-white shadow-lg transition-all hover:bg-[#526c04]"
            onClick={() =>
              navigate(`/recipes/${recipe.id}/slideShow`, {
                state: { recipeSteps: recipe.steps },
              })
            }
          >
            요리하기
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecipeDetailPage;
