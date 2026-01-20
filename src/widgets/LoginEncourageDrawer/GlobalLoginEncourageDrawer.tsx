"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { Image } from "@/shared/ui/image/Image";

const LoginDialog = dynamic(
  () => import("@/features/auth/ui/LoginDialog"),
  { ssr: false }
);

import { useLoginEncourageDrawerStore } from "./model/store";

const DEFAULT_MESSAGE = "로그인하고 더 많은 기능을 이용해보세요!";

const GlobalLoginEncourageDrawer = () => {
  const router = useRouter();
  const { Container, Content, Title } = useResponsiveSheet();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const { isOpen, icon, message, closeDrawer } = useLoginEncourageDrawerStore();

  const handleCTAClick = () => {
    closeDrawer();

    if (isMobile) {
      router.push("/login");
    } else {
      setIsLoginDialogOpen(true);
    }
  };

  return (
    <>
      <Container open={isOpen} onOpenChange={(open) => !open && closeDrawer()}>
        <Content className="overflow-hidden border-0 bg-white shadow-xl sm:max-w-md">
          <Title className="sr-only">로그인 필요</Title>

          <div className="flex flex-col items-center px-6 pb-8 pt-8">
            <div className="flex items-center gap-3">
              <Image
                src="/web-app-manifest-192x192.png"
                alt="Recipio"
                wrapperClassName="h-16 w-16 rounded-2xl shadow-lg"
                width={64}
                height={64}
                lazy={false}
              />
              <span className="text-3xl font-bold text-gray-900">
                Recipi'O
              </span>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xl font-bold break-keep text-gray-700">
                지금 <span className="text-olive-light">3초</span>만에 가입하고,
              </p>
              {icon ? (
                <div className="mt-2 flex items-center justify-center gap-1">
                  {icon}
                  <p className="text-xl font-bold text-gray-700">
                    {message || DEFAULT_MESSAGE}
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-xl font-bold text-gray-700">
                  {message || DEFAULT_MESSAGE}
                </p>
              )}
            </div>

            <button
              onClick={handleCTAClick}
              className="bg-olive-light mt-8 h-14 w-full cursor-pointer rounded-2xl text-lg font-bold text-white shadow-lg transition-colors hover:shadow-xl active:scale-[0.98]"
            >
              로그인하기
            </button>

            <p className="mt-4 text-center text-xs text-gray-400">
              로그인하면 하단 정책에 동의한 것으로 간주합니다.
              <br />
              <a
                href="https://grizzly-taker-1ad.notion.site/2ecc8d1def7c8068ad97e3f6318b6d90?pvs=74"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-600"
              >
                개인정보처리방침
              </a>
            </p>

            <div className="mx-auto mt-4 h-1 w-32 rounded-full bg-gray-200 sm:hidden" />
          </div>
        </Content>
      </Container>

      {!isMobile && (
        <LoginDialog
          open={isLoginDialogOpen}
          onOpenChange={setIsLoginDialogOpen}
        />
      )}
    </>
  );
};

export default GlobalLoginEncourageDrawer;
