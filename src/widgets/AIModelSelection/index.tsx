"use client";

import { aiModels } from "@/shared/config/constants/aiModel";
import { Image } from "@/shared/ui/image/Image";

import {
  type AIModel,
  useAIRecipeGeneration,
} from "@/features/recipe-create-ai";
import useAuthenticatedAction from "@/features/auth/model/hooks/useAuthenticatedAction";

const AIModelSelection = () => {
  const { selectAI } = useAIRecipeGeneration();

  const authenticatedSelectAI = useAuthenticatedAction<AIModel, undefined>(
    selectAI,
    { notifyOnly: true }
  );

  const handleSelectAI = (ai: AIModel) => {
    authenticatedSelectAI(ai);
  };

  return (
    <div className="mx-auto flex h-full flex-col items-center justify-center gap-4 bg-[#f7f7f7] p-4">
      <p className="text-dark text-center text-2xl font-bold">
        레시피를 생성할 AI를 선택해주세요.
      </p>
      <div className="grid grid-cols-2 gap-6">
        {Object.values(aiModels).map((ai) => (
          <button
            key={ai.id}
            onClick={() => handleSelectAI(ai)}
            className="flex flex-col items-center rounded-2xl border bg-white px-4 py-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
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
          </button>
        ))}
      </div>
    </div>
  );
};

export default AIModelSelection;
