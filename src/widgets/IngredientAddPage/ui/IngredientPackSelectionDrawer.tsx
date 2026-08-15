"use client";

import type { ReactNode } from "react";

import { X } from "lucide-react";

import type { IngredientPack } from "@/shared/config/constants/ingredientPacks";
import {
  format,
  localizeIngredientName,
  localizePack,
  useIngredientAddDict,
} from "@/shared/i18n";
import { useChromeLocale } from "@/shared/i18n/useChromeDict";
import { triggerHaptic } from "@/shared/lib/bridge";
import { Image } from "@/shared/ui/image/Image";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/shadcn/drawer";

import type { IngredientSelectionItem } from "@/entities/ingredient/ui/IngredientPicker";

type IngredientPackSelectionDrawerProps = {
  pack: IngredientPack | null;
  ownedIngredientIds: Set<string>;
  selectedIds: Set<string>;
  onToggle: (ingredient: IngredientSelectionItem) => void;
  onOpenChange: (open: boolean) => void;
  footer: ReactNode;
};

export const IngredientPackSelectionDrawer = ({
  pack,
  ownedIngredientIds,
  selectedIds,
  onToggle,
  onOpenChange,
  footer,
}: IngredientPackSelectionDrawerProps) => {
  const dict = useIngredientAddDict();
  const locale = useChromeLocale();
  const meta = pack ? localizePack(pack, locale) : null;

  return (
    <Drawer handleOnly open={pack !== null} onOpenChange={onOpenChange}>
      <DrawerContent hasDescription className="mx-auto max-w-2xl bg-white">
        <DrawerHeader className="relative border-b border-gray-100 pr-12">
          <DrawerTitle className="text-ink">{meta?.name}</DrawerTitle>
          <DrawerDescription className="text-ink-muted">
            {dict.packDrawerDescription}
          </DrawerDescription>
          <DrawerClose
            aria-label={dict.close}
            className="text-ink-sub absolute top-1 right-1 flex h-11 w-11 cursor-pointer items-center justify-center"
          >
            <X aria-hidden="true" size={22} />
          </DrawerClose>
        </DrawerHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
          {pack?.ingredients.map((ingredient) => {
            const isOwned = ownedIngredientIds.has(ingredient.id);
            const isSelected = selectedIds.has(ingredient.id);
            const localizedName = localizeIngredientName(
              ingredient.id,
              ingredient.name,
              locale
            );
            const label = format(
              isOwned ? dict.packIngredientOwned : dict.packIngredientSelect,
              { name: localizedName }
            );

            return (
              <label
                key={ingredient.id}
                className="flex min-h-16 cursor-pointer items-center gap-3 border-b border-gray-100 py-2 last:border-b-0 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-55"
              >
                <Image
                  src={ingredient.imageUrl}
                  alt=""
                  wrapperClassName="h-11 w-11 flex-none rounded-card bg-gray-100"
                />
                <span className="text-ink min-w-0 flex-1 truncate text-sm font-medium">
                  {localizedName}
                </span>
                {isOwned ? (
                  <span className="text-ink-muted text-xs">{dict.owned}</span>
                ) : null}
                <input
                  type="checkbox"
                  aria-label={label}
                  checked={isSelected || isOwned}
                  disabled={isOwned}
                  onChange={() => {
                    triggerHaptic("Light");
                    onToggle({ ...ingredient, name: localizedName });
                  }}
                  className="accent-olive-dark h-5 w-5 cursor-pointer disabled:cursor-not-allowed"
                />
              </label>
            );
          })}
        </div>
        {footer}
      </DrawerContent>
    </Drawer>
  );
};
