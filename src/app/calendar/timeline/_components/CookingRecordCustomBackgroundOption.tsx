import { Check } from "lucide-react";

import { format } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { Image } from "@/shared/ui/image/Image";

import type { StickerBookBackgroundOption } from "@/entities/recipe";

type CookingRecordCustomBackgroundOptionProps = {
  background: StickerBookBackgroundOption;
  index: number;
  isSelected: boolean;
  isPending: boolean;
  optionLabel: string;
  onSelect: (backgroundKey: string) => void;
};

export const CookingRecordCustomBackgroundOption = ({
  background,
  index,
  isSelected,
  isPending,
  optionLabel,
  onSelect,
}: CookingRecordCustomBackgroundOptionProps) => (
  <button
    type="button"
    aria-label={format(optionLabel, { index: index + 1 })}
    aria-pressed={isSelected}
    disabled={isPending}
    onClick={() => {
      if (isSelected) return;
      triggerHaptic("Light");
      onSelect(background.backgroundKey);
    }}
    className="focus-visible:outline-olive-dark relative aspect-square min-w-0 cursor-pointer overflow-hidden rounded-xl border border-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {background.imageUrl ? (
      <Image
        src={background.imageUrl}
        alt=""
        fit="cover"
        skeleton={<span aria-hidden="true" />}
        errorFallback={<span aria-hidden="true" />}
        wrapperClassName="absolute inset-0 h-full w-full"
      />
    ) : null}
    {isSelected ? (
      <Check
        aria-hidden="true"
        className="text-olive-dark absolute right-1.5 bottom-1.5 z-10 size-4 stroke-[2.5]"
      />
    ) : null}
  </button>
);
