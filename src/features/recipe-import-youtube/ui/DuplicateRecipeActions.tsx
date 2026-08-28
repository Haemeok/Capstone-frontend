"use client";

import { Bookmark } from "lucide-react";

import { LocalizedLink, useCommonDict, useYoutubeDict } from "@/shared/i18n";

type DuplicateRecipeActionsProps = {
  recipeId: string;
  isFavorited: boolean;
  onSaveClick: () => void;
};

export const duplicateRecipeActionFocusClass =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-dark";

export const DuplicateRecipeActions = ({
  recipeId,
  isFavorited,
  onSaveClick,
}: DuplicateRecipeActionsProps) => {
  const common = useCommonDict();
  const t = useYoutubeDict();

  return (
    <>
      {isFavorited ? (
        <p className="text-ink-sub text-center text-sm font-medium">
          {t.duplicateAlreadySaved}
        </p>
      ) : (
        <button
          type="button"
          aria-label={t.duplicateSaveButton}
          onClick={onSaveClick}
          className={`text-ink-sub flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gray-100 px-3 text-sm font-semibold transition-colors active:bg-gray-200 ${duplicateRecipeActionFocusClass}`}
        >
          <Bookmark aria-hidden="true" className="h-5 w-5 shrink-0" />
          {common.actions.save}
        </button>
      )}

      <LocalizedLink
        href={`/recipes/${recipeId}`}
        className={`bg-olive-light active:bg-olive-dark flex h-12 cursor-pointer items-center justify-center rounded-xl px-4 text-center text-base font-bold text-white transition-colors ${duplicateRecipeActionFocusClass}`}
      >
        {t.duplicateViewButton}
      </LocalizedLink>
    </>
  );
};
