import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";

import type { IngredientDetailView } from "@/entities/ingredient";

import CookingMethodsSection from "./ui/CookingMethodsSection";
import IngredientHero from "./ui/IngredientHero";
import IngredientRecipesSlide from "./IngredientRecipesSlide";
import PairingSection from "./ui/PairingSection";
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
      />

      <StorageInfoCard storage={detail.storage} />

      <PairingSection good={detail.pairings.good} bad={detail.pairings.bad} />

      <CookingMethodsSection methods={detail.cookingMethods} />

      <section className="px-5 py-6 border-t border-gray-100">
        <IngredientRecipesSlide ingredientId={detail.id} />
      </section>
    </Container>
  );
};

export default IngredientDetailPageClient;
