import { useState } from "react";
import ToggleIconButton from "./ToggleIconButton";
import { Heart } from "lucide-react";

type HeartButtonProps = {
  containerClassName?: string;
  buttonClassName?: string;
  onClick?: () => void;
  isCountShown?: boolean;
  ariaLabel?: string;
  width?: number;
  height?: number;
};

const HeartButton = ({
  containerClassName,
  buttonClassName,
  onClick,
  isCountShown,
  ariaLabel,
  width = 24,
  height = 24,
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
    <div
      className={`flex flex-col gap-1 justify-center items-center ${containerClassName}`}
    >
      <button
        onClick={() => handleToggle(!isLiked)}
        className={`flex items-center justify-center ${buttonClassName}`}
        aria-label={ariaLabel}
      >
        <Heart
          width={width}
          height={height}
          className={`${isCountShown ? "transition-all duration-200" : ""} ${
            isLiked ? "text-[#d12d2e] fill-[#d12d2e]" : ""
          } ${isAnimating ? "pulse" : ""}`}
        />
      </button>
      {isCountShown && <span className="text-sm font-bold">{likes}</span>}
    </div>
  );
};

export default HeartButton;
