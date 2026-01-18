"use client";

import { useState } from "react";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/shared/lib/utils";
import { notoSansKr } from "@/app/fonts/notoSansKr";

import { ProgressBar } from "./ProgressBar";
import { BannerSlide } from "./types";

const DEFAULT_AUTOPLAY_INTERVAL = 5000;
const DEFAULT_BACKGROUND_COLOR = "#f87171";

export type HomeBannerCarouselProps = {
  slides: BannerSlide[];
  autoPlayInterval?: number;
};

const HomeBannerCarousel = ({
  slides,
  autoPlayInterval = DEFAULT_AUTOPLAY_INTERVAL,
}: HomeBannerCarouselProps) => {
  const isSingleSlide = slides.length === 1;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: !isSingleSlide,
    watchDrag: !isSingleSlide,
  });

  const [isHovered, setIsHovered] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const scrollNext = () => {
    if (emblaApi) {
      emblaApi.scrollNext();
      setProgressKey((prev) => prev + 1);
    }
  };

  const scrollPrev = () => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      setProgressKey((prev) => prev + 1);
    }
  };

  return (
    <div
      className="relative md:hidden w-full overflow-hidden rounded-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.id} className="relative min-w-0 flex-[0_0_100%]">
              <Link
                href={slide.link}
                className="relative block aspect-[7/2] w-full overflow-hidden md:aspect-[5/1]"
                style={{
                  backgroundColor:
                    slide.backgroundColor || DEFAULT_BACKGROUND_COLOR,
                }}
              >
                <div className="flex h-full w-full items-center justify-between px-6 py-3 md:px-10 md:py-4">
                  <div className="z-10 flex min-w-0 flex-1 flex-col justify-center gap-0.5 pr-2 md:gap-1 md:pr-6">
                    <h2
                      className={cn(
                        notoSansKr.className,
                        "text-xl leading-tight font-extrabold whitespace-pre-line text-white md:text-3xl md:leading-tight"
                      )}
                    >
                      {slide.title}
                    </h2>
                    {slide.subtitle && (
                      <p className="text-sm font-semibold text-white/90 md:text-lg">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.ctaText && (
                      <span className="mt-1 inline-flex items-center gap-0.5 text-xs font-medium text-white/80 md:text-sm">
                        {slide.ctaText}
                        <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                      </span>
                    )}
                  </div>

                  <div className="relative w-24 h-24 md:w-28 md:h-28 flex-none rotate-12">
                    {slide.backgroundImage && (
                      <img
                        src={slide.backgroundImage}
                        alt=""
                        className="absolute inset-0 h-full w-full scale-[2] object-contain"
                      />
                    )}
                    <img
                      src={slide.mainImage}
                      alt={slide.title}
                      className="absolute inset-0 h-full w-full object-contain drop-shadow-xl transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {!isSingleSlide && (
        <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between gap-2 md:justify-end">
          <div className="flex-1 md:w-48 md:flex-none">
            <ProgressBar
              key={progressKey}
              isPaused={isHovered}
              interval={autoPlayInterval}
              onComplete={scrollNext}
              className="bg-white/30"
              indicatorClassName="bg-white"
            />
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={scrollPrev}
              className={cn(
                "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all hover:scale-110",
                "bg-white/80 text-gray-800 shadow-sm backdrop-blur-sm"
              )}
              aria-label="이전 슬라이드"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              onClick={scrollNext}
              className={cn(
                "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all hover:scale-110",
                "bg-white/80 text-gray-800 shadow-sm backdrop-blur-sm"
              )}
              aria-label="다음 슬라이드"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeBannerCarousel;
