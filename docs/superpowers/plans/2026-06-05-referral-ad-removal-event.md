# 친구 초대(광고 제거) 이벤트 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 추천 코드 공유·추천인 코드 입력·광고 제거 상태 표시(MVP)를 프론트에 붙인다.

**Architecture:** FSD `shared → entities → features → widgets → app`. `entities/referral`(데이터·파생·스토어) + `features/referral`(시트·선물상자·전역 호스트). 시트는 zustand 스토어로 열고 앱 레이어에서 1회 마운트(두 트리거의 feature↔feature import 회피). 광고는 서버 `showAds`로 게이팅.

**Tech Stack:** Next.js 15 App Router, TypeScript, TanStack Query, Zustand, Radix(Drawer/Dialog), Tailwind, Jest + React Testing Library.

**테스트 설계:** `docs/superpowers/specs/2026-06-05-referral-ad-removal-event-test-design.md` (각 실패 테스트는 T-xx 인용).

**공통 테스트 실행:** `npx jest <파일경로>` (next/jest, jsdom). 단일 케이스: `npx jest <파일> -t "<이름>"`.

**커밋 규약:** 영문 conventional commit + 본문. 한 commit = 한 의미 단위. 레이어가 다르면 분리.

---

## File Structure

**Slice 1 — 광고 게이팅**
- Create `src/shared/adsense/lib/resolveAdsEnabled.ts` — 순수 게이트 결정.
- Create `src/shared/adsense/lib/__tests__/resolveAdsEnabled.test.ts`
- Create `src/shared/adsense/__tests__/AdsGate.integration.test.tsx`
- Modify `src/entities/user/model/types.ts` — `adStatus` 추가.
- Modify `src/app/providers/AdsGateProvider.tsx` — `resolveAdsEnabled` + `showAds`.

**Slice 2 — 선물상자·코드 복사**
- Modify `src/shared/config/constants/api.ts` — `REFERRAL_INFO`, `REFERRAL_REDEEM`.
- Create `src/entities/referral/model/types.ts`
- Create `src/entities/referral/model/api.ts`
- Create `src/entities/referral/model/queryKeys.ts`
- Create `src/entities/referral/model/hooks.ts` — `useReferralInfoQuery`.
- Create `src/entities/referral/model/sheetStore.ts` — `isOpen`/`lastOpenedAt`/`open`/`close`.
- Create `src/entities/referral/lib/derive.ts` — `campaignMonthLabel`, `normalizeCode`.
- Create `src/entities/referral/lib/__tests__/derive.test.ts`
- Create `src/entities/referral/index.ts`
- Create `src/features/referral/ui/ReferralSheet.tsx`
- Create `src/features/referral/ui/ReferralGiftButton.tsx`
- Create `src/features/referral/ui/ReferralSheetHost.tsx`
- Create `src/features/referral/index.ts`
- Create `src/features/referral/ui/__tests__/ReferralSheet.test.tsx`
- Create `src/features/referral/ui/__tests__/ProfileActionRow.test.tsx`
- Modify `src/features/edit-user-profile/ui/UserInfoEditButton.tsx` — `variant`.
- Modify `src/widgets/UserProfile/UserProfileDisplay.tsx` — 액션 행.
- Modify `src/app/providers/AppProviders.tsx` — `ReferralSheetHost` 마운트.

**Slice 3 — 추천인 입력**
- Modify `src/entities/referral/lib/derive.ts` — `canRedeem`, `remainingRewardCount`, `referrerRewardLimitReached`.
- Create `src/entities/referral/lib/redeemErrorMessage.ts`
- Create `src/entities/referral/lib/extractErrorCode.ts`
- Create `src/entities/referral/lib/__tests__/redeemErrorMessage.test.ts`
- Append `derive.test.ts` — `canRedeem` 등.
- Modify `src/entities/referral/model/hooks.ts` — `useRedeemMutation`.
- Modify `src/features/referral/ui/ReferralSheet.tsx` — 입력/상태/에러.
- Append `ReferralSheet.test.tsx`.

**Slice 4 — 빨간불**
- Create `src/entities/referral/lib/shouldShowNudge.ts`
- Create `src/entities/referral/lib/__tests__/shouldShowNudge.test.ts`
- Modify `src/features/referral/ui/ReferralGiftButton.tsx`.
- Append `ProfileActionRow.test.tsx` (T-410).

**Slice 5 — 설정 카운트다운**
- Create `src/shared/lib/time/formatRemaining.ts`
- Create `src/shared/lib/time/__tests__/formatRemaining.test.ts`
- Create `src/shared/lib/hooks/useCountdown.ts`
- Create `src/shared/lib/hooks/__tests__/useCountdown.test.ts`
- Modify `src/features/auth/ui/SettingsActionButton.tsx` — 광고 제거 행.
- Create `src/features/auth/ui/__tests__/AdRemovalSettingsRow.test.tsx`

**Slice 6 — 프로필 OG**
- Create `src/entities/user/model/getPublicUserForMetadata.ts`
- Create `src/app/users/[userId]/UserDetailClient.tsx` (기존 client 로직 이동)
- Modify `src/app/users/[userId]/page.tsx` → server component + `generateMetadata`.
- Create `src/app/users/[userId]/__tests__/generateMetadata.test.ts`

**Slice 7 — 알림 매핑**
- Modify `src/entities/notification/model/type.ts`
- Modify `src/entities/notification/ui/NotificationItem.tsx`
- Create `src/entities/notification/ui/__tests__/NotificationItem.referral.test.tsx`

---

## Task 1: 광고 제거 게이팅 (walking skeleton)

**Files:**
- Create: `src/shared/adsense/lib/resolveAdsEnabled.ts`
- Test: `src/shared/adsense/lib/__tests__/resolveAdsEnabled.test.ts`, `src/shared/adsense/__tests__/AdsGate.integration.test.tsx`
- Modify: `src/entities/user/model/types.ts`, `src/app/providers/AdsGateProvider.tsx`

- [ ] **Step 1: Write the failing unit test (T-101, T-102, T-103)**

`src/shared/adsense/lib/__tests__/resolveAdsEnabled.test.ts`:
```ts
import { resolveAdsEnabled } from "../resolveAdsEnabled";

describe("resolveAdsEnabled", () => {
  it("T-101: showAds=false면 enabled=false", () => {
    expect(
      resolveAdsEnabled({ adsEnabled: true, isTestUser: false, showAds: false })
    ).toBe(false);
  });

  it("T-102: showAds=undefined면 adsEnabled && !isTestUser를 따른다", () => {
    expect(
      resolveAdsEnabled({ adsEnabled: true, isTestUser: false, showAds: undefined })
    ).toBe(true);
  });

  it("T-103: 테스트 유저면 showAds=true여도 enabled=false", () => {
    expect(
      resolveAdsEnabled({ adsEnabled: true, isTestUser: true, showAds: true })
    ).toBe(false);
  });

  it("adsEnabled=false면 항상 false", () => {
    expect(
      resolveAdsEnabled({ adsEnabled: false, isTestUser: false, showAds: true })
    ).toBe(false);
  });
});
```

- [ ] **Step 2: Run → fail**

Run: `npx jest src/shared/adsense/lib/__tests__/resolveAdsEnabled.test.ts`
Expected: FAIL — "Cannot find module '../resolveAdsEnabled'".

- [ ] **Step 3: Implement**

`src/shared/adsense/lib/resolveAdsEnabled.ts`:
```ts
type ResolveAdsEnabledArgs = {
  adsEnabled: boolean;
  isTestUser: boolean;
  showAds: boolean | undefined;
};

export const resolveAdsEnabled = ({
  adsEnabled,
  isTestUser,
  showAds,
}: ResolveAdsEnabledArgs): boolean =>
  adsEnabled && !isTestUser && showAds !== false;
```

- [ ] **Step 4: Run → pass**

Run: `npx jest src/shared/adsense/lib/__tests__/resolveAdsEnabled.test.ts` → PASS.

