import React from "react";

import type { AIModel } from "@/shared/config/constants/aiModel";
import { useT } from "@/shared/i18n";

type AICharacterSectionProps = {
  selectedAI: AIModel;
};

const AiCharacterSection = ({ selectedAI }: AICharacterSectionProps) => {
  const t = useT();
  return (
    <>
      <div className="text-center">
        <p className="text-ink text-xl font-bold">
          {t.aiRecipe.models[selectedAI.id].name}
          {t.aiRecipe.form.aiCharacter.withSuffix}
        </p>
        <p className="text-ink text-xl font-bold">
          {t.aiRecipe.form.aiCharacter.subtitle}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 py-4">
        <p className="text-ink-sub mt-2 text-center text-sm">
          {t.aiRecipe.models[selectedAI.id].description}
        </p>
      </div>
    </>
  );
};

export default AiCharacterSection;
