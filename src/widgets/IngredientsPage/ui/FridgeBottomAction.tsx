"use client";

import type { Ref } from "react";

import { format, plural } from "@/shared/i18n/format";
import { LocalizedLink } from "@/shared/i18n/LocalizedLink";
import { useIngredientsDict } from "@/shared/i18n/useIngredientsDict";

type FridgeBottomActionProps = {
  isLoggedIn: boolean;
  isManageMode: boolean;
  selectedCount: number;
  deleteButtonRef: Ref<HTMLButtonElement>;
  onDelete: () => void;
};

export const FridgeBottomAction = ({
  isLoggedIn,
  isManageMode,
  selectedCount,
  deleteButtonRef,
  onDelete,
}: FridgeBottomActionProps) => {
  const t = useIngredientsDict();

  if (!isLoggedIn || (isManageMode && selectedCount === 0)) return null;

  return (
    <div className="z-header sticky-optimized pointer-events-none fixed right-0 bottom-20 left-0 px-4 md:bottom-6">
      <div className="mx-auto max-w-4xl">
        {isManageMode ? (
          <button
            ref={deleteButtonRef}
            type="button"
            onClick={onDelete}
            className="bg-ink focus-visible:ring-ink active:bg-ink/90 pointer-events-auto min-h-12 w-full cursor-pointer rounded-xl px-5 text-base font-semibold text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {format(plural(selectedCount, t.deleteFab), {
              count: selectedCount,
            })}
          </button>
        ) : (
          <LocalizedLink
            href="/recipes/my-fridge"
            className="bg-olive-light focus-visible:ring-olive-light active:bg-olive-dark pointer-events-auto flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl px-5 text-base font-semibold text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {t.fabFindRecipes}
          </LocalizedLink>
        )}
      </div>
    </div>
  );
};
