import type { CoupangSlideCard } from "@/shared/coupang";
import {
  CoupangProductSlide,
  fetchRecipeCoupangProducts,
} from "@/shared/coupang";

type RecipeCoupangProductsProps = {
  recipeId: string;
  isIndexed: boolean | undefined;
};

const RecipeCoupangProducts = async ({
  recipeId,
  isIndexed,
}: RecipeCoupangProductsProps) => {
  const { items } = await fetchRecipeCoupangProducts(recipeId, { isIndexed });

  const withProducts = items.filter((item) => item.products.length > 0);
  const cards: CoupangSlideCard[] = withProducts.map((item) => ({
    product: item.products[0],
  }));

  if (cards.length === 0) return null;

  // ISO-8601(동일 오프셋)은 사전식 정렬이 곧 시간순 → 최신 수집 시각
  const lastCollectedAt = withProducts
    .map((item) => item.lastCollectedAt)
    .filter(Boolean)
    .sort()
    .at(-1);

  return (
    <section className="mt-6">
      <CoupangProductSlide cards={cards} lastCollectedAt={lastCollectedAt} />
    </section>
  );
};

export default RecipeCoupangProducts;
