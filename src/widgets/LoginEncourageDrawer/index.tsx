"use client";

import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { Image } from "@/shared/ui/image/Image";

const LoginDialog = dynamic(
  () => import("@/features/auth/ui/LoginDialog"),
  { ssr: false }
);

type LoginEncourageDrawerProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  icon?: ReactNode;
  message?: string;
};

const LoginEncourageDrawer = ({
  isOpen,
  onOpenChange,
  icon,
  message = "유튜브 레시피 편하게 요리하세요!",
}: LoginEncourageDrawerProps) => {
  const router = useRouter();
  const { Container, Content, Title } = useResponsiveSheet();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const handleCTAClick = () => {
    onOpenChange(false);

    if (isMobile) {
      router.push("/login");
    } else {
      setIsLoginDialogOpen(true);
    }
  };

  return (
    <>
      <Container open={isOpen} onOpenChange={onOpenChange}>
        <Content className="overflow-hidden border-0 bg-white shadow-xl">
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
                지금{" "}
                <span className="text-olive-light">3초</span>만에 가입하고,
              </p>
              {icon ? (
                <div className="mt-2 flex items-center justify-center gap-1">
                  {icon}
                  <p className="text-xl font-bold text-gray-700">{message}</p>
                </div>
              ) : (
                <p className="mt-2 text-xl font-bold text-gray-700">{message}</p>
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

export default LoginEncourageDrawer;
