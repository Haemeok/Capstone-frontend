import { useEffect, useState } from "react";

import {
  type AIModelId,
  aiModels,
  aiModelSteps,
} from "@/shared/config/constants/aiModel";

type AiLoadingProps = {
  aiModelId: AIModelId;
};

const AiLoading = ({ aiModelId }: AiLoadingProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const aiModel = aiModels[aiModelId];
  const { name, } = aiModel;


  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % aiModelSteps.length);
    }, 3000);

    return () => {
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="flex w-full min-h-[calc(100dvh-77px)] flex-col items-center justify-center gap-6  p-4">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold text-dark">
          {name}가 레시피를 만들고 있어요
        </h1>
        <p className="text-lg text-gray-600 animate-pulse">
          {aiModelSteps[currentStep]}
        </p>
      </div>

      <div className="max-w-sm text-center space-y-3">
        <div className="bg-olive-mint/10 rounded-2xl p-4">
          <p className="text-olive-mint font-bold mb-2">💡 잠깐!</p>
          <p className="text-gray-700 text-sm leading-relaxed">
            다른 작업을 해도 괜찮아요!
            <br />
            다른 페이지를 둘러보시거나 냉장고를 확인해보세요.
            <br />
            레시피가 완성되면 알려드릴게요.
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-500">평균 40초~1분 내 완성됩니다!</p>
    </div>
  );
};

export default AiLoading;
