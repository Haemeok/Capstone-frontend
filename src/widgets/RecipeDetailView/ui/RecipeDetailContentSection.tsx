"use client";

import { useSearchDiscoveryDict } from "@/shared/i18n/useSearchDiscoveryDict";

import { ContentPageGrid } from "@/features/content-pages";

const RecipeDetailContentSection = () => {
  const t = useSearchDiscoveryDict();

  return (
    <div className="mt-6 w-full">
      <h2 className="text-ink mb-2 text-lg font-bold">
        {t.contentSectionTitle}
      </h2>
      <ContentPageGrid />
    </div>
  );
};

export default RecipeDetailContentSection;
