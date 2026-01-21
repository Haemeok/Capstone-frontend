"use client";

import { Share2 } from "lucide-react";

import { useShare } from "@/shared/hooks/useShare";
import { cn } from "@/shared/lib/utils";
import { triggerHaptic } from "@/shared/lib/bridge";

type ShareButtonProps = {
  className?: string;
  label?: string;
  title?: string;
  text?: string;
  url?: string;
};

const ShareButton = ({
  className,
  label,
  title,
  text,
  url,
  ...props
}: ShareButtonProps) => {
  const { share } = useShare();

  const handleShareClick = () => {
    triggerHaptic("Light");
    share({ title, text, url });
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleShareClick}
        className={cn("flex h-10 w-10 items-center justify-center", className)}
        aria-label={label || "공유하기"}
        {...props}
      >
        <Share2 width={24} height={24} />
      </button>
      {label && <p className="mt-1 text-sm font-bold">{label}</p>}
    </div>
  );
};

export default ShareButton;
