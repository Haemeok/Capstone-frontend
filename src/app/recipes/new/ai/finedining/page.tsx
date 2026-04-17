import { Metadata } from "next";

import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import FineDiningRecipe from "@/widgets/FineDiningRecipe";

export const metadata: Metadata = {
  title: "파인 다이닝 레시피 생성 | Recipio",
  description: "우리 집 식탁을 고급 레스토랑처럼. AI가 제안하는 파인 다이닝 레시피를 만나보세요.",
};

const FineDiningPage = () => {
  return (
    <ErrorBoundary
      fallback={
        <SectionErrorFallback message="AI 레시피 생성 중 문제가 발생했어요" />
      }
    >
      <FineDiningRecipe />
    </ErrorBoundary>
  );
};

export default FineDiningPage;
