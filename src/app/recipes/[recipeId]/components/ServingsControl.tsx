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
    <div className="mb-3 flex items-center justify-between gap-2">
      <p className="text-xs text-gray-400">
        💡 간과 양념은 취향에 따라 다를 수 있어요.
        <br />
        조금씩 나눠 넣으며 맛을 봐주세요!
      </p>
      <div className="flex items-center gap-2 ml-auto">
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
    </div>
  );
};
