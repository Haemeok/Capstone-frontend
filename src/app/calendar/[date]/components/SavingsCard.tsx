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
    <section className="py-6">
      <div className="mb-5 flex items-center gap-2">
        <Image
          src={`${ICON_BASE_URL}low_cost.webp`}
          alt="절약"
          wrapperClassName="h-6 w-6"
          imgClassName="object-contain"
          fit="contain"
          lazy={false}
        />
        <h3 className="text-ink text-lg font-bold">절약</h3>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="text-center">
          <p className="text-ink-muted text-sm">배달/외식 했다면</p>
          <p className="mt-1 text-lg font-semibold text-gray-400 line-through decoration-gray-300 decoration-2">
            {formatNumber(totalMarketPrice, "원")}
          </p>
        </div>

        <div className="text-center">
          <p className="text-ink-sub text-base">직접 만들어서</p>
          <div className="mt-1 flex items-baseline justify-center gap-0.5">
            <span className="text-olive-dark text-4xl font-bold">+</span>
            <CountUp
              from={0}
              to={totalSavings}
              duration={0.5}
              separator=","
              direction="up"
              className="text-olive-dark text-4xl font-bold"
            />
            <span className="text-olive-dark text-3xl font-bold">원</span>
          </div>
          <p className="text-olive-dark mt-1 text-base font-semibold">
            절약했어요
          </p>
        </div>
      </div>
    </section>
  );
};

export default SavingsCard;
