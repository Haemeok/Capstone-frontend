"use client";

import { ReactNode, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import {
  appGlobalMessages,
  useApiLocale,
  useLocalizedRouter,
} from "@/shared/i18n";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import { Image } from "@/shared/ui/image/Image";

const LoginDialog = dynamic(() => import("@/features/auth/ui/LoginDialog"), {
  ssr: false,
});

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
  message,
}: LoginEncourageDrawerProps) => {
  const router = useLocalizedRouter();
  const { Container, Content, Title } = useResponsiveSheet();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const t = appGlobalMessages[useApiLocale()].login;
  const resolvedMessage = message ?? t.youtubeMessage;

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
          <Title className="sr-only">{t.srTitle}</Title>

          <div className="flex flex-col items-center px-6 pt-8 pb-8">
            <div className="flex items-center gap-3">
              <Image
                src="/web-app-manifest-192x192.png"
                alt="Recipio"
                wrapperClassName="h-16 w-16 rounded-2xl shadow-lg"
                width={64}
                height={64}
                lazy={false}
              />
              <span className="text-ink text-3xl font-bold">Recipi&apos;O</span>
            </div>

            <div className="mt-6 text-center">
              <p className="text-ink-sub text-xl font-bold break-keep">
                {t.leadPrefix}
                <span className="text-olive-light">{t.seconds}</span>
                {t.leadSuffix}
              </p>
              {icon ? (
                <div className="mt-2 flex items-center justify-center gap-1">
                  {icon}
                  <p className="text-ink-sub text-xl font-bold">
                    {resolvedMessage}
                  </p>
                </div>
              ) : (
                <p className="text-ink-sub mt-2 text-xl font-bold">
                  {resolvedMessage}
                </p>
              )}
            </div>

            <button
              onClick={handleCTAClick}
              className="bg-olive-light mt-8 h-14 w-full cursor-pointer rounded-2xl text-lg font-bold text-white shadow-lg transition-colors hover:shadow-xl active:scale-[0.98]"
            >
              {t.cta}
            </button>

            <p className="mt-4 text-center text-xs text-gray-400">
              {t.policyNote}
              <br />
              <Link
                href="/privacy"
                className="hover:text-ink-sub underline"
                prefetch={false}
              >
                {t.privacyLink}
              </Link>
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
