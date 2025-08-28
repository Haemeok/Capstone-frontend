import { AIModel } from "@/features/recipe-create-ai";
import SuspenseImage from "@/shared/ui/image/SuspenseImage";
import React from "react";

type AICharacterSectionProps = {
  selectedAI: AIModel;
};

const AiCharacterSection = ({ selectedAI }: AICharacterSectionProps) => {
  return (
    <>
      <div className="text-center">
        <p className="text-dark text-xl font-semibold">
          {selectedAI.name}와 함께
        </p>
        <p className="text-dark text-xl font-semibold">
          맞춤형 레시피를 생성해보세요 !
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 py-4">
        <div className="h-80 w-full rounded-2xl">
          <SuspenseImage
            src={selectedAI.image}
            alt={selectedAI.name}
            className="rounded-2xl object-cover w-full h-full"
            fill
          />
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">
          {selectedAI.description}
        </p>
      </div>
    </>
  );
};

export default AiCharacterSection;
