"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import useEmblaCarousel from "embla-carousel-react";

import { BannerSlide } from "./types";
import { useCarouselAutoplay } from "./useCarouselAutoplay";

const DEFAULT_AUTOPLAY_INTERVAL = 5000;
const DEFAULT_BACKGROUND_COLOR = "#f1f5f9";

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
                  className="relative block aspect-[9/2] w-full overflow-hidden"
                  style={{ backgroundColor }}
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={slide.mainImage}
                      alt=""
                      className="absolute inset-y-0 right-0 h-full w-1/2 object-cover"
                      style={{
                        WebkitMaskImage:
                          "linear-gradient(to right, transparent 0%, black 55%)",
                        maskImage:
                          "linear-gradient(to right, transparent 0%, black 55%)",
                      }}
                    />
                  </div>

                  <div className="relative z-10 flex h-full flex-col justify-center gap-0.5 px-4">
                    {slide.chip && (
                      <span className="text-xs font-semibold text-gray-500 md:text-sm">
                        {slide.chip}
                      </span>
                    )}
                    <h2 className="text-lg leading-tight font-extrabold text-gray-900 md:text-2xl">
                      {slide.title}
                    </h2>
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
