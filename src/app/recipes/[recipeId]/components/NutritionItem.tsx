import React from "react";

import { formatNumber } from "@/shared/lib/format";

type NutritionItemProps = {
  label: string;
  value: number;
  unit: string;
};

const NutritionItem = ({ label, value, unit }: NutritionItemProps) => {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-gray-200 p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-base font-bold text-gray-800">
        {formatNumber(value, unit)}
      </p>
    </div>
  );
};

export default NutritionItem;
