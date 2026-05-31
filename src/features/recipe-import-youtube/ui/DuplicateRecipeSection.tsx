"use client";

import { useCallback, useEffect, useRef } from "react";

import { AnimatePresence } from "motion/react";

import { triggerHaptic } from "@/shared/lib/bridge";

import { useRecipeBooks } from "@/entities/recipe-book";
import {
  useRecipeDetailQuery,
  useRecipeStatusQuery,
} from "@/entities/recipe/model/hooks";
import { useMyInfoQuery } from "@/entities/user/model/hooks";

import { useToggleRecipeSave } from "@/features/recipe-save/model/hooks";
import { useSaveToastWithChange } from "@/features/recipe-save/model/useSaveToastWithChange";

import { toDetailedRecipeItem } from "../model/duplicateRecipeMapper";
import { YoutubeMeta } from "../model/types";
import { DuplicateRecipeCard } from "./DuplicateRecipeCard";
import { DuplicateRecipeSkeleton } from "./DuplicateRecipeSkeleton";

type UrlSource = "direct" | "trending" | null;

type DuplicateRecipeSectionProps = {
  recipeId: string;
  youtubeMeta?: YoutubeMeta;
  urlSource?: UrlSource;
};

const DuplicateRecipeSection = ({
  recipeId,
  youtubeMeta,
  urlSource,
}: DuplicateRecipeSectionProps) => {
  const { user } = useMyInfoQuery();
  const { recipeData, isLoading } = useRecipeDetailQuery(recipeId);
  const { data: recipeStatus } = useRecipeStatusQuery(recipeId);

  const { mutate: toggleFavorite } = useToggleRecipeSave(recipeId);
  const { data: books } = useRecipeBooks();
  const defaultBook = books?.find((b) => b.isDefault);

  const { notifySaved, changeSheet } = useSaveToastWithChange(recipeId);

  const isFavorited = recipeStatus?.favoriteByCurrentUser ?? false;
  const hasAutoSavedRef = useRef(false);

  const handleSaveSuccess = useCallback(() => {
    triggerHaptic("Success");
    notifySaved(defaultBook);
  }, [notifySaved, defaultBook]);

  const handleSaveClick = () => {
    toggleFavorite(undefined, {
      onSuccess: handleSaveSuccess,
    });
  };

  useEffect(() => {
    const ready = !isLoading && recipeStatus !== undefined;
    const shouldAutoSave =
      ready &&
      !!user &&
      urlSource === "direct" &&
      !isFavorited &&
      !hasAutoSavedRef.current;

    if (!shouldAutoSave) return;

    hasAutoSavedRef.current = true;
    toggleFavorite(undefined, { onSuccess: handleSaveSuccess });
  }, [
    isLoading,
    recipeStatus,
    user,
    urlSource,
    isFavorited,
    toggleFavorite,
    handleSaveSuccess,
  ]);

  const recipeItem = recipeData
    ? toDetailedRecipeItem(recipeData, youtubeMeta)
    : null;

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <DuplicateRecipeSkeleton />
        ) : recipeItem ? (
          <DuplicateRecipeCard
            recipeId={recipeId}
            recipeItem={recipeItem}
            urlSource={urlSource}
            isFavorited={isFavorited}
            onSaveClick={handleSaveClick}
          />
        ) : null}
      </AnimatePresence>

      {changeSheet}
    </>
  );
};

export default DuplicateRecipeSection;
