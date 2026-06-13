"use client";

import type { MouseEvent } from "react";
import Link from "next/link";

import { Bookmark } from "lucide-react";

import { useChromeDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";

import { useUserStore } from "@/entities/user/model/store";

import { useLoginEncourageDrawerStore } from "@/widgets/LoginEncourageDrawer/model/store";

const SavedRecipeBooksButton = () => {
  const t = useChromeDict();
  const { user } = useUserStore();
  const { openDrawer } = useLoginEncourageDrawerStore();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    triggerHaptic("Light");

    if (!user) {
      e.preventDefault();
      openDrawer({
        icon: <Bookmark size={24} className="text-olive-light" />,
        message: t.savedBooksToast,
      });
    }
  };

  return (
    <Link
      href="/recipe-books"
      onClick={handleClick}
      aria-label={t.savedBooksAria}
      className="relative rounded-full p-1 transition-colors hover:bg-gray-100"
    >
      <div className="relative h-fit w-fit p-1">
        <Bookmark size={24} className="text-ink-sub" />
      </div>
    </Link>
  );
};

export default SavedRecipeBooksButton;
