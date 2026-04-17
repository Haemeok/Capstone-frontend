"use client";

import { useState } from "react";

import { ChangeBookSheet } from "@/features/recipe-book-change";

import { useToastStore } from "@/widgets/Toast";

type NotifyTarget = { id: string; name: string } | undefined;

export const useSaveToastWithChange = (recipeId: string) => {
  const { addToast } = useToastStore();
  const [changeOpen, setChangeOpen] = useState(false);
  const [currentBookId, setCurrentBookId] = useState<string | undefined>();

  const showSaveToast = (bookName: string | undefined) => {
    addToast({
      message: bookName
        ? `${bookName}에 저장되었습니다.`
        : `"저장된 레시피"에 보관되었습니다.`,
      variant: "action",
      position: "bottom",
      action: {
        label: "변경",
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
