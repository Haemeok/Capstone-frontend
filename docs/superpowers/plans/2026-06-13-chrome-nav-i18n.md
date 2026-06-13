# 공유 nav chrome i18n Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 헤더·하단탭·푸터 nav chrome을 ko/ja/en 사전 경유로 전환하되, ko 화면은 글자 단위로 무변화.

**Architecture:** 접근법 A — chrome는 root layout에 단일 렌더되어 locale prop이 없으므로, 순수 함수 `resolveChromeLocale(pathname)`로 URL prefix에서 locale을 자가판단하고 client 훅 `useChromeDict()`가 `nav` 사전 슬라이스를 lookup한다. 인스코프 위젯은 전부 이미 `"use client"`라 신규 client 전환 0, root layout·`headers()` 무변경(정적 렌더 보존).

**Tech Stack:** Next.js 15 App Router, TypeScript, jest + @testing-library/react, FSD.

**Source specs:** `2026-06-13-chrome-nav-i18n-{design,slices,test-design}.md`

**Glossary (고정):** locale(ko/ja/en) · chrome(헤더/하단탭/푸터) · nav(사전 네임스페이스) · 사전(dictionary) · prefix(`/en`·`/ja`) · 하단탭(BottomNavBar) · 헤더 · 푸터 · 미읽음(unread) · 타입 게이트 · chrome 훅(useChromeLocale/useChromeDict)

---

## File Structure

**Create:**
- `src/shared/i18n/resolveChromeLocale.ts` — 순수 함수 pathname→Locale (T-04 owner)
- `src/shared/i18n/__tests__/resolveChromeLocale.test.ts` — T-04
- `src/shared/i18n/useChromeDict.ts` — client 훅 `useChromeLocale`/`useChromeDict`
- `src/shared/i18n/navMessages.ts` — `Record<Locale, NavDict>` (nav 슬라이스만 import → 번들 격리)
- `src/shared/i18n/messages/{ko,ja,en}/nav.ts` — locale별 nav 데이터
- 각 위젯 옆 `__tests__/*.test.tsx` — T-01~T-14

**Modify:**
- `src/shared/i18n/types.ts` — `NavDict` 타입 + `Dictionary`에 `nav` 추가
- `src/shared/i18n/messages/{ko,ja,en}/index.ts` — `nav` 등록
- `src/shared/i18n/index.ts` — `useChromeDict`/`useChromeLocale` re-export
- `src/widgets/Footer/BottomNavBar.tsx` · `Footer/DesktopFooter.tsx`
- `src/widgets/Header/{DesktopHeader,NotificationButton,AppInstallButton,SavedRecipeBooksButton,UserProfileHeader}.tsx`

**nav 사전은 슬라이스 공유 데이터 리소스다.** Task 2에서 전체 `NavDict` 타입 + 세 locale nav.ts를
한 번에 만든다(데이터/config는 DRY하게 1회 생성). 이후 task는 위젯을 기존 키에 **와이어링**할 뿐이며,
각 task의 실패 테스트는 위젯 *행동*(T-01~T-14)에 바인딩되어 슬라이스의 수직성이 유지된다.

---

## Task 1: `resolveChromeLocale` 순수 함수 (T-04)

**Files:**
- Create: `src/shared/i18n/resolveChromeLocale.ts`
- Test: `src/shared/i18n/__tests__/resolveChromeLocale.test.ts`

- [ ] **Step 1: Write the failing test (T-04)**

```ts
// src/shared/i18n/__tests__/resolveChromeLocale.test.ts
import { resolveChromeLocale } from "../resolveChromeLocale";

describe("resolveChromeLocale (T-04)", () => {
  it.each([
    ["/", "ko"],
    ["/recipes/1", "ko"],
    ["/en", "en"],
    ["/en/", "en"],
    ["/en/recipes/1", "en"],
    ["/ja", "ja"],
    ["/ja/search/results", "ja"],
    ["/engine", "ko"],
    ["/news", "ko"],
    ["/english", "ko"],
  ] as const)("%s → %s (세그먼트 경계 안전)", (path, expected) => {
    expect(resolveChromeLocale(path)).toBe(expected);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/shared/i18n/__tests__/resolveChromeLocale.test.ts`
Expected: FAIL — "Cannot find module '../resolveChromeLocale'"

- [ ] **Step 3: Write minimal implementation**

