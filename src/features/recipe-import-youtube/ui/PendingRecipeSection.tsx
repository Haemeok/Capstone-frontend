"use client";

import { PendingRecipeCard } from "./PendingRecipeCard";
import { PlaceholderCard } from "./PlaceholderCard";

const MIN_ITEMS_PER_ROW = 2;

type PendingRecipeSectionProps = {
  pendingUrls: string[];
};

export const PendingRecipeSection = ({
  pendingUrls,
}: PendingRecipeSectionProps) => {
  const placeholderCount = Math.max(0, MIN_ITEMS_PER_ROW - pendingUrls.length);

  return (
    <div className=" mb-6 rounded-2xl p-4">
      <h3 className="text-olive-light mb-3 flex items-center gap-2 text-sm font-semibold">
        <span className="relative flex h-2 w-2">
          <span className="bg-olive-light absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
          <span className="bg-olive-light relative inline-flex h-2 w-2 rounded-full" />
        </span>
        처리 중인 레시피
      </h3>
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(165px,1fr))] md:[grid-template-columns:repeat(auto-fill,minmax(170px,1fr))] lg:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
        {pendingUrls.map((url) => (
          <PendingRecipeCard key={url} url={url} />
        ))}
        {Array.from({ length: placeholderCount }).map((_, i) => (
          <PlaceholderCard key={`placeholder-${i}`} />
        ))}
      </div>
    </div>
  );
};
