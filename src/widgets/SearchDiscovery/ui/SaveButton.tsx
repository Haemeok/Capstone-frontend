"use client";

import Link from "next/link";

import { Bookmark } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";

const SaveButton = () => {
  const handleClick = () => {
    triggerHaptic("Light");
  };

  return (
    <Link
      href="/recipe-books"
      onClick={handleClick}
      aria-label="저장한 레시피북"
      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 active:scale-95"
    >
      <Bookmark className="h-5 w-5" strokeWidth={2} />
    </Link>
  );
};

export default SaveButton;
