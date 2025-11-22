"use client";

import CountUp from "@/shared/ui/shadcn/CountUp";

type Phase1AcquiredProps = {
  amount: number;
  onComplete: () => void;
};

const Phase1Acquired = ({ amount, onComplete }: Phase1AcquiredProps) => {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center">
      <p className="mb-4 text-lg font-medium text-gray-600">획득!</p>
      <div className="flex items-baseline gap-2">
        <span className="text-6xl font-bold text-olive-mint">+</span>
        <CountUp
          from={0}
          to={amount}
          duration={0.8}
          separator=","
          direction="up"
          className="text-7xl font-bold text-olive-mint"
          onEnd={onComplete}
        />
        <span className="text-5xl font-bold text-olive-mint">원</span>
      </div>
      <p className="mt-6 text-base text-gray-500">레시피오와 함께 절약했어요!</p>
    </div>
  );
};

export default Phase1Acquired;
