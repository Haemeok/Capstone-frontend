"use client";

import Link from "next/link";

import { ChevronRight } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";

import { RecipeRecordItem } from "@/entities/recipe/ui/RecipeRecordItem";

import { RecordTimelineGroup } from "@/entities/recipe/model/record";

import { formatTimelineDateHeader } from "../lib/formatTimelineDateHeader";

type TimelineDateGroupProps = {
  group: RecordTimelineGroup;
};

export const TimelineDateGroup = ({ group }: TimelineDateGroupProps) => {
  const label = formatTimelineDateHeader(group.date);

  return (
    <section className="pt-6 first:pt-0">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">{label}</h2>
        <Link
          href={`/calendar/${group.date}`}
          onClick={() => triggerHaptic("Light")}
          className="flex items-center gap-0.5 rounded-lg px-2 py-1 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          더보기
          <ChevronRight className="size-4" />
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {group.records.map((record) => (
          <RecipeRecordItem
            key={record.recordId}
            recipeId={record.recipeId}
            recipeTitle={record.recipeTitle}
            imageUrl={record.imageUrl}
            calories={record.calories}
            nutrition={record.nutrition}
            ingredientCost={record.ingredientCost}
            marketPrice={record.marketPrice}
          />
        ))}
      </div>
    </section>
  );
};
