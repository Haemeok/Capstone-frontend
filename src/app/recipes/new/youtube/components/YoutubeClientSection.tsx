"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import type { Locale, YoutubeDict } from "@/shared/i18n";
import YouTubeIconBadge from "@/shared/ui/badge/YouTubeIconBadge";

import { TrendingYoutubeRecipe } from "@/entities/recipe/model/types";

const LoginEncourageDrawer = dynamic(
  () => import("@/features/auth/ui/LoginEncourageDrawer"),
  { ssr: false }
);

import { TrendingRecipesClient } from "./TrendingRecipesClient";
import { YoutubePreviewSection } from "./YoutubePreviewSection";
import { YoutubeUrlForm } from "./YoutubeUrlForm";
import { YoutubeUrlProvider } from "./YoutubeUrlProvider";

type YoutubeClientSectionProps = {
  trendingRecipes: TrendingYoutubeRecipe[];
  initialUrl: string;
  dict: YoutubeDict;
  locale: Locale;
};

export const YoutubeClientSection = ({
  trendingRecipes,
  initialUrl,
  dict,
  locale,
}: YoutubeClientSectionProps) => {
  const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(false);

  const handleLoginRequired = () => {
    setIsLoginDrawerOpen(true);
  };

  return (
    <YoutubeUrlProvider initialUrl={initialUrl}>
      <div className="mx-auto flex w-full max-w-xl flex-col items-center">
        <section className="mt-4 flex w-full flex-col gap-4">
          <YoutubeUrlForm dict={dict} />
          <YoutubePreviewSection onLoginRequired={handleLoginRequired} />
        </section>

        <div className="mt-4 w-full overflow-hidden rounded-3xl bg-gray-50/50">
          <TrendingRecipesClient
            recipes={trendingRecipes}
            dict={dict}
            locale={locale}
            className="w-full"
          />
        </div>
      </div>

      <LoginEncourageDrawer
        isOpen={isLoginDrawerOpen}
        onOpenChange={setIsLoginDrawerOpen}
        icon={<YouTubeIconBadge className="h-6 w-6" />}
      />
    </YoutubeUrlProvider>
  );
};
