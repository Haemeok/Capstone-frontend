"use client";

import { Container } from "@/shared/ui/Container";

import { SearchInput } from "@/features/search-input";

import ContentPageGrid from "./ui/ContentPageGrid";
import NutritionThemeSection from "./ui/NutritionThemeSection";
import PriceRangeSection from "./ui/PriceRangeSection";
import RecentlyViewedRecipes from "./ui/RecentlyViewedRecipes";
import RecentSearchChips from "./ui/RecentSearchChips";

const SearchDiscoveryClient = () => {
  return (
    <Container>
      <div className="space-y-8 pb-10">
        {/* 검색바 */}
        <div className="sticky top-0 z-10 -mx-4 bg-white px-4 pb-2 pt-4 md:-mx-6 md:px-6">
          <SearchInput />
        </div>

        {/* 최근 검색어 */}
        <RecentSearchChips />

        {/* 최근 본 레시피 */}
        <RecentlyViewedRecipes />

        {/* 추천 컬렉션 */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">
            🍳 이런 레시피 어때요?
          </h3>
          <ContentPageGrid />
        </section>

        {/* 목표별 레시피 */}
        <NutritionThemeSection />

        {/* 예산별 레시피 */}
        <PriceRangeSection />
      </div>
    </Container>
  );
};

export default SearchDiscoveryClient;
