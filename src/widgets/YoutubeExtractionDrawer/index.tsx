"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import { Confetti, type ConfettiRef } from "@/shared/ui/shadcn/confetti";
import { ICON_BASE_URL } from "@/shared/config/constants/recipe";
import SavingSection from "@/shared/ui/SavingSection";

type YoutubeExtractionDrawerProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const CONFETTI_FIRE_DELAY_MS = 300;

const YoutubeExtractionDrawer = ({
  isOpen,
  onOpenChange,
}: YoutubeExtractionDrawerProps) => {
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
      }, CONFETTI_FIRE_DELAY_MS);
    }
  }, [isOpen]);

  const handleCTAClick = () => {
    onOpenChange(false);
    router.push("/recipes/new/youtube");
  };

  return (
    <Container open={isOpen} onOpenChange={onOpenChange}>
      <Content className="overflow-hidden border-0 bg-white shadow-xl sm:max-w-md">
        <Confetti
          ref={confettiRef}
          className="pointer-events-none absolute inset-0 z-50 h-full w-full"
          manualstart={true}
        />
        <Title className="sr-only">유튜브 레시피 추출하기</Title>

        <div className="flex flex-col items-center px-6 pb-8">
          <SavingSection
            imageUrl={`${ICON_BASE_URL}youtube.webp`}
            altText="유튜브로 가져오기"
          />

          <div className="mt-6 text-center">
            <h2 className="text-2xl font-bold break-keep text-gray-900">
              유튜브 레시피 추출하기
            </h2>
            <p className="mt-3 text-base leading-relaxed break-keep text-gray-600">
              좋아하는 유튜브 영상에서
              <br />
              레시피를 자동으로 추출해보세요!
              <br />
            </p>
              <p className="mt-3 font-bold text-red-500">
                ⚠️ 기간 한정 무료!
              </p>
          </div>

          <button
            onClick={handleCTAClick}
            className="bg-olive-light mt-8 h-14 w-full cursor-pointer rounded-2xl text-lg font-bold text-white shadow-lg transition-colors hover:shadow-xl active:scale-[0.98]"
          >
            지금 바로 사용하기
          </button>

          <div className="mx-auto mt-6 h-1 w-32 rounded-full bg-gray-200 sm:hidden" />
        </div>
      </Content>
    </Container>
  );
};

export default YoutubeExtractionDrawer;
