import type { CoupangProduct } from "../model/types";
import { CoupangProductCard } from "./CoupangProductCard";

export type CoupangSlideCard = {
  product: CoupangProduct;
  caption?: string;
};

type CoupangProductSlideProps = {
  cards: CoupangSlideCard[];
};

export const CoupangProductSlide = ({ cards }: CoupangProductSlideProps) => {
  if (cards.length === 0) return null;

  return (
    <ul className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {cards.map(({ product, caption }) => (
        <li key={`${caption ?? ""}-${product.url}`}>
          <CoupangProductCard product={product} caption={caption} />
        </li>
      ))}
    </ul>
  );
};
