"use client";

import { useParams, useRouter } from "next/navigation";

import { formatNumber } from "@/shared/lib/format";
import PrevButton from "@/shared/ui/PrevButton";
import CountUp from "@/shared/ui/shadcn/CountUp";

import { useRecipeHistoryDetailQuery } from "@/entities/user";

import { useToastStore } from "@/widgets/Toast/model/store";
import { Image } from "@/shared/ui/image/Image";

const CalendarDetailPage = () => {
  const { date } = useParams<{ date: string }>();
  const router = useRouter();
  const { addToast } = useToastStore();

  const { data } = useRecipeHistoryDetailQuery(date, {
    enabled: !!date,
  });

  if (date === undefined) {
    router.push("/");
    addToast({
      message: "잘못된 접근입니다.",
      variant: "error",
      position: "bottom",
    });
    return;
  }

  const totalSavings =
    data?.reduce(
      (sum, item) => sum + item.marketPrice - item.ingredientCost,
      0
    ) ?? 0;
  const totalMarketPrice =
    data?.reduce((sum, item) => sum + item.marketPrice, 0) ?? 0;
  return (
    <div>
      <header className="relative flex items-center justify-center p-4">
        <PrevButton className="absolute left-4" />
        <h2 className="text-xl font-bold">{date} 기록</h2>
      </header>

      <div className="mx-4 mb-4 rounded-2xl p-6 border-1 border-olive-light/30">
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">배달/외식 했다면</p>
            <p className="text-2xl font-bold text-gray-400 line-through decoration-2 decoration-red-400">
              {formatNumber(totalMarketPrice, "원")}
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">내가 직접 만들어서</p>
            <div className="flex items-baseline justify-center gap-1">
              <CountUp
                from={0}
                to={totalSavings}
                duration={0.5}
                separator=","
                direction="up"
                className="text-5xl font-bold text-olive-mint"
              />
              <span className="text-3xl font-bold text-olive-mint">원</span>
            </div>
            <p className="text-base text-olive-dark mt-2 font-semibold">
              절약했어요!
            </p>
          </div>

          <p className="text-xs text-gray-400 text-center mt-1">
            외식 대비 인건비·배달비 등 절약 (약{" "}
            {formatNumber(totalMarketPrice - totalSavings, "원")} 추정)
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {data?.map((item) => (
          <div
            key={item.recipeId}
            onClick={() => router.push(`/recipes/${item.recipeId}`)}
            className="flex items-center gap-4 rounded-2xl border-1 border-gray-200 p-4 py-2"
          >
            <Image
              src={item.imageUrl}
              alt={item.recipeTitle}
              className="h-32 w-32 rounded-md"
            />
            <div className="flex flex-col gap-2">
              <h1 className="text-lg font-bold">{item.recipeTitle}</h1>
              <div className="flex flex-col">
                <p className="text-sm text-slate-500">이 레시피로</p>
                <p className="text-olive-mint text-mm font-bold">
                  {formatNumber(item.marketPrice - item.ingredientCost, "원")}{" "}
                  절약했어요
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarDetailPage;
