"use client";

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

  return (
    <div className="relative flex h-full items-center justify-center p-6">
      <div className="absolute top-2 left-2 md:hidden">
        <PrevButton size={24} className="text-ink-sub p-2" />
      </div>
      <div className="w-full max-w-4xl">
        <h1
          className={`text-ink mb-4 text-center text-3xl font-bold text-pretty ${wrapClass}`}
        >
          {t.hubTitle}
        </h1>
        <p
          className={`text-ink-muted mb-12 text-center text-pretty ${wrapClass}`}
        >
          {t.hubSubtitle}
        </p>

        <div className="grid grid-cols-2 gap-4 md:gap-8">
          <LocalizedLink
            href="/recipes/new/manual"
            className="group border-olive-light/30 hover:border-olive-mint block rounded-2xl border-2 bg-white p-4 transition-all duration-200 hover:shadow-lg md:p-8"
          >
            <div className="flex flex-col items-center space-y-3 text-center md:space-y-6">
              <div className="rounded-card relative w-32 overflow-hidden md:h-64 md:w-48">
                <Image
                  src={`${ICON_BASE_URL}note.webp`}
                  alt={t.manualCardImageAlt}
                  fit="cover"
                  imgClassName="transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col items-center gap-4">
                <h2
                  className={`text-ink text-lg font-bold text-pretty md:text-2xl ${wrapClass}`}
                >
                  {t.manualCardTitle}
                </h2>
                <p className={`text-ink-muted text-pretty ${wrapClass}`}>
                  {t.manualCardBody}
                </p>
              </div>
            </div>
          </LocalizedLink>

          <LocalizedLink
            href="/recipes/new/youtube"
            className="group border-olive-light/30 hover:border-olive-mint block rounded-2xl border-2 bg-white p-4 transition-all duration-200 hover:shadow-lg md:p-8"
          >
            <div className="flex flex-col items-center space-y-3 text-center md:space-y-6">
              <div className="rounded-card relative w-32 overflow-hidden md:h-64 md:w-48">
                <Image
                  src={`${ICON_BASE_URL}youtube.webp`}
                  alt={t.youtubeCardImageAlt}
                  fit="cover"
                  imgClassName="transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col items-center gap-4">
                <h2
                  className={`text-ink text-lg font-bold text-pretty md:text-2xl ${wrapClass}`}
                >
                  {t.youtubeCardTitle}
                </h2>
                <p className={`text-ink-muted text-pretty ${wrapClass}`}>
                  {t.youtubeCardBody}
                </p>
              </div>
            </div>
          </LocalizedLink>
        </div>
      </div>
    </div>
  );
};
