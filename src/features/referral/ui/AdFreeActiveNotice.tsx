"use client";

import { usePathname } from "next/navigation";

import { format, plural, useReferralDict } from "@/shared/i18n";
import { resolveChromeLocale } from "@/shared/i18n/resolveChromeLocale";

const LOCALE_TAG = { ko: "ko-KR", ja: "ja-JP", en: "en-US" } as const;

type AdFreeActiveNoticeProps = {
  remaining: number;
  adFreeUntil: string | null;
};

export const AdFreeActiveNotice = ({
  remaining,
  adFreeUntil,
}: AdFreeActiveNoticeProps) => {
  const locale = resolveChromeLocale(usePathname() ?? "/");
  const t = useReferralDict();
  const untilDate = adFreeUntil
    ? new Date(adFreeUntil).toLocaleDateString(LOCALE_TAG[locale], {
        month: "long",
        day: "numeric",
      })
    : "";
  const days = Math.floor(remaining / 86400000);
  const daysText =
    days > 0 ? format(plural(days, t.daysLeft), { n: days }) : t.endsToday;

  return (
    <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-blue-500">
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500"
        aria-hidden="true"
      />
      {t.adFreeLabel} · {format(t.adFreeUntil, { date: untilDate })} ·{" "}
      {daysText}
    </p>
  );
};
