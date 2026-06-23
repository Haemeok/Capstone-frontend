"use client";

import { useState } from "react";

import { format, useRecipeActionsDict } from "@/shared/i18n";

import { ChangeBookSheet } from "@/features/recipe-book-change";

import { useToastStore } from "@/widgets/Toast";

type NotifyTarget = { id: string; name: string } | undefined;

export const useSaveToastWithChange = (recipeId: string) => {
  const { addToast } = useToastStore();
  const t = useRecipeActionsDict();
  const [changeOpen, setChangeOpen] = useState(false);
  const [currentBookId, setCurrentBookId] = useState<string | undefined>();

  const showSaveToast = (bookName: string | undefined) => {
    addToast({
      message: bookName
        ? format(t.savedToBook, { bookName })
        : t.savedToDefault,
      variant: "action",
      position: "bottom",
      action: {
        label: t.changeBookAction,
        onClick: () => setChangeOpen(true),
      },
    });
  };

  const notifySaved = (target: NotifyTarget) => {
    setCurrentBookId(target?.id);
    showSaveToast(target?.name);
  };

  const handleMoveComplete = (toBookId: string, toBookName: string) => {
    setCurrentBookId(toBookId);
    showSaveToast(toBookName);
  };

  const changeSheet = (
    <ChangeBookSheet
      open={changeOpen}
      onOpenChange={setChangeOpen}
      recipeId={recipeId}
      fromBookId={currentBookId}
      onMoveComplete={handleMoveComplete}
    />
  );

  return { notifySaved, changeSheet };
};
