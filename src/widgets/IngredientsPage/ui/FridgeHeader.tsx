"use client";

import { format } from "@/shared/i18n/format";
import { useIngredientsDict } from "@/shared/i18n/useIngredientsDict";
import { triggerHaptic } from "@/shared/lib/bridge";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

type FridgeHeaderProps = {
  totalCount: number | null;
  isTotalCountError: boolean;
  isTotalCountPending: boolean;
  isManageMode: boolean;
  isAllSelected: boolean;
  onEnterManageMode: () => void;
  onToggleSelectAll: () => void;
  onExitManageMode: () => void;
};

const actionClassName =
  "text-ink-sub min-h-11 cursor-pointer rounded-xl px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-light focus-visible:ring-offset-2";

export const FridgeHeader = ({
  totalCount,
  isTotalCountError,
  isTotalCountPending,
  isManageMode,
  isAllSelected,
  onEnterManageMode,
  onToggleSelectAll,
  onExitManageMode,
}: FridgeHeaderProps) => {
  const t = useIngredientsDict();

  const handleEnterManageMode = () => {
    triggerHaptic("Light");
    onEnterManageMode();
  };

  const handleToggleSelectAll = () => {
    triggerHaptic("Light");
    onToggleSelectAll();
  };

  return (
    <header className="flex items-start justify-between gap-4 px-5 pt-7 pb-4 md:px-6">
      <div className="min-w-0">
        <h1 className="text-ink text-2xl leading-8 font-bold tracking-tight">
          {t.title}
        </h1>
        {isTotalCountError ? (
          <p role="alert" className="text-ink-muted mt-1 text-sm leading-6">
            {t.ownedCountUnavailable}
          </p>
        ) : isTotalCountPending || totalCount === null ? (
          <div role="status" aria-label={t.ownedCountLoading} className="mt-2">
            <Skeleton className="h-4 w-40" />
          </div>
        ) : (
          <p className="text-ink-muted mt-1 text-sm leading-6">
            {format(t.ownedCount, { count: totalCount })}
          </p>
        )}
      </div>

      {isManageMode ? (
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={handleToggleSelectAll}
            className={actionClassName}
          >
            {isAllSelected ? t.actions.cancel : t.actions.selectAll}
          </button>
          <button
            type="button"
            onClick={onExitManageMode}
            className={actionClassName}
          >
            {t.actions.done}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleEnterManageMode}
          className={actionClassName}
        >
          {t.actions.manage}
        </button>
      )}
    </header>
  );
};
