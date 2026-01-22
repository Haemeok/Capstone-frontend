"use client";

import CountUp from "@/shared/ui/shadcn/CountUp";

type Phase1AcquiredProps = {
  amount: number;
  onComplete: () => void;
};

const Phase1Acquired = ({ amount, onComplete }: Phase1AcquiredProps) => {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-8">
      <p className="mb-3 text-base font-medium text-gray-500">획득!</p>
      <div className="flex items-baseline gap-1">
        <span className="text-olive-mint text-3xl font-bold">+</span>
        <CountUp
          from={0}
          to={amount}
          duration={0.1}
          separator=","
          direction="up"
          className="text-olive-mint text-[44px] font-extrabold tracking-tight"
          onEnd={onComplete}
        />
        <span className="text-olive-mint text-2xl font-bold">원</span>
      </div>
      <p className="mt-4 text-sm text-gray-500">
        레시피오와 함께 절약했어요!
      </p>
    </div>
  );
};

export default Phase1Acquired;
