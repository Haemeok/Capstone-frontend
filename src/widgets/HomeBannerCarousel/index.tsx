"use client";

import { useCallback, useEffect, useState } from "react";

import { sendGAEvent } from "@next/third-parties/google";
import useEmblaCarousel from "embla-carousel-react";

import { useIsApp } from "@/shared/hooks/useIsApp";
import { LocalizedLink, useChromeLocale } from "@/shared/i18n";

import { APP_INSTALL_BANNER_ID } from "./slides";
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
  const isInApp = useIsApp();
  const locale = useChromeLocale();
  const visibleSlides = isInApp
    ? slides.filter((slide) => slide.id !== APP_INSTALL_BANNER_ID)
    : slides;
  const hasMultipleSlides = visibleSlides.length > 1;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: hasMultipleSlides,
    watchDrag: hasMultipleSlides,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const visibleSelectedIndex = Math.min(
    selectedIndex,
    Math.max(visibleSlides.length - 1, 0)
  );

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const { pause, resume, reset } = useCarouselAutoplay({
    onNext: scrollNext,
    interval: autoPlayInterval,
    isEnabled: hasMultipleSlides,
  });

  const handleSlideClick = (slideId: string) => {
    if (slideId !== APP_INSTALL_BANNER_ID) return;

    sendGAEvent("event", "app_install_banner_click", {
      source: "home_carousel",
      locale,
    });
  };

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      reset();
    };
    const onReInit = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onReInit);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onReInit);
    };
  }, [emblaApi, reset]);

  if (visibleSlides.length === 0) return null;

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
          {visibleSlides.map((slide) => {
            const backgroundColor =
              slide.backgroundColor || DEFAULT_BACKGROUND_COLOR;

            return (
              <div key={slide.id} className="relative min-w-0 flex-[0_0_100%]">
                <LocalizedLink
                  href={slide.link}
                  onClick={() => handleSlideClick(slide.id)}
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
                      <span className="text-ink-muted text-xs font-semibold md:text-sm">
                        {slide.chip}
                      </span>
                    )}
                    <h2 className="text-ink text-lg leading-tight font-extrabold md:text-2xl">
                      {slide.title}
                    </h2>
                  </div>
                </LocalizedLink>
              </div>
            );
          })}
        </div>
      </div>

      {hasMultipleSlides && (
        <div
          role="status"
          aria-live="polite"
          aria-label={`슬라이드 ${visibleSlides.length}개 중 ${visibleSelectedIndex + 1}번째`}
          className="absolute right-3 bottom-3 z-10 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white tabular-nums backdrop-blur-sm"
        >
          {visibleSelectedIndex + 1}/{visibleSlides.length}
        </div>
      )}
    </div>
  );
};

export default HomeBannerCarousel;