```ts
// src/shared/i18n/resolveChromeLocale.ts
import type { Locale } from "./types";

export const resolveChromeLocale = (pathname: string): Locale => {
  if (pathname === "/ja" || pathname.startsWith("/ja/")) return "ja";
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  return "ko";
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/shared/i18n/__tests__/resolveChromeLocale.test.ts`
Expected: PASS (10 cases)

- [ ] **Step 5: Commit**

```bash
git add src/shared/i18n/resolveChromeLocale.ts src/shared/i18n/__tests__/resolveChromeLocale.test.ts
git commit -m "feat(i18n): resolveChromeLocale pure prefix->locale mapping (T-04)" -- src/shared/i18n/resolveChromeLocale.ts src/shared/i18n/__tests__/resolveChromeLocale.test.ts
```

---

## Task 2: nav 사전 + chrome 훅 + 하단탭 와이어링 (walking skeleton, T-01/02/03)

이 task가 토대(NavDict 타입·세 locale nav.ts·navMessages·useChromeDict)를 온라인으로 만든다.
실패 테스트는 BottomNavBar 렌더(T-01/02/03).

**Files:**
- Modify: `src/shared/i18n/types.ts`
- Create: `src/shared/i18n/messages/{ko,ja,en}/nav.ts`
- Modify: `src/shared/i18n/messages/{ko,ja,en}/index.ts`
- Create: `src/shared/i18n/navMessages.ts`, `src/shared/i18n/useChromeDict.ts`
- Modify: `src/shared/i18n/index.ts`
- Modify: `src/widgets/Footer/BottomNavBar.tsx`
- Test: `src/widgets/Footer/__tests__/BottomNavBar.i18n.test.tsx`

- [ ] **Step 1: Write the failing test (T-01/02/03)**

```tsx
// src/widgets/Footer/__tests__/BottomNavBar.i18n.test.tsx
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";

import BottomNavBar from "../BottomNavBar";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("@/entities/user", () => ({
  useUserStore: () => ({ user: { id: "u1" } }),
}));
jest.mock("@/shared/hooks/useIsBottomNavVisible", () => ({
  useIsBottomNavVisible: () => true,
}));
jest.mock("@/shared/store/useInputFocusStore", () => ({
  useInputFocusStore: () => ({ isInputFocused: false }),
}));
jest.mock("@/widgets/AIRecipeNotificationBadge", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("@/shared/ui/badge/LoginPromotionBadge", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

const setPath = (p: string) =>
  (usePathname as jest.Mock).mockReturnValue(p);

describe("BottomNavBar i18n", () => {
  it("T-01: /en 경로에서 영어 라벨", () => {
    setPath("/en/recipes/1");
    render(<BottomNavBar />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("T-02: /ja 경로에서 일본어 라벨", () => {
    setPath("/ja/recipes/1");
    render(<BottomNavBar />);
    expect(screen.getByText("ホーム")).toBeInTheDocument();
    expect(screen.getByText("検索")).toBeInTheDocument();
  });

  it("T-03: 루트(ko)에서 한국어 라벨 무회귀", () => {
    setPath("/");
    render(<BottomNavBar />);
    expect(screen.getByText("홈")).toBeInTheDocument();
    expect(screen.getByText("검색")).toBeInTheDocument();
    expect(screen.getByText("냉장고")).toBeInTheDocument();
    expect(screen.getByText("AI 레시피")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/widgets/Footer/__tests__/BottomNavBar.i18n.test.tsx`
Expected: FAIL — "Home" 없음(현재 하드코딩 "홈"). T-03도 일부 통과할 수 있으나 T-01/02는 FAIL.

- [ ] **Step 3a: `NavDict` 타입 추가**

`src/shared/i18n/types.ts` — `Dictionary` 정의 **앞에** 추가하고, `Dictionary`에 `nav` 줄 추가:

```ts
export type NavDict = {
  home: string;
  search: string;
  fridge: string;
  aiRecipe: string;
  my: string;
  recipeSearch: string;
  youtubeRecipe: string;
  login: string;
  install: string;
  installAria: string;
  notificationsAria: string;
  notificationsUnreadAria: Plural;
  unreadBadgeAria: Plural;
  savedBooksAria: string;
  savedBooksToast: string;
  profile: string;
  footer: {
    sectionService: string;
    sectionSupport: string;
    tagline: string;
    businessInfoToggleAria: string;
    terms: string;
    privacy: string;
    reportError: string;
    adInquiry: string;
    copyrightReport: string;
    ceoLabel: string;
    csLabel: string;
    adLabel: string;
  };
};
```

