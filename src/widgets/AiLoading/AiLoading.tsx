import { useEffect, useState } from "react";

type AiLoadingProps = {
  name: string;
};

const AiLoading = ({ name }: AiLoadingProps) => {
  const [dots, setDots] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "재료를 분석하고 있어요",
    "맛있는 조합을 찾고 있어요",
    "요리 순서를 정리하고 있어요",
    "마지막 손질을 하고 있어요",
  ];

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 3000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 bg-[#f7f7f7] p-4">
      <div className="relative">
        <div className="loading h-64 w-64 opacity-80"></div>
      </div>

      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">
          {name}가 레시피를 만들고 있어요{dots}
        </h1>

        <p className="text-lg text-gray-600 animate-pulse">
          {steps[currentStep]}
        </p>

        <div className="bg-white rounded-full ">
          <p className="text-sm text-gray-500">평균 40초~1분 내 완성됩니다!</p>
        </div>
      </div>

      <div className="max-w-sm text-center space-y-3">
        <div className="bg-olive-mint/10 rounded-2xl p-4">
          <p className="text-olive-mint font-semibold mb-2">💡 잠깐!</p>
          <p className="text-gray-700 text-sm leading-relaxed">
            다른 작업을 해도 괜찮아요!
            <br />
            다른 페이지를 둘러보시거나 냉장고를 확인해보세요.
            <br />
            레시피가 완성되면 알려드릴게요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiLoading;
