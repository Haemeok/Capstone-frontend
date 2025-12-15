import { Sparkles } from "lucide-react";

const BudgetHeader = () => {
  return (
    <div className="space-y-4 text-center">
      <div className="flex items-center justify-center gap-2">
        <Sparkles className="text-olive-light h-8 w-8" />
        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
          가성비 레시피 추천
        </h1>
        <Sparkles className="text-olive-light h-8 w-8" />
      </div>
      <p className="text-base text-gray-600 md:text-lg">
        예산과 선호하는 음식 종류를 선택하면
        <br />
        딱 맞는 가성비 레시피를 추천해드려요
      </p>
    </div>
  );
};

export default BudgetHeader;