`Dictionary` 타입에 한 줄 추가:

```ts
export type Dictionary = {
  search: SearchDict;
  meta: MetaDict;
  errors: ErrorsDict;
  notFound: NotFoundDict;
  recipeDetail: RecipeDetailDict;
  youtube: YoutubeDict;
  ingredientDetail: IngredientDetailDict;
  aiRecipe: AiRecipeDict;
  nav: NavDict;
};
```

- [ ] **Step 3b: 세 locale nav.ts 생성**

```ts
// src/shared/i18n/messages/ko/nav.ts
import type { NavDict } from "../../types";

export const nav: NavDict = {
  home: "홈",
  search: "검색",
  fridge: "냉장고",
  aiRecipe: "AI 레시피",
  my: "My",
  recipeSearch: "레시피 검색",
  youtubeRecipe: "유튜브 레시피",
  login: "로그인",
  install: "앱 설치",
  installAria: "앱 설치하기",
  notificationsAria: "알림 페이지로 이동",
  notificationsUnreadAria: {
    one: "알림 페이지로 이동 ({count}개 미읽음)",
    other: "알림 페이지로 이동 ({count}개 미읽음)",
  },
  unreadBadgeAria: {
    one: "{count}개의 읽지 않은 알림",
    other: "{count}개의 읽지 않은 알림",
  },
  savedBooksAria: "저장한 레시피북",
  savedBooksToast: "저장한 레시피북을 확인해보세요!",
  profile: "프로필",
  footer: {
    sectionService: "서비스",
    sectionSupport: "고객지원",
    tagline:
      "AI 기반 레시피 추천 서비스로, 냉장고 재료만으로 맛있는 요리를 만들어보세요.",
    businessInfoToggleAria: "사업자 정보 펼치기",
    terms: "서비스 이용약관",
    privacy: "개인정보 처리방침",
    reportError: "오류제보",
    adInquiry: "광고/제휴 문의",
    copyrightReport: "저작권 신고 및 게시 중단 요청",
    ceoLabel: "대표",
    csLabel: "고객센터",
    adLabel: "광고 문의",
  },
};
```

```ts
// src/shared/i18n/messages/ja/nav.ts
import type { NavDict } from "../../types";

export const nav: NavDict = {
  home: "ホーム",
  search: "検索",
  fridge: "冷蔵庫",
  aiRecipe: "AIレシピ",
  my: "マイ",
  recipeSearch: "レシピ検索",
  youtubeRecipe: "YouTubeレシピ",
  login: "ログイン",
  install: "アプリインストール",
  installAria: "アプリをインストール",
  notificationsAria: "通知ページへ移動",
  notificationsUnreadAria: {
    one: "通知ページへ移動（未読{count}件）",
    other: "通知ページへ移動（未読{count}件）",
  },
  unreadBadgeAria: {
    one: "未読の通知{count}件",
    other: "未読の通知{count}件",
  },
  savedBooksAria: "保存したレシピブック",
  savedBooksToast: "保存したレシピブックを確認しましょう！",
  profile: "プロフィール",
  footer: {
    sectionService: "サービス",
    sectionSupport: "カスタマーサポート",
    tagline:
      "AIによるレシピ提案サービス。冷蔵庫の食材だけで美味しい料理を作りましょう。",
    businessInfoToggleAria: "事業者情報を開く",
    terms: "利用規約",
    privacy: "プライバシーポリシー",
    reportError: "エラー報告",
    adInquiry: "広告・提携のお問い合わせ",
    copyrightReport: "著作権侵害の報告・削除依頼",
    ceoLabel: "代表",
    csLabel: "カスタマーセンター",
    adLabel: "広告のお問い合わせ",
  },
};
```

