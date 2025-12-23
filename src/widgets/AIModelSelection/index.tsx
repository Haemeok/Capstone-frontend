"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";

import { aiModels, AIModelId } from "@/shared/config/constants/aiModel";
import { Image } from "@/shared/ui/image/Image";
import useAuthenticatedAction from "@/features/auth/model/hooks/useAuthenticatedAction";
import { cn } from "@/shared/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/shadcn/carousel";

const AIModelSelection = () => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const targetDate = new Date("2025-12-23T00:00:00");

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft("OPEN!");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}일 ${hours}시간 ${minutes}분 ${seconds}초`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
        break;
    }
  };

  const authenticatedSelectAI = useAuthenticatedAction<AIModelId, void>(
    navigateToModel,
    { notifyOnly: true }
  );

  return (
    <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-6 py-4">
      <p className="text-dark text-center text-2xl font-bold">
        레시피를 생성할 AI를 선택해주세요.
      </p>

      <Carousel
        opts={{
          align: "center",
          loop: false,
        }}
        className="w-full max-w-sm"
      >
        <CarouselContent className="-ml-4">
          {Object.values(aiModels).map((ai) => {
            const isFineDining = ai.id === "FINE_DINING";

            return (
              <CarouselItem key={ai.id} className="basis-[85%] pl-4">
                <button
                  onClick={() => !isFineDining && authenticatedSelectAI(ai.id)}
                  disabled={isFineDining}
                  className={cn(
                    "relative flex aspect-[2/3] w-full flex-col overflow-hidden rounded-xl bg-gray-100 shadow-lg transition-all",
                    !isFineDining && "active:scale-[0.98]",
                    isFineDining && "cursor-not-allowed"
                  )}
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

                  {isFineDining && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                      <div className="flex flex-col items-center rounded-xl bg-black/60 px-5 py-4 text-white backdrop-blur-md">
                        <Clock className="text-olive-light mb-2 h-8 w-8" />
                        <p className="text-olive-light mb-1 text-xs font-bold">
                          COMING SOON
                        </p>
                        <p className="font-mono text-base font-bold tracking-widest">
                          {timeLeft || "Loading..."}
                        </p>
                      </div>
                    </div>
                  )}
                </button>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
};

export default AIModelSelection;
