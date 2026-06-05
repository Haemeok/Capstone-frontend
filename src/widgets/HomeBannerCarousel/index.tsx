"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import { notoSansKr } from "@/app/fonts/notoSansKr";

import { BannerSlide } from "./types";
import { useCarouselAutoplay } from "./useCarouselAutoplay";

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

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const { pause, resume, reset } = useCarouselAutoplay({
    onNext: scrollNext,
    interval: autoPlayInterval,
    isEnabled: !isSingleSlide,
  });

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      reset();
    };

    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, reset]);

  return (
    <div
      className="rounded-card relative mb-4 w-full overflow-hidden md:hidden"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {slides.map((slide) => {
            const backgroundColor =
              slide.backgroundColor || DEFAULT_BACKGROUND_COLOR;

            return (
              <div key={slide.id} className="relative min-w-0 flex-[0_0_100%]">
                <Link
                  href={slide.link}
                  className="relative block aspect-[7/2] w-full overflow-hidden md:aspect-[5/1]"
                  style={{ backgroundColor }}
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={slide.mainImage}
                      alt=""
                      className="absolute inset-y-0 right-0 h-full w-3/5 object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to right, ${backgroundColor} 35%, transparent 100%)`,
                      }}
                    />
                  </div>

                  <div className="relative z-10 flex h-full flex-col justify-center gap-1 px-6 py-3 md:px-10">
                    {slide.chip && (
                      <span className="w-fit rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm md:text-sm">
                        {slide.chip}
                      </span>
                    )}
                    <h2
                      className={cn(
                        notoSansKr.className,
                        "text-xl leading-tight font-extrabold whitespace-pre-line text-white md:text-3xl md:leading-tight"
                      )}
                    >
                      {slide.title}
                    </h2>
                    {slide.ctaText && (
                      <span className="mt-0.5 inline-flex items-center gap-0.5 text-xs font-medium text-white/80 md:text-sm">
                        {slide.ctaText}
                        <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {!isSingleSlide && (
        <div
          role="status"
          aria-live="polite"
          aria-label={`슬라이드 ${slides.length}개 중 ${selectedIndex + 1}번째`}
          className="absolute right-3 bottom-3 z-10 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white tabular-nums backdrop-blur-sm"
        >
          {selectedIndex + 1}/{slides.length}
        </div>
      )}
    </div>
  );
};

export default HomeBannerCarousel;
