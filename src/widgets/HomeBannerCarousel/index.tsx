"use client";

import { useState } from "react";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
              <Link
                href={slide.link}
                className="relative block aspect-[16/6] w-full overflow-hidden md:aspect-[16/4]"
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative flex h-full items-center justify-center px-6 pb-6 sm:pb-16 md:pb-6">
                  <div className="max-w-3xl text-center text-white">
                    {slide.badge && (
                      <div className="flex justify-center">
                        <span
                          className={cn(
                            "rounded-full px-4 py-1.5 text-sm font-semibold",
                            slide.badge.variant === "success" &&
                              "bg-green-500 text-white",
                            slide.badge.variant === "warning" &&
                              "bg-red-500 text-white",
                            slide.badge.variant === "default" &&
                              "bg-white/20 text-white backdrop-blur-sm"
                          )}
                        >
                          {slide.badge.text}
                        </span>
                      </div>
                    )}
                    <h2 className="mb-3 text-2xl leading-tight font-bold md:text-4xl md:leading-tight">
                      {slide.highlight ? (
                        <>
                          {slide.title}
                          <br />
                          <span
                            className="bg-gradient-to-r bg-clip-text text-transparent"
                            style={{
                              backgroundImage: `linear-gradient(to right, ${slide.highlight.color}, ${slide.highlight.color})`,
                            }}
                          >
                            {slide.highlight.text}
                          </span>
                        </>
                      ) : (
                        slide.title
                      )}
                    </h2>
                    <p className="hidden text-sm sm:block md:text-lg">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </Link>
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
