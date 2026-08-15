"use client";

import { X } from "lucide-react";

import {
  format,
  useIngredientAddDict,
  useIngredientPickerDict,
} from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";
import { Button } from "@/shared/ui/shadcn/button";

import type { IngredientSelectionItem } from "@/entities/ingredient/ui/IngredientPicker";

type IngredientAddSelectionBarProps = {
  items: IngredientSelectionItem[];
  isPending: boolean;
  errorMessage?: string;
  onRemove: (id: string) => void;
  onSubmit: () => void;
  placement?: "page" | "drawer";
};

export const IngredientAddSelectionBar = ({
  items,
  isPending,
  errorMessage,
  onRemove,
  onSubmit,
  placement = "page",
}: IngredientAddSelectionBarProps) => {
  const dict = useIngredientAddDict();
  const pickerDict = useIngredientPickerDict();

  if (items.length === 0) return null;

  const submitLabel = isPending
    ? dict.adding
    : format(dict.addCount, { count: items.length });
  const handleRemove = (id: string) => {
    triggerHaptic("Light");
    onRemove(id);
  };

  return (
    <div
      className={cn(
        "border-t border-gray-100 bg-white px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]",
        placement === "page"
          ? "z-header sticky-optimized fixed right-0 bottom-[var(--bottom-nav-h)] left-0 md:bottom-0"
          : "mt-auto flex-none"
      )}
    >
      {errorMessage ? (
        <p
          role="alert"
          className="text-ink-sub mx-auto mb-2 max-w-4xl bg-gray-100 px-3 py-2 text-sm"
        >
          {errorMessage}
        </p>
      ) : null}
      <div className="mx-auto flex max-w-4xl items-center gap-3">
        <div className="scrollbar-hide flex min-w-0 flex-1 gap-2 overflow-x-auto py-1">
          {items.map((item) => (
            <div key={item.id} className="relative h-12 w-12 flex-none">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  wrapperClassName="h-full w-full rounded-card bg-gray-100"
                />
              ) : (
                <span className="text-ink-sub rounded-card flex h-full w-full items-center justify-center bg-gray-100 px-1 text-center text-xs">
                  {item.name}
                </span>
              )}
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                aria-label={format(pickerDict.removeAria, { name: item.name })}
                className="text-ink-sub absolute -top-2 -right-2 flex h-11 w-11 cursor-pointer items-start justify-end rounded-md p-1.5"
              >
                <X aria-hidden="true" size={12} />
              </button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isPending}
          className="bg-olive-dark hover:bg-olive h-12 flex-none px-5 text-sm font-bold text-white"
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
};
