"use client";

import { AnimatePresence, motion } from "framer-motion";

type ServingsControlProps = {
  currentServings: number;
  minServings: number;
  maxServings: number;
  onIncrement: () => void;
  onDecrement: () => void;
  isReportMode?: boolean;
};

export const ServingsControl = ({
  currentServings,
  minServings,
  maxServings,
  onIncrement,
  onDecrement,
  isReportMode = false,
}: ServingsControlProps) => {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <AnimatePresence>
        {isReportMode && (
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-olive-light font-medium"
          >
            문제가 있는 재료를 눌러주세요
          </motion.p>
        )}
      </AnimatePresence>
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