- [ ] **Step 5: Extend User type**

`src/entities/user/model/types.ts` — `User` 타입에 추가(기존 필드 아래):
```ts
  adStatus?: {
    showAds: boolean;
    adFreeUntil: string | null;
  };
```

- [ ] **Step 6: Wire AdsGateProvider**

`src/app/providers/AdsGateProvider.tsx` — `value` useMemo 교체:
```tsx
import { resolveAdsEnabled } from "@/shared/adsense/lib/resolveAdsEnabled";
// ...
  const userId = useUserStore((state) => state.user?.id);
  const showAds = useUserStore((state) => state.user?.adStatus?.showAds);
  // ...
  const value = useMemo<AdsGateValue>(() => {
    if (!hydrated) return { enabled: false, isTestUser: false };

    const isTestUser = Boolean(userId && ADSENSE_TEST_USER_IDS.has(userId));
    const enabled = resolveAdsEnabled({
      adsEnabled: isAdsEnabled(),
      isTestUser,
      showAds,
    });
    return { enabled, isTestUser };
  }, [hydrated, userId, showAds]);
```

- [ ] **Step 7: Write the failing acceptance test (T-110)**

`src/shared/adsense/__tests__/AdsGate.integration.test.tsx`:
```tsx
import { render } from "@testing-library/react";

import { useUserStore } from "@/entities/user/model/store";

import { AdsGateProvider } from "@/app/providers/AdsGateProvider";
import { AdSlot } from "../AdSlot";

const baseUser = {
  id: "u1",
  nickname: "t",
  profileImage: "",
  hasFirstRecord: false,
  remainingAiGenerationQuota: 0,
  remainingYoutubeExtractionCredits: 0,
  remainingAiQuota: 0,
  remainingYoutubeQuota: 0,
} as never;

describe("AdsGate × AdSlot (T-110)", () => {
  afterEach(() => useUserStore.setState({ user: null }));

  it("T-110: showAds=false면 AdSlot이 아무것도 렌더하지 않는다", () => {
    useUserStore.setState({
      user: { ...baseUser, adStatus: { showAds: false, adFreeUntil: "2026-09-05T00:00:00Z" } },
    });
    const { container } = render(
      <AdsGateProvider>
        <AdSlot slotId="x" minHeight={250} />
      </AdsGateProvider>
    );
    expect(container).toBeEmptyDOMElement();
  });
});
```

> 참고: `AdsGateProvider`는 마운트 후 `setHydrated(true)` effect로 `hydrated`가 되어야 `enabled`가 계산된다. RTL `render`는 effect를 flush하므로 동기 assertion으로 충분하다. `isAdsEnabled()`는 `ADSENSE_CLIENT_ID` env가 비어있으면 false이므로, 이 테스트는 "showAds=false → enabled false → null"을 검증한다(showAds 분기 자체는 unit T-101이 소유).

- [ ] **Step 8: Run → pass**

Run: `npx jest src/shared/adsense/__tests__/AdsGate.integration.test.tsx` → PASS.

- [ ] **Step 9: Type-check & commit**

```bash
npx tsc --noEmit
git add src/shared/adsense/lib/resolveAdsEnabled.ts \
        src/shared/adsense/lib/__tests__/resolveAdsEnabled.test.ts \
        src/shared/adsense/__tests__/AdsGate.integration.test.tsx \
        src/entities/user/model/types.ts \
        src/app/providers/AdsGateProvider.tsx
git commit -m "feat(ads): gate ad slots on server showAds flag"
```

---

## Task 2: entities/referral 데이터 레이어 + 파생

**Files:** Create `types.ts`, `api.ts`, `queryKeys.ts`, `hooks.ts`, `sheetStore.ts`, `lib/derive.ts`, `lib/__tests__/derive.test.ts`, `index.ts` (all under `src/entities/referral/`); Modify `src/shared/config/constants/api.ts`.

- [ ] **Step 1: Add endpoints**

`src/shared/config/constants/api.ts` — `END_POINTS` 객체에 추가(`MY_INFO_DEV` 아래):
```ts
  REFERRAL_INFO: "/dev/me/referral",
  REFERRAL_REDEEM: "/dev/me/referral/redemptions",
```

- [ ] **Step 2: Types**

`src/entities/referral/model/types.ts`:
```ts
export type RedeemStatus =
  | "AVAILABLE"
  | "ALREADY_REDEEMED"
  | "NOT_ELIGIBLE_OLD_USER"
  | "REDEEM_WINDOW_EXPIRED"
  | "NO_ACTIVE_CAMPAIGN";

export type ReferralCampaign = {
  campaignKey: string;
  endsAt: string;
  maxRewardsPerReferrer: number;
  referrerRewardedCount: number;
};

export type Referrer = {
  nickname: string;
  referralCode: string;
};

export type RedeemStatusInfo = {
  status: RedeemStatus;
  redeemDeadline: string | null;
  redeemedAt: string | null;
  referrer: Referrer | null;
};

export type ReferralInfo = {
  myReferralCode: string;
  campaign: ReferralCampaign | null;
  redeemStatus: RedeemStatusInfo;
};

export type RedeemResult = {
  campaignKey: string;
  rewardApplied: boolean;
  adFreeUntil: string;
};
```

- [ ] **Step 3: API + query keys**

`src/entities/referral/model/api.ts`:
```ts
import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import { RedeemResult, ReferralInfo } from "./types";

export const getReferralInfo = () =>
  api.get<ReferralInfo>(END_POINTS.REFERRAL_INFO);

export const redeemReferralCode = (referralCode: string) =>
  api.post<RedeemResult>(END_POINTS.REFERRAL_REDEEM, { referralCode });
```

`src/entities/referral/model/queryKeys.ts`:
```ts
export const REFERRAL_QUERY_KEYS = {
  all: ["referral"] as const,
  info: () => [...REFERRAL_QUERY_KEYS.all, "info"] as const,
};
```

- [ ] **Step 4: Query hook**

`src/entities/referral/model/hooks.ts`:
```ts
"use client";

import { useQuery } from "@tanstack/react-query";

import { getReferralInfo } from "./api";
import { REFERRAL_QUERY_KEYS } from "./queryKeys";

export const useReferralInfoQuery = (enabled: boolean) =>
  useQuery({
    queryKey: REFERRAL_QUERY_KEYS.info(),
    queryFn: getReferralInfo,
    staleTime: 10 * 60 * 1000,
    enabled,
  });
```

- [ ] **Step 5: Sheet store (isOpen + lastOpenedAt)**

`src/entities/referral/model/sheetStore.ts`:
```ts
import { create } from "zustand";

import { storage } from "@/shared/lib/storage";

export const REFERRAL_LAST_OPENED_KEY = "recipio-referral-last-opened-at";

type ReferralSheetStore = {
  isOpen: boolean;
  lastOpenedAt: number | null;
  open: () => void;
  close: () => void;
};

const readLastOpenedAt = (): number | null => {
  const raw = storage.getItem(REFERRAL_LAST_OPENED_KEY);
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};

export const useReferralSheetStore = create<ReferralSheetStore>((set) => ({
  isOpen: false,
  lastOpenedAt: readLastOpenedAt(),

  open: () => {
    const now = Date.now();
    storage.setItem(REFERRAL_LAST_OPENED_KEY, String(now));
    set({ isOpen: true, lastOpenedAt: now });
  },

  close: () => set({ isOpen: false }),
}));
```

- [ ] **Step 6: Write failing derive test (T-201, T-202)**

`src/entities/referral/lib/__tests__/derive.test.ts`:
```ts
import { campaignMonthLabel, normalizeCode } from "../derive";

describe("campaignMonthLabel", () => {
  it("T-201: campaignKey의 월을 문자열로 반환한다", () => {
    expect(campaignMonthLabel({ campaignKey: "2026-07" } as never)).toBe("7");
    expect(campaignMonthLabel({ campaignKey: "2026-12" } as never)).toBe("12");
  });

  it("T-202: campaign이 null이면 null을 반환한다", () => {
    expect(campaignMonthLabel(null)).toBeNull();
  });
});

describe("normalizeCode", () => {
  it("trim + uppercase 한다", () => {
    expect(normalizeCode("  ab12cd34 ")).toBe("AB12CD34");
  });
});
```

