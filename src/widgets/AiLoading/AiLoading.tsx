"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

import {
  type AIModelId,
  aiModels,
  aiModelSteps,
} from "@/shared/config/constants/aiModel";
import PrevButton from "@/shared/ui/PrevButton";

import { calculateFakeProgress } from "@/features/recipe-create-ai/lib/progress";

type AiLoadingProps = {
  aiModelId: AIModelId;
  progress?: number;
  startTime: number;
};

const UPDATE_INTERVAL_MS = 2000;

const subscribeToInterval = (notify: () => void) => {
  const id = setInterval(notify, UPDATE_INTERVAL_MS);
  return () => clearInterval(id);
};

const useFakeProgress = (startTime: number) => {
  const getSnapshot = useCallback(
    () => calculateFakeProgress(startTime),
    [startTime]
  );
  const getServerSnapshot = useCallback(() => 0, []);

  return useSyncExternalStore(
    subscribeToInterval,
    getSnapshot,
    getServerSnapshot
  );
};

const AiLoading = ({ aiModelId, progress = 0, startTime }: AiLoadingProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const aiModel = aiModels[aiModelId];
  const { name } = aiModel;

  const fakeProgress = useFakeProgress(startTime);
  const displayProgress = Math.max(progress, fakeProgress);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % aiModelSteps.length);
    }, 3000);

    return () => {
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="relative flex min-h-[calc(100dvh-77px)] w-full flex-col items-center justify-center gap-6 p-4">
      <PrevButton className="absolute top-4 left-4 text-gray-600" />

      <div className="flex flex-col items-center gap-2">
        <h1 className="text-dark text-2xl font-bold">
          {name} 레시피를 만들고 있어요
        </h1>
        <p className="animate-pulse text-lg text-gray-600">
          {aiModelSteps[currentStep]}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xs">
        <div className="mb-2 flex justify-between text-sm text-gray-500">
          <span>진행률</span>
          <span>{displayProgress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="bg-olive-light h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${displayProgress}%` }}
          />
        </div>
      </div>

      <div className="max-w-sm space-y-3 text-center">
        <div className="bg-olive-mint/10 rounded-2xl p-4">
          <p className="text-olive-mint mb-2 font-bold">💡 잠깐!</p>
          <p className="text-sm leading-relaxed text-gray-700">
            다른 작업을 해도 괜찮아요!
            <br />
            다른 페이지를 둘러보시거나 냉장고를 확인해보세요.
            <br />
            레시피가 완성되면 알려드릴게요.
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-500">보통 2~3분 정도 걸려요</p>
    </div>
  );
};

export default AiLoading;
