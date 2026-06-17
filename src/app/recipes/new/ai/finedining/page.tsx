import { Metadata } from "next";

import { BottomAnchorAdSlot } from "@/shared/adsense";
import { DictionaryProvider, getDictionary } from "@/shared/i18n";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import FineDiningRecipe from "@/widgets/FineDiningRecipe";

export const metadata: Metadata = {
  // i18n-ignore: ko SEO 메타데이터
  title: "파인 다이닝 레시피 생성 | Recipio",
  description:
    // i18n-ignore: ko SEO 메타데이터
    "우리 집 식탁을 고급 레스토랑처럼. AI가 제안하는 파인 다이닝 레시피를 만나보세요.",
};

const FineDiningPage = () => {
  const dict = getDictionary("ko");
  return (
    <DictionaryProvider dict={dict}>
      <ErrorBoundary
        fallback={
          <SectionErrorFallback message={dict.aiRecipe.errorFallback} />
        }
      >
        <FineDiningRecipe />
      </ErrorBoundary>
      <BottomAnchorAdSlot />
    </DictionaryProvider>
  );
};

export default FineDiningPage;
