import type { SearchDiscoveryDict } from "@/shared/i18n/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/shadcn/carousel";

import { CONTENT_PAGES } from "@/entities/recipe/lib/content-pages";

import ContentPageCard from "./ContentPageCard";

type ContentPageGridProps = {
  copy: SearchDiscoveryDict["contentPages"];
  layout?: "default" | "home";
};

const ContentPageGrid = ({
  copy,
  layout = "default",
}: ContentPageGridProps) => (
  <Carousel
    opts={{
      align: "start",
      loop: false,
      dragFree: true,
      containScroll: "trimSnaps",
    }}
    className="-mx-4 px-4"
  >
    <CarouselContent className="-ml-3">
      {CONTENT_PAGES.map((page) => (
        <CarouselItem key={page.id} className="basis-auto pl-3">
          <ContentPageCard page={page} copy={copy[page.id]} layout={layout} />
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious className="left-0 hidden md:flex" />
    <CarouselNext className="right-0 hidden md:flex" />
  </Carousel>
);

export default ContentPageGrid;
