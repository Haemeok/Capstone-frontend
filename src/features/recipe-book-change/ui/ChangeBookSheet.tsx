"use client";

import { useState } from "react";

import { PlusIcon } from "lucide-react";

import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/shadcn/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/shadcn/drawer";

import {
  getRecipeBookErrorMessage,
  useMoveRecipes,
  useRecipeBooks,
} from "@/entities/recipe-book";

import { CreateRecipeBookSheet } from "@/features/recipe-book-create";

import { useToastStore } from "@/widgets/Toast/model/store";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipeId: string;
  fromBookId: string;
};

const DESKTOP_BREAKPOINT = "(min-width: 768px)";

export const ChangeBookSheet = ({
  open,
  onOpenChange,
  recipeId,
  fromBookId,
}: Props) => {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT);
  const { data: books } = useRecipeBooks();
  const moveMutation = useMoveRecipes();
  const addToast = useToastStore((s) => s.addToast);
  const [createOpen, setCreateOpen] = useState(false);

  const targets = (books ?? []).filter((b) => b.id !== fromBookId);

  const handleSelect = async (toBookId: string, toBookName: string) => {
    try {
      await moveMutation.mutateAsync({
        fromBookId,
        toBookId,
        recipeIds: [recipeId],
      });
      addToast({
        message: `${toBookName}으로 이동했어요`,
        variant: "success",
      });
      onOpenChange(false);
    } catch (error) {
      addToast({
        message: getRecipeBookErrorMessage(error),
        variant: "error",
      });
    }
  };

  const Body = (
    <div className="px-2 pb-6">
      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-xl px-4 py-4 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
        onClick={() => setCreateOpen(true)}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-olive-light/10 text-olive-light">
          <PlusIcon size={18} />
        </span>
        <span className="font-medium text-gray-900">새 레시피북 만들기</span>
      </button>
      {targets.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-gray-500">
          이동할 다른 레시피북이 없어요. 새로 만들어보세요.
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
                <span className="font-medium text-gray-900">{b.name}</span>
                <span className="text-sm text-gray-500">{b.recipeCount}개</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const sheet = isDesktop ? (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border-0 bg-white shadow-xl sm:max-w-md sm:rounded-2xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold text-gray-900">
            어느 레시피북으로 옮길까요?
          </DialogTitle>
        </DialogHeader>
        {Body}
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="rounded-t-3xl">
        <DrawerHeader className="px-6 pt-6 pb-2 text-left">
          <DrawerTitle className="text-xl font-bold text-gray-900">
            어느 레시피북으로 옮길까요?
          </DrawerTitle>
        </DrawerHeader>
        {Body}
      </DrawerContent>
    </Drawer>
  );

  return (
    <>
      {sheet}
      <CreateRecipeBookSheet open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
};
