"use client";

import { useEffect } from "react";
import { notFound, useParams } from "next/navigation";

import { Container } from "@/shared/ui/Container";

import { useRecipeBooks, useUnseenImportStore } from "@/entities/recipe-book";

import {
  EditModeBottomBar,
  useEditModeStore,
} from "@/features/recipe-book-edit-mode";

import {
  RecipeBookDetailHeader,
  RecipeBookRecipeGrid,
} from "@/widgets/RecipeBookDetail";

export default function RecipeBookDetailPage() {
  const params = useParams<{ bookId: string }>();
  const bookId = params?.bookId ?? "";
  const { data: books, isLoading } = useRecipeBooks();
  const exit = useEditModeStore((s) => s.exit);
  const clearUnseen = useUnseenImportStore((s) => s.clearUnseen);

  useEffect(() => {
    clearUnseen();
  }, [clearUnseen]);

  useEffect(() => {
    return () => exit();
  }, [exit]);

  if (isLoading) {
    return (
      <Container>
        <div className="h-14 border-b border-gray-100 bg-white" />
      </Container>
    );
  }

  const book = books?.find((b) => b.id === bookId);

  if (!book) {
    notFound();
  }

  return (
    <Container className="pt-0">
      <RecipeBookDetailHeader book={book} />
      <RecipeBookRecipeGrid bookId={bookId} />
      <EditModeBottomBar bookId={bookId} />
    </Container>
  );
}
