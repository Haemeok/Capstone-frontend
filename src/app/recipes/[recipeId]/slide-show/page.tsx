"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { Bookmark, Share, Star, X } from "lucide-react";

import { Button } from "@/shared/ui/shadcn/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/shared/ui/shadcn/carousel";

import { useRecipeDetailQuery } from "@/entities/recipe";

import { useToggleRecipeFavorite } from "@/features/recipe-favorite";

import SlideShowContent from "@/widgets/SlideShowContent/SlideShowContent";
import { useToastStore } from "@/widgets/Toast";

const RecipeSlideShowPage = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [scrollProgress, setScrollProgress] = useState(0);

  const router = useRouter();
  const { recipeId } = useParams();
  const { recipeData: recipe } = useRecipeDetailQuery(Number(recipeId));
  const { mutate: toggleRecipeFavorite } = useToggleRecipeFavorite(recipe.id);
  const { addToast } = useToastStore();

  const TOTAL_STEPS = recipe.steps.length + 1;
  const recipeSteps = recipe.steps;

  useEffect(() => {
    if (!api) {
      return;
    }

    const onScroll = () => {
      const progress = api.scrollProgress();
      setScrollProgress((progress * recipeSteps.length) / TOTAL_STEPS);
    };

    api.on("scroll", onScroll);

    setScrollProgress(api.scrollProgress());

    return () => {
      api.off("scroll", onScroll);
    };
  }, [api]);

  const handleProgressClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

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

  const getStepProgress = (stepIndex: number) => {
    const stepSize = 1 / TOTAL_STEPS;
    const stepStart = stepSize * stepIndex;

    const newScrollProgress =
      stepIndex === TOTAL_STEPS - 1
        ? scrollProgress + stepSize
        : scrollProgress;
    const progressRaw = ((newScrollProgress - stepStart) / stepSize) * 100;

    return Math.max(0, Math.min(100, progressRaw));
  };

  return (
    <div className="bg-background text-foreground relative flex h-screen flex-col">
      <div className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/30 text-white hover:bg-black/50"
          onClick={() => router.back()}
        >
          <X className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/30 text-white hover:bg-black/50"
        >
          <Share className="h-5 w-5" />
        </Button>
      </div>

      <Carousel
        setApi={setApi}
        className="flex h-full flex-grow flex-col overflow-hidden"
      >
        <CarouselContent className="-ml-0 h-full flex-grow">
          {recipeSteps.map((step, index) => (
            <CarouselItem key={index} className="h-full pl-0">
              <SlideShowContent step={step} />
            </CarouselItem>
          ))}
          <CarouselItem
            key={TOTAL_STEPS}
            className="flex h-full flex-col items-center justify-center gap-3 px-4"
          >
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              className="h-1/2 w-2/3 rounded-2xl object-cover"
            />
            <p className="text-md text-dark">
              {recipe.author.nickname}님의 {recipe.title} 어떠셨나요?
            </p>
            <button
              className="bg-olive-mint flex w-full items-center justify-center gap-2 rounded-lg py-2 text-white"
              onClick={handleToggleFavorite}
            >
              <Bookmark size={20} /> 저장하기
            </button>
            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg border-1 border-gray-300 py-2"
              onClick={() => router.push(`/recipes/${recipe.id}/rate`)}
            >
              <Star size={20} /> 평가하기
            </button>
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      <div className="border-border bg-background flex h-12 border-t">
        {recipeSteps.map((step, index) => (
          <div
            key={index}
            className="border-border relative flex-1 border-r"
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
    </div>
  );
};

export default RecipeSlideShowPage;
