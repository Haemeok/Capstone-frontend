"use client";

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

import { useToastStore } from "@/widgets/Toast/model/store";

import { useEditModeStore } from "../model/useEditModeStore";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fromBookId: string;
};

export const MoveRecipesSheet = ({
  open,
  onOpenChange,
  fromBookId,
}: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { data: books } = useRecipeBooks();
  const moveMutation = useMoveRecipes();
  const selectedIds = useEditModeStore((s) => s.selectedIds);
  const exit = useEditModeStore((s) => s.exit);
  const addToast = useToastStore((state) => state.addToast);

  const targets = (books ?? []).filter((b) => b.id !== fromBookId);
  const count = selectedIds.size;

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
    <div className="px-2 pb-6">
      {targets.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-gray-500">
          이동할 다른 레시피북이 없어요. 먼저 새 레시피북을 만들어주세요.
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
                <span className="text-sm text-gray-500">
                  {b.recipeCount}개
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="overflow-hidden border-0 bg-white shadow-xl sm:max-w-md sm:rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl font-bold text-gray-900">
              어느 레시피북으로 이동할까요?
            </DialogTitle>
          </DialogHeader>
          {Body}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="rounded-t-3xl">
        <DrawerHeader className="px-6 pt-6 pb-2 text-left">
          <DrawerTitle className="text-xl font-bold text-gray-900">
            어느 레시피북으로 이동할까요?
          </DrawerTitle>
        </DrawerHeader>
        {Body}
      </DrawerContent>
    </Drawer>
  );
};