```ts
// src/shared/i18n/messages/en/nav.ts
import type { NavDict } from "../../types";

export const nav: NavDict = {
  home: "Home",
  search: "Search",
  fridge: "Fridge",
  aiRecipe: "AI Recipe",
  my: "My",
  recipeSearch: "Recipe Search",
  youtubeRecipe: "YouTube Recipe",
  login: "Login",
  install: "Install App",
  installAria: "Install the app",
  notificationsAria: "Go to notifications",
  notificationsUnreadAria: {
    one: "Go to notifications ({count} unread)",
    other: "Go to notifications ({count} unread)",
  },
  unreadBadgeAria: {
    one: "{count} unread notification",
    other: "{count} unread notifications",
  },
  savedBooksAria: "Saved recipe books",
  savedBooksToast: "Check out your saved recipe books!",
  profile: "Profile",
  footer: {
    sectionService: "Service",
    sectionSupport: "Support",
    tagline:
      "Make delicious meals with just what's in your fridge, powered by AI recipe recommendations.",
    businessInfoToggleAria: "Expand business info",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    reportError: "Report an error",
    adInquiry: "Advertising & partnerships",
    copyrightReport: "Copyright / takedown request",
    ceoLabel: "CEO",
    csLabel: "Customer service",
    adLabel: "Advertising",
  },
};
```

- [ ] **Step 3c: 각 index.ts에 nav 등록**

세 파일 모두 동일 패턴. `src/shared/i18n/messages/ko/index.ts`:

```ts
import type { Dictionary } from "../../types";
import { aiRecipe } from "./aiRecipe";
import { ingredientDetail } from "./ingredientDetail";
import { nav } from "./nav";
import { recipeDetail } from "./recipeDetail";
import { errors, meta, notFound, search } from "./search";
import { youtube } from "./youtube";

export const ko: Dictionary = {
  search,
  meta,
  errors,
  notFound,
  recipeDetail,
  youtube,
  ingredientDetail,
  aiRecipe,
  nav,
};
```

`messages/ja/index.ts`, `messages/en/index.ts`도 동일하게 `import { nav } from "./nav";`와 객체에 `nav,` 추가 (export 상수명은 각각 `ja`, `en`).

- [ ] **Step 3d: navMessages + chrome 훅 생성**

```ts
// src/shared/i18n/navMessages.ts
import { nav as en } from "./messages/en/nav";
import { nav as ja } from "./messages/ja/nav";
import { nav as ko } from "./messages/ko/nav";
import type { Locale, NavDict } from "./types";

export const navMessages: Record<Locale, NavDict> = { ko, ja, en };
```

```ts
// src/shared/i18n/useChromeDict.ts
"use client";

import { usePathname } from "next/navigation";

import { navMessages } from "./navMessages";
import { resolveChromeLocale } from "./resolveChromeLocale";
import type { Locale, NavDict } from "./types";

export const useChromeLocale = (): Locale =>
  resolveChromeLocale(usePathname() ?? "/");

export const useChromeDict = (): NavDict => navMessages[useChromeLocale()];
```

- [ ] **Step 3e: index.ts re-export**

`src/shared/i18n/index.ts`에 추가:

```ts
export { useChromeDict, useChromeLocale } from "./useChromeDict";
export { resolveChromeLocale } from "./resolveChromeLocale";
```

(`Dictionary, Locale, Plural, YoutubeDict` 옆에 `NavDict` 타입도 export에 추가:
`export type { Dictionary, Locale, NavDict, Plural, YoutubeDict } from "./types";`)

- [ ] **Step 3f: BottomNavBar 와이어링**

