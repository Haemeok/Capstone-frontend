"use client";

import type { MouseEvent } from "react";
import Link from "next/link";

import { Bookmark } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";

import { useUserStore } from "@/entities/user/model/store";

import { useLoginEncourageDrawerStore } from "@/widgets/LoginEncourageDrawer/model/store";

const SavedRecipeBooksButton = () => {
  const { user } = useUserStore();
  const { openDrawer } = useLoginEncourageDrawerStore();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    triggerHaptic("Light");

    if (!user) {
      e.preventDefault();
      openDrawer({
        icon: <Bookmark size={24} className="text-olive-light" />,
        message: "저장한 레시피북을 확인해보세요!",
      });
    }
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

export default SavedRecipeBooksButton;
