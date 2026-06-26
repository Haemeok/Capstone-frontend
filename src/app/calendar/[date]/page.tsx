"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";

import {
  format,
  useLocalizedRouter,
  useUserPagesDict,
  useUserPagesLocale,
} from "@/shared/i18n";
import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";

import { useRecipeHistoryItemsQuery } from "@/entities/recipe/model/hooks";

import { useToastStore } from "@/shared/ui/toast/model/store";

import { formatTimelineDateHeader } from "../timeline/lib/formatTimelineDateHeader";
import NutritionCard from "./components/NutritionCard";
import RecipeListSection from "./components/RecipeListSection";
import SavingsCard from "./components/SavingsCard";
import { buildDaySummary } from "./lib/buildDaySummary";

const CalendarDetailPage = () => {
  const { date } = useParams<{ date: string }>();
  const router = useLocalizedRouter();
  const { addToast } = useToastStore();
  const locale = useUserPagesLocale();
  const t = useUserPagesDict().calendar;

  const { data } = useRecipeHistoryItemsQuery(date, !!date);

  const heading = useMemo(() => {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return formatTimelineDateHeader(date, locale);
  }, [date, locale]);

  if (date === undefined) {
    router.push("/");
    addToast({
      message: t.invalidAccess,
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
  const recipeCount = data?.length ?? 0;

  return (
    <Container>
      <header className="relative flex items-center justify-center pt-4 pb-2">
        <PrevButton className="absolute left-0" />
        <div className="text-center">
          {heading ? (
            <>
              <h2 className="text-ink text-2xl font-bold">{heading}</h2>
              <p className="text-ink-muted mt-1 text-sm">
                {buildDaySummary(recipeCount, totalSavings, locale, t)}
              </p>
            </>
          ) : (
            <h2 className="text-ink text-2xl font-bold">
              {format(t.recordHeadingSuffix, { date })}
            </h2>
          )}
        </div>
      </header>

      <div className="pb-8">
        {locale === "ko" && (
          <SavingsCard
            totalSavings={totalSavings}
            totalMarketPrice={totalMarketPrice}
          />
        )}
        <NutritionCard data={data} />
        <RecipeListSection data={data} />
      </div>
    </Container>
  );
};

export default CalendarDetailPage;
