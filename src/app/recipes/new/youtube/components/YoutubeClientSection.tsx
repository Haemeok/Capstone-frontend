"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import YouTubeIconBadge from "@/shared/ui/badge/YouTubeIconBadge";

import { TrendingYoutubeRecipe } from "@/entities/recipe/model/types";
import { useMyInfoQuery } from "@/entities/user/model/hooks";

const LoginEncourageDrawer = dynamic(
  () => import("@/widgets/LoginEncourageDrawer"),
  { ssr: false }
);

import { TrendingRecipesClient } from "./TrendingRecipesClient";
import { YoutubePreviewSection } from "./YoutubePreviewSection";
import { YoutubeQuotaBadge } from "./YoutubeQuotaBadge";
import { YoutubeUrlForm } from "./YoutubeUrlForm";
import { YoutubeUrlProvider } from "./YoutubeUrlProvider";

type YoutubeClientSectionProps = {
  trendingRecipes: TrendingYoutubeRecipe[];
  initialUrl: string;
};

export const YoutubeClientSection = ({
  trendingRecipes,
  initialUrl,
}: YoutubeClientSectionProps) => {
  const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(false);
  const { user } = useMyInfoQuery();

  const handleLoginRequired = () => {
    setIsLoginDrawerOpen(true);
  };

  return (
    <YoutubeUrlProvider initialUrl={initialUrl}>
      <div className="mx-auto flex w-full max-w-xl flex-col items-center">
        <section className="w-full mt-4 flex flex-col gap-4">
          <YoutubeQuotaBadge remainingQuota={user?.remainingYoutubeQuota} />
          <YoutubeUrlForm />
          <YoutubePreviewSection onLoginRequired={handleLoginRequired} />
        </section>

        <div className="mt-4 w-full overflow-hidden rounded-3xl bg-gray-50/50">
          <TrendingRecipesClient recipes={trendingRecipes} className="w-full" />
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