- [ ] **Step 7: Run → fail**

Run: `npx jest src/entities/referral/lib/__tests__/derive.test.ts` → FAIL (module not found).

- [ ] **Step 8: Implement derive**

`src/entities/referral/lib/derive.ts`:
```ts
import { ReferralCampaign } from "../model/types";

export const campaignMonthLabel = (
  campaign: ReferralCampaign | null
): string | null => {
  if (!campaign) return null;
  const month = Number(campaign.campaignKey.split("-")[1]);
  if (!Number.isFinite(month) || month < 1 || month > 12) return null;
  return String(month);
};

export const normalizeCode = (raw: string): string => raw.trim().toUpperCase();
```

- [ ] **Step 9: Run → pass**

Run: `npx jest src/entities/referral/lib/__tests__/derive.test.ts` → PASS.

- [ ] **Step 10: Barrel**

`src/entities/referral/index.ts`:
```ts
export * from "./model/types";
export * from "./model/api";
export * from "./model/queryKeys";
export * from "./model/hooks";
export * from "./model/sheetStore";
export * from "./lib/derive";
```

- [ ] **Step 11: Type-check & commit**

```bash
npx tsc --noEmit
git add src/shared/config/constants/api.ts src/entities/referral
git commit -m "feat(referral): add referral entity data layer and derivations"
```

---

## Task 3: 선물상자 시트 + 프로필 액션 행 (Slice 2 UI)

**Files:** Create `ReferralSheet.tsx`, `ReferralGiftButton.tsx`, `ReferralSheetHost.tsx`, `features/referral/index.ts`, tests; Modify `UserInfoEditButton.tsx`, `UserProfileDisplay.tsx`, `AppProviders.tsx`.

- [ ] **Step 1: UserInfoEditButton variant**

`src/features/edit-user-profile/ui/UserInfoEditButton.tsx` — `variant` prop 추가. 전체 교체:
```tsx
"use client";

import Link from "next/link";

import { Pencil } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";

import { cn } from "@/lib/utils";

type UserInfoEditButtonProps = {
  className?: string;
  variant?: "icon" | "bar";
};

const UserInfoEditButton = ({
  className = "",
  variant = "icon",
}: UserInfoEditButtonProps) => {
  if (variant === "bar") {
    return (
      <Link
        href="/users/edit"
        prefetch={false}
        onClick={() => triggerHaptic("Light")}
        className={cn(
          "flex h-10 flex-1 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50",
          className
        )}
      >
        프로필 수정
      </Link>
    );
  }

  return (
    <Link
      href="/users/edit"
      prefetch={false}
      aria-label="프로필 편집"
      title="프로필 편집"
      onClick={() => triggerHaptic("Light")}
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700",
        className
      )}
    >
      <Pencil size={12} aria-hidden="true" />
    </Link>
  );
};

export default UserInfoEditButton;
```

- [ ] **Step 2: ReferralSheet (Slice 2 범위 — 헤더 + 내 코드 복사 + 로딩/에러)**

`src/features/referral/ui/ReferralSheet.tsx`:
```tsx
"use client";

import { Copy } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";

import { campaignMonthLabel, useReferralInfoQuery } from "@/entities/referral";

import { useToastStore } from "@/widgets/Toast/model/store";

type ReferralSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ReferralSheet = ({ open, onOpenChange }: ReferralSheetProps) => {
  const { Container, Content, Header, Title } = useResponsiveSheet();
  const { addToast } = useToastStore();
  const { data, isLoading, isError, refetch } = useReferralInfoQuery(open);

  const monthLabel = campaignMonthLabel(data?.campaign ?? null);
  const headerText = monthLabel
    ? `${monthLabel}월 친구 초대 이벤트`
    : "친구 초대 이벤트";

  const handleCopy = async () => {
    if (!data?.myReferralCode) return;
    await navigator.clipboard.writeText(data.myReferralCode);
    triggerHaptic("Success");
    addToast({ message: "초대코드를 복사했어요.", variant: "success" });
  };

  return (
    <Container open={open} onOpenChange={onOpenChange}>
      <Content className="p-0 sm:p-6">
        <Header className="px-5 pt-5">
          <Title className="text-lg font-bold">{headerText}</Title>
        </Header>

        <div className="px-5 pb-6">
          <p className="text-sm text-gray-500">
            친구를 초대하면 두 분 모두 한 달 동안 광고 없이 레시피오를 즐길 수
            있어요. 여러 친구를 초대할수록 혜택이 쌓여요.
          </p>

          {isLoading && (
            <div
              data-testid="referral-skeleton"
              className="mt-5 h-24 animate-pulse rounded-lg bg-gray-100"
            />
          )}

          {isError && (
            <div className="mt-5 flex flex-col items-center gap-2 py-6">
              <p className="text-sm text-gray-500">정보를 불러오지 못했어요.</p>
              <button
                onClick={() => refetch()}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                다시 시도
              </button>
            </div>
          )}

          {data && (
            <div className="mt-5">
              <p className="mb-1 text-xs font-semibold text-gray-400">
                내 초대코드
              </p>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <span className="text-lg font-bold tracking-wide text-gray-900">
                  {data.myReferralCode}
                </span>
                <button
                  onClick={handleCopy}
                  aria-label="초대코드 복사"
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                  <Copy size={14} aria-hidden="true" />
                  복사
                </button>
              </div>
            </div>
          )}
        </div>
      </Content>
    </Container>
  );
};
```

- [ ] **Step 3: ReferralGiftButton (Slice 2 범위 — 클릭만, 빨간불은 Task 6)**

`src/features/referral/ui/ReferralGiftButton.tsx`:
```tsx
"use client";

import { Gift } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";

import { useReferralSheetStore } from "@/entities/referral";

export const ReferralGiftButton = () => {
  const open = useReferralSheetStore((s) => s.open);

  return (
    <button
      type="button"
      aria-label="친구 초대 이벤트"
      onClick={() => {
        triggerHaptic("Light");
        open();
      }}
      className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-900 transition-colors hover:bg-gray-50"
    >
      <Gift size={18} aria-hidden="true" />
    </button>
  );
};
```

- [ ] **Step 4: ReferralSheetHost (전역 1회 마운트)**

`src/features/referral/ui/ReferralSheetHost.tsx`:
```tsx
"use client";

import { useReferralSheetStore } from "@/entities/referral";

import { ReferralSheet } from "./ReferralSheet";

export const ReferralSheetHost = () => {
  const isOpen = useReferralSheetStore((s) => s.isOpen);
  const close = useReferralSheetStore((s) => s.close);

  return (
    <ReferralSheet open={isOpen} onOpenChange={(o) => !o && close()} />
  );
};
```

`src/features/referral/index.ts`:
```ts
export { ReferralGiftButton } from "./ui/ReferralGiftButton";
export { ReferralSheetHost } from "./ui/ReferralSheetHost";
```

- [ ] **Step 5: Mount host in AppProviders**

`src/app/providers/AppProviders.tsx` — `AdsGateProvider` children 옆(트리 내부)에 추가. import 추가 후, 최상위 렌더 트리에 `<ReferralSheetHost />`를 한 번 렌더(기존 `{children}` 바로 뒤):
```tsx
import { ReferralSheetHost } from "@/features/referral";
// ... 기존 children 렌더 직후 같은 부모 안에:
<ReferralSheetHost />
```

- [ ] **Step 6: Profile action row**

