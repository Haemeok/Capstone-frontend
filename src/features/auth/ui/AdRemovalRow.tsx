"use client";

import { usePathname } from "next/navigation";

import { Gift } from "lucide-react";

import { format, resolveChromeLocale, useSettingsDict } from "@/shared/i18n";
import { formatRemaining } from "@/shared/lib/time/formatRemaining";

import { useAdFreeStatus } from "@/entities/user";

export const AdRemovalRow = ({ onOpenSheet }: { onOpenSheet: () => void }) => {
  const t = useSettingsDict();
  const { isActive, remaining } = useAdFreeStatus();
  const locale = resolveChromeLocale(usePathname() ?? "/");

  return (
    <button
      type="button"
      onClick={onOpenSheet}
      className="text-ink-sub flex w-full items-center justify-between px-4 py-3 hover:bg-gray-50"
    >
      <span className="flex items-center gap-2">
        <Gift size={16} />
        {t.adRemoval}
      </span>
      {isActive ? (
        <span className="flex items-center gap-1.5 text-sm font-semibold text-blue-500">
          <span
            className="h-1.5 w-1.5 rounded-full bg-blue-500"
            aria-hidden="true"
          />
          {format(t.adRemovalRemaining, {
            remaining: formatRemaining(remaining, locale),
          })}
        </span>
      ) : (
        <span className="text-sm text-gray-400">{t.adRemovalCta}</span>
      )}
    </button>
  );
};
