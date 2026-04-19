"use client";

import { useRouter } from "next/navigation";

import { Container } from "@/shared/ui/Container";

import type { DetailedRecipeGridItem } from "@/entities/recipe/model/types";

import { SearchInput } from "@/features/search-input";

import ContentPageGrid from "./ui/ContentPageGrid";
import LatestRecipesSection from "./ui/LatestRecipesSection";
import NutritionThemeSection from "./ui/NutritionThemeSection";
import PriceRangeSection from "./ui/PriceRangeSection";
import RecentlyViewedRecipes from "./ui/RecentlyViewedRecipes";
import RecentSearchChips from "./ui/RecentSearchChips";
import SaveButton from "./ui/SaveButton";

type SearchDiscoveryClientProps = {
  focused: boolean;
  latestRecipes: DetailedRecipeGridItem[];
};

const SearchDiscoveryClient = ({
  focused,
  latestRecipes,
}: SearchDiscoveryClientProps) => {
  const router = useRouter();

  const handleSearchFocus = () => {
    if (!focused) {
      router.push("/search?focused=1", { scroll: false });
    }
  };

  return (
    <Container>
      <div className={focused ? "min-h-dvh space-y-6 pb-10" : "space-y-8 pb-10"}>
        {/* 검색바 + 저장 버튼 */}
        <div className="sticky top-0 z-10 -mx-4 bg-white px-4 pb-2 pt-4 md:-mx-6 md:px-6">
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <SearchInput onFocus={focused ? undefined : handleSearchFocus} />
            </div>
            <SaveButton />
          </div>
        </div>

        {focused ? (
          <>
            <RecentSearchChips />
            <RecentlyViewedRecipes />
          </>
        ) : (
          <>
            <LatestRecipesSection recipes={latestRecipes} />

            <section className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">
                이런 레시피 어때요?
              </h3>
              <ContentPageGrid />
            </section>

            <NutritionThemeSection />

            <PriceRangeSection />
          </>
        )}
      </div>
    </Container>
  );
};

export default SearchDiscoveryClient;
