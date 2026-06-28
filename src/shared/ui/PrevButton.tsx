"use client";

import { ArrowLeftIcon, XIcon } from "lucide-react";

import { useLocalizedRouter } from "@/shared/i18n";
import { useCommonDict } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";

type PrevButtonProps = {
  className?: string;
  onClick?: () => void;
  size?: number;
  showOnDesktop?: boolean;
  icon?: "back" | "close";
};

const PrevButton = ({
  className,
  onClick,
  size = 24,
  showOnDesktop = false,
  icon = "back",
}: PrevButtonProps) => {
  const router = useLocalizedRouter();

  const t = useCommonDict();
  const handleClick = onClick ?? (() => router.back());
  const Icon = icon === "close" ? XIcon : ArrowLeftIcon;
  const ariaLabel = icon === "close" ? t.actions.close : t.actions.back;

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center",
        !showOnDesktop && "md:hidden",
        className
      )}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      <Icon size={size} />
    </button>
  );
};

export default PrevButton;
