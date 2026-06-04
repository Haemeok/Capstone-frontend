import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";

import type { IngredientDetailView } from "@/entities/ingredient";

import IngredientRecipesSlide from "./IngredientRecipesSlide";
import BenefitsList from "./ui/BenefitsList";
import CookingMethodsSection from "./ui/CookingMethodsSection";
import CoupangPurchaseCard from "./ui/CoupangPurchaseCard";
import IngredientHero from "./ui/IngredientHero";
import NutritionCard from "./ui/NutritionCard";
import PairingSection from "./ui/PairingSection";
import SeasonStrip from "./ui/SeasonStrip";
import StorageInfoCard from "./ui/StorageInfoCard";

type IngredientDetailPageClientProps = {
  detail: IngredientDetailView;
};

const IngredientDetailPageClient = ({
  detail,
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
        caloriesPer100g={detail.nutrition?.kcal ?? null}
      />

      <StorageInfoCard storage={detail.storage} />

      <CoupangPurchaseCard href={detail.coupangLink} />

      <SeasonStrip months={detail.seasonMonths} />

      <NutritionCard nutrition={detail.nutrition} />

      <BenefitsList benefits={detail.benefits} />

      <PairingSection good={detail.pairings.good} bad={detail.pairings.bad} />

      <CookingMethodsSection methods={detail.cookingMethods} />

      <section className="border-t border-gray-100 px-5 py-6">
        <IngredientRecipesSlide
          ingredientId={detail.id}
          ingredientName={detail.name}
        />
      </section>
    </Container>
  );
};

export default IngredientDetailPageClient;
