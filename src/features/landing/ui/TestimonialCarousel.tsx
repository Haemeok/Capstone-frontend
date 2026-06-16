"use client";

import { useEffect, useState } from "react";

import type { LandingDict, Locale } from "@/shared/i18n";
import { Reveal } from "@/shared/ui/Reveal";

const AUTO_ADVANCE_DELAY = 6000;

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          className={`h-5 w-5 ${
            index < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export const TestimonialCarousel = ({
  t,
}: {
  t: LandingDict;
  locale: Locale;
}) => {
  const testimonials = t.testimonials.items;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, AUTO_ADVANCE_DELAY);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="from-beige/30 relative w-full overflow-hidden bg-gradient-to-b via-white to-white px-4 py-20 md:py-32">
      <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <Reveal className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-full bg-purple-50 px-4 py-1 text-sm font-semibold text-purple-600">
            {t.testimonials.eyebrow}
          </div>
          <h2 className="text-ink mb-4 text-4xl font-extrabold md:text-5xl">
            {t.testimonials.title}
          </h2>
          <p className="text-ink-sub mx-auto max-w-2xl text-lg">
            {t.testimonials.subtitle}
          </p>
        </Reveal>

        <div className="relative min-h-[320px]">
          <div
            key={currentIndex}
            className="animate-in fade-in zoom-in-95 relative duration-300"
          >
            <div className="from-olive-light/20 via-olive-mint/20 to-olive-medium/20 absolute -inset-4 rounded-[2.5rem] bg-gradient-to-r opacity-50 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-gray-200/50 bg-white p-10 shadow-2xl md:p-14">
              <div className="text-olive-light/10 absolute top-8 right-8 text-8xl">
                &quot;
              </div>

              <div className="relative mb-8 flex items-start justify-between">
                <div className="flex items-center gap-5">
                  <div className="from-olive-light/20 to-olive-mint/20 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br text-4xl shadow-lg">
                    {currentTestimonial.avatar}
                  </div>
                  <div>
                    <h3 className="text-ink mb-1 text-2xl font-extrabold">
                      {currentTestimonial.name}
                    </h3>
                    <p className="text-ink-muted mb-2 text-sm">
                      {currentTestimonial.role}
                    </p>
                    <StarRating rating={currentTestimonial.rating} />
                  </div>
                </div>

                <div className="bg-olive-mint/10 hidden rounded-xl px-4 py-2 md:block">
                  <p className="text-olive-medium text-sm font-bold">
                    {currentTestimonial.highlight}
                  </p>
                </div>
              </div>

              <p className="text-ink-sub relative text-xl leading-relaxed md:text-2xl">
                &quot;{currentTestimonial.content}&quot;
              </p>

              <div className="bg-olive-mint/10 mt-6 block rounded-xl px-4 py-2 md:hidden">
                <p className="text-olive-medium text-sm font-bold">
                  {currentTestimonial.highlight}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`group relative transition-all ${
                index === currentIndex ? "w-12" : "w-3"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            >
              <div
                className={`h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-olive-medium shadow-olive-medium/30 shadow-lg"
                    : "bg-gray-300 group-hover:bg-gray-400"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
