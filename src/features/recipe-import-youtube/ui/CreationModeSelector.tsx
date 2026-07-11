"use client";

import { ChevronRight } from "lucide-react";

import { aiModels } from "@/shared/config/constants/aiModel";
import { ICON_BASE_URL } from "@/shared/config/constants/recipe";
import {
  LocalizedLink,
  useRecipeCreateDict,
  useRecipeCreateLocale,
} from "@/shared/i18n";
import { Image } from "@/shared/ui/image/Image";
import PrevButton from "@/shared/ui/PrevButton";

export const CreationModeSelector = () => {
  const t = useRecipeCreateDict();
  const locale = useRecipeCreateLocale();
  const wrapClass = locale === "ko" ? "break-keep" : "break-words";

  const modeCards = [
    {
      href: "/recipes/new/youtube",
      image: `${ICON_BASE_URL}youtube.webp`,
      alt: t.youtubeCardImageAlt,
      title: t.youtubeCardTitle,
      body: t.youtubeCardBody,
    },
    {
      href: "/recipes/new/ai",
      image: aiModels.INGREDIENT_FOCUS.image,
      alt: t.aiCardImageAlt,
      title: t.aiCardTitle,
      body: t.aiCardBody,
    },
    {
      href: "/recipes/new/manual",
      image: `${ICON_BASE_URL}note.webp`,
      alt: t.manualCardImageAlt,
      title: t.manualCardTitle,
      body: t.manualCardBody,
    },
  ];

  return (
    <div className="relative flex h-full items-center justify-center p-6">
      <div className="absolute top-2 left-2 md:hidden">
        <PrevButton size={24} className="text-ink-sub p-2" />
      </div>
      <div className="w-full max-w-4xl">
        <h1
          className={`text-ink mb-4 text-center text-2xl font-bold text-pretty md:text-3xl ${wrapClass}`}
        >
          {t.hubTitle}
        </h1>
        <p
          className={`text-ink-muted mb-8 text-center text-pretty md:mb-12 ${wrapClass}`}
        >
          {t.hubSubtitle}
        </p>

        <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-8">
          {modeCards.map((card) => (
            <LocalizedLink
              key={card.href}
              href={card.href}
              className="group md:hover:border-olive-mint flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition-colors active:bg-gray-50 md:flex-col md:gap-6 md:p-8 md:hover:shadow-sm"
            >
              <div className="rounded-card relative w-20 shrink-0 overflow-hidden md:h-64 md:w-48">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fit="cover"
                  imgClassName="transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1 md:flex-none md:items-center md:gap-4 md:text-center">
                <h2
                  className={`text-ink text-base font-semibold text-pretty md:text-2xl md:font-bold ${wrapClass}`}
                >
                  {card.title}
                </h2>
                <p
                  className={`text-ink-muted text-sm text-pretty md:text-base ${wrapClass}`}
                >
                  {card.body}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-gray-400 md:hidden" />
            </LocalizedLink>
          ))}
        </div>
      </div>
    </div>
  );
};