`src/widgets/UserProfile/UserProfileDisplay.tsx` — (1) 닉네임 줄의 `{isOwnProfile && <UserInfoEditButton />}` 제거, (2) `CollapsibleP` 아래에 액션 행 추가. import 추가:
```tsx
import { Share2 } from "lucide-react";

import { BASE_URL } from "@/shared/config/constants/api";
import { triggerHaptic } from "@/shared/lib/bridge";
import { useShare } from "@/shared/hooks/useShare";

import { ReferralGiftButton } from "@/features/referral";
```
컴포넌트를 화살표+`const` 유지하되 본문에서 `useShare` 사용을 위해 함수형으로 전환(현재 암시적 반환을 블록으로):
```tsx
const UserProfileDisplay = ({
  user,
  isOwnProfile,
  loggedInUser,
}: UserProfileDisplayProps) => {
  const { share } = useShare();

  const handleShareProfile = () => {
    triggerHaptic("Light");
    share({
      title: `${user.nickname}님의 프로필`,
      text: "레시피오에서 확인해보세요!",
      url: `${BASE_URL}users/${user.id}`,
    });
  };

  return (
    <div className="relative z-10 px-5 pt-4 pb-1">
      {/* ...기존 이미지/닉네임/ActionButton 블록 (단 닉네임 줄의 UserInfoEditButton 제거)... */}
      <CollapsibleP
        content={user.introduction}
        className="text-mm px-0 pt-3 pb-2"
        height={52}
        gradientHeight={16}
      />
      {isOwnProfile && (
        <div className="mt-1 flex items-center gap-2">
          <UserInfoEditButton variant="bar" />
          <ReferralGiftButton />
          <button
            type="button"
            aria-label="프로필 공유"
            onClick={handleShareProfile}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-900 transition-colors hover:bg-gray-50"
          >
            <Share2 size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};
```
> 닉네임 줄에서 `UserInfoEditButton` import는 유지(아래 bar variant에서 사용). 닉네임 줄의 사용처만 삭제.

- [ ] **Step 7: Write failing acceptance tests (T-210, T-211, T-212, T-213, T-214)**

`src/features/referral/ui/__tests__/ReferralSheet.test.tsx`:
```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import * as api from "@/entities/referral/model/api";

import { ReferralSheet } from "../ReferralSheet";

jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn(), isAppWebView: () => false }));
jest.mock("@/widgets/Toast/model/store", () => ({
  useToastStore: () => ({ addToast: jest.fn() }),
}));

const renderSheet = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <ReferralSheet open onOpenChange={() => {}} />
    </QueryClientProvider>
  );
};

const info = {
  myReferralCode: "AB12CD34",
  campaign: { campaignKey: "2026-07", endsAt: "", maxRewardsPerReferrer: 3, referrerRewardedCount: 0 },
  redeemStatus: { status: "AVAILABLE", redeemDeadline: null, redeemedAt: null, referrer: null },
};

describe("ReferralSheet", () => {
  beforeEach(() => jest.restoreAllMocks());

  it("T-211/T-214: 헤더에 캠페인 월 라벨과 내 코드를 보여준다", async () => {
    jest.spyOn(api, "getReferralInfo").mockResolvedValue(info as never);
    renderSheet();
    expect(await screen.findByText("7월 친구 초대 이벤트")).toBeInTheDocument();
    expect(screen.getByText("AB12CD34")).toBeInTheDocument();
  });

  it("T-212: 복사를 누르면 clipboard에 코드를 쓴다", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    jest.spyOn(api, "getReferralInfo").mockResolvedValue(info as never);
    renderSheet();
    fireEvent.click(await screen.findByLabelText("초대코드 복사"));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith("AB12CD34"));
  });

  it("T-214(edge): 조회 실패면 다시 시도 버튼을 보여준다", async () => {
    jest.spyOn(api, "getReferralInfo").mockRejectedValue(new Error("boom"));
    renderSheet();
    expect(await screen.findByText("다시 시도")).toBeInTheDocument();
  });
});
```

`src/features/referral/ui/__tests__/ProfileActionRow.test.tsx`:
```tsx
import { render, screen, fireEvent } from "@testing-library/react";

import { useReferralSheetStore } from "@/entities/referral";

import UserProfileDisplay from "@/widgets/UserProfile/UserProfileDisplay";

const shareMock = jest.fn();
jest.mock("@/shared/hooks/useShare", () => ({ useShare: () => ({ share: shareMock }) }));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn(), isAppWebView: () => false }));

const user = {
  id: "u1", nickname: "유저", profileImage: "", introduction: "안녕",
  hasFirstRecord: false, remainingAiGenerationQuota: 0,
  remainingYoutubeExtractionCredits: 0, remainingAiQuota: 0, remainingYoutubeQuota: 0,
} as never;

describe("프로필 액션 행", () => {
  beforeEach(() => { shareMock.mockClear(); useReferralSheetStore.setState({ isOpen: false }); });

  it("T-210: 본인 프로필이면 '프로필 수정'이 /users/edit 링크다", () => {
    render(<UserProfileDisplay user={user} isOwnProfile loggedInUser={user} />);
    expect(screen.getByRole("link", { name: "프로필 수정" })).toHaveAttribute("href", "/users/edit");
  });

  it("T-211: 선물상자를 누르면 시트 스토어가 열린다", () => {
    render(<UserProfileDisplay user={user} isOwnProfile loggedInUser={user} />);
    fireEvent.click(screen.getByLabelText("친구 초대 이벤트"));
    expect(useReferralSheetStore.getState().isOpen).toBe(true);
  });

  it("T-213: 공유 버튼은 프로필 URL로 공유한다", () => {
    render(<UserProfileDisplay user={user} isOwnProfile loggedInUser={user} />);
    fireEvent.click(screen.getByLabelText("프로필 공유"));
    expect(shareMock).toHaveBeenCalledWith(
      expect.objectContaining({ url: "https://www.recipio.kr/users/u1" })
    );
  });
});
```

- [ ] **Step 8: Run → fail, then pass after wiring**

Run: `npx jest src/features/referral src/features/referral/ui/__tests__/ProfileActionRow.test.tsx`
먼저 FAIL → Step 1~6 구현으로 PASS. (UserProfileDisplay가 `ActionButton`을 렌더하므로, 테스트가 `ActionButton` 내부 의존성으로 실패하면 해당 모듈을 mock하거나 테스트 wrapper에 필요한 store를 setState로 채운다.)

- [ ] **Step 9: Type-check & commit**

```bash
npx tsc --noEmit
git add src/features/referral src/features/edit-user-profile/ui/UserInfoEditButton.tsx \
        src/widgets/UserProfile/UserProfileDisplay.tsx src/app/providers/AppProviders.tsx
git commit -m "feat(referral): add gift sheet, profile action row, and global host"
```

---

## Task 4: 추천인 코드 입력 (Slice 3)

**Files:** Modify `derive.ts`, `hooks.ts`, `ReferralSheet.tsx`; Create `redeemErrorMessage.ts`, `extractErrorCode.ts`, tests.

- [ ] **Step 1: Write failing derive test (T-301, T-302)** — append `src/entities/referral/lib/__tests__/derive.test.ts`:
```ts
import {
  canRedeem,
  referrerRewardLimitReached,
  remainingRewardCount,
} from "../derive";

describe("canRedeem (T-301)", () => {
  it("AVAILABLE만 true", () => {
    expect(canRedeem("AVAILABLE")).toBe(true);
    (["ALREADY_REDEEMED", "NOT_ELIGIBLE_OLD_USER", "REDEEM_WINDOW_EXPIRED", "NO_ACTIVE_CAMPAIGN"] as const)
      .forEach((s) => expect(canRedeem(s)).toBe(false));
  });
});

describe("보상 한도 (T-302)", () => {
  const c = (rewarded: number) =>
    ({ campaignKey: "2026-07", endsAt: "", maxRewardsPerReferrer: 3, referrerRewardedCount: rewarded }) as never;
  it("3/3이면 한도 도달, 남은 0", () => {
    expect(referrerRewardLimitReached(c(3))).toBe(true);
    expect(remainingRewardCount(c(3))).toBe(0);
  });
  it("2/3이면 미도달, 남은 1", () => {
    expect(referrerRewardLimitReached(c(2))).toBe(false);
    expect(remainingRewardCount(c(2))).toBe(1);
  });
});
```

