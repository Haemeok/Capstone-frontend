import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { X, Share, Star, Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import SlideShowContent from "@/components/SlideShowContent";
import { RecipeStep } from "@/type/recipe";
import { useLocation, useNavigate } from "react-router";

const RecipeSlideShowPage = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [scrollProgress, setScrollProgress] = useState(0);
  const navigate = useNavigate();
  const { recipeSteps } = useLocation().state as { recipeSteps: RecipeStep[] };
  const TOTAL_STEPS = recipeSteps.length + 1;

  useEffect(() => {
    if (!api) {
      return;
    }

    const onScroll = () => {
      const progress = api.scrollProgress();
      setScrollProgress(progress);
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

  const getStepProgress = (stepIndex: number) => {
    const totalSteps = recipeSteps.length;
    const stepSize = 1 / totalSteps;
    const stepStart = stepSize * stepIndex;
    const stepEnd = stepSize * (stepIndex + 1);

    if (scrollProgress < stepStart) {
      return 0;
    } else if (scrollProgress >= stepEnd) {
      return 100;
    }

    const stepProgress = ((scrollProgress - stepStart) / stepSize) * 100;
    return stepProgress;
  };
  return (
    <div className="relative flex flex-col h-screen bg-background text-foreground">
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/30 text-white hover:bg-black/50"
          onClick={() => navigate(-1)}
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
        className="h-full flex-grow flex flex-col overflow-hidden"
      >
        <CarouselContent className="-ml-0 flex-grow h-full">
          {recipeSteps.map((step, index) => (
            <CarouselItem key={index} className="pl-0 h-full">
              <SlideShowContent step={step} totalSteps={TOTAL_STEPS} />
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
      </Carousel>

      <div className="flex h-12 border-t border-border bg-background">
        {recipeSteps.map((step, index) => (
          <div
            key={index}
            className="flex-1 relative border-r border-border"
            onClick={() => handleProgressClick(index)}
          >
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
        <div className="w-12 h-full flex items-center justify-center bg-muted border-l border-border">
          <Bookmark className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

export default RecipeSlideShowPage;
