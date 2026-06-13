"use client";

import { X } from "lucide-react";

import { format, useIngredientPickerDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { Image } from "@/shared/ui/image/Image";
import { Button } from "@/shared/ui/shadcn/button";

import type { IngredientItem } from "@/entities/ingredient/model/types";

type IngredientSelectionTrayProps = {
  items: IngredientItem[];
  onRemove: (id: string) => void;
  onComplete: () => void;
};

const IngredientSelectionTray = ({
  items,
  onRemove,
  onComplete,
}: IngredientSelectionTrayProps) => {
  const t = useIngredientPickerDict();
  const handleComplete = () => {
    triggerHaptic("Success");
    onComplete();
  };

  return (
    <div className="flex items-center gap-3 border-t border-gray-100 bg-white p-3">
      <div className="scrollbar-hide flex flex-1 gap-2 overflow-x-auto px-1 py-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex w-14 flex-shrink-0 flex-col items-center"
          >
            <div className="relative h-14 w-14">
              <div className="h-full w-full overflow-hidden rounded-lg bg-gray-100">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    wrapperClassName="h-full w-full"
                    fit="cover"
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                aria-label={format(t.removeAria, { name: item.name })}
                className="text-ink-sub absolute -top-1 -right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-gray-200 shadow"
              >
                <X size={12} />
              </button>
            </div>
            <span className="text-ink-sub mt-1 w-full truncate text-center text-[11px]">
              {item.name}
            </span>
          </div>
        ))}
      </div>
      <Button
        onClick={handleComplete}
        disabled={items.length === 0}
        className="bg-olive-vivid hover:bg-olive-vivid/90 h-12 flex-shrink-0 cursor-pointer px-6 text-base font-semibold text-white disabled:bg-gray-300"
      >
        {t.complete}
      </Button>
    </div>
  );
};

export default IngredientSelectionTray;
