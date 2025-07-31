"use client";

import Image from "next/image";

import { aiModels } from "@/shared/config/constants/aiModel";

import {
  type AIModel,
  useAIRecipeGeneration,
} from "@/features/recipe-create-ai";

const AIModelSelection = () => {
  const { selectAI } = useAIRecipeGeneration();

  const handleSelectAI = (ai: AIModel) => {
    selectAI(ai);
  };

  return (
    <div className="mx-auto flex h-full flex-col items-center justify-center gap-4 bg-[#f7f7f7] p-4">
      <p className="text-dark text-center text-2xl font-semibold">
        레시피를 생성할 AI를 선택해주세요.
      </p>
      <div className="grid grid-cols-2 gap-6">
        {Object.values(aiModels).map((ai) => (
          <button
            key={ai.id}
            onClick={() => handleSelectAI(ai)}
            className="flex flex-col items-center rounded-2xl border bg-white px-4 py-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            <div className="relative h-48 w-full rounded-2xl mb-4">
              <img
                src={ai.image}
                alt={ai.name}
                className="rounded-2xl object-cover"
              />
            </div>
            <p className="text-dark text-lg font-medium">{ai.name}</p>
            <p className="mt-2 text-center text-sm text-gray-600">
              {ai.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AIModelSelection;
