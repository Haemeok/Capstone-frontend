import { useState } from 'react';
import ToggleIconButton from './ToggleIconButton';
import { Heart } from 'lucide-react';
import clsx from 'clsx';
import { cn } from '@/lib/utils';

type HeartButtonProps = {
  containerClassName?: string;
  buttonClassName?: string;
  iconClassName?: string;
  onClick: () => void;
  isLiked: boolean;
  likeCount: number;
  isCountShown?: boolean;
  width?: number;
  height?: number;
  isOnNavbar?: boolean;
};

const HeartButton = ({
  containerClassName,
  buttonClassName = '',
  iconClassName = '',
  onClick,
  isLiked,
  likeCount,
  isCountShown,
  width = 24,
  height = 24,
  isOnNavbar = false,
  ...props
}: HeartButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClick();

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 250);
  };

  const finalButtonClassName = clsx(
    isOnNavbar ? 'nav-button-base' : '',
    `flex items-center justify-center ${buttonClassName}`,
  );

  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 ${containerClassName}`}
    >
      <button
        onClick={(e) => handleToggle(e)}
        className={finalButtonClassName}
        {...props}
      >
        <Heart
          width={width}
          height={height}
          className={cn(
            iconClassName,
            isLiked ? 'fill-[#d12d2e] text-[#d12d2e]' : '',
            isAnimating ? 'beat' : '',
          )}
        />
      </button>
      {isCountShown && <span className="text-sm font-bold">{likeCount}</span>}
    </div>
  );
};

export default HeartButton;
