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
      className="relative rounded-full p-1 transition-colors hover:bg-gray-100"
    >
      <div className="relative h-fit w-fit p-1">
        <Bookmark size={24} className="text-gray-600" />
      </div>
    </Link>
  );
};

export default SaveButton;