`src/widgets/Footer/BottomNavBar.tsx`:
- import 추가: `import { useChromeDict } from "@/shared/i18n";`
- 컴포넌트 본문 상단(`const pathname = usePathname();` 아래)에 `const t = useChromeDict();`
- 라벨 교체: `label="홈"`→`label={t.home}`, `label="검색"`→`label={t.search}`,
  `label="냉장고"`→`label={t.fridge}`, `label="AI 레시피"`→`label={t.aiRecipe}`,
  `label="My"`→`label={t.my}`

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/widgets/Footer/__tests__/BottomNavBar.i18n.test.tsx`
Expected: PASS (T-01/02/03)

- [ ] **Step 5: 타입 게이트(TG-1) + 정적 보존(INV-1) 확인**

Run: `npx tsc --noEmit`
Expected: 통과 (세 nav.ts가 NavDict 완전 충족). 한 키를 일부러 지우면 FAIL함을 확인 후 복구.

Run: `git grep -nE "next/headers|\\bheaders\\(\\)|\\bcookies\\(\\)" -- src/shared/i18n/useChromeDict.ts src/shared/i18n/navMessages.ts src/widgets/Footer/BottomNavBar.tsx`
Expected: 매치 0 (정적 렌더 deopt 미도입).

- [ ] **Step 6: Commit**

```bash
git add src/shared/i18n/types.ts src/shared/i18n/messages/ko/nav.ts src/shared/i18n/messages/ja/nav.ts src/shared/i18n/messages/en/nav.ts src/shared/i18n/messages/ko/index.ts src/shared/i18n/messages/ja/index.ts src/shared/i18n/messages/en/index.ts src/shared/i18n/navMessages.ts src/shared/i18n/useChromeDict.ts src/shared/i18n/index.ts src/widgets/Footer/BottomNavBar.tsx src/widgets/Footer/__tests__/BottomNavBar.i18n.test.tsx
git commit -m "feat(i18n): nav dict + chrome hooks, localize bottom tab bar (T-01/02/03)" -- src/shared/i18n/types.ts src/shared/i18n/messages/ko/nav.ts src/shared/i18n/messages/ja/nav.ts src/shared/i18n/messages/en/nav.ts src/shared/i18n/messages/ko/index.ts src/shared/i18n/messages/ja/index.ts src/shared/i18n/messages/en/index.ts src/shared/i18n/navMessages.ts src/shared/i18n/useChromeDict.ts src/shared/i18n/index.ts src/widgets/Footer/BottomNavBar.tsx src/widgets/Footer/__tests__/BottomNavBar.i18n.test.tsx
```

---

## Task 3: 데스크톱 헤더 nav + 로그인 (T-05/06)

**Files:**
- Modify: `src/widgets/Header/DesktopHeader.tsx`
- Test: `src/widgets/Header/__tests__/DesktopHeader.i18n.test.tsx`

- [ ] **Step 1: Write the failing test (T-05/06)**

```tsx
// src/widgets/Header/__tests__/DesktopHeader.i18n.test.tsx
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";

