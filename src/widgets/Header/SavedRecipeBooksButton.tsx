"use client";

import Link from "next/link";

import { Bookmark } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";

const SavedRecipeBooksButton = () => {
  const handleClick = () => {
    triggerHaptic("Light");
  };

  return (
    <Link
      href="/recipe-books"
      onClick={handleClick}
      aria-label="저장한 레시피북"
      className="relative p-1 rounded-full hover:bg-gray-100 transition-colors"
    >
      <div className="h-fit w-fit relative p-1">
        <Bookmark size={24} className="text-gray-600" />
      </div>
    </Link>
  );
};

export default SavedRecipeBooksButton;