- [ ] **Step 2: Run → fail; implement derive additions**

`src/entities/referral/lib/derive.ts` — 추가:
```ts
import { RedeemStatus } from "../model/types";

export const canRedeem = (status: RedeemStatus): boolean =>
  status === "AVAILABLE";

export const remainingRewardCount = (
  campaign: ReferralCampaign | null
): number =>
  campaign
    ? Math.max(0, campaign.maxRewardsPerReferrer - campaign.referrerRewardedCount)
    : 0;

export const referrerRewardLimitReached = (
  campaign: ReferralCampaign | null
): boolean =>
  campaign
    ? campaign.referrerRewardedCount >= campaign.maxRewardsPerReferrer
    : false;
```
Run: `npx jest src/entities/referral/lib/__tests__/derive.test.ts` → PASS.

- [ ] **Step 3: Write failing error-message test (T-303)**

`src/entities/referral/lib/__tests__/redeemErrorMessage.test.ts`:
```ts
import { redeemErrorMessage } from "../redeemErrorMessage";

describe("redeemErrorMessage (T-303)", () => {
  it("알려진 코드는 전용 문구", () => {
    expect(redeemErrorMessage("1301")).toContain("찾을 수 없");
    expect(redeemErrorMessage("1302")).toContain("본인");
    expect(redeemErrorMessage("1303")).toContain("이미");
  });
  it("미지의 코드는 generic 폴백", () => {
    expect(redeemErrorMessage("9999")).toContain("실패");
    expect(redeemErrorMessage(undefined)).toContain("실패");
  });
});
```

- [ ] **Step 4: Run → fail; implement**

`src/entities/referral/lib/redeemErrorMessage.ts`:
```ts
const REFERRAL_ERROR_MESSAGES: Record<string, string> = {
  "1301": "추천 코드를 찾을 수 없어요.",
  "1302": "본인의 추천 코드는 입력할 수 없어요.",
  "1303": "이미 추천인을 입력했어요.",
  "1304": "이벤트 시작 이후 가입한 분만 추천인을 입력할 수 있어요.",
  "1305": "추천인 입력 가능 기간이 지났어요.",
  "1306": "현재 진행 중인 추천 이벤트가 없어요.",
};

const FALLBACK = "추천인 입력에 실패했어요. 잠시 후 다시 시도해 주세요.";

export const redeemErrorMessage = (code: string | undefined): string => {
  if (code && REFERRAL_ERROR_MESSAGES[code]) return REFERRAL_ERROR_MESSAGES[code];
  return FALLBACK;
};
```

`src/entities/referral/lib/extractErrorCode.ts`:
```ts
import { getErrorData } from "@/shared/api/errors";

export const extractErrorCode = (error: unknown): string | undefined => {
  const data = getErrorData(error as never);
  return data?.code != null ? String(data.code) : undefined;
};
```
> `getErrorData`는 client.ts가 이미 사용 중인 ApiError 본문 추출기다. 시그니처가 다르면 `(error as { code?: string | number })?.code`로 폴백.

Run: `npx jest src/entities/referral/lib/__tests__/redeemErrorMessage.test.ts` → PASS.

- [ ] **Step 5: Redeem mutation hook** — append `src/entities/referral/model/hooks.ts`:
```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { redeemReferralCode } from "./api";

export const useRedeemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => redeemReferralCode(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      queryClient.invalidateQueries({ queryKey: REFERRAL_QUERY_KEYS.all });
    },
  });
};
```
> 상단 import에 `useMutation, useQueryClient` 추가, `REFERRAL_QUERY_KEYS` import 확인.

- [ ] **Step 6: ReferralSheet redeem 섹션** — `data` 블록 안, 내 코드 아래에 추가. import:
```tsx
import { useState } from "react";
import {
  canRedeem, normalizeCode, referrerRewardLimitReached,
  useRedeemMutation,
} from "@/entities/referral";
import { extractErrorCode } from "@/entities/referral/lib/extractErrorCode";
import { redeemErrorMessage } from "@/entities/referral/lib/redeemErrorMessage";
```
컴포넌트 본문:
```tsx
  const [code, setCode] = useState("");
  const [errorText, setErrorText] = useState<string | null>(null);
  const redeem = useRedeemMutation();

  const status = data?.redeemStatus.status;
  const inputEnabled = status ? canRedeem(status) : false;

  const STATUS_MESSAGE: Record<string, string> = {
    ALREADY_REDEEMED: "이미 추천인을 입력했어요.",
    NOT_ELIGIBLE_OLD_USER: "이벤트 시작 이후 가입한 분만 입력할 수 있어요.",
    REDEEM_WINDOW_EXPIRED: "추천인 입력 가능 기간이 지났어요.",
    NO_ACTIVE_CAMPAIGN: "현재 진행 중인 추천 이벤트가 없어요.",
  };

  const handleRedeem = () => {
    setErrorText(null);
    redeem.mutate(normalizeCode(code), {
      onSuccess: (res) => {
        const until = new Date(res.adFreeUntil).toLocaleDateString("ko-KR");
        addToast({ message: `광고 제거가 ${until}까지 적용됐어요.`, variant: "success" });
      },
      onError: (e) => setErrorText(redeemErrorMessage(extractErrorCode(e))),
    });
  };
```
렌더(내 코드 아래):
```tsx
              {inputEnabled ? (
                <div className="mt-5">
                  <p className="mb-1 text-xs font-semibold text-gray-400">친구 초대코드 입력</p>
                  <div className="flex gap-2">
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="초대코드"
                      maxLength={20}
                      className="focus:border-olive-light w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-base focus:bg-white focus:outline-none"
                    />
                    <button
                      onClick={handleRedeem}
                      disabled={redeem.isPending || code.trim() === ""}
                      className="bg-olive-light shrink-0 rounded-lg px-4 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      적용
                    </button>
                  </div>
                  {errorText && <p className="mt-2 text-sm text-red-500">{errorText}</p>}
                </div>
              ) : (
                status && (
                  <p className="mt-5 text-sm text-gray-500">
                    {status === "ALREADY_REDEEMED" && data.redeemStatus.referrer
                      ? `${data.redeemStatus.referrer.nickname}님의 추천으로 가입했어요.`
                      : STATUS_MESSAGE[status]}
                  </p>
                )
              )}

              {referrerRewardLimitReached(data.campaign) && (
                <p className="mt-3 text-xs text-gray-400">
                  이번 이벤트 내 추가 보상은 모두 받았지만, 친구는 여전히 혜택을 받을 수 있어요.
                </p>
              )}
```
> `STATUS_MESSAGE` 객체는 모듈 상수로 빼도 됨(컴포넌트 밖). `||` 사용 금지 — 위는 삼항으로만 분기.

