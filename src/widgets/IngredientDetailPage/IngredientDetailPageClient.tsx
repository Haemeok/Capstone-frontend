import type { Locale } from "@/shared/i18n";
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
  locale?: Locale;
};

const IngredientDetailPageClient = ({
  detail,
  locale = "ko",
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

      <StorageInfoCard storage={detail.storage} locale={locale} />

      {locale === "ko" && <CoupangPurchaseCard href={detail.coupangLink} />}

      <SeasonStrip months={detail.seasonMonths} locale={locale} />

      <NutritionCard nutrition={detail.nutrition} locale={locale} />

      <BenefitsList benefits={detail.benefits} locale={locale} />

      <PairingSection
        good={detail.pairings.good}
        bad={detail.pairings.bad}
        locale={locale}
      />

      <CookingMethodsSection methods={detail.cookingMethods} locale={locale} />

      <section className="border-t border-gray-100 px-5 py-6">
        <IngredientRecipesSlide
          ingredientId={detail.id}
          ingredientName={detail.name}
          locale={locale}
        />
      </section>
    </Container>
  );
};

export default IngredientDetailPageClient;
