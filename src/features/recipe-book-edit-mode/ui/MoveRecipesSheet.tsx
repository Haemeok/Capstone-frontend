"use client";

import { useState } from "react";

import { PlusIcon } from "lucide-react";

import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";

import {
  getRecipeBookErrorMessage,
  MAX_RECIPE_BOOKS,
  useMoveRecipes,
  useRecipeBooks,
} from "@/entities/recipe-book";

import { CreateRecipeBookSheet } from "@/features/recipe-book-create";

import { useToastStore } from "@/widgets/Toast/model/store";

import { useEditModeStore } from "../model/useEditModeStore";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fromBookId: string;
};

export const MoveRecipesSheet = ({ open, onOpenChange, fromBookId }: Props) => {
  const { Container, Content, Header, Title } = useResponsiveSheet();
  const { data: books } = useRecipeBooks();
  const moveMutation = useMoveRecipes();
  const selectedIds = useEditModeStore((s) => s.selectedIds);
  const exit = useEditModeStore((s) => s.exit);
  const addToast = useToastStore((state) => state.addToast);
  const [createOpen, setCreateOpen] = useState(false);

  const targets = (books ?? []).filter((b) => b.id !== fromBookId);
  const count = selectedIds.size;
  const canCreateMore = (books?.length ?? 0) < MAX_RECIPE_BOOKS;

  const handleSelect = async (toBookId: string, toBookName: string) => {
    if (count === 0) return;
    try {
      await moveMutation.mutateAsync({
        fromBookId,
        toBookId,
        recipeIds: Array.from(selectedIds),
      });
      addToast({
        message: `${count}개를 ${toBookName}으로 이동했어요`,
        variant: "success",
      });
      onOpenChange(false);
      exit();
    } catch (error) {
      addToast({
        message: getRecipeBookErrorMessage(error),
        variant: "error",
      });
    }
  };

  const Body = (
    <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-6">
      {canCreateMore && (
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-4 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
          onClick={() => setCreateOpen(true)}
        >
          <span className="bg-olive-light/10 text-olive-light flex h-8 w-8 items-center justify-center rounded-full">
            <PlusIcon size={18} />
          </span>
          <span className="text-ink font-medium">새 레시피북 만들기</span>
        </button>
      )}
      {targets.length === 0 ? (
        <p className="text-ink-muted px-4 py-6 text-center text-sm">
          {canCreateMore
            ? "이동할 다른 레시피북이 없어요. 새로 만들어보세요."
            : "이동할 다른 레시피북이 없어요."}
        </p>
      ) : (
        <ul>
          {targets.map((b) => (
            <li key={b.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl px-4 py-4 text-left transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50"
                onClick={() => handleSelect(b.id, b.name)}
                disabled={moveMutation.isPending}
              >
                <span className="text-ink font-medium">{b.name}</span>
                <span className="text-ink-muted text-sm">
                  {b.recipeCount}개
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <>
      <Container open={open} onOpenChange={onOpenChange}>
        <Content className="flex flex-col overflow-hidden border-0 bg-white shadow-xl sm:max-h-[85vh] sm:max-w-md sm:rounded-2xl">
          <Header className="px-6 pt-6 pb-2 text-left">
            <Title className="text-ink text-xl font-bold">
              어느 레시피북으로 이동할까요?
            </Title>
          </Header>
          {Body}
        </Content>
      </Container>
      <CreateRecipeBookSheet open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
};
