"use client";

import { useEffect, useState } from "react";

import { useUiCommonDict } from "@/shared/i18n";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/shadcn/popover";

type BadgeButtonProps = {
  badgeText: string;
  badgeIcon: React.ReactNode;
};

const BadgeButton = ({ badgeText, badgeIcon }: BadgeButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useUiCommonDict();

  useEffect(() => {
    if (isOpen) {
      const handleScroll = () => {
        setIsOpen(false);
      };

      window.addEventListener("scroll", handleScroll, true);

      const timerId = setTimeout(() => {
        setIsOpen(false);
      }, 3000);

      return () => {
        clearTimeout(timerId);
        window.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button aria-label={t.badge.infoToggleAria} className="cursor-pointer">
          {badgeIcon}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-fit py-2" role="tooltip">
        <p className="text-ink-muted text-sm">{badgeText}</p>
      </PopoverContent>
    </Popover>
  );
};

export default BadgeButton;
