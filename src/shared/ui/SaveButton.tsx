import { Bookmark } from "lucide-react";

import { cn } from "@/shared/lib/utils";

type SaveButtonProps = {
  className?: string;
  iconClassName?: string;
  onClick?: () => void;
  label?: string;
  isFavorite: boolean;
};

const SaveButton = ({
  className,
  iconClassName,
  onClick,
  label,
  isFavorite,
}: SaveButtonProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.();
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleClick}
        className={className}
        aria-label={isFavorite ? "저장 해제" : "저장"}
        aria-pressed={isFavorite}
      >
        <Bookmark
          width={30}
          height={30}
          className={cn(
            "transition-all duration-300",
            iconClassName,
            isFavorite && "fill-dark"
          )}
        />
      </button>
      {label && <p className="mt-1 text-sm font-bold">{label}</p>}
    </div>
  );
};

export default SaveButton;
