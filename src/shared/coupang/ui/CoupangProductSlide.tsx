import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/shadcn/carousel";

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
    <Carousel
      opts={{ align: "start", loop: false, dragFree: true }}
      className="w-full"
    >
      <CarouselContent className="-ml-3">
        {cards.map(({ product, caption }) => (
          <CarouselItem
            key={`${caption ?? ""}-${product.url}`}
            className="basis-auto pl-3"
          >
            <CoupangProductCard product={product} caption={caption} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-4 hidden cursor-pointer md:flex" />
      <CarouselNext className="-right-4 hidden cursor-pointer md:flex" />
    </Carousel>
  );
};
