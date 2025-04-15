import React, { useState, useEffect, useRef } from 'react';
import StarIcon from './StarIcon';

type Size = 'sm' | 'md' | 'lg' | 'xl';

type RatingProps = {
  count?: number;
  value?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: Size;
  showValue?: boolean;
  precision?: number;
  allowHalf?: boolean;
  className?: string;
};

const Ratings = ({
  count = 5,
  value = 0,
  onChange,
  readOnly = false,
  size = 'md',
  showValue = false,
  precision = 1,
  allowHalf = false,
  className = '',
}: RatingProps) => {
  const [hoverValue, setHoverValue] = useState<number>(0);
  const starRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    starRefs.current = starRefs.current.slice(0, count);
  }, [count]);

  const sizeClasses: Record<Size, string> = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10',
  };

  const roundToNearest = (val: number): number => {
    const inv = 1.0 / precision;
    return Math.round(val * inv) / inv;
  };

  const handleClick = (
    idx: number,
    event: React.MouseEvent<HTMLDivElement>,
  ): void => {
    if (readOnly || !onChange) return;

    let newValue = idx + 1;

    if (allowHalf && starRefs.current[idx]) {
      const rect = starRefs.current[idx]?.getBoundingClientRect();
      if (rect) {
        const halfPoint = rect.left + rect.width / 2;

        if (event.clientX < halfPoint) {
          newValue = idx + 0.5;
        }
      }
    }

    const finalValue = Math.abs(value - newValue) < 0.1 ? 0 : newValue;
    onChange(roundToNearest(finalValue));
  };

  const handleMouseMove = (
    idx: number,
    event: React.MouseEvent<HTMLDivElement>,
  ): void => {
    if (readOnly) return;

    let val = idx + 1;

    if (allowHalf && starRefs.current[idx]) {
      const rect = starRefs.current[idx]?.getBoundingClientRect();
      if (rect) {
        const halfPoint = rect.left + rect.width / 2;

        if (event.clientX < halfPoint) {
          val = idx + 0.5;
        }
      }
    }

    setHoverValue(val);
  };

  const handleMouseLeave = (): void => {
    if (readOnly) return;
    setHoverValue(0);
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="flex items-center gap-4">
        {[...Array(count)].map((_, idx) => {
          const starValue = idx + 1;
          const currentValue = hoverValue || value;

          const isFilled = currentValue >= starValue;

          const isHalfFilled =
            allowHalf &&
            currentValue >= starValue - 0.5 &&
            currentValue < starValue;

          return (
            <div
              key={idx}
              className={`${sizeClasses[size]} cursor-pointer`}
              ref={(el) => {
                starRefs.current[idx] = el;
              }}
              onClick={(e) => handleClick(idx, e)}
              onMouseMove={(e) => handleMouseMove(idx, e)}
              onMouseLeave={handleMouseLeave}
            >
              <StarIcon
                filled={isFilled}
                halfFilled={isHalfFilled}
                hovered={hoverValue > 0 && hoverValue >= starValue - 0.5}
              />
            </div>
          );
        })}

        {showValue && (
          <span className="ml-2 text-sm font-medium">
            {hoverValue > 0 ? hoverValue.toFixed(1) : value.toFixed(1)} /{' '}
            {count}
          </span>
        )}
      </div>
    </div>
  );
};

export default Ratings;
