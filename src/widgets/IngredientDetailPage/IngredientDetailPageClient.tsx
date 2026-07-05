import { CoupangProductSlide } from "@/shared/coupang";
import type { Locale } from "@/shared/i18n";
import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";

import type { IngredientDetailView } from "@/entities/ingredient";

import IngredientRecipesSlide from "./IngredientRecipesSlide";
import BenefitsList from "./ui/BenefitsList";
import CookingMethodsSection from "./ui/CookingMethodsSection";
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

      {locale === "ko" &&
        detail.coupang &&
        detail.coupang.products.length > 0 && (
          <section className="px-5 pt-2 pb-4">
            <CoupangProductSlide
              cards={detail.coupang.products.map((product) => ({ product }))}
              lastCollectedAt={detail.coupang.lastCollectedAt}
            />
            <p className="text-ink-muted mt-3 text-center text-[11px] leading-tight font-light text-pretty break-keep">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의
              수수료를 제공받습니다.
            </p>
          </section>
        )}

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
