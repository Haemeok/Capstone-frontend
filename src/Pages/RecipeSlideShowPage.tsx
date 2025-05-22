import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { X, Share, Star, Bookmark } from 'lucide-react';
import { useEffect, useState } from 'react';
import SlideShowContent from '@/components/SlideShowContent';
import { Recipe, RecipeStep } from '@/type/recipe';
import { useLocation, useNavigate, useParams } from 'react-router';
import SuspenseImage from '@/components/Image/SuspenseImage';
import { useToggleRecipeFavorite } from '@/hooks/useToggleMutations';
import useAuthenticatedAction from '@/hooks/useAuthenticatedAction';
import useRecipeDetailQuery from '@/hooks/useRecipeDetailQuery';

const RecipeSlideShowPage = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [scrollProgress, setScrollProgress] = useState(0);

  const navigate = useNavigate();
  const { recipeId } = useParams();
  const { recipeData: recipe } = useRecipeDetailQuery(Number(recipeId));
  const { mutate: toggleRecipeFavorite } = useToggleRecipeFavorite(recipe.id);

  const TOTAL_STEPS = recipe.steps.length + 1;
  const recipeSteps = recipe.steps;

  useEffect(() => {
    if (!api) {
      return;
    }

    const onScroll = () => {
      const progress = api.scrollProgress();
      setScrollProgress(progress);
    };

    api.on('scroll', onScroll);

    setScrollProgress(api.scrollProgress());

    return () => {
      api.off('scroll', onScroll);
    };
  }, [api]);

  const handleProgressClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  const getStepProgress = (stepIndex: number) => {
    const stepSize = 1 / TOTAL_STEPS;
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

  const handleRecipeFavorite = useAuthenticatedAction(toggleRecipeFavorite);
  return (
    <div className="bg-background text-foreground relative flex h-screen flex-col">
      <div className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between p-4">
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
        className="flex h-full flex-grow flex-col overflow-hidden"
      >
        <CarouselContent className="-ml-0 h-full flex-grow">
          {recipeSteps.map((step, index) => (
            <CarouselItem key={index} className="h-full pl-0">
              <SlideShowContent step={step} totalSteps={TOTAL_STEPS} />
            </CarouselItem>
          ))}
          <CarouselItem
            key={TOTAL_STEPS}
            className="flex h-full flex-col items-center justify-center gap-3 px-4"
          >
            <SuspenseImage
              src={recipe.imageUrl}
              alt={recipe.title}
              className="h-1/2 w-2/3 rounded-2xl object-cover"
            />
            <p className="text-md text-dark">
              {recipe.author.nickname}님의 {recipe.title} 어떠셨나요?
            </p>
            <Button
              size="lg"
              className="bg-olive-mint w-full text-white"
              onClick={() => handleRecipeFavorite()}
            >
              <Bookmark className="mr-2 h-4 w-4" /> 저장하기
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => navigate(`/recipes/${recipe.id}/rate`)}
            >
              <Star className="mr-2 h-4 w-4" /> 평가하기
            </Button>
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
        <div className="bg-muted border-border relative h-full w-12 flex-1 items-center justify-center border-l">
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
