"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";

import { Link2 } from "lucide-react";

import { type HomeDict, useLocalizedRouter } from "@/shared/i18n";
import YouTubeIconBadge from "@/shared/ui/badge/YouTubeIconBadge";

import { validateYoutubeUrl } from "@/features/recipe-import-youtube/lib/urlValidation";

import { DesktopYoutubeTransformPreview } from "./DesktopYoutubeTransformPreview";

type DesktopYoutubeImportHeroProps = {
  messages: HomeDict["desktopYoutubeImport"];
};

export const DesktopYoutubeImportHero = ({
  messages,
}: DesktopYoutubeImportHeroProps) => {
  const router = useLocalizedRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const helperId = "desktop-youtube-import-helper";

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
    setError(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validateYoutubeUrl(url);

    if (!result.valid) {
      setError(messages.invalidUrl);
      return;
    }

    const search = new URLSearchParams({ url: result.cleanUrl });
    router.push(`/recipes/new/youtube?${search.toString()}`);
  };

  return (
    <section
      data-testid="desktop-youtube-import-hero"
      aria-label={messages.ariaLabel}
      className="hidden w-full bg-[#f4f8f2] md:block"
    >
      <div className="mx-auto grid min-h-[405px] w-full max-w-6xl items-center gap-10 px-6 py-11 lg:grid-cols-[minmax(430px,1.05fr)_minmax(430px,0.95fr)] lg:gap-12">
        <div className="max-w-[560px]">
          <div className="text-ink-sub flex items-center gap-2 text-sm font-semibold">
            <YouTubeIconBadge className="h-5 w-5" />
            <span>{messages.eyebrow}</span>
          </div>
          <h1 className="text-ink mt-4 text-[38px] leading-[1.14] font-bold tracking-[-0.05em] lg:text-[42px]">
            <span className="block">{messages.titleLine1}</span>
            <span className="block">{messages.titleLine2}</span>
          </h1>
          <p className="text-ink-sub mt-5 text-base leading-6">
            {messages.description}
          </p>

          <form className="mt-7" noValidate onSubmit={handleSubmit}>
            <div
              className={`flex min-h-[60px] items-center gap-3 rounded-2xl border bg-white p-1.5 pl-4 transition-colors focus-within:ring-2 ${
                error
                  ? "border-red-500 focus-within:ring-red-500/20"
                  : "focus-within:ring-olive-light/25 focus-within:border-olive-light border-gray-200"
              }`}
            >
              <Link2
                aria-hidden="true"
                className="h-5 w-5 shrink-0 text-gray-400"
              />
              <input
                type="url"
                inputMode="url"
                autoComplete="off"
                value={url}
                onChange={handleChange}
                aria-label={messages.inputLabel}
                aria-describedby={helperId}
                aria-invalid={Boolean(error)}
                placeholder={messages.placeholder}
                className="text-ink min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="bg-ink min-h-12 shrink-0 cursor-pointer rounded-xl px-5 text-sm font-bold text-white transition-colors hover:bg-[#333333] focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {messages.submit}
              </button>
            </div>
            <p
              id={helperId}
              role={error ? "alert" : undefined}
              className={`mt-2 px-1 text-xs ${error ? "text-red-500" : "text-ink-muted"}`}
            >
              {error ?? messages.helper}
            </p>
          </form>
        </div>

        <DesktopYoutubeTransformPreview messages={messages} />
      </div>
    </section>
  );
};
