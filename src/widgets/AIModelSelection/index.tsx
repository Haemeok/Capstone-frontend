"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";

import { aiModels, AIModelId } from "@/shared/config/constants/aiModel";
import { Image } from "@/shared/ui/image/Image";
import useAuthenticatedAction from "@/features/auth/model/hooks/useAuthenticatedAction";
import { cn } from "@/shared/lib/utils";

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
    <div className="mx-auto flex h-full flex-col items-center justify-center gap-4 p-4">
      <p className="text-dark text-center text-2xl font-bold">
        레시피를 생성할 AI를 선택해주세요.
      </p>
      <div className="grid grid-cols-2 gap-6">
        {Object.values(aiModels).map((ai) => {
          const isFineDining = ai.id === "FINE_DINING";
          
          return (
            <button
              key={ai.id}
              onClick={() => !isFineDining && authenticatedSelectAI(ai.id)}
              disabled={isFineDining}
              className={cn(
                "relative flex flex-col items-center rounded-2xl border bg-white px-4 py-6 shadow-lg transition-all",
                !isFineDining && "hover:scale-105 hover:shadow-xl",
                isFineDining && "cursor-not-allowed overflow-hidden"
              )}
            >
              <div className={cn("w-full h-full flex flex-col items-center", isFineDining && "blur-sm opacity-50")}>
                <div className="w-full aspect-square rounded-2xl mb-4 overflow-hidden">
                  <Image
                    src={ai.image}
                    alt={ai.name}
                    wrapperClassName="w-full h-full"
                    imgClassName="object-cover"
                    fit="cover"
                  />
                </div>
                <p className="text-dark text-lg font-bold">{ai.name}</p>
                <p className="mt-2 text-center text-sm text-gray-500">
                  {ai.description}
                </p>
              </div>

              {isFineDining && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/10">
                  <div className="flex flex-col items-center rounded-xl bg-black/60 px-4 py-3 text-white backdrop-blur-md">
                    <Clock className="mb-2 h-6 w-6 text-olive-light" />
                    <p className="mb-1 text-xs font-bold text-olive-light">COMING SOON</p>
                    <p className="font-mono text-sm font-bold tracking-widest">
                      {timeLeft || "Loading..."}
                    </p>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AIModelSelection;
