"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/shared/ui/shadcn/button";

interface CommentMoreButtonProps {
  recipeId: number;
}

export function CommentMoreButton({ recipeId }: CommentMoreButtonProps) {
  const router = useRouter();

  const handleNavigateToComments = () => {
    router.push(`/recipes/${recipeId}/comments`);
  };

  return (
    <Button
      variant="ghost"
      className="text-olive-medium cursor-pointer font-semibold"
      onClick={handleNavigateToComments}
    >
      더 읽기
    </Button>
  );
}
