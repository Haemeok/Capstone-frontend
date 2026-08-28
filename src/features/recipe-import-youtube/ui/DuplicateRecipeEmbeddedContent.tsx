"use client";

import { useYoutubeDict } from "@/shared/i18n";

import type { DetailedRecipeGridItem } from "@/entities/recipe/model/types";

import { DuplicateRecipeActions } from "./DuplicateRecipeActions";
import { DuplicateRecipeSheetSkeleton } from "./DuplicateRecipeSheetSkeleton";
import { DuplicateRecipeSummary } from "./DuplicateRecipeSummary";

type DuplicateRecipeEmbeddedContentProps = {
  recipeId: string;
  recipeItem: DetailedRecipeGridItem | null;
  isLoading: boolean;
  isFavorited: boolean;
  wasAutoSaved: boolean;
  onSaveClick: () => void;
};

export const DuplicateRecipeEmbeddedContent = ({
  recipeId,
  recipeItem,
  isLoading,
  isFavorited,
  wasAutoSaved,
  onSaveClick,
}: DuplicateRecipeEmbeddedContentProps) => {
  const t = useYoutubeDict();

  return (
    <div className="flex min-h-0 flex-col">
      <header className="shrink-0 px-5 pt-5 pr-16 pb-4 text-left sm:px-6 sm:pt-6 sm:pr-16">
        <h2 className="text-ink text-xl leading-7 font-bold">
          {t.duplicateTitle}
        </h2>
        <p className="text-left text-sm leading-5 font-medium">
          <span className="text-olive-dark block">{t.duplicateNoCredit}</span>
          {wasAutoSaved ? (
            <span className="text-ink-sub mt-1 block">{t.duplicateAdded}</span>
          ) : null}
        </p>
      </header>

      {isLoading && recipeItem === null ? (
        <DuplicateRecipeSheetSkeleton isMobile={false} />
      ) : recipeItem ? (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <DuplicateRecipeSummary isMobile={false} recipeItem={recipeItem} />
          </div>
          <footer
            className={`grid shrink-0 gap-2 bg-white px-5 pt-2 pb-4 sm:px-6 sm:pb-6 ${isFavorited ? "grid-cols-1" : "grid-cols-[1fr_1.6fr]"}`}
          >
            <DuplicateRecipeActions
              recipeId={recipeId}
              isFavorited={isFavorited}
              onSaveClick={onSaveClick}
            />
          </footer>
        </>
      ) : null}
    </div>
  );
};
