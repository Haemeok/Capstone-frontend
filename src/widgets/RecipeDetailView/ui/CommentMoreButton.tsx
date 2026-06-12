"use client";

import Link from "next/link";

import { useRecipeStatus } from "@/features/recipe-status";

type CommentMoreButtonProps = {
  text: string;
};

const CommentMoreButton = ({ text }: CommentMoreButtonProps) => {
  const { recipeId } = useRecipeStatus();
  return (
    <Link
      href={`/recipes/${recipeId}/comments`}
      prefetch={false}
      className="text-olive-light block cursor-pointer px-4 py-2 text-center"
    >
      <p className="text-sm font-bold">{text}</p>
    </Link>
  );
};

export default CommentMoreButton;
