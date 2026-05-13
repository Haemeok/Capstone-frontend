"use client";

import { useEffect } from "react";

import { BookOpen, Lock, MessageCircle } from "lucide-react";

import { useAdsGate } from "@/shared/adsense/AdsGateContext";
import {
  APP_STORE_URL,
  PLAY_STORE_URL,
} from "@/shared/config/constants/appStore";
import { useIsApp } from "@/shared/hooks/useIsApp";
import { triggerHaptic } from "@/shared/lib/bridge";
import { Image } from "@/shared/ui/image/Image";
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/ui/shadcn/drawer";

import { APP_UPDATE_DISMISS_KEY } from "./model/constants";
import { useAppUpdateDrawerStore } from "./model/store";

type MobileOS = "ios" | "android";

const detectMobileOS = (): MobileOS => {
  if (typeof navigator === "undefined") return "android";
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ? "ios" : "android";
};

const UPDATE_HIGHLIGHTS = [
  { icon: Lock, text: "로그인이 한결 매끄러워졌어요" },
  { icon: BookOpen, text: "레시피북을 더 많이 만들 수 있어요" },
  { icon: MessageCircle, text: "레시피 챗봇이 새로 들어왔어요" },
] as const;

const GlobalAppUpdateDrawer = () => {
  const isInApp = useIsApp();
  // 검수용: NEXT_PUBLIC_ADSENSE_TEST_USER_ID 와 일치하는 관리자 계정에만 노출.
  // 게이트 해제는 env 만 비우면 됨.
  const { isTestUser } = useAdsGate();
  const { isOpen, openDrawer, dismiss } = useAppUpdateDrawerStore();

  useEffect(() => {
    if (!isInApp) return;
    if (!isTestUser) return;
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(APP_UPDATE_DISMISS_KEY)) return;
    openDrawer();
  }, [isInApp, isTestUser, openDrawer]);

  if (!isInApp) return null;
  if (!isTestUser) return null;

  const os = detectMobileOS();
  const storeUrl = os === "ios" ? APP_STORE_URL : PLAY_STORE_URL;
  const storeLabel = os === "ios" ? "App Store" : "Play 스토어";

  const handleUpdateClick = () => {
    triggerHaptic("Light");
    dismiss();
    window.open(storeUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Drawer open={isOpen} dismissible={false}>
      <DrawerContent className="overflow-hidden border-0 bg-white shadow-xl [&>div:first-child]:hidden">
        <DrawerTitle className="sr-only">새 버전 안내</DrawerTitle>

        <div className="flex flex-col items-center px-6 pb-8 pt-10">
          <div className="flex items-center gap-3">
            <Image
              src="/web-app-manifest-192x192.png"
              alt="Recipio"
              wrapperClassName="h-16 w-16 rounded-2xl shadow-lg"
              width={64}
              height={64}
              lazy={false}
            />
            <span className="text-3xl font-bold text-gray-900">Recipi&apos;O</span>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xl font-bold break-keep text-gray-700">
              <span className="text-olive-light">새 버전</span>이 나왔어요!
            </p>
            <p className="mt-2 text-sm font-medium break-keep text-gray-500">
              이번 업데이트로 이런 점들이 좋아졌어요
            </p>
          </div>

          <ul className="mt-6 w-full space-y-2.5">
            {UPDATE_HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3.5"
              >
                <Icon className="text-olive-light h-5 w-5 shrink-0" />
                <span className="text-base font-semibold break-keep text-gray-700">
                  {text}
                </span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleUpdateClick}
            className="bg-olive-light mt-8 h-14 w-full cursor-pointer rounded-2xl text-lg font-bold text-white shadow-lg transition-colors hover:shadow-xl active:scale-[0.98]"
          >
            {storeLabel}에서 업데이트하기
          </button>

          <p className="mt-4 text-center text-xs break-keep text-gray-400">
            업데이트하시면 이 안내가 다시 뜨지 않아요
          </p>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default GlobalAppUpdateDrawer;
