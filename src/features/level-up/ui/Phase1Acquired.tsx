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
        <span className="text-olive-mint text-6xl font-bold">+</span>
        <CountUp
          from={0}
          to={amount}
          duration={0.1}
          separator=","
          direction="up"
          className="text-olive-mint text-7xl font-bold"
          onEnd={onComplete}
        />
        <span className="text-olive-mint text-5xl font-bold">원</span>
      </div>
      <p className="mt-6 text-base text-gray-500">
        레시피오와 함께 절약했어요!
      </p>
    </div>
  );
};

export default Phase1Acquired;
