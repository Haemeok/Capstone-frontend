"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/shared/ui/shadcn/button";

type CommentMoreButtonProps = {
  recipeId: number;
};

const CommentMoreButton = ({ recipeId }: CommentMoreButtonProps) => {
  const router = useRouter();

  const handleNavigateToComments = () => {
    router.push(`/recipes/${recipeId}/comments`);
  };

  return (
    <Button
      variant="ghost"
      className="text-olive-medium cursor-pointer font-bold"
      onClick={handleNavigateToComments}
    >
      더 읽기
    </Button>
  );
};

export default CommentMoreButton;
