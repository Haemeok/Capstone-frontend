"use client";

import { useState } from "react";
import Image from "next/image";

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

  const { scrollProgress, handleProgressClick, getStepProgress } = useSlideShowProgress({
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
            <div className="mx-auto w-full max-w-sm flex flex-col items-center">
              <div className="relative h-80 w-80 mb-4 rounded-2xl overflow-hidden">
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="object-cover"
                  fill
                />
              </div>
              <p className="text-lg text-dark text-center mb-6">
                {recipe.author.nickname}님의 {recipe.title} 어떠셨나요?
              </p>
              <div className="w-full space-y-3">
                <button
                  className="bg-olive-mint flex w-full items-center justify-center gap-2 rounded-lg py-2 text-white font-medium"
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

      <div className="border-border bg-background flex border-t h-12">
        {recipeSteps.map((step, index) => (
          <div
            key={index}
            className="border-border relative flex-1 border-r h-full"
            onClick={() => handleProgressClick(index)}
          >
            <div className="flex h-full items-center justify-center">
              <span className="text-muted-foreground absolute top-1 left-2 z-10 text-xs font-medium">
                {`0${index + 1}`}
              </span>
            </div>
            <div
              className="bg-olive-mint absolute bottom-0 left-0 h-full"
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
            className="bg-olive-mint absolute bottom-0 left-0 h-full"
            style={{ width: `${getStepProgress(recipeSteps.length)}%` }}
          />
        </div>
      </div>
    </>
  );
};

export default SlideShowCarousel;