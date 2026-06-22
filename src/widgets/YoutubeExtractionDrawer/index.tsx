"use client";

import { useEffect, useRef } from "react";

import { ICON_BASE_URL } from "@/shared/config/constants/recipe";
import { getDictionary, useApiLocale, useLocalizedRouter } from "@/shared/i18n";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import SavingSection from "@/shared/ui/SavingSection";
import { Confetti, type ConfettiRef } from "@/shared/ui/shadcn/confetti";

type YoutubeExtractionDrawerProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const CONFETTI_FIRE_DELAY_MS = 300;

const YoutubeExtractionDrawer = ({
  isOpen,
  onOpenChange,
}: YoutubeExtractionDrawerProps) => {
  const router = useLocalizedRouter();
  const { Container, Content, Title } = useResponsiveSheet();
  const confettiRef = useRef<ConfettiRef>(null);
  const t = getDictionary(useApiLocale()).appGlobal.youtubeExtract;

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
      <Content className="overflow-hidden border-0 bg-white shadow-xl">
        <Confetti
          ref={confettiRef}
          className="pointer-events-none absolute inset-0 z-50 h-full w-full"
          manualstart={true}
        />
        <Title className="sr-only">{t.srTitle}</Title>

        <div className="flex flex-col items-center px-6 pb-8">
          <SavingSection
            imageUrl={`${ICON_BASE_URL}youtube.webp`}
            altText={t.imageAlt}
          />

          <div className="mt-6 text-center">
            <h2 className="text-ink text-2xl font-bold break-keep">
              {t.title}
            </h2>
            <p className="text-ink-sub mt-3 text-base leading-relaxed break-keep">
              {t.body}
            </p>
            <p className="mt-3 font-bold text-red-500">{t.bodyWarning}</p>
          </div>

          <button
            onClick={handleCTAClick}
            className="bg-olive-light mt-8 h-14 w-full cursor-pointer rounded-2xl text-lg font-bold text-white shadow-lg transition-colors hover:shadow-xl active:scale-[0.98]"
          >
            {t.cta}
          </button>

          <div className="mx-auto mt-6 h-1 w-32 rounded-full bg-gray-200 sm:hidden" />
        </div>
      </Content>
    </Container>
  );
};

export default YoutubeExtractionDrawer;
