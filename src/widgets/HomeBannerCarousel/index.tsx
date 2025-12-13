"use client";

import { useState } from "react";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import { ProgressBar } from "./ProgressBar";
import { BannerSlide, ButtonVariant } from "./types";

const DEFAULT_AUTOPLAY_INTERVAL = 5000;

export type HomeBannerCarouselProps = {
  slides: BannerSlide[];
  variant?: ButtonVariant;
  autoPlayInterval?: number;
};

const HomeBannerCarousel = ({
  slides,
  variant = "white",
  autoPlayInterval = DEFAULT_AUTOPLAY_INTERVAL,
}: HomeBannerCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

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

  const buttonClasses = cn(
    "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all hover:scale-110",
    variant === "white" ? "text-white" : "text-gray-800"
  );

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.id} className="relative min-w-0 flex-[0_0_100%]">
              <a
                href={slide.link}
                className="from-olive to-olive-light block aspect-[16/3] w-full bg-gradient-to-r"
              >
                <div className="flex h-full items-center justify-center">
                  <div className="text-center text-white">
                    <h2 className="mb-2 text-3xl font-bold">{slide.title}</h2>
                    <p className="text-lg">{slide.description}</p>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-4 bottom-4 left-4 flex items-center gap-2 md:right-auto">
        <div className="flex gap-1">
          <button
            onClick={scrollPrev}
            className={buttonClasses}
            aria-label="이전 슬라이드"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            onClick={scrollNext}
            className={buttonClasses}
            aria-label="다음 슬라이드"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 md:w-96">
          <ProgressBar
            key={progressKey}
            isPaused={isHovered}
            interval={autoPlayInterval}
            onComplete={scrollNext}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeBannerCarousel;
