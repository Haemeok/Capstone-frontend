import * as React from "react";

import { Card, CardContent } from "@/components/ui/card"; // Assuming Card components exist
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"; // Assuming Carousel components exist
import { Button } from "@/components/ui/button"; // Assuming Button component exists
import { X, Share, Star, Bookmark } from "lucide-react"; // Assuming lucide-react is installed
import { RecipeSteps } from "@/mock";

const TOTAL_STEPS = RecipeSteps.length + 1;

export default function RecipeSlideShowPage() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    const onScroll = () => {
      const progress = api.scrollProgress();
      setScrollProgress(progress);
    };
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
    api.on("scroll", onScroll);

    // 초기 스크롤 프로그레스 값 설정
    setScrollProgress(api.scrollProgress());

    return () => {
      api.off("scroll", onScroll);
    };
  }, [api]);

  const currentStepData = RecipeSteps[current - 1] || RecipeSteps[0];

  const isLastStep = current === TOTAL_STEPS;
  console.log(current, TOTAL_STEPS, isLastStep);
  const getStepProgress = (stepIndex: number) => {
    const totalSteps = RecipeSteps.length;
    const stepSize = 1 / totalSteps; // 각 단계당 차지하는 비율
    const stepStart = stepSize * stepIndex; // 해당 단계의 시작 지점
    const stepEnd = stepSize * (stepIndex + 1); // 해당 단계의 끝 지점

    // 현재 스크롤 진행도가 해당 단계를 얼마나 지났는지 계산
    if (scrollProgress < stepStart) {
      return 0; // 아직 해당 단계에 도달하지 않음
    } else if (scrollProgress >= stepEnd) {
      return 100; // 해당 단계를 완전히 통과
    } else {
      // 해당 단계 내에서의 진행도 계산
      const stepProgress = ((scrollProgress - stepStart) / stepSize) * 100;
      return stepProgress;
    }
  };
  return (
    <div className="relative flex flex-col h-screen bg-background text-foreground">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/30 text-white hover:bg-black/50"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">닫기</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/30 text-white hover:bg-black/50"
        >
          <Share className="h-5 w-5" />
          <span className="sr-only">공유하기</span>
        </Button>
      </div>

      {/* Carousel */}
      <Carousel
        setApi={setApi}
        className="h-full flex-grow flex flex-col overflow-hidden"
      >
        <CarouselContent className="-ml-0 flex-grow h-full">
          {RecipeSteps.map((step, index) => (
            <CarouselItem key={index} className="pl-0 h-full">
              <div className="flex flex-col h-full">
                {/* Image Area */}
                <div className="relative h-3/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={step.stepImageUrl}
                    alt={`Step ${step.stepNumber}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Image Overlay for Step Number? (Optional based on exact design) */}
                  {/* <div className="absolute top-4 right-4 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded">
                     {step.step} / {TOTAL_STEPS}
                   </div> */}
                </div>

                {/* Content Area */}
                <div className="p-6 h-full">
                  {step.ingredients && step.ingredients.length > 0 && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                      {/* Placeholder for equipment icons */}
                      {step.ingredients.map((ingredient) => (
                        <span
                          key={ingredient.id}
                          className="bg-muted px-2 py-1 rounded text-xs"
                        >
                          {ingredient.name}
                        </span>
                      ))}
                    </div>
                  )}
                  {step.instruction && (
                    <h2 className="text-2xl font-bold mb-4">
                      {step.instruction}
                    </h2>
                  )}
                  <div className="prose prose-sm max-w-none">
                    {typeof step.instruction === "string" ? (
                      <p>{step.instruction}</p>
                    ) : (
                      step.instruction
                    )}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
          <CarouselItem key={TOTAL_STEPS} className="pl-0 h-full">
            <div className="mt-8 flex flex-col space-y-3">
              <Button
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Bookmark className="mr-2 h-4 w-4" /> 저장하기
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                <Star className="mr-2 h-4 w-4" /> 평가하기
              </Button>
            </div>
          </CarouselItem>
        </CarouselContent>
        {/* Hide default navigation buttons */}
        {/* <CarouselPrevious /> */}
        {/* <CarouselNext /> */}
      </Carousel>

      {/* Progress Indicator */}
      <div className="flex h-12 border-t border-border bg-background">
        {RecipeSteps.map((step, index) => (
          <div key={index} className="flex-1 relative border-r border-border">
            <div className="flex items-center justify-center h-full">
              <span className="text-xs font-medium text-muted-foreground absolute top-1 left-2 z-10">
                {`0${index + 1}`}
              </span>
            </div>
            <div
              className="absolute bottom-0 left-0 h-full bg-[#53be67]"
              style={{ width: `${getStepProgress(index - 1)}%` }}
            />
          </div>
        ))}
        {/* Bookmark Icon at the end */}
        <div className="w-12 h-full flex items-center justify-center bg-muted border-l border-border">
          <Bookmark className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
