"use client";

import { useRouter } from "next/navigation";

import { ArrowLeftIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";

type PrevButtonProps = {
  className?: string;
  onClick?: () => void;
  size?: number;
  showOnDesktop?: boolean;
};

const PrevButton = ({
  className,
  onClick,
  size = 24,
  showOnDesktop = false,
}: PrevButtonProps) => {
  const router = useRouter();

  const handleClick = onClick ?? (() => router.back());

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center",
        !showOnDesktop && "md:hidden",
        className
      )}
      onClick={handleClick}
      aria-label="뒤로 가기"
    >
      <ArrowLeftIcon size={size} />
    </button>
  );
};

export default PrevButton;
