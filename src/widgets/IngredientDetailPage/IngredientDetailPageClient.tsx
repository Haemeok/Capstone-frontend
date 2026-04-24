"use client";

import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";

import type { IngredientDetail } from "@/entities/ingredient";
import type { DetailedRecipeGridItem } from "@/entities/recipe";

import RecipeSlide from "@/widgets/RecipeSlide/RecipeSlide";

import CookingMethodsSection from "./ui/CookingMethodsSection";
import IngredientHero from "./ui/IngredientHero";
import PairingSection from "./ui/PairingSection";
import StorageInfoCard from "./ui/StorageInfoCard";

type IngredientDetailPageClientProps = {
  detail: IngredientDetail;
  recipes: DetailedRecipeGridItem[];
};

const IngredientDetailPageClient = ({
  detail,
  recipes,
}: IngredientDetailPageClientProps) => {
  return (
    <Container padding={false}>
      <div className="px-5 pt-4">
        <PrevButton />
      </div>

      <IngredientHero
        name={detail.name}
        categoryLabel={detail.categoryLabel}
        imageUrl={detail.imageUrl}
      />

      <StorageInfoCard storage={detail.storage} />

      <PairingSection good={detail.pairings.good} bad={detail.pairings.bad} />

      <CookingMethodsSection methods={detail.cookingMethods} />

      <section className="px-5 py-6 border-t border-gray-100">
        <RecipeSlide
          title="이 재료로 만들 수 있는 레시피"
          recipes={recipes}
          isLoading={false}
          error={null}
        />
      </section>
    </Container>
  );
};

export default IngredientDetailPageClient;
