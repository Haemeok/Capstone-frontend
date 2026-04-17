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
      <Link
        href={`/calendar/${group.date}`}
        onClick={() => triggerHaptic("Light")}
        className="mb-3 flex items-center gap-1 text-xl font-bold text-gray-900 transition-colors hover:text-gray-700"
      >
        {label}
        <ChevronRight className="size-5 text-gray-400" />
      </Link>
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