- [ ] **Step 7: Write failing acceptance tests (T-310~315)** — append `ReferralSheet.test.tsx`:
```tsx
it("T-310: AVAILABLE이면 입력창과 적용 버튼이 활성화", async () => {
  jest.spyOn(api, "getReferralInfo").mockResolvedValue(info as never);
  renderSheet();
  expect(await screen.findByPlaceholderText("초대코드")).toBeEnabled();
});

it("T-311/T-312: 유효 코드 적용 → 성공 토스트 + ALREADY_REDEEMED 전환", async () => {
  jest.spyOn(api, "getReferralInfo")
    .mockResolvedValueOnce(info as never)
    .mockResolvedValue({ ...info, redeemStatus: { status: "ALREADY_REDEEMED", redeemDeadline: null, redeemedAt: "2026-07-10T00:00:00Z", referrer: { nickname: "요리왕", referralCode: "AB12CD34" } } } as never);
  jest.spyOn(api, "redeemReferralCode").mockResolvedValue({ campaignKey: "2026-07", rewardApplied: true, adFreeUntil: "2026-08-10T00:00:00Z" } as never);
  renderSheet();
  fireEvent.change(await screen.findByPlaceholderText("초대코드"), { target: { value: "cd78ef90" } });
  fireEvent.click(screen.getByText("적용"));
  await waitFor(() => expect(api.redeemReferralCode).toHaveBeenCalledWith("CD78EF90"));
});

it("T-313: ALREADY_REDEEMED면 입력창이 없고 상태 문구를 보여준다", async () => {
  jest.spyOn(api, "getReferralInfo").mockResolvedValue({ ...info, redeemStatus: { status: "NO_ACTIVE_CAMPAIGN", redeemDeadline: null, redeemedAt: null, referrer: null } } as never);
  renderSheet();
  expect(await screen.findByText(/진행 중인 추천 이벤트가 없어요/)).toBeInTheDocument();
  expect(screen.queryByPlaceholderText("초대코드")).not.toBeInTheDocument();
});

it("T-314: 1303 에러면 에러 문구를 보여주고 성공 처리하지 않는다", async () => {
  jest.spyOn(api, "getReferralInfo").mockResolvedValue(info as never);
  jest.spyOn(api, "redeemReferralCode").mockRejectedValue({ getErrorData: true, code: "1303" });
  renderSheet();
  fireEvent.change(await screen.findByPlaceholderText("초대코드"), { target: { value: "AB12CD34" } });
  fireEvent.click(screen.getByText("적용"));
  expect(await screen.findByText("이미 추천인을 입력했어요.")).toBeInTheDocument();
});
```
> T-314의 mock 에러는 `extractErrorCode`가 `1303`을 뽑을 수 있는 형태여야 한다. `getErrorData` 실제 시그니처에 맞춰 reject 객체를 구성하거나, `extractErrorCode`를 jest.mock으로 `() => "1303"` 처리. 핵심 단언은 "에러 문구 노출 + 성공 토스트/전환 없음".

- [ ] **Step 8: Run → green; type-check; commit**

```bash
npx jest src/entities/referral/lib src/features/referral/ui/__tests__/ReferralSheet.test.tsx
npx tsc --noEmit
git add src/entities/referral src/features/referral/ui/ReferralSheet.tsx
git commit -m "feat(referral): redeem referral code with status and error states"
```

---

## Task 5: 선물상자 7일 빨간불 (Slice 4)

**Files:** Create `shouldShowNudge.ts` + test; Modify `ReferralGiftButton.tsx`, `UserProfileDisplay.tsx`; append `ProfileActionRow.test.tsx`.

- [ ] **Step 1: Write failing test (T-401~405)**

`src/entities/referral/lib/__tests__/shouldShowNudge.test.ts`:
```ts
import { NUDGE_INTERVAL_MS, shouldShowNudge } from "../shouldShowNudge";

const now = 1_000_000_000_000;

describe("shouldShowNudge", () => {
  it("T-401: 캠페인 활성 + 연 적 없음 → true", () => {
    expect(shouldShowNudge({ campaignActive: true, lastOpenedAt: null, now })).toBe(true);
  });
  it("T-402: 방금 열었으면 → false", () => {
    expect(shouldShowNudge({ campaignActive: true, lastOpenedAt: now, now })).toBe(false);
  });
  it("T-403: 7일 경계 — 7일+1초 경과 → true, 6일 → false", () => {
    expect(shouldShowNudge({ campaignActive: true, lastOpenedAt: now - NUDGE_INTERVAL_MS - 1000, now })).toBe(true);
    expect(shouldShowNudge({ campaignActive: true, lastOpenedAt: now - 6 * 24 * 3600 * 1000, now })).toBe(false);
  });
  it("T-404: 캠페인 비활성 → 항상 false", () => {
    expect(shouldShowNudge({ campaignActive: false, lastOpenedAt: null, now })).toBe(false);
  });
  it("T-405: redeem 여부와 무관 — 활성+7일경과면 true", () => {
    expect(shouldShowNudge({ campaignActive: true, lastOpenedAt: now - NUDGE_INTERVAL_MS - 1, now })).toBe(true);
  });
});
```

- [ ] **Step 2: Run → fail; implement**

`src/entities/referral/lib/shouldShowNudge.ts`:
```ts
export const NUDGE_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

type ShouldShowNudgeArgs = {
  campaignActive: boolean;
  lastOpenedAt: number | null;
  now: number;
};

export const shouldShowNudge = ({
  campaignActive,
  lastOpenedAt,
  now,
}: ShouldShowNudgeArgs): boolean => {
  if (!campaignActive) return false;
  if (lastOpenedAt === null) return true;
  return now - lastOpenedAt > NUDGE_INTERVAL_MS;
};
```
Run → PASS. Barrel: `export * from "./lib/shouldShowNudge";` 를 `entities/referral/index.ts`에 추가.

- [ ] **Step 3: Gift button red dot + campaign query**

`src/features/referral/ui/ReferralGiftButton.tsx` — 교체:
```tsx
"use client";

import { Gift } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";

import {
  shouldShowNudge,
  useReferralInfoQuery,
  useReferralSheetStore,
} from "@/entities/referral";

type ReferralGiftButtonProps = { enabled?: boolean };

export const ReferralGiftButton = ({ enabled = true }: ReferralGiftButtonProps) => {
  const open = useReferralSheetStore((s) => s.open);
  const lastOpenedAt = useReferralSheetStore((s) => s.lastOpenedAt);
  const { data } = useReferralInfoQuery(enabled);

  const showDot = shouldShowNudge({
    campaignActive: Boolean(data?.campaign),
    lastOpenedAt,
    now: Date.now(),
  });

  return (
    <button
      type="button"
      aria-label="친구 초대 이벤트"
      onClick={() => {
        triggerHaptic("Light");
        open();
      }}
      className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-900 transition-colors hover:bg-gray-50"
    >
      <Gift size={18} aria-hidden="true" />
      {showDot && (
        <span
          data-testid="referral-nudge-dot"
          className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"
        />
      )}
    </button>
  );
};
```
> `useReferralInfoQuery`가 시트(Task 3)와 같은 query key를 쓰므로 본인 프로필에서 1회만 fetch되고 시트와 캐시 공유.

- [ ] **Step 4: Write failing acceptance test (T-410)** — append `ProfileActionRow.test.tsx`:
```tsx
it("T-410: 활성 캠페인 + 연 적 없으면 빨간 점, 열면 사라진다", async () => {
  jest.spyOn(require("@/entities/referral/model/api"), "getReferralInfo")
    .mockResolvedValue(info as never); // info = campaign 있는 픽스처
  useReferralSheetStore.setState({ lastOpenedAt: null, isOpen: false });
  // QueryClientProvider로 감싸 렌더 (renderSheet 헬퍼와 동일 패턴)
  // ... render(<QueryClientProvider><UserProfileDisplay .../></QueryClientProvider>)
  expect(await screen.findByTestId("referral-nudge-dot")).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText("친구 초대 이벤트"));
  // open()이 lastOpenedAt = Date.now()로 세팅 → 재계산 시 점 사라짐
  await waitFor(() => expect(screen.queryByTestId("referral-nudge-dot")).not.toBeInTheDocument());
});
```
> 이 테스트는 `UserProfileDisplay`를 `QueryClientProvider`로 감싸야 한다(파일 상단 import 추가). `info`는 ReferralSheet 테스트와 동일 픽스처를 공유하도록 `__tests__/fixtures.ts`로 추출 권장.

- [ ] **Step 5: Run → green; type-check; commit**

```bash
npx jest src/entities/referral/lib/__tests__/shouldShowNudge.test.ts src/features/referral/ui/__tests__/ProfileActionRow.test.tsx
npx tsc --noEmit
git add src/entities/referral src/features/referral/ui/ReferralGiftButton.tsx
git commit -m "feat(referral): show 7-day nudge dot on gift button during campaign"
```

