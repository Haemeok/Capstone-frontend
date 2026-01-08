"use client";

import { useEffect, useState } from "react";

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
        <button aria-label="배지 정보 표시" className="cursor-pointer">
          {badgeIcon}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-fit py-2" role="tooltip">
        <p className="text-sm text-gray-500">{badgeText}</p>
      </PopoverContent>
    </Popover>
  );
};

export default BadgeButton;
