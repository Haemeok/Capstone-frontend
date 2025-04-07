import { useState } from "react";
import ToggleIconButton from "./ToggleIconButton";
import { Heart } from "lucide-react";

type HeartButtonProps = {
  className?: string;
  onClick?: () => void;
  label?: string;
  ariaLabel?: string;
};

const HeartButton = ({
  className,
  onClick,
  label,
  ariaLabel,
}: HeartButtonProps) => {
  const [likes, setLikes] = useState(5);
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = (active: boolean) => {
    setIsLiked(active);
    setLikes((prev) => (active ? prev + 1 : prev - 1));

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <button
        onClick={() => handleToggle(!isLiked)}
        className={`w-10 h-10 flex items-center justify-center ${className}`}
        aria-label={ariaLabel}
      >
        <Heart
          width={24}
          height={24}
          className={`${label ? "transition-all duration-200" : ""} ${
            isLiked ? "text-red-700 fill-red-700" : ""
          } ${isAnimating ? "pulse" : ""}`}
        />
      </button>
      {label && <span className="mt-1 text-sm font-bold">{likes}</span>}
    </div>
  );
};

export default HeartButton;
