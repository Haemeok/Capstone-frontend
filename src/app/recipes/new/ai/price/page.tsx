import { Metadata } from "next";

import { BottomAnchorAdSlot } from "@/shared/adsense";
import { DictionaryProvider, getDictionary } from "@/shared/i18n";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import BudgetRecipe from "@/widgets/BudgetRecipe";

export const metadata: Metadata = {
  // i18n-ignore: ko SEO 메타데이터
  title: "가성비 레시피 생성 | Recipio",
  description:
    // i18n-ignore: ko SEO 메타데이터
    "예산에 맞는 가성비 레시피를 AI가 생성해드립니다. 직장인 평균 한끼보다 저렴하게 맛있는 요리를 즐겨보세요.",
};

const BudgetRecipePage = () => {
  const dict = getDictionary("ko");
  return (
    <DictionaryProvider dict={dict}>
      <ErrorBoundary
        fallback={
          <SectionErrorFallback message={dict.aiRecipe.errorFallback} />
        }
      >
        <BudgetRecipe />
      </ErrorBoundary>
      <BottomAnchorAdSlot />
    </DictionaryProvider>
  );
};

export default BudgetRecipePage;
