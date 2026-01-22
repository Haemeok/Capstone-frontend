"use client";

type ServingsControlProps = {
  currentServings: number;
  minServings: number;
  maxServings: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export const ServingsControl = ({
  currentServings,
  minServings,
  maxServings,
  onIncrement,
  onDecrement,
}: ServingsControlProps) => {
  return (
    <div className="mb-3 flex items-center justify-end gap-2">
      <span className="text-sm text-gray-600">인분</span>
      <div className="flex items-center gap-1">
        {currentServings > minServings && (
          <button
            type="button"
            onClick={onDecrement}
            aria-label="인분 줄이기"
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-gray-200 text-sm text-gray-600 transition-colors hover:bg-gray-300"
          >
            -
          </button>
        )}
        <span className="w-10 text-center text-sm font-medium text-gray-800">
          {currentServings}
        </span>
        {currentServings < maxServings && (
          <button
            type="button"
            onClick={onIncrement}
            aria-label="인분 늘리기"
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-gray-200 text-sm text-gray-600 transition-colors hover:bg-gray-300"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
};
