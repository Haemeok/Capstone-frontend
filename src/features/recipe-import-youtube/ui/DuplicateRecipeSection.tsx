"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { triggerHaptic } from "@/shared/lib/bridge";

import {
  useRecipeDetailQuery,
  useRecipeStatusQuery,
} from "@/entities/recipe/model/hooks";
import { useRecipeBooks } from "@/entities/recipe-book";
import { useAuthGate } from "@/entities/user";
import { useMyInfoQuery } from "@/entities/user/model/hooks";

import { useToggleRecipeSave } from "@/features/recipe-save/model/hooks";
import { useSaveToastWithChange } from "@/features/recipe-save/model/useSaveToastWithChange";

import { toDetailedRecipeItem } from "../model/duplicateRecipeMapper";
import { YoutubeMeta } from "../model/types";
import { DuplicateRecipeSheet } from "./DuplicateRecipeSheet";

type UrlSource = "direct" | "trending" | null;

type DuplicateRecipeSectionProps = {
  recipeId: string;
  youtubeMeta?: YoutubeMeta;
  urlSource?: UrlSource;
  isEmbedded?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const DuplicateRecipeSection = ({
  recipeId,
  youtubeMeta,
  urlSource,
  isEmbedded = false,
  open,
  onOpenChange,
}: DuplicateRecipeSectionProps) => {
  const { user } = useMyInfoQuery();
  const { recipeData, isLoading } = useRecipeDetailQuery(recipeId);
  const { data: recipeStatus } = useRecipeStatusQuery(recipeId);

  const { mutate: toggleFavorite } = useToggleRecipeSave(recipeId);
  const authGate = useAuthGate();
  const { data: books } = useRecipeBooks({ enabled: authGate });
  const defaultBook = books?.find((b) => b.isDefault);

  const { notifySaved, changeSheet } = useSaveToastWithChange(recipeId);

  const isFavorited = recipeStatus?.favoriteByCurrentUser ?? false;
  const autoSaveAttemptedRecipeIdRef = useRef<string | null>(null);
  const [autoSavedRecipeId, setAutoSavedRecipeId] = useState<string | null>(
    null
  );

  const handleSaveSuccess = useCallback(() => {
    triggerHaptic("Success");
    notifySaved(defaultBook);
  }, [notifySaved, defaultBook]);

  const handleAutoSaveSuccess = useCallback(() => {
    setAutoSavedRecipeId(recipeId);
    handleSaveSuccess();
  }, [handleSaveSuccess, recipeId]);

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
      autoSaveAttemptedRecipeIdRef.current !== recipeId;

    if (!shouldAutoSave) return;

    autoSaveAttemptedRecipeIdRef.current = recipeId;
    toggleFavorite(undefined, { onSuccess: handleAutoSaveSuccess });
  }, [
    isLoading,
    recipeStatus,
    user,
    urlSource,
    isFavorited,
    recipeId,
    toggleFavorite,
    handleAutoSaveSuccess,
  ]);

  const recipeItem = recipeData
    ? toDetailedRecipeItem(recipeData, youtubeMeta)
    : null;

  return (
    <>
      {isLoading || recipeItem ? (
        <DuplicateRecipeSheet
          key={recipeId}
          recipeId={recipeId}
          recipeItem={recipeItem}
          isLoading={isLoading}
          isFavorited={isFavorited}
          wasAutoSaved={autoSavedRecipeId === recipeId}
          onSaveClick={handleSaveClick}
          isEmbedded={isEmbedded}
          open={open}
          onOpenChange={onOpenChange}
        />
      ) : null}

      {changeSheet}
    </>
  );
};

export default DuplicateRecipeSection;
