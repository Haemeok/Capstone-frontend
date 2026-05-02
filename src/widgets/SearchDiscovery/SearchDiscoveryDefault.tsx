"use client";

import { useRouter } from "next/navigation";

import { Container } from "@/shared/ui/Container";

import FloatingCreateRecipeButton from "@/features/recipe-create/ui/FloatingCreateRecipeButton";
import { SearchInput } from "@/features/search-input";

import ContentPageGrid from "./ui/ContentPageGrid";
import LatestRecipesSlide from "./ui/LatestRecipesSlide";
import NutritionThemeSection from "./ui/NutritionThemeSection";
import PriceRangeSection from "./ui/PriceRangeSection";
import SaveButton from "./ui/SaveButton";

const SearchDiscoveryDefault = () => {
  const router = useRouter();

  const handleSearchFocus = () => {
    router.push("/search?focused=1", { scroll: false });
  };

  return (
    <Container className="pt-0">
      <div className="space-y-6 pb-10">
        <div className="sticky top-0 z-10 -mx-4 bg-white px-4 pb-2 pt-4 md:-mx-6 md:px-6">
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <SearchInput onFocus={handleSearchFocus} />
            </div>
            <SaveButton />
          </div>
        </div>

        <LatestRecipesSlide />

        <section className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">
            이런 레시피 어때요?
          </h3>
          <ContentPageGrid />
        </section>

        <NutritionThemeSection />

        <PriceRangeSection />
      </div>
      <FloatingCreateRecipeButton />
    </Container>
  );
};

export default SearchDiscoveryDefault;
