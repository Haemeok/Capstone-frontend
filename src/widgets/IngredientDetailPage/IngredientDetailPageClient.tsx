import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";

import type { IngredientDetailView } from "@/entities/ingredient";

import BenefitsList from "./ui/BenefitsList";
import CookingMethodsSection from "./ui/CookingMethodsSection";
import CoupangPurchaseCard from "./ui/CoupangPurchaseCard";
import IngredientHero from "./ui/IngredientHero";
import IngredientRecipesSlide from "./IngredientRecipesSlide";
import NutritionCard from "./ui/NutritionCard";
import PairingSection from "./ui/PairingSection";
import PrepTipCard from "./ui/PrepTipCard";
import SeasonStrip from "./ui/SeasonStrip";
import StorageInfoCard from "./ui/StorageInfoCard";
import SubstitutesSection from "./ui/SubstitutesSection";

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
        shortDescription={detail.shortDescription}
        caloriesPer100g={detail.nutrition?.calories ?? null}
      />

      <StorageInfoCard storage={detail.storage} />

      <CoupangPurchaseCard href={detail.coupangLink} />

      <SeasonStrip months={detail.seasonMonths} />

      <NutritionCard nutrition={detail.nutrition} />

      <BenefitsList benefits={detail.benefits} />

      <PrepTipCard tip={detail.prepTip} />

      <PairingSection good={detail.pairings.good} bad={detail.pairings.bad} />

      <SubstitutesSection items={detail.substitutes} />

      <CookingMethodsSection methods={detail.cookingMethods} />

      <section className="px-5 py-6 border-t border-gray-100">
        <IngredientRecipesSlide
          ingredientId={detail.id}
          ingredientName={detail.name}
        />
      </section>
    </Container>
  );
};

export default IngredientDetailPageClient;
