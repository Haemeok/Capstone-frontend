"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { AIModelId, aiModels } from "@/shared/config/constants/aiModel";
import { useT } from "@/shared/i18n";
import { Image } from "@/shared/ui/image/Image";

import { useUserStore } from "@/entities/user/model/store";

const LoginEncourageDrawer = dynamic(
  () => import("@/widgets/LoginEncourageDrawer"),
  { ssr: false }
);

const AIModelSelection = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const t = useT();
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
          <p className="text-ink text-center text-xl font-semibold md:text-3xl">
            {t.aiRecipe.modelSelectHeading}
          </p>

          <div className="grid w-full grid-cols-2 gap-3 py-4 md:gap-6">
            {Object.values(aiModels).map((ai) => {
              return (
                <button
                  key={ai.id}
                  onClick={() => handleSelectAI(ai.id)}
                  className="rounded-card grid aspect-[3/4] max-h-[500px] w-full cursor-pointer overflow-hidden bg-gray-100 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Image
                    src={ai.image}
                    alt={t.aiRecipe.models[ai.id].name}
                    wrapperClassName="col-start-1 row-start-1 h-full w-full"
                    imgClassName="object-cover"
                    fit="cover"
                  />
                  <div className="pointer-events-none z-10 col-start-1 row-start-1 h-full w-full bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="z-20 col-start-1 row-start-1 flex h-full flex-col justify-end p-4 text-left md:p-6">
                    <p className="text-lg font-bold text-white md:text-2xl">
                      {t.aiRecipe.models[ai.id].name}
                    </p>
                    <p className="mt-1 text-xs font-light text-pretty break-keep text-white/90 md:mt-2 md:text-sm">
                      {t.aiRecipe.models[ai.id].description}
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
        message={t.aiRecipe.loginDrawerMessage}
      />
    </>
  );
};

export default AIModelSelection;
