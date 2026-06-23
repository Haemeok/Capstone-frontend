"use client";

import { format, useRecipeGridDict } from "@/shared/i18n";

type TimeBadgeProps = {
  minutes: number;
};

const TimeBadge = ({ minutes }: TimeBadgeProps) => {
  const t = useRecipeGridDict();

  return (
    <span className="rounded-card bg-ink/85 px-2.5 py-1 text-xs font-semibold text-white">
      {format(t.cookingTime, { n: minutes })}
    </span>
  );
};

export default TimeBadge;
