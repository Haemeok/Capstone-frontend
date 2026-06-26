"use client";

import { useState } from "react";

import { PlusIcon } from "lucide-react";

import { format, useUserPagesDict, useUserPagesLocale } from "@/shared/i18n";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";

import {
  getRecipeBookError,
  MAX_RECIPE_BOOKS,
  useMoveRecipes,
  useRecipeBooks,
} from "@/entities/recipe-book";

import { CreateRecipeBookSheet } from "@/features/recipe-book-create";

import { useToastStore } from "@/shared/ui/toast/model/store";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipeId: string;
  fromBookId?: string;
  onMoveComplete?: (toBookId: string, toBookName: string) => void;
};

export const ChangeBookSheet = ({
  open,
  onOpenChange,
  recipeId,
  fromBookId: fromBookIdProp,
  onMoveComplete,
}: Props) => {
  const locale = useUserPagesLocale();
  const t = useUserPagesDict().recipeBooks;
  const { Container, Content, Header, Title } = useResponsiveSheet();
  const { data: books } = useRecipeBooks();
  const moveMutation = useMoveRecipes();
  const addToast = useToastStore((s) => s.addToast);
  const [createOpen, setCreateOpen] = useState(false);

  const defaultBook = books?.find((b) => b.isDefault);
  const sortedBooks = [...(books ?? [])].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );
  const fromBookId = fromBookIdProp ?? defaultBook?.id ?? sortedBooks[0]?.id;
  const targets = (books ?? []).filter((b) => b.id !== fromBookId);
  const canCreateMore = (books?.length ?? 0) < MAX_RECIPE_BOOKS;

  const handleSelect = async (toBookId: string, toBookName: string) => {
    if (!fromBookId) {
      addToast({
        message: t.change.notFound,
        variant: "error",
      });
      return;
    }
    try {
      await moveMutation.mutateAsync({
        fromBookId,
        toBookId,
        recipeIds: [recipeId],
      });
      onOpenChange(false);
      if (onMoveComplete) {
        onMoveComplete(toBookId, toBookName);
      } else {
        addToast({
          message: format(t.change.toast, { name: toBookName }),
          variant: "success",
        });
      }
    } catch (error) {
      addToast({
        message: getRecipeBookError(error, locale).message,
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
          <span className="text-ink font-medium">{t.move.createNew}</span>
        </button>
      )}
      {targets.length === 0 ? (
        <p className="text-ink-muted px-4 py-6 text-center text-sm">
          {canCreateMore ? t.move.emptyWithCreate : t.move.empty}
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
                  {format(t.move.countSuffix, { count: b.recipeCount })}
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
              {t.change.heading}
            </Title>
          </Header>
          {Body}
        </Content>
      </Container>
      <CreateRecipeBookSheet open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
};
