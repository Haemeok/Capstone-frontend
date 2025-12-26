"use client";

import { useRouter } from "next/navigation";

import { aiModels, AIModelId } from "@/shared/config/constants/aiModel";
import { Image } from "@/shared/ui/image/Image";
import useAuthenticatedAction from "@/features/auth/model/hooks/useAuthenticatedAction";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/shared/ui/shadcn/carousel";

const AIModelSelection = () => {
  const router = useRouter();

  const navigateToModel = (modelId: AIModelId) => {
    switch (modelId) {
      case "INGREDIENT_FOCUS":
        router.push("/recipes/new/ai/ingredient");
        break;
      case "COST_EFFECTIVE":
        router.push("/recipes/new/ai/price");
        break;
      case "NUTRITION_BALANCE":
        router.push("/recipes/new/ai/nutrition");
        break;
      case "FINE_DINING":
        router.push("/recipes/new/ai/finedining");
        break;
    }
  };

  const authenticatedSelectAI = useAuthenticatedAction<AIModelId, void>(
    navigateToModel,
    { notifyOnly: true }
  );

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="flex w-full max-w-5xl flex-col items-center gap-8">
        <p className="text-dark text-center text-xl font-bold md:text-3xl">
          어떤 AI와 함께 요리할까요?
        </p>

        <div className="w-full md:hidden">
          <Carousel
            opts={{
              align: "center",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {Object.values(aiModels).map((ai) => {
                return (
                  <CarouselItem key={ai.id} className="basis-[85%] pl-4">
                    <button
                      onClick={() => authenticatedSelectAI(ai.id)}
                      className="grid w-full cursor-pointer overflow-hidden rounded-2xl bg-gray-100 shadow-lg transition-all active:scale-[0.98]"
                    >
                      <Image
                        src={ai.image}
                        alt={ai.name}
                        wrapperClassName="col-start-1 row-start-1 h-full w-full"
                        imgClassName="object-cover"
                        fit="cover"
                      />
                      <div className="z-10 col-start-1 row-start-1 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      <div className="z-20 col-start-1 row-start-1 flex h-full flex-col justify-end p-6 text-left">
                        <p className="text-2xl font-bold text-white">
                          {ai.name}
                        </p>
                        <p className="mt-2 text-sm font-light text-white/90">
                          {ai.description}
                        </p>
                      </div>
                    </button>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="hidden w-full grid-cols-2 gap-6 md:grid">
          {Object.values(aiModels).map((ai) => {
            return (
              <button
                key={ai.id}
                onClick={() => authenticatedSelectAI(ai.id)}
                className="grid w-full cursor-pointer overflow-hidden rounded-2xl bg-gray-100 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Image
                  src={ai.image}
                  alt={ai.name}
                  wrapperClassName="col-start-1 row-start-1 h-full w-full"
                  imgClassName="object-cover"
                  fit="cover"
                />
                <div className="z-10 col-start-1 row-start-1 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="z-20 col-start-1 row-start-1 flex h-full flex-col justify-end p-6 text-left">
                  <p className="text-2xl font-bold text-white">{ai.name}</p>
                  <p className="mt-2 text-sm font-light text-white/90">
                    {ai.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AIModelSelection;
