# 언어 스위처 + locale-sticky 네비게이션 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 내부 링크가 현재 locale을 따라가고(`/en`에서 클릭해도 `/en` 유지), 설정에서 언어를 바꾸면 현재 페이지의 해당 locale 버전으로 이동·저장한다.

**Architecture:** 순수 `localizedHref(path, locale)`/`stripLocale(pathname)` + 이를 쓰는 client 래퍼 `LocalizedLink`(현재 locale은 기존 `useChromeLocale`로 판단). chrome 링크를 `LocalizedLink`로 교체. 설정 시트에 `LanguageSettingRow`(select 시 `router.push` + localStorage 저장). 자동 리다이렉트 없음.

**Tech Stack:** Next.js 15 App Router, TypeScript, jest + @testing-library/react, FSD.

**Source specs:** `2026-06-13-language-switcher-{design,slices,test-design}.md`

**Glossary:** locale(ko/ja/en) · prefix(`/en`·`/ja`) · localizedHref · stripLocale · barePath · LocalizedLink · chrome(헤더/하단탭/푸터) · 스위처 · 선호 locale(`PREFERRED_LOCALE`/get·setStoredLocale)

**선행 인프라(존재):** `resolveChromeLocale`, `useChromeLocale`(`@/shared/i18n`), `LOCALES`/`Locale`(types), `STORAGE_KEYS`(`@/shared/config/constants/localStorage`).

---

## File Structure

**Create:**
- `src/shared/i18n/localizedHref.ts` — 순수 `localizedHref` + `stripLocale`
- `src/shared/i18n/__tests__/localizedHref.test.ts` — T-01, T-02, T-05
- `src/shared/i18n/preferredLocale.ts` — `getStoredLocale`/`setStoredLocale`
- `src/shared/i18n/__tests__/preferredLocale.test.ts` — T-06
- `src/shared/i18n/LocalizedLink.tsx` — client 래퍼
- `src/shared/i18n/__tests__/LocalizedLink.test.tsx` — T-03, T-04
- `src/features/auth/ui/LanguageSettingRow.tsx` — 설정 언어 row
- `src/features/auth/ui/__tests__/LanguageSettingRow.test.tsx` — T-07, T-08, T-09

**Modify:**
- `src/shared/config/constants/localStorage.ts` — `PREFERRED_LOCALE` 키 추가
- `src/shared/i18n/index.ts` — 신규 export
- `src/widgets/Header/DesktopHeader.tsx` · `src/widgets/Footer/BottomNavButton.tsx` · `src/widgets/Footer/DesktopFooter.tsx` — chrome 링크 → `LocalizedLink`(+active 보정)
- `src/features/auth/ui/SettingsActionButton.tsx` — `<LanguageSettingRow />` 삽입

---

## Task 1: 순수 경로 헬퍼 `localizedHref` + `stripLocale` (T-01/02/05)

**Files:**
- Create: `src/shared/i18n/localizedHref.ts`
- Test: `src/shared/i18n/__tests__/localizedHref.test.ts`

- [ ] **Step 1: Write the failing test (T-01/02/05)**

```ts
// src/shared/i18n/__tests__/localizedHref.test.ts
import { localizedHref, stripLocale } from "../localizedHref";

describe("localizedHref (T-01)", () => {
  it.each([
    ["/search", "ja", "/ja/search"],
    ["/search", "en", "/en/search"],
    ["/search", "ko", "/search"],
    ["/", "ja", "/ja"],
    ["/", "ko", "/"],
  ] as const)("(%s, %s) → %s", (path, locale, expected) => {
    expect(localizedHref(path, locale)).toBe(expected);
  });
});

describe("localizedHref 무변경 (T-02)", () => {
  it.each([
    ["https://x.com/a", "ja"],
    ["#top", "ja"],
    ["/ja/search", "ja"],
    ["/en/recipes/1", "ja"],
  ] as const)("(%s, %s) 그대로", (path, locale) => {
    expect(localizedHref(path, locale)).toBe(path);
  });
});

describe("stripLocale (T-05)", () => {
  it.each([
    ["/ja/recipes/1", "ja", "/recipes/1"],
    ["/recipes/1", "ko", "/recipes/1"],
    ["/ja", "ja", "/"],
    ["/engine", "ko", "/engine"],
  ] as const)("%s → {%s, %s}", (pathname, locale, barePath) => {
    expect(stripLocale(pathname)).toEqual({ locale, barePath });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/shared/i18n/__tests__/localizedHref.test.ts`
