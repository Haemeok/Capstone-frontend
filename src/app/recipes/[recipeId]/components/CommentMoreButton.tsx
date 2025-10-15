"use client";

import { useRouter } from "next/navigation";

type CommentMoreButtonProps = {
  recipeId: number;
  text: string;
};

const CommentMoreButton = ({ recipeId, text }: CommentMoreButtonProps) => {
  const router = useRouter();

  const handleNavigateToComments = () => {
    router.push(`/recipes/${recipeId}/comments`);
  };

  return (
    <button
      className="text-olive-light cursor-pointer py-2 px-4"
      onClick={handleNavigateToComments}
    >
      <p className="text-sm font-bold">{text}</p>
    </button>
  );
};

export default CommentMoreButton;
