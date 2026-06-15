"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useUserPagesDict, useUserPagesLocale } from "@/shared/i18n";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";

import {
  buildRecipeBookFormSchema,
  FIELD_ERROR_CODES,
  getRecipeBookError,
  type RecipeBookFormValues,
  useRecipeBooks,
  useUpdateRecipeBookName,
} from "@/entities/recipe-book";

import { useToastStore } from "@/widgets/Toast/model/store";

const NAME_MAX_LENGTH = 50;

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
  const t = useUserPagesDict().recipeBooks;
  const locale = useUserPagesLocale();
  const { Container, Content, Header, Title } = useResponsiveSheet();
  const { data: books } = useRecipeBooks();
  const updateMutation = useUpdateRecipeBookName(bookId);
  const addToast = useToastStore((state) => state.addToast);

  const schema = useMemo(
    () => buildRecipeBookFormSchema(t.validation),
    [t.validation]
  );

  const form = useForm<RecipeBookFormValues>({
    resolver: zodResolver(schema),
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
      form.setError("name", { message: t.errors[1107] });
      return;
    }
    try {
      await updateMutation.mutateAsync({ name: trimmed });
      addToast({ message: t.rename.toast, variant: "success" });
      onOpenChange(false);
    } catch (error) {
      const { code, message } = getRecipeBookError(error, locale);
      if (code !== null && FIELD_ERROR_CODES.has(code)) {
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
          placeholder={t.rename.placeholder}
          maxLength={NAME_MAX_LENGTH}
          className="focus:border-olive-light focus:ring-olive-light text-ink w-full rounded-xl border border-gray-200 p-4 transition-colors placeholder:text-gray-400 focus:ring-1 focus:outline-none"
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
          className="text-ink-sub h-12 flex-1 rounded-xl bg-gray-100 font-medium transition-colors hover:bg-gray-200"
          onClick={() => onOpenChange(false)}
        >
          {t.rename.cancel}
        </button>
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="bg-olive-light h-12 flex-1 rounded-xl font-bold text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
        >
          {updateMutation.isPending ? t.rename.submitting : t.rename.submit}
        </button>
      </div>
    </form>
  );

  return (
    <Container open={open} onOpenChange={onOpenChange}>
      <Content className="overflow-hidden border-0 bg-white shadow-xl sm:max-w-md sm:rounded-2xl">
        <Header className="px-6 pt-6 pb-4 text-left">
          <Title className="text-ink text-xl font-bold">{t.rename.title}</Title>
        </Header>
        {Body}
      </Content>
    </Container>
  );
};
