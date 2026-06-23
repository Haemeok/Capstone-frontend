"use client";

import { useLocalizedRouter } from "@/shared/i18n";
import {
  useSearchDiscoveryDict,
  useSearchDiscoveryLocale,
} from "@/shared/i18n/useSearchDiscoveryDict";
import { Container } from "@/shared/ui/Container";

import { ContentPageGrid } from "@/features/content-pages";
import FloatingCreateRecipeButton from "@/features/recipe-create/ui/FloatingCreateRecipeButton";
import { SearchInput } from "@/features/search-input";

import CookedAgainSlide from "@/widgets/RecipeSlide/CookedAgainSlide";
import CookedPopularSlide from "@/widgets/RecipeSlide/CookedPopularSlide";
import FridgeIngredientSlide from "@/widgets/RecipeSlide/FridgeIngredientSlide";

import LatestRecipesSlide from "./ui/LatestRecipesSlide";
import NutritionThemeSection from "./ui/NutritionThemeSection";
import PriceRangeSection from "./ui/PriceRangeSection";
import SaveButton from "./ui/SaveButton";

const SearchDiscoveryDefault = () => {
  const router = useLocalizedRouter();
  const t = useSearchDiscoveryDict();
  const locale = useSearchDiscoveryLocale();

  const handleSearchFocus = () => {
    router.push("/search?focused=1", { scroll: false });
  };

  return (
    <Container className="pt-0">
      <div className="space-y-6 pb-10">
        <div className="sticky top-0 z-10 -mx-4 bg-white px-4 pt-4 pb-2 md:-mx-6 md:px-6">
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <SearchInput onFocus={handleSearchFocus} />
            </div>
            <SaveButton />
          </div>
        </div>

        <LatestRecipesSlide />

        <FridgeIngredientSlide locale={locale} />
        <CookedAgainSlide locale={locale} />
        <CookedPopularSlide locale={locale} />

        <section className="space-y-4">
          <h3 className="text-ink text-lg font-bold">
            {t.contentSectionTitle}
          </h3>
          <ContentPageGrid />
        </section>

        <section className="space-y-4">
          <h3 className="text-ink text-lg font-bold">
            {t.nutritionSectionTitle}
          </h3>
          <NutritionThemeSection />
        </section>

        {locale === "ko" && <PriceRangeSection />}
      </div>
      <FloatingCreateRecipeButton />
    </Container>
  );
};

export default SearchDiscoveryDefault;
