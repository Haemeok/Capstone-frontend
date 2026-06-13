import { Metadata } from "next";

import { BottomAnchorAdSlot } from "@/shared/adsense";
import {
  buildHreflangAlternates,
  DictionaryProvider,
  getDictionary,
} from "@/shared/i18n";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import BudgetRecipe from "@/widgets/BudgetRecipe";

export const metadata: Metadata = {
  title: getDictionary("ja").aiRecipe.price.pageTitle,
  description: getDictionary("ja").aiRecipe.price.pageDescription,
  openGraph: { locale: "ja_JP" },
  alternates: { languages: buildHreflangAlternates("recipes/new/ai/price") },
};

const BudgetRecipePage = () => {
  const dict = getDictionary("ja");
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