Expected: FAIL — "Cannot find module '../localizedHref'"

- [ ] **Step 3: Write minimal implementation**

```ts
// src/shared/i18n/localizedHref.ts
import type { Locale } from "./types";

const PREFIXED = /^\/(ja|en)(\/|$)/;

export const localizedHref = (path: string, locale: Locale): string => {
  if (path.startsWith("http") || path.startsWith("#") || PREFIXED.test(path)) {
    return path;
  }
  if (locale === "ko") return path;
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
};

export const stripLocale = (
  pathname: string
): { locale: Locale; barePath: string } => {
  const match = pathname.match(/^\/(ja|en)(\/.*|$)/);
  if (match) {
    const locale = match[1] as Locale;
    const rest = match[2];
    return { locale, barePath: rest === "" ? "/" : rest };
  }
  return { locale: "ko", barePath: pathname };
};
```

> `match[1] as Locale` — 정규식이 `ja|en`만 캡처하므로 Locale 보장.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/shared/i18n/__tests__/localizedHref.test.ts`
Expected: PASS (T-01 5건, T-02 4건, T-05 4건)

- [ ] **Step 5: Commit**

```bash
git add src/shared/i18n/localizedHref.ts src/shared/i18n/__tests__/localizedHref.test.ts
git commit -m "feat(i18n): localizedHref + stripLocale pure path helpers (T-01/02/05)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>" -- src/shared/i18n/localizedHref.ts src/shared/i18n/__tests__/localizedHref.test.ts
```

---

## Task 2: `LocalizedLink` 래퍼 + chrome 링크 전환 (walking skeleton, T-03/04)

**Files:**
- Create: `src/shared/i18n/LocalizedLink.tsx`
- Test: `src/shared/i18n/__tests__/LocalizedLink.test.tsx`
- Modify: `src/shared/i18n/index.ts`, `src/widgets/Header/DesktopHeader.tsx`, `src/widgets/Footer/BottomNavButton.tsx`, `src/widgets/Footer/DesktopFooter.tsx`

- [ ] **Step 1: Write the failing test (T-03/04)**

```tsx
// src/shared/i18n/__tests__/LocalizedLink.test.tsx
import { render } from "@testing-library/react";
import { usePathname } from "next/navigation";

import { LocalizedLink } from "../LocalizedLink";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));

const setPath = (p: string) => (usePathname as jest.Mock).mockReturnValue(p);

