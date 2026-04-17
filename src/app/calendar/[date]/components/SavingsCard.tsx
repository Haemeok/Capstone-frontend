import { ICON_BASE_URL } from "@/shared/config/constants/recipe";
import { formatNumber } from "@/shared/lib/format";
import { Image } from "@/shared/ui/image/Image";
import CountUp from "@/shared/ui/shadcn/CountUp";

type SavingsCardProps = {
  totalSavings: number;
  totalMarketPrice: number;
};

const SavingsCard = ({ totalSavings, totalMarketPrice }: SavingsCardProps) => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2.5">
        <Image
          src={`${ICON_BASE_URL}low_cost.webp`}
          alt="절약"
          wrapperClassName="h-7 w-7"
          imgClassName="object-contain"
          fit="contain"
          lazy={false}
        />
        <h3 className="text-lg font-bold text-gray-900">절약 리포트</h3>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <p className="text-base text-gray-500">배달/외식 했다면</p>
          <p className="mt-1 text-xl font-semibold text-gray-400 line-through decoration-red-400/60 decoration-2">
            {formatNumber(totalMarketPrice, "원")}
          </p>
        </div>

        <div className="h-px w-12 bg-gray-200" />

        <div className="text-center">
          <p className="text-base text-gray-600">직접 만들어서</p>
          <div className="mt-2 flex items-baseline justify-center gap-0.5">
            <span className="text-olive-mint text-4xl font-bold">+</span>
            <CountUp
              from={0}
              to={totalSavings}
              duration={0.5}
              separator=","
              direction="up"
              className="text-olive-mint text-4xl font-bold"
            />
            <span className="text-olive-mint text-3xl font-bold">원</span>
          </div>
          <p className="text-olive-dark mt-2 text-base font-semibold">
            절약했어요
          </p>
        </div>

        <p className="mt-1 text-center text-sm text-gray-400">
          외식 대비 약{" "}
          {formatNumber(totalMarketPrice - totalSavings, "원")} 추정
        </p>
      </div>
    </div>
  );
};

export default SavingsCard;
