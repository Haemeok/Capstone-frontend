import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/shadcn/carousel";

import type { CoupangProduct } from "../model/types";
import { CoupangCollectedInfo } from "./CoupangCollectedInfo";
import { CoupangProductCard } from "./CoupangProductCard";

export type CoupangSlideCard = {
  product: CoupangProduct;
};

type CoupangProductSlideProps = {
  cards: CoupangSlideCard[];
  lastCollectedAt?: string;
};

export const CoupangProductSlide = ({
  cards,
  lastCollectedAt,
}: CoupangProductSlideProps) => {
  if (cards.length === 0) return null;

  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5">
        {/* i18n-ignore: 쿠팡 슬라이드 ko 전용 */}
        <h3 className="text-ink text-lg font-bold">
          쿠팡에서 잘 팔리는 상품으로 골라왔어요
        </h3>
        {lastCollectedAt && (
          <CoupangCollectedInfo lastCollectedAt={lastCollectedAt} />
        )}
      </div>
      <Carousel
        opts={{ align: "start", loop: false, dragFree: true }}
        className="w-full"
      >
        <CarouselContent className="-ml-3">
          {cards.map(({ product }) => (
            <CarouselItem key={product.url} className="basis-auto pl-3">
              <CoupangProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 hidden cursor-pointer md:flex" />
        <CarouselNext className="-right-4 hidden cursor-pointer md:flex" />
      </Carousel>
    </div>
  );
};