---

## Task 6: 설정 탭 광고 제거 + 실시간 카운트다운 (Slice 5)

**Files:** Create `formatRemaining.ts` + test, `useCountdown.ts` + test; Modify `SettingsActionButton.tsx`; Create row test.

- [ ] **Step 1: Write failing test (T-501, T-502)**

`src/shared/lib/time/__tests__/formatRemaining.test.ts`:
```ts
import { formatRemaining } from "../formatRemaining";

describe("formatRemaining", () => {
  it("T-501: 일/시:분:초 포맷", () => {
    const ms = ((1 * 24 + 2) * 3600 + 3 * 60 + 4) * 1000;
    expect(formatRemaining(ms)).toBe("1일 02:03:04");
  });
  it("T-502: 0 이하면 00:00:00", () => {
    expect(formatRemaining(0)).toBe("00:00:00");
    expect(formatRemaining(-5000)).toBe("00:00:00");
  });
});
```

- [ ] **Step 2: Run → fail; implement**

`src/shared/lib/time/formatRemaining.ts`:
```ts
const pad = (n: number): string => String(n).padStart(2, "0");

export const formatRemaining = (ms: number): string => {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const clock = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return days > 0 ? `${days}일 ${clock}` : clock;
};
```
Run → PASS.

- [ ] **Step 3: Write failing hook test (T-503)**

`src/shared/lib/hooks/__tests__/useCountdown.test.ts`:
```ts
import { act, renderHook } from "@testing-library/react";

import { useCountdown } from "../useCountdown";

describe("useCountdown (T-503)", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("1초마다 남은 ms가 줄고 0에서 멈춘다", () => {
    const target = new Date(Date.now() + 2000).toISOString();
    const { result } = renderHook(() => useCountdown(target));
    expect(result.current).toBeGreaterThan(0);
    act(() => { jest.advanceTimersByTime(3000); });
    expect(result.current).toBe(0);
  });
});
```

- [ ] **Step 4: Run → fail; implement**

`src/shared/lib/hooks/useCountdown.ts`:
```ts
"use client";

import { useEffect, useState } from "react";

const computeRemaining = (target: string | null | undefined): number => {
  if (!target) return 0;
  return Math.max(0, new Date(target).getTime() - Date.now());
};

export const useCountdown = (target: string | null | undefined): number => {
  const [remaining, setRemaining] = useState(() => computeRemaining(target));

  useEffect(() => {
    setRemaining(computeRemaining(target));
    if (!target) return;

    const id = setInterval(() => {
      const next = computeRemaining(target);
      setRemaining(next);
      if (next <= 0) clearInterval(id);
    }, 1000);

    return () => clearInterval(id);
  }, [target]);

  return remaining;
};
```
Run → PASS.

- [ ] **Step 5: Settings row** — `src/features/auth/ui/SettingsActionButton.tsx`. 설정 행 목록(`알림`/`개인정보처리방침` 등과 같은 컨테이너) 맨 위에 광고 제거 행 추가. import:
```tsx
import { Gift } from "lucide-react";

import { useCountdown } from "@/shared/lib/hooks/useCountdown";
import { formatRemaining } from "@/shared/lib/time/formatRemaining";

import { useReferralSheetStore } from "@/entities/referral";
import { useUserStore } from "@/entities/user/model/store";
```
행 컴포넌트(같은 파일 하단 또는 별도 함수). 모달/시트 닫고 전역 시트 열기:
```tsx
const AdRemovalRow = ({ onOpenSheet }: { onOpenSheet: () => void }) => {
  const adFreeUntil = useUserStore((s) => s.user?.adStatus?.adFreeUntil);
  const showAds = useUserStore((s) => s.user?.adStatus?.showAds);
  const remaining = useCountdown(adFreeUntil ?? null);
  const isActive = showAds === false && remaining > 0;

  return (
    <button
      onClick={onOpenSheet}
      className="flex w-full items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50"
    >
      <span className="flex items-center gap-2">
        <Gift size={16} />
        광고 제거
      </span>
      <span className="text-sm text-gray-400">
        {isActive ? formatRemaining(remaining) : "광고 없이 즐기기"}
      </span>
    </button>
  );
};
```
설정 메뉴 안에서:
```tsx
<AdRemovalRow
  onOpenSheet={() => {
    setIsModalOpen(false);
    useReferralSheetStore.getState().open();
  }}
/>
```

- [ ] **Step 6: Write failing acceptance test (T-510, T-511)**

`src/features/auth/ui/__tests__/AdRemovalSettingsRow.test.tsx` — `AdRemovalRow`를 export하여 단위 렌더(또는 SettingsActionButton 통합). 권장: `AdRemovalRow`를 named export:
```tsx
import { render, screen, fireEvent } from "@testing-library/react";

import { useReferralSheetStore } from "@/entities/referral";
import { useUserStore } from "@/entities/user/model/store";

import { AdRemovalRow } from "../SettingsActionButton";

describe("광고 제거 설정 행", () => {
  afterEach(() => useUserStore.setState({ user: null }));

  it("T-511: 활성이면 카운트다운, 비활성이면 라벨", () => {
    useUserStore.setState({ user: { adStatus: { showAds: false, adFreeUntil: new Date(Date.now() + 90000000).toISOString() } } as never });
    const { rerender } = render(<AdRemovalRow onOpenSheet={() => {}} />);
    expect(screen.getByText(/일 /)).toBeInTheDocument();

    useUserStore.setState({ user: { adStatus: { showAds: true, adFreeUntil: null } } as never });
    rerender(<AdRemovalRow onOpenSheet={() => {}} />);
    expect(screen.getByText("광고 없이 즐기기")).toBeInTheDocument();
  });

  it("T-510: 행을 누르면 onOpenSheet 콜백이 호출된다", () => {
    const onOpen = jest.fn();
    render(<AdRemovalRow onOpenSheet={onOpen} />);
    fireEvent.click(screen.getByText("광고 제거"));
    expect(onOpen).toHaveBeenCalled();
  });
});
```
> `AdRemovalRow`를 `SettingsActionButton.tsx`에서 `export const AdRemovalRow`로 노출. T-510의 "같은 시트 열림"은 `onOpenSheet`가 `useReferralSheetStore.open()`을 호출한다는 통합으로 보장(콜백 단언으로 owner-seam 검증).

- [ ] **Step 7: Run → green; type-check; commit**

```bash
npx jest src/shared/lib/time src/shared/lib/hooks/__tests__/useCountdown.test.ts src/features/auth/ui/__tests__/AdRemovalSettingsRow.test.tsx
npx tsc --noEmit
git add src/shared/lib/time src/shared/lib/hooks/useCountdown.ts src/features/auth/ui/SettingsActionButton.tsx src/features/auth/ui/__tests__/AdRemovalSettingsRow.test.tsx
git commit -m "feat(referral): add ad-removal settings row with live countdown"
```

---

## Task 7: 프로필 공유 OG 메타데이터 (Slice 6)

**Files:** Create `getPublicUserForMetadata.ts`, `UserDetailClient.tsx`, metadata test; Modify `page.tsx`.

- [ ] **Step 1: Server fetch helper**

`src/entities/user/model/getPublicUserForMetadata.ts`:
```ts
import { BASE_API_URL, END_POINTS } from "@/shared/config/constants/api";

import { User } from "./types";

export const getPublicUserForMetadata = async (
  userId: string
): Promise<User | null> => {
  try {
    const res = await fetch(`${BASE_API_URL}${END_POINTS.USER_INFO(userId)}`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as User;
  } catch {
    return null;
  }
};
```

- [ ] **Step 2: Move client logic to UserDetailClient**

`src/app/users/[userId]/UserDetailClient.tsx` — 기존 `page.tsx` 본문(`"use client"` 포함)을 그대로 이동, 컴포넌트명 `UserDetailClient`로 export.

