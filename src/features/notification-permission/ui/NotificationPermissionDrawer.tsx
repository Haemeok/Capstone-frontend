"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";

import { getDictionary, useApiLocale } from "@/shared/i18n";
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
  const t = getDictionary(useApiLocale()).appGlobal.notification;

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
        className="text-ink mt-6 text-lg font-bold"
      >
        {t.successTitle}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-ink-muted mt-2 text-center text-sm"
      >
        {t.successBody}
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
  const t = getDictionary(useApiLocale()).appGlobal.notification;

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
        <Title className="sr-only">{t.srTitle}</Title>

        <AnimatePresence mode="wait">
          {showSuccess ? (
            <SuccessView key="success" />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center px-6 pt-10 pb-8"
            >
              <div className="bg-olive-light/10 flex h-20 w-20 items-center justify-center rounded-full">
                <Bell className="text-olive-light h-10 w-10" />
              </div>

              <div className="mt-6 text-center">
                <h2 className="text-ink text-xl font-bold">{t.title}</h2>
                <p className="text-ink-sub mt-3 text-base leading-relaxed">
                  {t.body}
                </p>
              </div>

              <div className="mt-8 flex w-full flex-col gap-3">
                <button
                  onClick={handleAccept}
                  className="bg-olive-light h-14 w-full cursor-pointer rounded-2xl text-base font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
                >
                  {t.allow}
                </button>
                <button
                  onClick={handleDecline}
                  className="text-ink-muted h-12 w-full cursor-pointer rounded-xl text-base font-medium transition-colors hover:bg-gray-100 active:bg-gray-200"
                >
                  {t.later}
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
