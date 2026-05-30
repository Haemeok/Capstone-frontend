"use client";

import { X } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { Image } from "@/shared/ui/image/Image";
import { Button } from "@/shared/ui/shadcn/button";

import type { IngredientItem } from "@/entities/ingredient";

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
  const handleComplete = () => {
    triggerHaptic("Success");
    onComplete();
  };

  return (
    <div className="flex items-center gap-3 border-t border-gray-100 bg-white p-3">
      <div className="scrollbar-hide flex flex-1 gap-2 overflow-x-auto">
        {items.map((item) => (
          <div key={item.id} className="relative h-14 w-14 flex-shrink-0">
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
              aria-label={`${item.name} 제거`}
              className="absolute -top-1 -right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-gray-800 text-white shadow"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
      <Button
        onClick={handleComplete}
        disabled={items.length === 0}
        className="bg-olive-light hover:bg-olive-dark flex-shrink-0 cursor-pointer text-white disabled:bg-gray-300"
      >
        완료
      </Button>
    </div>
  );
};

export default IngredientSelectionTray;
