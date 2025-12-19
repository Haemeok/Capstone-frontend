import React from "react";

import { Image } from "@/shared/ui/image/Image";

import { AIModel } from "@/features/recipe-create-ai";

type AICharacterSectionProps = {
  selectedAI: AIModel;
};

const AiCharacterSection = ({ selectedAI }: AICharacterSectionProps) => {
  return (
    <>
      <div className="text-center">
        <p className="text-dark text-xl font-bold">{selectedAI.name}와 함께</p>
        <p className="text-dark text-xl font-bold">
          맞춤형 레시피를 생성해보세요 !
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 py-4">
        <p className="mt-2 text-center text-sm text-gray-600">
          {selectedAI.description}
        </p>
      </div>
    </>
  );
};

export default AiCharacterSection;
