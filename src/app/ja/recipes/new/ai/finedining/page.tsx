import { Metadata } from "next";

import { BottomAnchorAdSlot } from "@/shared/adsense";
import {
  buildHreflangAlternates,
  DictionaryProvider,
  getDictionary,
} from "@/shared/i18n";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import FineDiningRecipe from "@/widgets/FineDiningRecipe";

export const metadata: Metadata = {
  title: getDictionary("ja").aiRecipe.fineDining.pageTitle,
  description: getDictionary("ja").aiRecipe.fineDining.pageDescription,
  openGraph: { locale: "ja_JP" },
  alternates: {
    languages: buildHreflangAlternates("recipes/new/ai/finedining"),
  },
};

const FineDiningPage = () => {
  const dict = getDictionary("ja");
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
