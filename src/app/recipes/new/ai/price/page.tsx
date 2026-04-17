import { Metadata } from "next";

import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import BudgetRecipe from "@/widgets/BudgetRecipe";

export const metadata: Metadata = {
  title: "가성비 레시피 생성 | Recipio",
  description:
    "예산에 맞는 가성비 레시피를 AI가 생성해드립니다. 직장인 평균 한끼보다 저렴하게 맛있는 요리를 즐겨보세요.",
};

const BudgetRecipePage = () => {
  return (
    <ErrorBoundary
      fallback={
        <SectionErrorFallback message="AI 레시피 생성 중 문제가 발생했어요" />
      }
    >
      <BudgetRecipe />
    </ErrorBoundary>
  );
};

export default BudgetRecipePage;
