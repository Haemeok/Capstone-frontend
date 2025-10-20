"use client";

import Link from "next/link";

type CommentMoreButtonProps = {
  recipeId: number;
  text: string;
};

const CommentMoreButton = ({ recipeId, text }: CommentMoreButtonProps) => {
  return (
    <Link
      href={`/recipes/${recipeId}/comments`}
      prefetch={false}
      className="text-olive-light cursor-pointer py-2 px-4 block text-center"
    >
      <p className="text-sm font-bold">{text}</p>
    </Link>
  );
};

export default CommentMoreButton;
