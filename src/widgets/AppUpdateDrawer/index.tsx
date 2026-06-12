"use client";

import { useEffect } from "react";

import { BookOpen, Lock, MessageCircle } from "lucide-react";

import {
  APP_STORE_URL,
  PLAY_STORE_URL,
} from "@/shared/config/constants/appStore";
import { useIsApp } from "@/shared/hooks/useIsApp";
import { triggerHaptic } from "@/shared/lib/bridge";
import { Image } from "@/shared/ui/image/Image";
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/ui/shadcn/drawer";

import {
  APP_UPDATE_DISMISS_KEY,
  EXISTING_USER_MARKER_KEYS,
} from "./model/constants";
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
  const { isOpen, openDrawer, dismiss } = useAppUpdateDrawerStore();

  useEffect(() => {
    if (!isInApp) return;
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(APP_UPDATE_DISMISS_KEY)) return;

    const isExistingUser = EXISTING_USER_MARKER_KEYS.some((key) =>
      window.localStorage.getItem(key)
    );

    if (!isExistingUser) {
      dismiss();
      return;
    }

    openDrawer();
  }, [isInApp, openDrawer, dismiss]);

  if (!isInApp) return null;

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
      <DrawerContent className="flex flex-col overflow-hidden border-0 bg-white shadow-xl [&>div:first-child]:hidden">
        <DrawerTitle className="sr-only">새 버전 안내</DrawerTitle>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-10">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3">
              <Image
                src="/web-app-manifest-192x192.png"
                alt="Recipio"
                wrapperClassName="h-16 w-16 rounded-card shadow-lg"
                width={64}
                height={64}
                lazy={false}
              />
              <span className="text-ink text-3xl font-bold">Recipi&apos;O</span>
            </div>

            <div className="mt-6 text-center">
              <p className="text-ink-sub text-xl font-bold break-keep">
                <span className="text-olive-light">새 버전</span>이 나왔어요!
              </p>
              <p className="text-ink-muted mt-2 text-sm font-medium break-keep">
                이번 업데이트로 이런 점들이 좋아졌어요
              </p>
            </div>

            <ul className="mt-6 w-full space-y-2.5 pb-4">
              {UPDATE_HIGHLIGHTS.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3.5"
                >
                  <Icon className="text-olive-light h-5 w-5 shrink-0" />
                  <span className="text-ink-sub text-base font-semibold break-keep">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="shrink-0 border-t border-gray-100 bg-white px-6 pt-4 pb-[max(env(safe-area-inset-bottom),1.5rem)]">
          <button
            onClick={handleUpdateClick}
            className="bg-olive-light h-14 w-full cursor-pointer rounded-2xl text-lg font-bold text-white shadow-lg transition-colors hover:shadow-xl active:scale-[0.98]"
          >
            {storeLabel}에서 업데이트하기
          </button>

          <p className="mt-3 text-center text-xs break-keep text-gray-400">
            업데이트하시면 이 안내가 다시 뜨지 않아요
          </p>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default GlobalAppUpdateDrawer;
