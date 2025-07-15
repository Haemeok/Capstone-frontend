"use client";

import { createContext, type ReactNode,useContext } from "react";

import { usePWAInstall } from "@/shared/hooks/usePWAInstall";

// 컨텍스트에 담을 데이터 타입 정의
type PWAInstallContextType = ReturnType<typeof usePWAInstall>;

// 컨텍스트 생성
const PWAInstallContext = createContext<PWAInstallContextType | null>(null);

/**
 * PWA 설치 기능을 전역에서 사용할 수 있도록 하는 Provider
 * 실제 로직은 usePWAInstall 훅에서 처리됨
 */
export const PWAInstallProvider = ({ children }: { children: ReactNode }) => {
  const pwaInstallState = usePWAInstall();

  return (
    <PWAInstallContext.Provider value={pwaInstallState}>
      {children}
    </PWAInstallContext.Provider>
  );
};

/**
 * PWA 설치 기능을 사용하기 위한 커스텀 훅
 */
export const usePWAInstallContext = () => {
  const context = useContext(PWAInstallContext);
  if (!context) {
    throw new Error(
      "usePWAInstallContext must be used within a PWAInstallProvider"
    );
  }
  return context;
};
