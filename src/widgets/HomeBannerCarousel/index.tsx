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
    "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all hover:scale-110 bg-white/80 shadow-sm backdrop-blur-sm",
    "text-gray-800"
  );

  const renderTitle = (
    title: string,
    highlight?: { text: string; color?: string }
  ) => {
    if (!highlight) return title;

    const parts = title.split(highlight.text);
    if (parts.length === 1) return title;

    return (
      <>
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <span style={{ color: highlight.color || "inherit" }}>
                {highlight.text}
              </span>
            )}
          </span>
        ))}
      </>
    );
  };

  const getBadgeStyle = (variant?: string) => {
    switch (variant) {
      case "event":
        return "bg-gray-900 text-white";
      case "warning":
        return "bg-red-500 text-white";
      case "success":
        return "bg-green-500 text-white";
      case "new":
        return "bg-blue-600 text-white";
      default:
        return "bg-gray-800 text-white";
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.id} className="relative min-w-0 flex-[0_0_100%]">
              <Link
                href={slide.link}
                className="relative block aspect-[16/7] w-full overflow-hidden md:aspect-[21/6]"
                style={{ backgroundColor: slide.backgroundColor || "#f3f4f6" }}
              >
                <div className="flex h-full w-full items-center justify-between px-6 py-4 pb-12 md:px-10 md:py-8 md:pb-8">
                  <div
                    className={cn(
                      "z-10 flex min-w-0 flex-1 flex-col justify-center gap-1 md:gap-3",
                      slide.imagePosition === "left"
                        ? "order-2 pl-4 md:pl-10"
                        : "order-1 pr-4 md:pr-10"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {slide.badge && (
                        <span
                          className={cn(
                            "flex-none rounded-full px-2.5 py-1 text-xs font-bold",
                            getBadgeStyle(slide.badge.variant)
                          )}
                        >
                          {slide.badge.text}
                        </span>
                      )}
                      {slide.subTitle && (
                        <span className="truncate text-sm font-semibold text-gray-700 md:text-lg">
                          {slide.subTitle}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl leading-tight font-extrabold whitespace-pre-line text-gray-900 md:text-4xl md:leading-tight">
                      {renderTitle(slide.title, slide.highlight)}
                    </h2>

                    {slide.description && (
                      <p className="mt-1 hidden text-sm text-gray-600 md:block">
                        {slide.description}
                      </p>
                    )}
                  </div>

                  <div
                    className={cn(
                      "relative aspect-square h-full flex-none py-2 md:py-4",
                      slide.imagePosition === "left" ? "order-1" : "order-2"
                    )}
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-contain drop-shadow-xl transition-transform duration-500 hover:scale-105"
                        sizes="(max-width: 768px) 40vw, 30vw"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between gap-2 md:justify-end">
        <div className="flex-1 md:w-48 md:flex-none">
          <ProgressBar
            key={progressKey}
            isPaused={isHovered}
            interval={autoPlayInterval}
            onComplete={scrollNext}
            className="bg-gray-200"
            indicatorClassName="bg-gray-900"
          />
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={scrollPrev}
            className={buttonClasses}
            aria-label="이전 슬라이드"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            onClick={scrollNext}
            className={buttonClasses}
            aria-label="다음 슬라이드"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeBannerCarousel;
