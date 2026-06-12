import React from "react";

import { formatNumber } from "@/shared/lib/format";

type NutritionItemProps = {
  label: string;
  value: number;
  unit: string;
};

const NutritionItem = ({ label, value, unit }: NutritionItemProps) => {
  return (
    <div className="rounded-card flex flex-col gap-1 border border-gray-200 p-3">
      <p className="text-ink-muted text-xs">{label}</p>
      <p className="text-ink text-base font-bold">
        {formatNumber(value, unit)}
      </p>
    </div>
  );
};

export default NutritionItem;
