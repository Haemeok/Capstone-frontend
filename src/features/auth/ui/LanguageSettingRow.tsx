"use client";

import { usePathname, useRouter } from "next/navigation";

import { Languages } from "lucide-react";

import {
  type Locale,
  LOCALES,
  localizedHref,
  setStoredLocale,
  stripLocale,
  useSettingsDict,
} from "@/shared/i18n";

import { useUserStore } from "@/entities/user/model/store";
import { updatePreferredLocale } from "@/entities/user/model/updatePreferredLocale";

const LOCALE_LABELS: Record<Locale, string> = {
  ko: "한국어",
  ja: "日本語",
  en: "English",
};

export const LanguageSettingRow = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { locale: current, barePath } = stripLocale(pathname);
  const t = useSettingsDict();
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  const handleSelect = (next: Locale) => {
    setStoredLocale(next);
    if (isAuthenticated) {
      void updatePreferredLocale(next).catch(() => {});
    }
    router.push(localizedHref(barePath, next));
  };

  return (
    <div className="flex w-full items-center justify-between px-4 py-3">
      <div className="text-ink-sub flex items-center gap-2">
        <Languages size={16} aria-hidden="true" />
        <span>{t.language}</span>
      </div>
      <div
        role="group"
        aria-label={t.languageSelectAria}
        className="flex gap-1"
      >
        {LOCALES.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => handleSelect(loc)}
            aria-pressed={loc === current}
            className={`cursor-pointer rounded-md px-2 py-1 text-sm transition-colors ${
              loc === current
                ? "bg-olive-light/10 text-olive-light font-semibold"
                : "text-ink-sub hover:bg-gray-50"
            }`}
          >
            {LOCALE_LABELS[loc]}
          </button>
        ))}
      </div>
    </div>
  );
};
