"use client";

import { Bookmark } from "lucide-react";

import { LocalizedLink } from "@/shared/i18n";
import { useChromeDict } from "@/shared/i18n/useChromeDict";
import { triggerHaptic } from "@/shared/lib/bridge";

const SaveButton = () => {
  const nav = useChromeDict();

  const handleClick = () => {
    triggerHaptic("Light");
  };

  return (
    <LocalizedLink
      href="/recipe-books"
      onClick={handleClick}
      aria-label={nav.savedBooksAria}
      className="relative rounded-full p-1 transition-colors hover:bg-gray-100"
    >
      <div className="relative h-fit w-fit p-1">
        <Bookmark size={24} className="text-ink-sub" />
      </div>
    </LocalizedLink>
  );
};

export default SaveButton;