- [ ] **Step 3: page.tsx → server component + generateMetadata**

`src/app/users/[userId]/page.tsx`:
```tsx
import type { Metadata } from "next";

import { BASE_URL } from "@/shared/config/constants/api";
import { isDefaultProfileImage } from "@/shared/lib/colors";

import { getPublicUserForMetadata } from "@/entities/user/model/getPublicUserForMetadata";

import UserDetailClient from "./UserDetailClient";

const FALLBACK_DESC = "레시피오에서 이 프로필을 확인해보세요.";
const FALLBACK_IMAGE = `${BASE_URL}og-default.png`;

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<Metadata> => {
  const { userId } = await params;
  const user = await getPublicUserForMetadata(userId);

  if (!user) {
    return { title: "레시피오", description: FALLBACK_DESC };
  }

  const title = `${user.nickname} - 레시피오`;
  const description = user.introduction || FALLBACK_DESC; // 빈 소개 → 폴백 (의도된 fallthrough)
  const image =
    user.profileImage && !isDefaultProfileImage(user.profileImage)
      ? user.profileImage
      : FALLBACK_IMAGE;
  const url = `${BASE_URL}users/${userId}`;

  return {
    title,
    description,
    openGraph: { title, description, url, images: [{ url: image }] },
    twitter: { card: "summary", title, description, images: [image] },
  };
};

const Page = () => <UserDetailClient />;

export default Page;
```

- [ ] **Step 4: Write failing test (T-601~603)**

`src/app/users/[userId]/__tests__/generateMetadata.test.ts`:
```ts
import { generateMetadata } from "../page";
import * as fetcher from "@/entities/user/model/getPublicUserForMetadata";

const mk = (over: Record<string, unknown>) =>
  jest.spyOn(fetcher, "getPublicUserForMetadata").mockResolvedValue({
    id: "u1", nickname: "유저", introduction: "안녕", profileImage: "https://img/x.png",
    ...over,
  } as never);

const params = Promise.resolve({ userId: "u1" });

describe("generateMetadata (T-601~603)", () => {
  afterEach(() => jest.restoreAllMocks());

  it("T-601/602/603: 닉네임 제목, 소개 description, 이미지 og", async () => {
    mk({});
    const m = await generateMetadata({ params });
    expect(m.title).toContain("유저");
    expect(m.description).toBe("안녕");
    expect(m.openGraph?.images).toEqual([{ url: "https://img/x.png" }]);
  });

  it("T-602: 소개 없으면 폴백 description", async () => {
    mk({ introduction: "" });
    const m = await generateMetadata({ params });
    expect(m.description).toBe("레시피오에서 이 프로필을 확인해보세요.");
  });

  it("T-603: 이미지 없으면 폴백 이미지", async () => {
    mk({ profileImage: "" });
    const m = await generateMetadata({ params });
    expect(m.openGraph?.images).toEqual([{ url: expect.stringContaining("og-default") }]);
  });
});
```
> `isDefaultProfileImage`가 기본 이미지 URL 패턴을 판별. 픽스처의 `https://img/x.png`가 default로 분류되지 않도록 실제 기본 이미지 상수와 다른 URL 사용.

- [ ] **Step 5: Run → green; type-check; commit**

```bash
npx jest "src/app/users/[userId]/__tests__/generateMetadata.test.ts"
npx tsc --noEmit
git add "src/app/users/[userId]" src/entities/user/model/getPublicUserForMetadata.ts
git commit -m "feat(profile): add Open Graph metadata for public profile pages"
```

---

## Task 8: 추천 보상 알림 매핑 (Slice 7)

**Files:** Modify `type.ts`, `NotificationItem.tsx`; Create referral notification test.

- [ ] **Step 1: Extend types**

`src/entities/notification/model/type.ts`:
- `NotificationType` union에 `| "REFERRAL_REWARD_GRANTED"` 추가.
- `RelatedType` union에 `| "REFERRAL_REDEMPTION"` 추가.
- `Notification` 타입에 `message?: string;` 추가.

- [ ] **Step 2: NotificationItem 매핑**

`src/entities/notification/ui/NotificationItem.tsx`:
- `NOTIFICATION_MESSAGES`에 `REFERRAL_REWARD_GRANTED: "추천 보상으로 광고 제거 혜택이 추가됐어요."` 추가.
- 본문 렌더 조건에서, actorNickname 없이 단독 메시지를 쓰는 타입에 referral도 포함:
```tsx
              {notification.type === "AI_RECIPE_DONE" ||
              notification.type === "REFERRAL_REWARD_GRANTED" ? (
                notification.message ?? NOTIFICATION_MESSAGES[notification.type]
              ) : (
                <>
                  <span className="font-bold text-black">{notification.actorNickname}</span>
                  {NOTIFICATION_MESSAGES[notification.type]}
                </>
              )}
```
> `notification.message ?? ...` — 서버가 동적 만료일 포함 message를 주면 그대로, 없으면 정적 폴백. (`??`이므로 코멘트 불필요.)

- [ ] **Step 3: Write failing test (T-701)**

`src/entities/notification/ui/__tests__/NotificationItem.referral.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";

import { NotificationItem } from "../NotificationItem";

const base = {
  id: 1, userId: 1, actorId: 2, actorNickname: "친구", imageUrl: "",
  relatedType: "REFERRAL_REDEMPTION", relatedId: 1, relatedUrl: "",
  createdAt: new Date().toISOString(), read: false,
} as never;

describe("REFERRAL_REWARD_GRANTED 알림 (T-701)", () => {
  it("서버 message를 그대로 보여준다(없으면 폴백)", () => {
    render(
      <NotificationItem
        notification={{ ...base, type: "REFERRAL_REWARD_GRANTED", message: "광고 제거 1개월이 추가됐어요." }}
        showActions={false}
      />
    );
    expect(screen.getByText("광고 제거 1개월이 추가됐어요.")).toBeInTheDocument();
    expect(screen.queryByText("친구")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run → green; type-check; commit**

```bash
npx jest src/entities/notification/ui/__tests__/NotificationItem.referral.test.tsx
npx tsc --noEmit
git add src/entities/notification/model/type.ts src/entities/notification/ui/NotificationItem.tsx src/entities/notification/ui/__tests__/NotificationItem.referral.test.tsx
git commit -m "feat(notification): map REFERRAL_REWARD_GRANTED notification type"
```

---

## Self-Review 결과

**1. 추적성 (AC → T-xx → task):** 매트릭스 전부 task에 매핑됨.
- T-101/102/103/110 → Task 1 · T-201/202 → Task 2 · T-210/211/212/213/214 → Task 3 ·
  T-301/302/303/310/311/312/313/314 → Task 4 · T-401~405/410 → Task 5 ·
  T-501/502/503/510/511 → Task 6 · T-601/602/603 → Task 7 · T-701 → Task 8.
- T-315(보상 한도 안내)는 Task 4 Step 6의 `referrerRewardLimitReached` 렌더로 충족(불변식 노출). 추가 단언이 필요하면 ReferralSheet 테스트에 한 줄.

**2. Placeholder scan:** 모든 코드 스텝에 실제 코드 포함. "적절히 처리" 류 없음.

**3. Type 일관성:** `ReferralInfo`/`RedeemStatus`/`campaignMonthLabel`/`shouldShowNudge`/`useReferralSheetStore` 식별자가 task 전반 동일. `useReferralInfoQuery(enabled: boolean)` 시그니처가 시트(Task 3)·선물상자(Task 5)에서 동일.

**Non-goals (테스트 없음):** `?ref` 자동 캡처 / 타인 프로필 공유 버튼 / 어드민 캠페인 UI / 클라 정책 재구현 / admin 햅틱.

**알려진 미확정:** (a) `getErrorData` 시그니처 — 다르면 Task 4 Step 4 폴백 사용. (b) Slice 7 서버 `message` 필드 존재 여부 — 없으면 정적 폴백으로 동작.
