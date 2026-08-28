"use client";

import { LocalizedLink } from "@/shared/i18n";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";

import { useCookingRecordLaunch } from "../model/useCookingRecordLaunch";
import styles from "./CookingRecordLaunchDrawer.module.css";

export const CookingRecordLaunchDrawer = () => {
  const { isOpen, dismiss } = useCookingRecordLaunch();
  const { isMobile, Container, Content, Title, Description } =
    useResponsiveSheet();

  if (!isOpen) return null;

  return (
    <Container
      modal={false}
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) dismiss();
      }}
    >
      {!isMobile ? (
        <div
          aria-hidden="true"
          className="animate-in fade-in-0 fixed inset-0 z-[49] bg-black/50 motion-reduce:animate-none"
        />
      ) : null}
      <Content
        hasDescription
        closeLabel="요리기록 출시 안내 닫기"
        closeButtonClassName="top-3.5 right-3.5 rounded-full border border-black/10 bg-white/95 shadow-sm hover:bg-white"
        className={`mx-auto h-[374px] max-w-[480px] overflow-hidden border-0 bg-[#eef3e9] motion-reduce:animate-none ${
          isMobile
            ? "rounded-t-[22px] [&>div:first-child]:hidden"
            : "rounded-[22px] shadow-xl"
        }`}
      >
        <img
          src="/events/cooking-record/food-cluster.webp"
          alt=""
          width={640}
          height={960}
          className={`${styles.foodCluster} pointer-events-none absolute -top-20 -right-14 h-[495px] w-[330px] object-contain`}
        />

        <div className="relative z-10 w-[200px] px-6 pt-8">
          <span className={`${styles.label} text-ink-sub text-xs`}>
            NEW · 요리기록
          </span>
          <Title className="text-ink mt-2 text-[25px] leading-[1.2] tracking-[-0.045em]">
            오늘 먹은 음식,
            <br />
            사진으로 남겨요
          </Title>
          <Description className="text-ink-sub mt-3 w-[174px] text-sm leading-[1.5] font-medium">
            한 줄 메모를 더하면 나만의 요리 달력이 완성돼요.
          </Description>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 bg-white px-4 pt-3 pb-[max(28px,env(safe-area-inset-bottom))]">
          <LocalizedLink
            href="/events/cooking-record"
            onClick={dismiss}
            className="bg-ink active:bg-ink-sub flex min-h-[52px] items-center justify-center rounded-2xl text-base font-bold text-white"
          >
            요리기록 시작하기
          </LocalizedLink>
        </div>
      </Content>
    </Container>
  );
};
