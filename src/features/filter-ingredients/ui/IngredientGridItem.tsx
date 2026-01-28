import { Check } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

type Props = {
  id: string;
  name: string;
  imageUrl?: string | null;
  isSelected: boolean;
  onToggle: (id: string, name: string) => void;
};

export const IngredientGridItem = ({
  id,
  name,
  imageUrl,
  isSelected,
  onToggle,
}: Props) => {
  return (
    <button
      onClick={() => onToggle(id, name)}
      className={cn(
        "relative flex cursor-pointer flex-col items-center rounded-xl p-2 transition-all",
        isSelected
          ? "bg-olive-light/10 ring-2 ring-olive-light"
          : "hover:bg-gray-50"
      )}
    >
      {isSelected && (
        <div className="absolute top-1 right-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-olive-light">
          <Check size={12} className="text-white" strokeWidth={3} />
        </div>
      )}

      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={name}
            wrapperClassName="h-full w-full"
            fit="cover"
          />
        )}
      </div>

      <p
        className={cn(
          "mt-1.5 w-full truncate text-center text-xs",
          isSelected ? "font-bold text-olive-light" : "text-gray-700"
        )}
      >
        {name}
      </p>
    </button>
  );
};
