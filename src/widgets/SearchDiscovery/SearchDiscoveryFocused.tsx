"use client";

import { useRouter } from "next/navigation";

import { triggerHaptic } from "@/shared/lib/bridge";
import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";

import { SearchInput } from "@/features/search-input";

import RecentlyViewedRecipes from "./ui/RecentlyViewedRecipes";
import RecentSearchChips from "./ui/RecentSearchChips";

const SearchDiscoveryFocused = () => {
  const router = useRouter();

  const handleBack = () => {
    triggerHaptic("Light");
    router.push("/search", { scroll: false });
  };

  return (
    <Container className="pt-0">
      <div className="min-h-dvh space-y-4 pb-10">
        <div className="sticky top-0 z-10 -mx-4 bg-white px-4 pb-2 pt-4 md:-mx-6 md:px-6">
          <div className="flex items-center gap-2">
            <PrevButton onClick={handleBack} size={24} className="shrink-0" />
            <div className="min-w-0 flex-1">
              <SearchInput />
            </div>
          </div>
        </div>

        <RecentSearchChips />
        <RecentlyViewedRecipes />
      </div>
    </Container>
  );
};

export default SearchDiscoveryFocused;
