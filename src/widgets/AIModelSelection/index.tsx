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
    <div className="flex h-screen w-full items-center justify-center overflow-hidden p-4">
      <div className="flex w-full max-w-7xl flex-col items-center gap-6">
        <p className="text-dark text-center text-2xl font-bold">
          레시피를 생성할 AI를 선택해주세요.
        </p>

        <div className="md:hidden w-full">
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
                      className="relative flex aspect-[2/3] w-full flex-col overflow-hidden rounded-xl bg-gray-100 shadow-lg transition-all active:scale-[0.98]"
                    >
                      <div className="absolute inset-0">
                        <Image
                          src={ai.image}
                          alt={ai.name}
                          wrapperClassName="w-full h-full"
                          imgClassName="object-cover"
                          fit="cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      </div>

                      <div className="relative z-10 flex h-full flex-col justify-end p-6 text-left">
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

        <div className="hidden md:grid w-full max-w-4xl grid-cols-2 gap-6">
          {Object.values(aiModels).map((ai) => {
            return (
              <button
                key={ai.id}
                onClick={() => authenticatedSelectAI(ai.id)}
                className="relative flex aspect-[4/5] w-full flex-col overflow-hidden rounded-xl bg-gray-100 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0">
                  <Image
                    src={ai.image}
                    alt={ai.name}
                    wrapperClassName="w-full h-full"
                    imgClassName="object-cover"
                    fit="cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                </div>

                <div className="relative z-10 flex h-full flex-col justify-end p-6 text-left">
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
