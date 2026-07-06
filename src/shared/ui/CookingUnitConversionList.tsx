"use client";

import { useCookingUnitsDict } from "@/shared/i18n";

const CookingUnitConversionList = () => {
  const dict = useCookingUnitsDict();

  return (
    <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-white">
      {dict.conversions.map((item) => (
        <li key={item.unit} className="flex flex-col gap-0.5 p-4">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-ink font-bold">{item.unit}</span>
            <span className="text-ink font-semibold tabular-nums">
              {item.value}
            </span>
          </div>
          <span className="text-ink-muted text-xs">{item.tip}</span>
        </li>
      ))}
    </ul>
  );
};

export default CookingUnitConversionList;
