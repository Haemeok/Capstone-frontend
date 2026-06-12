"use client";

import { MessageCircle } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import { Image } from "@/shared/ui/image/Image";

type ReviewGateDrawerProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPositive: () => void;
  onNegative: () => void;
};

export const ReviewGateDrawer = ({
  isOpen,
  onOpenChange,
  onPositive,
  onNegative,
}: ReviewGateDrawerProps) => {
  const { Container, Content, Title } = useResponsiveSheet();

  const handlePositive = () => {
    triggerHaptic("Light");
    onPositive();
  };

  const handleNegative = () => {
    triggerHaptic("Light");
    onNegative();
  };

  return (
    <Container open={isOpen} onOpenChange={onOpenChange}>
      <Content className="overflow-hidden border-0 bg-white shadow-xl">
        <Title className="sr-only">앱 만족도 조사</Title>

        <div className="flex flex-col items-center px-6 pt-8 pb-8">
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
            <p className="text-ink-sub text-xl font-bold">
              <span className="text-olive-light">레시피오</span> 마음에
              드셨나요?
            </p>
            <p className="text-ink-muted mt-2 text-base">
              소중한 리뷰가 큰 힘이 됩니다
            </p>
          </div>

          <button
            onClick={handlePositive}
            className="bg-olive-light mt-8 h-14 w-full cursor-pointer rounded-2xl text-lg font-bold text-white shadow-lg transition-colors hover:shadow-xl active:scale-[0.98]"
          >
            별점 남기러 가기
          </button>

          <button
            onClick={handleNegative}
            className="text-ink-muted mt-3 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-base font-medium transition-colors hover:bg-gray-100 active:bg-gray-200"
          >
            <MessageCircle className="h-4 w-4" />
            아쉬운 점이 있어요
          </button>

          <div className="mx-auto mt-4 h-1 w-32 rounded-full bg-gray-200 sm:hidden" />
        </div>
      </Content>
    </Container>
  );
};
