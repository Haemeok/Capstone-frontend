import { useState } from 'react';
import ToggleIconButton from './ToggleIconButton';
import { Heart } from 'lucide-react';

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

  const handleToggle = (
    active: boolean,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    setIsLiked(active);
    setLikes((prev) => (active ? prev + 1 : prev - 1));

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 250);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 ${containerClassName}`}
    >
      <button
        onClick={(e) => handleToggle(!isLiked, e)}
        className={`flex items-center justify-center ${buttonClassName}`}
        aria-label={ariaLabel}
      >
        <Heart
          width={width}
          height={height}
          className={`${isCountShown ? 'transition-all duration-200' : ''} ${
            isLiked ? 'fill-[#d12d2e] text-[#d12d2e]' : ''
          } ${isAnimating ? 'beat' : ''}`}
        />
      </button>
      {isCountShown && <span className="text-sm font-bold">{likes}</span>}
    </div>
  );
};

export default HeartButton;