describe("LocalizedLink", () => {
  it("T-03: /en 페이지에서 href에 /en prefix", () => {
    setPath("/en/recipes/1");
    const { container } = render(
      <LocalizedLink href="/search">go</LocalizedLink>
    );
    expect(container.querySelector("a")).toHaveAttribute("href", "/en/search");
  });

  it("T-04: 루트(ko)에서 prefix 없음", () => {
    setPath("/");
    const { container } = render(
      <LocalizedLink href="/search">go</LocalizedLink>
    );
    expect(container.querySelector("a")).toHaveAttribute("href", "/search");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/shared/i18n/__tests__/LocalizedLink.test.tsx`
Expected: FAIL — "Cannot find module '../LocalizedLink'"

- [ ] **Step 3a: `LocalizedLink` 생성**

```tsx
// src/shared/i18n/LocalizedLink.tsx
"use client";

import type { ComponentProps } from "react";
import Link from "next/link";

import { localizedHref } from "./localizedHref";
import { useChromeLocale } from "./useChromeDict";

type LocalizedLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

export const LocalizedLink = ({ href, ...props }: LocalizedLinkProps) => {
  const locale = useChromeLocale();
  return <Link href={localizedHref(href, locale)} {...props} />;
};
```

- [ ] **Step 3b: index.ts export**

`src/shared/i18n/index.ts`에 추가:

```ts
export { localizedHref, stripLocale } from "./localizedHref";
export { LocalizedLink } from "./LocalizedLink";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/shared/i18n/__tests__/LocalizedLink.test.tsx`
Expected: PASS (T-03/04)

- [ ] **Step 5: chrome 링크 전환**

**`src/widgets/Footer/BottomNavButton.tsx`** — `next/link`의 `Link`를 `LocalizedLink`로 교체하고, active 비교를 `stripLocale`로 보정(현재 `path`가 ko 기준이라 `/en`에서 깨짐):
- import 교체: `import Link from "next/link";` 제거, `import { LocalizedLink, stripLocale } from "@/shared/i18n";` 추가 (`usePathname`/`triggerHaptic` import 유지)
- `const isActive = ...` 줄을 다음으로 교체:
```tsx
  const { barePath } = stripLocale(usePathname());
  const isActive =
    path === "/" ? barePath === "/" : barePath.startsWith(path);
```
  (기존 `const currentPath = usePathname();` 줄은 제거)
- `<Link href={path} ...>` → `<LocalizedLink href={path} ...>`, 닫는 `</Link>` → `</LocalizedLink>`

**`src/widgets/Header/DesktopHeader.tsx`** — nav/로고/My 링크를 `LocalizedLink`로, active 비교 보정:
- import 추가: `import { LocalizedLink, stripLocale, useChromeDict } from "@/shared/i18n";` (기존 `useChromeDict` import와 합치고, `import Link from "next/link";`는 제거)
- `const pathname = usePathname();` 아래 `const { barePath } = stripLocale(pathname);` 추가
- 로고 `<Link href="/" ...>` → `<LocalizedLink href="/" ...>` (닫는 태그도)
- nav map의 `<Link key={link.href} href={link.href} ... pathname === link.href ...>` 에서:
  - `<Link` → `<LocalizedLink`, `</Link>` → `</LocalizedLink>`
  - active 비교 `pathname === link.href` → `barePath === link.href`
- My `<Link href={`/users/${user.id}`} ...>` → `<LocalizedLink ...>` (닫는 태그도)

**`src/widgets/Footer/DesktopFooter.tsx`** — 내부 링크(`/terms`·`/privacy`)만 교체(외부 `<a>`는 유지):
- import 추가: `import { LocalizedLink } from "@/shared/i18n";` (`import Link from "next/link";`는 내부 Link가 더 없으면 제거)
- service/support map의 비-external 분기 `<Link key={link.labelKey} href={link.href} ...>` → `<LocalizedLink ...>` (닫는 태그도). external `<a>` 분기는 그대로.

- [ ] **Step 6: 회귀 + 타입 확인**

Run: `npx jest src/widgets/Header src/widgets/Footer src/shared/i18n`
Expected: 기존 chrome i18n 라벨 테스트 + 신규 T-03/04 전부 PASS (ko에서 href 무변경이라 회귀 없음)

Run: `npx tsc --noEmit`
Expected: 통과 (무관 기존 에러는 DONE_WITH_CONCERNS로만 보고)

- [ ] **Step 7: Commit**

```bash
git add src/shared/i18n/LocalizedLink.tsx src/shared/i18n/__tests__/LocalizedLink.test.tsx src/shared/i18n/index.ts src/widgets/Footer/BottomNavButton.tsx src/widgets/Header/DesktopHeader.tsx src/widgets/Footer/DesktopFooter.tsx
git commit -m "feat(i18n): LocalizedLink wrapper, make chrome links locale-sticky (T-03/04)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>" -- src/shared/i18n/LocalizedLink.tsx src/shared/i18n/__tests__/LocalizedLink.test.tsx src/shared/i18n/index.ts src/widgets/Footer/BottomNavButton.tsx src/widgets/Header/DesktopHeader.tsx src/widgets/Footer/DesktopFooter.tsx
```

---

## Task 3: 선호 locale localStorage 헬퍼 (T-06)

**Files:**
- Modify: `src/shared/config/constants/localStorage.ts`
- Create: `src/shared/i18n/preferredLocale.ts`
- Test: `src/shared/i18n/__tests__/preferredLocale.test.ts`
- Modify: `src/shared/i18n/index.ts`

- [ ] **Step 1: Write the failing test (T-06)**

```ts
// src/shared/i18n/__tests__/preferredLocale.test.ts
import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";

import { getStoredLocale, setStoredLocale } from "../preferredLocale";

describe("preferredLocale (T-06)", () => {
  beforeEach(() => localStorage.clear());

  it("미설정 → null", () => {
    expect(getStoredLocale()).toBeNull();
  });

  it("유효 locale 저장 → 반환", () => {
    localStorage.setItem(STORAGE_KEYS.PREFERRED_LOCALE, "ja");
    expect(getStoredLocale()).toBe("ja");
  });

  it("미지원/빈 값 → null", () => {
    localStorage.setItem(STORAGE_KEYS.PREFERRED_LOCALE, "de");
    expect(getStoredLocale()).toBeNull();
    localStorage.setItem(STORAGE_KEYS.PREFERRED_LOCALE, "");
    expect(getStoredLocale()).toBeNull();
  });

  it("setStoredLocale 왕복", () => {
    setStoredLocale("en");
    expect(getStoredLocale()).toBe("en");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/shared/i18n/__tests__/preferredLocale.test.ts`
Expected: FAIL — `STORAGE_KEYS.PREFERRED_LOCALE` undefined / 모듈 없음

- [ ] **Step 3a: `PREFERRED_LOCALE` 키 추가**

`src/shared/config/constants/localStorage.ts`의 `STORAGE_KEYS` 객체에 한 줄 추가(`SMART_APP_BANNER_DISMISSED` 아래):

```ts
  PREFERRED_LOCALE: "preferred_locale",
```

- [ ] **Step 3b: 헬퍼 생성**

```ts
// src/shared/i18n/preferredLocale.ts
import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";

import { LOCALES, type Locale } from "./types";

const isLocale = (value: string | null): value is Locale =>
  value !== null && (LOCALES as readonly string[]).includes(value);

export const getStoredLocale = (): Locale | null => {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(STORAGE_KEYS.PREFERRED_LOCALE);
    return isLocale(value) ? value : null;
  } catch {
    return null;
  }
};

export const setStoredLocale = (locale: Locale): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERRED_LOCALE, locale);
  } catch {
    return;
  }
};
```

- [ ] **Step 3c: index.ts export**

`src/shared/i18n/index.ts`에 추가:

```ts
export { getStoredLocale, setStoredLocale } from "./preferredLocale";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/shared/i18n/__tests__/preferredLocale.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/shared/config/constants/localStorage.ts src/shared/i18n/preferredLocale.ts src/shared/i18n/__tests__/preferredLocale.test.ts src/shared/i18n/index.ts
git commit -m "feat(i18n): preferred-locale localStorage helpers (T-06)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>" -- src/shared/config/constants/localStorage.ts src/shared/i18n/preferredLocale.ts src/shared/i18n/__tests__/preferredLocale.test.ts src/shared/i18n/index.ts
```

---

## Task 4: 설정 언어 스위처 row (T-07/08/09)

**Files:**
- Create: `src/features/auth/ui/LanguageSettingRow.tsx`
- Test: `src/features/auth/ui/__tests__/LanguageSettingRow.test.tsx`
- Modify: `src/features/auth/ui/SettingsActionButton.tsx`

- [ ] **Step 1: Write the failing test (T-07/08/09)**

```tsx
// src/features/auth/ui/__tests__/LanguageSettingRow.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { usePathname, useRouter } from "next/navigation";

import { STORAGE_KEYS } from "@/shared/config/constants/localStorage";

import { LanguageSettingRow } from "../LanguageSettingRow";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

const push = jest.fn();

beforeEach(() => {
  push.mockClear();
  localStorage.clear();
  (useRouter as jest.Mock).mockReturnValue({ push });
  (usePathname as jest.Mock).mockReturnValue("/en/recipes/1");
});

describe("LanguageSettingRow", () => {
  it("T-07: 현재 활성 언어가 선택 상태", () => {
    render(<LanguageSettingRow />);
    expect(screen.getByRole("button", { name: "English" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "한국어" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("T-08: 日本語 선택 → /ja 이동 + localStorage 저장", () => {
    render(<LanguageSettingRow />);
    fireEvent.click(screen.getByRole("button", { name: "日本語" }));
    expect(push).toHaveBeenCalledWith("/ja/recipes/1");
    expect(localStorage.getItem(STORAGE_KEYS.PREFERRED_LOCALE)).toBe("ja");
  });

  it("T-09: 한국어 선택 → prefix 없는 경로", () => {
    render(<LanguageSettingRow />);
    fireEvent.click(screen.getByRole("button", { name: "한국어" }));
    expect(push).toHaveBeenCalledWith("/recipes/1");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/features/auth/ui/__tests__/LanguageSettingRow.test.tsx`
Expected: FAIL — "Cannot find module '../LanguageSettingRow'"

- [ ] **Step 3a: `LanguageSettingRow` 생성**

```tsx
// src/features/auth/ui/LanguageSettingRow.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";

import { Languages } from "lucide-react";

import {
  localizedHref,
  setStoredLocale,
  stripLocale,
  LOCALES,
  type Locale,
} from "@/shared/i18n";

const LOCALE_LABELS: Record<Locale, string> = {
  ko: "한국어",
  ja: "日本語",
  en: "English",
};

export const LanguageSettingRow = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { locale: current, barePath } = stripLocale(pathname);

  const handleSelect = (next: Locale) => {
    setStoredLocale(next);
    router.push(localizedHref(barePath, next));
  };

  return (
    <div className="flex w-full items-center justify-between px-4 py-3">
      <div className="text-ink-sub flex items-center gap-2">
        <Languages size={16} aria-hidden="true" />
        <span>언어</span>
      </div>
      <div role="group" aria-label="언어 선택" className="flex gap-1">
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
```

> `LOCALES`/`Locale`은 `@/shared/i18n`에서 이미 export됨. `setStoredLocale`/`stripLocale`/`localizedHref`은 Task 1·3에서 추가됨.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/features/auth/ui/__tests__/LanguageSettingRow.test.tsx`
Expected: PASS (T-07/08/09)

- [ ] **Step 5: SettingsActionButton에 삽입**

`src/features/auth/ui/SettingsActionButton.tsx`:
- import 추가: `import { LanguageSettingRow } from "./LanguageSettingRow";`
- 설정 row 목록에서 `<AdRemovalRow ... />` 블록 **아래**에 한 줄 추가:
```tsx
              <LanguageSettingRow />
```

- [ ] **Step 6: 타입 + 전체 i18n 스위트 확인**

Run: `npx tsc --noEmit`
Expected: 통과 (무관 기존 에러는 DONE_WITH_CONCERNS로만 보고)

Run: `npx jest src/shared/i18n src/features/auth/ui src/widgets/Header src/widgets/Footer`
Expected: 전 i18n/스위처/chrome 테스트 통과

- [ ] **Step 7: Commit**

```bash
git add src/features/auth/ui/LanguageSettingRow.tsx src/features/auth/ui/__tests__/LanguageSettingRow.test.tsx src/features/auth/ui/SettingsActionButton.tsx
git commit -m "feat(i18n): language switcher row in settings (T-07/08/09)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>" -- src/features/auth/ui/LanguageSettingRow.tsx src/features/auth/ui/__tests__/LanguageSettingRow.test.tsx src/features/auth/ui/SettingsActionButton.tsx
```

---

## Traceability (self-review)

| Test ID | Task | 위치 |
| --- | --- | --- |
| T-01, T-02, T-05 | 1 | localizedHref.test |
| T-03, T-04 | 2 | LocalizedLink.test (+chrome 전환) |
| T-06 | 3 | preferredLocale.test |
| T-07, T-08, T-09 | 4 | LanguageSettingRow.test |

모든 매트릭스 Test ID가 task의 실패 테스트로 매핑됨. non-goal(자동 리다이렉트·404 레지스트리·쿠키/서버 리다이렉트·html lang·chrome 외 링크 일괄 전환·카피 번역)은 테스트 없음(의도된 부재).
