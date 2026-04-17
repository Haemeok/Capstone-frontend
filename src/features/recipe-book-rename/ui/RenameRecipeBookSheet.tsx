"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  recipeBookFormSchema,
  type RecipeBookFormValues,
  useRecipeBooks,
  useUpdateRecipeBookName,
  getRecipeBookErrorMessage,
} from "@/entities/recipe-book";

import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/shadcn/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/shadcn/dialog";
import { useToastStore } from "@/widgets/Toast/model/store";

const NAME_MAX_LENGTH = 50;
const DUPLICATE_ERROR_HINT = "같은 이름";
const DEFAULT_BOOK_HINT = "기본 폴더";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
  currentName: string;
};

export const RenameRecipeBookSheet = ({
  open,
  onOpenChange,
  bookId,
  currentName,
}: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { data: books } = useRecipeBooks();
  const updateMutation = useUpdateRecipeBookName(bookId);
  const addToast = useToastStore((state) => state.addToast);

  const form = useForm<RecipeBookFormValues>({
    resolver: zodResolver(recipeBookFormSchema),
    defaultValues: { name: currentName },
  });

  useEffect(() => {
    if (open) form.reset({ name: currentName });
  }, [open, currentName, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    const trimmed = values.name.trim();
    if (trimmed === currentName) {
      onOpenChange(false);
      return;
    }
    const isDuplicate =
      books?.some((b) => b.id !== bookId && b.name === trimmed) ?? false;
    if (isDuplicate) {
      form.setError("name", { message: "이미 같은 이름의 폴더가 있어요" });
      return;
    }
    try {
      await updateMutation.mutateAsync({ name: trimmed });
      addToast({ message: "폴더 이름이 변경되었어요", variant: "success" });
      onOpenChange(false);
    } catch (error) {
      const message = getRecipeBookErrorMessage(error);
      if (
        message.includes(DUPLICATE_ERROR_HINT) ||
        message.includes(DEFAULT_BOOK_HINT)
      ) {
        form.setError("name", { message });
      } else {
        addToast({ message, variant: "error" });
      }
    }
  });

  const value = form.watch("name");
  const error = form.formState.errors.name?.message;

  const Body = (
    <form onSubmit={onSubmit} className="space-y-4 px-6 pb-6">
      <div>
        <input
          {...form.register("name")}
          placeholder="폴더 이름"
          maxLength={NAME_MAX_LENGTH}
          className="focus:border-olive-light focus:ring-olive-light w-full rounded-xl border border-gray-200 p-4 text-gray-900 transition-colors placeholder:text-gray-400 focus:ring-1 focus:outline-none"
          autoFocus
        />
        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm text-red-500">{error ?? ""}</span>
          <span className="text-sm text-gray-400">
            {value.length} / {NAME_MAX_LENGTH}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className="h-12 flex-1 rounded-xl bg-gray-100 font-medium text-gray-700 transition-colors hover:bg-gray-200"
          onClick={() => onOpenChange(false)}
        >
          취소
        </button>
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="bg-olive-light h-12 flex-1 rounded-xl font-bold text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
        >
          {updateMutation.isPending ? "변경 중..." : "변경"}
        </button>
      </div>
    </form>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="overflow-hidden border-0 bg-white shadow-xl sm:max-w-md sm:rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-xl font-bold text-gray-900">
              폴더 이름 변경
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
        <DrawerHeader className="px-6 pt-6 pb-4 text-left">
          <DrawerTitle className="text-xl font-bold text-gray-900">
            폴더 이름 변경
          </DrawerTitle>
        </DrawerHeader>
        {Body}
      </DrawerContent>
    </Drawer>
  );
};
