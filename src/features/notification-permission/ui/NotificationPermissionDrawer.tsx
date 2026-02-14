"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";

type NotificationPermissionDrawerProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  onDecline: () => void;
  showSuccess?: boolean;
};

const SuccessView = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center justify-center px-6 py-12"
    >
      <motion.svg
        viewBox="0 0 50 50"
        className="h-20 w-20"
        initial="hidden"
        animate="visible"
      >
        <motion.circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#43c278"
          strokeWidth="3"
          variants={{
            hidden: { pathLength: 0 },
            visible: { pathLength: 1 },
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        <motion.path
          d="M14 27 L22 35 L36 18"
          fill="none"
          stroke="#43c278"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: { pathLength: 0 },
            visible: { pathLength: 1 },
          }}
          transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
        />
      </motion.svg>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-lg font-bold text-gray-900"
      >
        알림 설정이 완료되었어요
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-2 text-center text-sm text-gray-500"
      >
        중요한 소식을 놓치지 않게 알려드릴게요
      </motion.p>
    </motion.div>
  );
};

export const NotificationPermissionDrawer = ({
  isOpen,
  onOpenChange,
  onAccept,
  onDecline,
  showSuccess = false,
}: NotificationPermissionDrawerProps) => {
  const { Container, Content, Title } = useResponsiveSheet();

  const handleAccept = () => {
    triggerHaptic("Light");
    onAccept();
  };

  const handleDecline = () => {
    triggerHaptic("Light");
    onDecline();
  };

  return (
    <Container open={isOpen} onOpenChange={onOpenChange}>
      <Content className="overflow-hidden border-0 bg-white shadow-xl">
        <Title className="sr-only">알림 권한 요청</Title>

        <AnimatePresence mode="wait">
          {showSuccess ? (
            <SuccessView key="success" />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center px-6 pb-8 pt-10"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </Content>
    </Container>
  );
};
