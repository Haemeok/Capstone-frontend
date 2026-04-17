"use client";

import { useRouter } from "next/navigation";

import { ArrowLeftIcon, XIcon } from "lucide-react";

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
  const router = useRouter();

  const handleClick = onClick ?? (() => router.back());
  const Icon = icon === "close" ? XIcon : ArrowLeftIcon;
  const ariaLabel = icon === "close" ? "닫기" : "뒤로 가기";

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
