import { useState } from 'react';
import ToggleIconButton from './ToggleIconButton';
import { Heart } from 'lucide-react';
import clsx from 'clsx';

type HeartButtonProps = {
  containerClassName?: string;
  buttonClassName?: string;
  onClick: () => void;
  isLiked: boolean;
  likeCount: number;
  isCountShown?: boolean;
  width?: number;
  height?: number;
};

const HeartButton = ({
  containerClassName,
  buttonClassName,
  onClick,
  isLiked,
  likeCount,
  isCountShown,
  width = 24,
  height = 24,
  ...props
}: HeartButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = (
    active: boolean,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    onClick();

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 250);
  };

  const finalButtonClassName = clsx(
    'nav-button-base',
    `flex items-center justify-center ${buttonClassName}`,
  );

  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 ${containerClassName}`}
    >
      <button
        onClick={(e) => handleToggle(!isLiked, e)}
        className={finalButtonClassName}
        {...props}
      >
        <Heart
          width={width}
          height={height}
          className={`${isCountShown ? 'transition-all duration-200' : ''} ${
            isLiked ? 'fill-[#d12d2e] text-[#d12d2e]' : ''
          } ${isAnimating ? 'beat' : ''}`}
        />
      </button>
      {isCountShown && <span className="text-sm font-bold">{likeCount}</span>}
    </div>
  );
};

export default HeartButton;
