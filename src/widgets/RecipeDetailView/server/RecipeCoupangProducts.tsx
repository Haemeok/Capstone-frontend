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

  const cards: CoupangSlideCard[] = items
    .filter((item) => item.products.length > 0)
    .map((item) => ({
      product: item.products[0],
      caption: item.coupangName,
    }));

  if (cards.length === 0) return null;

  return (
    <section className="mt-3">
      <CoupangProductSlide cards={cards} />
    </section>
  );
};

export default RecipeCoupangProducts;
