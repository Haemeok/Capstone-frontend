"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/shadcn/carousel";

import { CONTENT_PAGES } from "@/shared/config/constants/content-pages";

import ContentPageCard from "./ContentPageCard";

const ContentPageGrid = () => {
  return (
    <Carousel
      opts={{ align: "start", dragFree: true, containScroll: "trimSnaps" }}
      className="relative"
    >
      <CarouselContent className="-ml-3">
        {CONTENT_PAGES.map((page) => (
          <CarouselItem key={page.id} className="basis-auto pl-3">
            <ContentPageCard page={page} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 hidden md:flex" />
      <CarouselNext className="right-2 hidden md:flex" />
    </Carousel>
  );
};

export default ContentPageGrid;
