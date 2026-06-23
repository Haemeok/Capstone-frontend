"use client";

import { CONTENT_PAGES } from "@/shared/config/constants/content-pages";
import { useSearchDiscoveryDict } from "@/shared/i18n/useSearchDiscoveryDict";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/shadcn/carousel";

import ContentPageCard from "./ContentPageCard";

const ContentPageGrid = () => {
  const t = useSearchDiscoveryDict();

  return (
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
            <ContentPageCard page={page} copy={t.contentPages[page.id]} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 hidden md:flex" />
      <CarouselNext className="right-0 hidden md:flex" />
    </Carousel>
  );
};

export default ContentPageGrid;
