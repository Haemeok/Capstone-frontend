import { formatNumber } from "@/shared/lib/format";
import CountUp from "@/shared/ui/shadcn/CountUp";

type SavingsCardProps = {
  totalSavings: number;
  totalMarketPrice: number;
};

const SavingsCard = ({ totalSavings, totalMarketPrice }: SavingsCardProps) => {
  return (
    <div className="border-olive-light/30 mx-4 mb-4 rounded-2xl border-1 p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <p className="mb-1 text-sm text-gray-500">배달/외식 했다면</p>
          <p className="text-2xl font-bold text-gray-400 line-through decoration-red-400 decoration-2">
            {formatNumber(totalMarketPrice, "원")}
          </p>
        </div>

        <div className="text-center">
          <p className="mb-2 text-sm text-gray-600">내가 직접 만들어서</p>
          <div className="flex items-center justify-center gap-1">
            <p className="text-olive-mint text-center text-5xl font-bold">+</p>
            <CountUp
              from={0}
              to={totalSavings}
              duration={0.5}
              separator=","
              direction="up"
              className="text-olive-mint text-5xl font-bold"
            />
            <span className="text-olive-mint text-4xl font-bold">원</span>
          </div>
          <p className="text-olive-dark mt-2 text-base font-semibold">
            절약했어요!
          </p>
        </div>

        <p className="mt-1 text-center text-xs text-gray-400">
          외식 대비 인건비·배달비 등 절약 (약{" "}
          {formatNumber(totalMarketPrice - totalSavings, "원")} 추정)
        </p>
      </div>
    </div>
  );
};

export default SavingsCard;
