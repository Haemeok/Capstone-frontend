"use client";

import { useRouter } from "next/navigation";

import { triggerHaptic } from "@/shared/lib/bridge";
import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";

import type { DetailedRecipeGridItem } from "@/entities/recipe/model/types";

import FloatingCreateRecipeButton from "@/features/recipe-create/ui/FloatingCreateRecipeButton";
import { SearchInput } from "@/features/search-input";

import RecipeSlide from "@/widgets/RecipeSlide/RecipeSlide";

import ContentPageGrid from "./ui/ContentPageGrid";
import NutritionThemeSection from "./ui/NutritionThemeSection";
import PriceRangeSection from "./ui/PriceRangeSection";
import RecentlyViewedRecipes from "./ui/RecentlyViewedRecipes";
import RecentSearchChips from "./ui/RecentSearchChips";
import SaveButton from "./ui/SaveButton";

const LATEST_RECIPES_HREF = "/search/results?sort=createdAt%2CDESC";

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

  const handleBack = () => {
    triggerHaptic("Light");
    router.push("/search", { scroll: false });
  };

  return (
    <Container className="pt-0">
      <div className={focused ? "min-h-dvh space-y-4 pb-10" : "space-y-6 pb-10"}>
        {/* 검색바 + 좌/우 버튼 */}
        <div className="sticky top-0 z-10 -mx-4 bg-white px-4 pb-2 pt-4 md:-mx-6 md:px-6">
          <div className="flex items-center gap-2">
            {focused && (
              <PrevButton onClick={handleBack} size={24} className="shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <SearchInput onFocus={focused ? undefined : handleSearchFocus} />
            </div>
            {!focused && <SaveButton />}
          </div>
        </div>

        {focused ? (
          <>
            <RecentSearchChips />
            <RecentlyViewedRecipes />
          </>
        ) : (
          <>
            <RecipeSlide
              title="따끈따끈한 최신 레시피"
              to={LATEST_RECIPES_HREF}
              recipes={latestRecipes}
              isLoading={false}
              error={null}
            />

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
      {!focused && <FloatingCreateRecipeButton />}
    </Container>
  );
};

export default SearchDiscoveryClient;
