"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";

import { Container } from "@/shared/ui/Container";

import { useRecipeBooks } from "@/entities/recipe-book";

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

  const [allRecipeIds, setAllRecipeIds] = useState<string[]>([]);

  // Page unmount → exit edit mode (so navigating between books resets state)
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
    <Container className="min-h-screen bg-white">
      <RecipeBookDetailHeader book={book} />
      <RecipeBookRecipeGrid bookId={bookId} onAllIdsChange={setAllRecipeIds} />
      <EditModeBottomBar bookId={bookId} allRecipeIds={allRecipeIds} />
    </Container>
  );
}
