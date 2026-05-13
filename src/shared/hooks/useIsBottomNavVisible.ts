"use client";

import { usePathname } from "next/navigation";

import { shouldHideNavbar } from "@/shared/lib/navigation";

import { useIsApp } from "./useIsApp";

/**
 * BottomNavBar 가 현재 라우트에서 시각적으로 노출되는지 여부.
 *
 * - 초기 SSR / 첫 client commit 에선 isApp=false → 웹 기준으로 계산된다.
 *   웹 사용자에겐 정확하고, 앱 사용자에겐 effect 후 hide 로 전환되며 한 프레임
 *   nav 가 깜빡일 수 있다 (의도된 트레이드오프 — referrer 검사보다 단순).
 * - input focus / unsaved modal 같은 BottomNavBar 내부의 추가 hide 사유는
 *   이 hook 에 포함하지 않는다 (AdSlot 위치 계산엔 영향 미미하고, 호출 사이트가
 *   필요하면 자체 검사).
 */
export const useIsBottomNavVisible = (): boolean => {
  const pathname = usePathname();
  const isApp = useIsApp();
  return !shouldHideNavbar(pathname, { isApp });
};
