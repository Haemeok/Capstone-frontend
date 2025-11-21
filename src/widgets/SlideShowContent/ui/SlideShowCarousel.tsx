"use client";

import { useState } from "react";
import { Image } from "@/shared/ui/image/Image";

import { Bookmark, Star } from "lucide-react";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/shared/ui/shadcn/carousel";

import { type Recipe } from "@/entities/recipe";

import { useToggleRecipeFavorite } from "@/features/recipe-favorite";

import { useToastStore } from "@/widgets/Toast";

import { useSlideShowProgress } from "../hooks/useSlideShowProgress";
import SlideShowContent from "../SlideShowContent";

type SlideShowCarouselProps = {
  recipe: Recipe;
  onRateClick: () => void;
};

const SlideShowCarousel = ({ recipe, onRateClick }: SlideShowCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();

  const { mutate: toggleRecipeFavorite } = useToggleRecipeFavorite(recipe.id);
  const { addToast } = useToastStore();

  const TOTAL_STEPS = recipe.steps.length + 1;
  const recipeSteps = recipe.steps;

  const { handleProgressClick, getStepProgress } = useSlideShowProgress({
    api,
    totalSteps: TOTAL_STEPS,
    recipeStepsLength: recipeSteps.length,
  });

  const handleToggleFavorite = () => {
    const message = recipe.favoriteByCurrentUser
      ? "즐겨찾기에서 삭제했습니다."
      : "즐겨찾기에 추가했습니다.";

    toggleRecipeFavorite(undefined, {
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
    <>
      <Carousel setApi={setApi} className="h-full w-full">
        <CarouselContent className="-ml-0 h-full">
          {recipeSteps.map((step, index) => (
            <CarouselItem key={index} className="h-full pl-0">
              <SlideShowContent step={step} />
            </CarouselItem>
          ))}
          <CarouselItem
            key={TOTAL_STEPS}
            className="flex h-full flex-col justify-center px-6 pt-16"
          >
            <div className="mx-auto flex w-full max-w-sm flex-col items-center">
              <div className="relative mb-4 h-80 w-80 overflow-hidden rounded-2xl">
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="object-cover"
                />
              </div>
              <div className="text-dark mb-4 flex w-full items-center justify-center gap-1 text-lg">
                <span className="font-bold">{recipe.author.nickname}</span>
                <span>님의</span>
                <span className="font-bold">{recipe.title}</span>
                <span>어떠셨나요?</span>
              </div>
              <div className="mb-4 flex w-2/3 flex-col items-center justify-center">
                <p className="line-clamp-2 text-center text-gray-500">
                  평가에 참여하면, 마이페이지에서 식비 절약 현황을 한눈에 볼 수
                  있어요!
                </p>
              </div>
              <div className="w-full space-y-3">
                <button
                  className="bg-olive-light flex w-full items-center justify-center gap-2 rounded-lg py-2 font-medium text-white"
                  onClick={handleToggleFavorite}
                >
                  <Bookmark size={20} /> 저장하기
                </button>
                <button
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-1 border-gray-300 py-2 font-medium"
                  onClick={onRateClick}
                >
                  <Star size={20} /> 평가하기
                </button>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      <div className="border-border bg-background flex h-12 border-t">
        {recipeSteps.map((_, index) => (
          <div
            key={index}
            className="border-border relative h-full flex-1 border-r"
            onClick={() => handleProgressClick(index)}
          >
            <div className="flex h-full items-center justify-center">
              <span className="text-muted-foreground absolute top-1 left-2 z-10 text-xs font-medium">
                {`0${index + 1}`}
              </span>
            </div>
            <div
              className="bg-olive-light absolute bottom-0 left-0 h-full"
              style={{ width: `${getStepProgress(index - 1)}%` }}
            />
          </div>
        ))}
        <div
          onClick={() => handleProgressClick(TOTAL_STEPS)}
          className="border-border relative h-full w-12 flex-1 items-center justify-center border-l"
        >
          <Bookmark className="text-muted-foreground absolute top-1 left-2 z-20 h-4 w-4" />
          <div
            className="bg-olive-light absolute bottom-0 left-0 h-full"
            style={{ width: `${getStepProgress(recipeSteps.length)}%` }}
          />
        </div>
      </div>
    </>
  );
};

export default SlideShowCarousel;
