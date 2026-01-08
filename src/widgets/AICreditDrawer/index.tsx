"use client";

import { useEffect, useRef } from "react";
import { Image } from "@/shared/ui/image/Image";
import { useRouter } from "next/navigation";

import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import { Confetti, type ConfettiRef } from "@/shared/ui/shadcn/confetti";
import { ICON_BASE_URL } from "@/shared/config/constants/recipe";

type AICreditDrawerProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const AICreditDrawer = ({ isOpen, onOpenChange }: AICreditDrawerProps) => {
  const router = useRouter();
  const { Container, Content, Title } = useResponsiveSheet();
  const confettiRef = useRef<ConfettiRef>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        confettiRef.current?.fire({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          zIndex: 9999,
        });
      }, 300);
    }
  }, [isOpen]);

  const handleCTAClick = () => {
    onOpenChange(false);
    router.push("/recipes/new/ai");
  };

  return (
    <Container open={isOpen} onOpenChange={onOpenChange}>
      <Content className="overflow-hidden border-0 bg-white shadow-xl sm:max-w-md">
        <Confetti
          ref={confettiRef}
          className="pointer-events-none absolute inset-0 z-50 h-full w-full"
          manualstart={true}
        />
        <Title className="sr-only">AI 무료 이용권</Title>

        <div className="flex flex-col items-center px-6 pb-8">
          <div className="mt-8 flex justify-center">
            <Image
              src={`${ICON_BASE_URL}gift.webp`}
              alt="AI 무료 이용권"
              wrapperClassName="relative h-48 w-48 animate-bounce-soft"
              priority
            />
          </div>

          <div className="mt-6 text-center">
            <h2 className="text-2xl font-bold break-keep text-gray-900">
              AI 무료 생성권 도착!
            </h2>
            <p className="mt-3 text-base leading-relaxed break-keep text-gray-600">
              매일 1회 무료로 만들어 드려요!
              <br />
              <span className="font-bold text-red-500">
                ⚠️ 오늘 다 써야 내일 또 충전돼요!
              </span>
            </p>
          </div>

          <button
            onClick={handleCTAClick}
            className="bg-olive-light mt-8 h-14 w-full cursor-pointer rounded-2xl text-lg font-bold text-white shadow-lg transition-colors hover:shadow-xl active:scale-[0.98]"
          >
            지금 바로 만들기
          </button>

          <div className="mx-auto mt-6 h-1 w-32 rounded-full bg-gray-200 sm:hidden" />
        </div>
      </Content>
    </Container>
  );
};

export default AICreditDrawer;