import DesktopHeader from "../DesktopHeader";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));
jest.mock("@/entities/user", () => ({
  useUserStore: () => ({ user: null, isAuthReady: true }),
}));
jest.mock("next/dynamic", () => () => () => null);
jest.mock("../NotificationButton", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/shared/ui/badge/LoginPromotionBadge", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

const setPath = (p: string) => (usePathname as jest.Mock).mockReturnValue(p);

describe("DesktopHeader i18n", () => {
  it("T-05: /en 경로에서 nav·로그인 영어", () => {
    setPath("/en");
    render(<DesktopHeader />);
    expect(screen.getByText("Recipe Search")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("T-06: 루트(ko)에서 무회귀", () => {
    setPath("/");
    render(<DesktopHeader />);
    expect(screen.getByText("레시피 검색")).toBeInTheDocument();
    expect(screen.getByText("로그인")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/widgets/Header/__tests__/DesktopHeader.i18n.test.tsx`
Expected: FAIL — "Recipe Search" 없음.

- [ ] **Step 3: Wire DesktopHeader**

`src/widgets/Header/DesktopHeader.tsx`:
- import 추가: `import { useChromeDict } from "@/shared/i18n";`
- 모듈 상수 `NAV_LINKS`를 라벨 키 기반으로 교체:

```ts
const NAV_LINKS = [
  { href: "/", labelKey: "home" },
  { href: "/search", labelKey: "recipeSearch" },
  { href: "/ingredients", labelKey: "fridge" },
  { href: "/recipes/new/ai", labelKey: "aiRecipe" },
  { href: "/recipes/new/youtube", labelKey: "youtubeRecipe" },
] as const;
```

- 컴포넌트 본문 `const pathname = usePathname();` 아래에 `const t = useChromeDict();`
- nav 링크 렌더에서 `{link.label}` → `{t[link.labelKey]}`
- "My" 텍스트(line 83 부근) → `{t.my}`
- "로그인" 버튼 텍스트 → `{t.login}`

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/widgets/Header/__tests__/DesktopHeader.i18n.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/widgets/Header/DesktopHeader.tsx src/widgets/Header/__tests__/DesktopHeader.i18n.test.tsx
git commit -m "feat(i18n): localize desktop header nav and login (T-05/06)" -- src/widgets/Header/DesktopHeader.tsx src/widgets/Header/__tests__/DesktopHeader.i18n.test.tsx
```

---

## Task 4: 알림 버튼 미읽음 plural (T-07/08)

**Files:**
- Modify: `src/widgets/Header/NotificationButton.tsx`
- Test: `src/widgets/Header/__tests__/NotificationButton.i18n.test.tsx`

- [ ] **Step 1: Write the failing test (T-07/08)**

```tsx
// src/widgets/Header/__tests__/NotificationButton.i18n.test.tsx
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";

import NotificationButton from "../NotificationButton";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));
jest.mock("@/entities/user", () => ({
  useUserStore: () => ({ user: { id: "u1" } }),
}));

const mockUnread = jest.fn();
jest.mock("@/entities/notification", () => ({
  useInfiniteNotificationsQuery: () => ({ unreadCount: mockUnread() }),
}));

const setPath = (p: string) => (usePathname as jest.Mock).mockReturnValue(p);

describe("NotificationButton i18n", () => {
  it("T-07: /en, 미읽음 3 → 영어 plural aria + count", () => {
    setPath("/en");
    mockUnread.mockReturnValue(3);
    render(<NotificationButton />);
    expect(
      screen.getByLabelText("Go to notifications (3 unread)")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("3 unread notifications")
    ).toBeInTheDocument();
  });

  it("T-08: /en, 미읽음 0 → 기본 aria(미읽음 절 없음)", () => {
    setPath("/en");
    mockUnread.mockReturnValue(0);
    render(<NotificationButton />);
    expect(screen.getByLabelText("Go to notifications")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/widgets/Header/__tests__/NotificationButton.i18n.test.tsx`
Expected: FAIL — 한국어 aria만 존재.

- [ ] **Step 3: Wire NotificationButton**

`src/widgets/Header/NotificationButton.tsx`:
- import 추가: `import { useChromeDict, format, plural } from "@/shared/i18n";`
- 본문 상단에 `const t = useChromeDict();`
- Link aria-label 교체:

```tsx
aria-label={
  unreadCount > 0
    ? format(plural(unreadCount, t.notificationsUnreadAria), {
        count: unreadCount,
      })
    : t.notificationsAria
}
```

- 배지 aria-label 교체:

```tsx
aria-label={format(plural(unreadCount, t.unreadBadgeAria), {
  count: unreadCount,
})}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/widgets/Header/__tests__/NotificationButton.i18n.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/widgets/Header/NotificationButton.tsx src/widgets/Header/__tests__/NotificationButton.i18n.test.tsx
git commit -m "feat(i18n): localize notification button with unread plural (T-07/08)" -- src/widgets/Header/NotificationButton.tsx src/widgets/Header/__tests__/NotificationButton.i18n.test.tsx
```

---

## Task 5: 앱 설치 · 저장한 레시피북 · 프로필 헤더 (T-09/10)

**Files:**
- Modify: `src/widgets/Header/AppInstallButton.tsx`, `SavedRecipeBooksButton.tsx`, `UserProfileHeader.tsx`
- Test: `src/widgets/Header/__tests__/HeaderActionButtons.i18n.test.tsx`

- [ ] **Step 1: Write the failing test (T-09/10)**

```tsx
// src/widgets/Header/__tests__/HeaderActionButtons.i18n.test.tsx
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";

import AppInstallButton from "../AppInstallButton";
import UserProfileHeader from "../UserProfileHeader";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));
jest.mock("@/shared/hooks/useIsApp", () => ({ useIsApp: () => false }));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
jest.mock("next/dynamic", () => () => () => null);

const setPath = (p: string) => (usePathname as jest.Mock).mockReturnValue(p);

describe("Header action buttons i18n", () => {
  it("T-09: /en — 앱 설치 영어 라벨/aria, 프로필 영어", () => {
    setPath("/en");
    const { unmount } = render(<AppInstallButton />);
    expect(screen.getByText("Install App")).toBeInTheDocument();
    expect(screen.getByLabelText("Install the app")).toBeInTheDocument();
    unmount();
    render(<UserProfileHeader isOwnProfile />);
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("T-10: 루트(ko) — 무회귀", () => {
    setPath("/");
    const { unmount } = render(<AppInstallButton />);
    expect(screen.getByText("앱 설치")).toBeInTheDocument();
    unmount();
    render(<UserProfileHeader isOwnProfile />);
    expect(screen.getByText("프로필")).toBeInTheDocument();
  });
});
```

> SavedRecipeBooksButton의 toast 문구(savedBooksToast)는 사용자 인터랙션(비로그인 클릭)
> 경유라 별도 단위 검증 없이 aria만 동일 패턴으로 커버. aria-label "Saved recipe books"는
> Task 5 구현에 포함하되, 위 테스트는 대표 위젯(AppInstall/Profile)으로 wiring을 증명한다
> (change-detector 회피: 위젯별 전수 등식 금지).

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/widgets/Header/__tests__/HeaderActionButtons.i18n.test.tsx`
Expected: FAIL — "Install App" 없음.

- [ ] **Step 3a: Wire AppInstallButton**

`src/widgets/Header/AppInstallButton.tsx`:
- import: `import { useChromeDict } from "@/shared/i18n";`
- 본문 `const isInApp = useIsApp();` 아래(early return 전)에 `const t = useChromeDict();`
- `aria-label="앱 설치하기"` → `aria-label={t.installAria}`
- `<span>앱 설치</span>` → `<span>{t.install}</span>`

- [ ] **Step 3b: Wire SavedRecipeBooksButton**

`src/widgets/Header/SavedRecipeBooksButton.tsx`:
- import: `import { useChromeDict } from "@/shared/i18n";`
- 본문 상단에 `const t = useChromeDict();`
- drawer `message: "저장한 레시피북을 확인해보세요!"` → `message: t.savedBooksToast`
- `aria-label="저장한 레시피북"` → `aria-label={t.savedBooksAria}`

- [ ] **Step 3c: Wire UserProfileHeader**

`src/widgets/Header/UserProfileHeader.tsx`:
- import: `import { useChromeDict } from "@/shared/i18n";`
- `Header` 컴포넌트 본문 상단에 `const t = useChromeDict();`
- 두 `<h2 ...>프로필</h2>` → `<h2 ...>{t.profile}</h2>` (양쪽 분기 모두)

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/widgets/Header/__tests__/HeaderActionButtons.i18n.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/widgets/Header/AppInstallButton.tsx src/widgets/Header/SavedRecipeBooksButton.tsx src/widgets/Header/UserProfileHeader.tsx src/widgets/Header/__tests__/HeaderActionButtons.i18n.test.tsx
git commit -m "feat(i18n): localize install/saved-books/profile header buttons (T-09/10)" -- src/widgets/Header/AppInstallButton.tsx src/widgets/Header/SavedRecipeBooksButton.tsx src/widgets/Header/UserProfileHeader.tsx src/widgets/Header/__tests__/HeaderActionButtons.i18n.test.tsx
```

---

## Task 6: 데스크톱 푸터 (T-11/12/13/14)

**Files:**
- Modify: `src/widgets/Footer/DesktopFooter.tsx`
- Test: `src/widgets/Footer/__tests__/DesktopFooter.i18n.test.tsx`

- [ ] **Step 1: Write the failing test (T-11/12/13/14)**

```tsx
// src/widgets/Footer/__tests__/DesktopFooter.i18n.test.tsx
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";

import DesktopFooter from "../DesktopFooter";

jest.mock("next/navigation", () => ({ usePathname: jest.fn() }));

const setPath = (p: string) => (usePathname as jest.Mock).mockReturnValue(p);

describe("DesktopFooter i18n", () => {
  it("T-11: /en — 섹션 제목·법적 링크 라벨 영어", () => {
    setPath("/en");
    render(<DesktopFooter />);
    expect(screen.getByText("Service")).toBeInTheDocument();
    expect(screen.getByText("Support")).toBeInTheDocument();
    expect(screen.getByText("Terms of Service")).toBeInTheDocument();
  });

  it("T-12: 루트(ko) — 무회귀", () => {
    setPath("/");
    render(<DesktopFooter />);
    expect(screen.getByText("서비스")).toBeInTheDocument();
    expect(screen.getByText("고객지원")).toBeInTheDocument();
  });

  it("T-13: /en — 고유명사·Copyright·브랜드 비번역 유지", () => {
    setPath("/en");
    render(<DesktopFooter />);
    expect(screen.getByText("레시피오 (Recipio)")).toBeInTheDocument();
    expect(
      screen.getByText("Copyright © 2026 Team Recipio. All rights reserved.")
    ).toBeInTheDocument();
  });

  it("T-14: /en — 법적 링크 href는 ko 목적지 유지", () => {
    setPath("/en");
    render(<DesktopFooter />);
    expect(screen.getByText("Terms of Service").closest("a")).toHaveAttribute(
      "href",
      "/terms"
    );
    expect(screen.getByText("Privacy Policy").closest("a")).toHaveAttribute(
      "href",
      "/privacy"
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/widgets/Footer/__tests__/DesktopFooter.i18n.test.tsx`
Expected: FAIL — "Service" 없음.

- [ ] **Step 3: Wire DesktopFooter**

`src/widgets/Footer/DesktopFooter.tsx`:
- import: `import { useChromeDict } from "@/shared/i18n";`
- 모듈 상수 `FOOTER_LINKS`/`INFO_ROWS`의 한국어 `label`을 키로 교체(href·external·value는 유지):

```ts
const FOOTER_LINKS = {
  service: [
    { labelKey: "terms", href: "/terms" },
    { labelKey: "privacy", href: "/privacy" },
  ],
  support: [
    {
      labelKey: "reportError",
      href: "https://slashpage.com/recipio/943zqpmqxn63g2wnvy87",
      external: true,
    },
    { labelKey: "adInquiry", href: "/contact" },
    {
      labelKey: "copyrightReport",
      href: "https://docs.google.com/forms/d/e/1FAIpQLSdVUjr7LsnvG-WVG46cBhQOOUJN82irzTaKVS2Uthl6qKZgVg/viewform?usp=publish-editor",
      external: true,
    },
  ],
} as const;

const INFO_ROWS = [
  { labelKey: "ceoLabel", value: "도원진" },
  { labelKey: "csLabel", value: "recipio.cs@gmail.com" },
  { labelKey: "adLabel", value: "recipio.kr@gmail.com" },
] as const;
```

- 컴포넌트 본문 상단에 `const t = useChromeDict();`
- `key={link.label}` → `key={link.labelKey}`, `{link.label}` → `{t.footer[link.labelKey]}` (service·support 양쪽)
- `key={row.label}` → `key={row.labelKey}`, `<span>{row.label}</span>` → `<span>{t.footer[row.labelKey]}</span>`
- `aria-label="사업자 정보 펼치기"` → `aria-label={t.footer.businessInfoToggleAria}`
- 태그라인 `<p>AI 기반 ...</p>` 내용 → `{t.footer.tagline}`
- `<h4>서비스</h4>` → `<h4 ...>{t.footer.sectionService}</h4>`, `<h4>고객지원</h4>` → `{t.footer.sectionSupport}`
- **변경하지 않음(비번역):** `레시피오 (Recipio)` h3, `Copyright © 2026 ...`, INFO_ROWS의 `value`

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/widgets/Footer/__tests__/DesktopFooter.i18n.test.tsx`
Expected: PASS

- [ ] **Step 5: 전체 타입 체크 + chrome 회귀 스위트**

Run: `npx tsc --noEmit`
Expected: 통과

Run: `npx jest src/shared/i18n src/widgets/Header src/widgets/Footer`
Expected: 전 chrome i18n 테스트 통과

- [ ] **Step 6: Commit**

```bash
git add src/widgets/Footer/DesktopFooter.tsx src/widgets/Footer/__tests__/DesktopFooter.i18n.test.tsx
git commit -m "feat(i18n): localize desktop footer labels, keep proper nouns/href (T-11/12/13/14)" -- src/widgets/Footer/DesktopFooter.tsx src/widgets/Footer/__tests__/DesktopFooter.i18n.test.tsx
```

---

## Traceability (self-review)

| Test ID | Task | 위치 |
| --- | --- | --- |
| T-04 | 1 | resolveChromeLocale.test |
| T-01/02/03 | 2 | BottomNavBar.i18n.test |
| TG-1 / INV-1 | 2 | tsc / grep (Step 5) |
| T-05/06 | 3 | DesktopHeader.i18n.test |
| T-07/08 | 4 | NotificationButton.i18n.test |
| T-09/10 | 5 | HeaderActionButtons.i18n.test |
| T-11/12/13/14 | 6 | DesktopFooter.i18n.test |

모든 매트릭스 Test ID가 task의 실패 테스트로 매핑됨. non-goal(html lang·CategoryTabs·Toast·
RecipeNavBarButtons·법적 목적지 번역·언어 스위처)은 테스트 없음(의도된 부재).
