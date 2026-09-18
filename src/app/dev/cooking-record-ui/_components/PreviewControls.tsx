"use client";

import type { Locale } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";

type Props = {
  locale: Locale;
  onLocale: (locale: Locale) => void;
  onCreate: () => void;
  onRecipe: () => void;
  onProfile: () => void;
  onCatalog: (status: "ready" | "loading" | "error" | "empty") => void;
  onReset: () => void;
};
export const PreviewControls = ({
  locale,
  onLocale,
  onCreate,
  onRecipe,
  onProfile,
  onCatalog,
  onReset,
}: Props) => (
  <aside className="text-ink w-full space-y-5 px-5 py-5 lg:w-64 lg:shrink-0">
    <div>
      <p className="text-ink-muted text-xs">
        UI 미리보기 · 서버에 저장되지 않습니다
      </p>
      <h1 className="mt-2 text-xl font-bold">요리 기록 · 접시</h1>
    </div>
    <p className="text-ink-sub text-sm leading-6">
      실제 사진을 골라 편집할 수 있습니다. 배경 제거는 미연결이며, 샘플에는 기존
      누끼 사진을 사용합니다.
    </p>
    <div className="flex flex-wrap gap-2">
      {[
        { label: "새 기록", run: onCreate },
        { label: "레시피 완료", run: onRecipe },
        { label: "프로필", run: onProfile },
        { label: "초기화", run: onReset },
      ].map(({ label, run }) => (
        <button
          key={label}
          type="button"
          className="min-h-11 cursor-pointer rounded-lg border border-gray-200 bg-white px-3 text-sm"
          onClick={() => {
            triggerHaptic("Light");
            run();
          }}
        >
          {label}
        </button>
      ))}
    </div>
    <label className="block text-sm">
      언어
      <select
        value={locale}
        className="mt-2 min-h-11 w-full rounded-lg border border-gray-200 bg-white px-3"
        onChange={(event) => {
          const value = event.target.value;
          if (value === "ko" || value === "en" || value === "ja")
            onLocale(value);
        }}
      >
        <option value="ko">한국어</option>
        <option value="en">English</option>
        <option value="ja">日本語</option>
      </select>
    </label>
    <label className="block text-sm">
      접시 목록 상태
      <select
        defaultValue="ready"
        className="mt-2 min-h-11 w-full rounded-lg border border-gray-200 bg-white px-3"
        onChange={(event) => {
          const value = event.target.value;
          if (
            value === "ready" ||
            value === "loading" ||
            value === "error" ||
            value === "empty"
          )
            onCatalog(value);
        }}
      >
        <option value="ready">실제 목록 16개</option>
        <option value="loading">불러오는 중</option>
        <option value="error">실패</option>
        <option value="empty">빈 목록</option>
      </select>
    </label>
  </aside>
);
