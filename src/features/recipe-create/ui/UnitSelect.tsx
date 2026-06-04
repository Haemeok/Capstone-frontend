"use client";

import { useState } from "react";

import { triggerHaptic } from "@/shared/lib/bridge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/shadcn/select";

import { useIngredientUnits } from "@/entities/ingredient/model/hooks";

type UnitSelectProps = {
  ingredientId: string;
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  ariaLabel?: string;
};

const UnitSelect = ({
  ingredientId,
  value,
  onChange,
  disabled,
  ariaLabel,
}: UnitSelectProps) => {
  const [open, setOpen] = useState(false);
  const { data: units, isLoading } = useIngredientUnits(ingredientId, open);

  const handleOpenChange = (next: boolean) => {
    if (next && !disabled) triggerHaptic("Light");
    setOpen(next);
  };

  const handleValueChange = (next: string) => {
    triggerHaptic("Light");
    onChange(next);
  };

  const showSavedValueFallback = !units || !units.some((u) => u.unit === value);

  return (
    <Select
      value={value || undefined}
      onValueChange={handleValueChange}
      open={open}
      onOpenChange={handleOpenChange}
      disabled={disabled}
    >
      <SelectTrigger aria-label={ariaLabel} className="h-8 w-20 px-2 text-sm">
        <SelectValue placeholder={value || "단위"} />
      </SelectTrigger>
      <SelectContent>
        {isLoading && (
          <SelectItem value={value || "_loading"} disabled>
            로딩…
          </SelectItem>
        )}
        {showSavedValueFallback && value && !isLoading && (
          <SelectItem value={value}>{value}</SelectItem>
        )}
        {units?.map((opt) => (
          <SelectItem key={opt.unit} value={opt.unit}>
            {opt.unit}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default UnitSelect;
