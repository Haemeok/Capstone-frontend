"use client";

import { Bell } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";

type NotificationPermissionDrawerProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  onDecline: () => void;
};

export const NotificationPermissionDrawer = ({
  isOpen,
  onOpenChange,
  onAccept,
  onDecline,
}: NotificationPermissionDrawerProps) => {
  const { Container, Content, Title } = useResponsiveSheet();

  const handleAccept = () => {
    triggerHaptic("Success");
    onAccept();
  };

  const handleDecline = () => {
    triggerHaptic("Light");
    onDecline();
  };

  return (
    <Container open={isOpen} onOpenChange={onOpenChange}>
      <Content className="overflow-hidden border-0 bg-white shadow-xl sm:max-w-md">
        <Title className="sr-only">알림 권한 요청</Title>

        <div className="flex flex-col items-center px-6 pb-8 pt-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-olive-light/10">
            <Bell className="h-10 w-10 text-olive-light" />
          </div>

          <div className="mt-6 text-center">
            <h2 className="text-xl font-bold text-gray-900">
              알림을 허용해 주세요
            </h2>
            <p className="mt-3 text-base leading-relaxed text-gray-600">
              새로운 레시피 추천, 인기 급상승 레시피 등
              <br />
              놓치고 싶지 않은 소식을 알려드릴게요
            </p>
          </div>

          <div className="mt-8 flex w-full flex-col gap-3">
            <button
              onClick={handleAccept}
              className="bg-olive-light h-14 w-full cursor-pointer rounded-2xl text-base font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
            >
              알림 허용하기
            </button>
            <button
              onClick={handleDecline}
              className="h-12 w-full cursor-pointer rounded-xl text-base font-medium text-gray-500 transition-colors hover:bg-gray-100 active:bg-gray-200"
            >
              나중에
            </button>
          </div>

          <div className="mx-auto mt-4 h-1 w-32 rounded-full bg-gray-200 sm:hidden" />
        </div>
      </Content>
    </Container>
  );
};
