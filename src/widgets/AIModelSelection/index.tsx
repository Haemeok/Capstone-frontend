"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import { aiModels, AIModelId } from "@/shared/config/constants/aiModel";
import { Image } from "@/shared/ui/image/Image";
import { useUserStore } from "@/entities/user/model/store";

const LoginEncourageDrawer = dynamic(
  () => import("@/widgets/LoginEncourageDrawer"),
  { ssr: false }
);

const AIModelSelection = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(false);

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

  const handleSelectAI = (modelId: AIModelId) => {
    if (!user) {
      setIsLoginDrawerOpen(true);
      return;
    }
    navigateToModel(modelId);
  };

  return (
    <>
      <div className="flex h-full w-full items-center justify-center p-4">
        <div className="flex h-full w-full flex-col items-center justify-center gap-6 md:gap-8">
          <p className="text-dark text-center text-xl font-bold md:text-3xl">
            어떤 AI와 함께 요리할까요?
          </p>

          <div className="grid w-full grid-cols-2 gap-3 py-4 md:gap-6">
            {Object.values(aiModels).map((ai) => {
              return (
                <button
                  key={ai.id}
                  onClick={() => handleSelectAI(ai.id)}
                  className="grid aspect-[3/4] max-h-[500px] w-full cursor-pointer overflow-hidden rounded-2xl bg-gray-100 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Image
                    src={ai.image}
                    alt={ai.name}
                    wrapperClassName="col-start-1 row-start-1 h-full w-full"
                    imgClassName="object-cover"
                    fit="cover"
                  />
                  <div className="pointer-events-none z-10 col-start-1 row-start-1 h-full w-full bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="z-20 col-start-1 row-start-1 flex h-full flex-col justify-end p-4 text-left md:p-6">
                    <p className="text-lg font-bold text-white md:text-2xl">
                      {ai.name}
                    </p>
                    <p className="mt-1 text-xs font-light text-pretty break-keep text-white/90 md:mt-2 md:text-sm">
                      {ai.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <LoginEncourageDrawer
        isOpen={isLoginDrawerOpen}
        onOpenChange={setIsLoginDrawerOpen}
        message="AI와 함께 레시피를 만들어보세요!"
      />
    </>
  );
};

export default AIModelSelection;
