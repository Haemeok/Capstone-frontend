"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import { format, useRecipeActionsDict } from "@/shared/i18n";
import { useToastStore } from "@/shared/ui/toast";

const ChangeBookSheet = dynamic(
  () =>
    import("@/features/recipe-book-change").then((mod) => mod.ChangeBookSheet),
  { ssr: false }
);

type NotifyTarget = { id: string; name: string } | undefined;

export const useSaveToastWithChange = (recipeId: string) => {
  const { addToast } = useToastStore();
  const t = useRecipeActionsDict();
  const [changeOpen, setChangeOpen] = useState(false);
  const [hasOpenedChange, setHasOpenedChange] = useState(false);
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
        onClick: () => {
          setHasOpenedChange(true);
          setChangeOpen(true);
        },
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

  const changeSheet = hasOpenedChange ? (
    <ChangeBookSheet
      open={changeOpen}
      onOpenChange={setChangeOpen}
      recipeId={recipeId}
      fromBookId={currentBookId}
      onMoveComplete={handleMoveComplete}
    />
  ) : null;

  return { notifySaved, changeSheet };
};
