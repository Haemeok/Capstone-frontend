import type { ReactNode } from "react";

import { CookingRecordEventCta } from "./CookingRecordEventCta";
import styles from "./CookingRecordEventView.module.css";
import EventPageShell from "./EventPageShell";

const STICKER_BASE_PATH = "/events/cooking-record";
const CALENDAR_STICKERS: Record<number, string> = {
  3: `${STICKER_BASE_PATH}/sticker-03.webp`,
  8: `${STICKER_BASE_PATH}/sticker-05.webp`,
  16: `${STICKER_BASE_PATH}/sticker-06.webp`,
};

type FeatureSectionProps = {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
};

const FeatureSection = ({
  number,
  title,
  description,
  children,
}: FeatureSectionProps) => (
  <section className="border-b border-black/5 px-5 py-12 last:border-b-0">
    <p className="text-olive-medium text-xs font-bold tracking-[0.12em]">
      {number}
    </p>
    <h2 className="text-ink mt-2 text-[24px] leading-[1.3] font-bold tracking-[-0.035em]">
      {title}
    </h2>
    <p className="text-ink-sub mt-2 text-sm leading-6">{description}</p>
    <div className="mt-7">{children}</div>
  </section>
);

const HeroStickerPaper = () => (
  <div
    className={`${styles.heroPaper} relative mx-auto mt-8 h-[230px] w-full max-w-[340px] overflow-hidden rounded-[22px]`}
    aria-hidden="true"
  >
    {[
      ["01", "left-1 top-3 h-32 -rotate-6"],
      ["03", "right-3 top-1 h-28 rotate-6"],
      ["05", "bottom-0 left-14 h-28 rotate-3"],
      ["06", "right-9 bottom-0 h-24 -rotate-3"],
    ].map(([number, className]) => (
      <img
        key={number}
        src={`${STICKER_BASE_PATH}/sticker-${number}.webp`}
        alt=""
        width={160}
        height={160}
        className={`${styles.heroSticker} absolute w-auto object-contain ${className}`}
      />
    ))}
  </div>
);

const RecordPreview = () => (
  <div className={`${styles.recordCard} rounded-[22px] p-5`}>
    <div className="flex items-center gap-4">
      <div className="grid size-24 shrink-0 place-items-center rounded-2xl bg-[#eef3e9]">
        <img
          src={`${STICKER_BASE_PATH}/sticker-01.webp`}
          alt=""
          width={104}
          height={104}
          className="h-24 w-24 object-contain"
        />
      </div>
      <div className="min-w-0">
        <p className="text-ink-muted text-xs">8월 26일 · 저녁</p>
        <p className="text-ink mt-1 text-lg font-bold">오늘 만든 한 그릇</p>
        <p className="text-ink-sub mt-2 text-sm">다음에는 매운맛을 조금 더</p>
      </div>
    </div>
  </div>
);

const StickerBookPreview = () => (
  <div className={`${styles.stickerBook} rounded-[22px] px-5 py-6`}>
    <div className="grid grid-cols-3 gap-3" aria-hidden="true">
      {["02", "04", "07"].map((number, index) => (
        <div
          key={number}
          className="grid aspect-square place-items-center rounded-2xl bg-white/75"
        >
          <img
            src={`${STICKER_BASE_PATH}/sticker-${number}.webp`}
            alt=""
            width={112}
            height={112}
            className={`h-24 w-24 object-contain ${index === 1 ? "rotate-3" : "-rotate-2"}`}
          />
        </div>
      ))}
    </div>
    <p className="text-ink-sub mt-4 text-center text-xs font-semibold">
      2026년 8월 · 이번 달의 요리
    </p>
  </div>
);

const CalendarPreview = () => (
  <div className={`${styles.calendar} rounded-[22px] bg-white p-4`}>
    <p className="text-ink mb-4 text-center text-sm font-bold">2026년 8월</p>
    <div className="text-ink-muted grid grid-cols-7 text-center text-[10px]">
      {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
        <span key={day} className="py-1 font-semibold">
          {day}
        </span>
      ))}
      {Array.from({ length: 21 }, (_, index) => {
        const day = index + 1;
        const sticker = CALENDAR_STICKERS[day];
        return (
          <div
            key={day}
            className="relative grid aspect-square place-items-center border-t border-black/5"
          >
            <span className="absolute top-1 left-1">{day}</span>
            {sticker && (
              <img
                src={sticker}
                alt=""
                width={48}
                height={48}
                className="mt-2 h-9 w-9 object-contain"
              />
            )}
          </div>
        );
      })}
    </div>
  </div>
);

const CookingRecordHero = () => (
  <section className="bg-[#eef3e9] px-5 pt-9 pb-12 text-center">
    <p className="text-olive-medium text-xs font-semibold">
      새로 나온 요리기록
    </p>
    <h2 className="text-ink mt-2 text-[29px] leading-[1.3] font-bold tracking-[-0.04em]">
      요리한 오늘이
      <span className="block">나만의 기록이 돼요</span>
    </h2>
    <p className="text-ink-sub mx-auto mt-4 max-w-[300px] text-sm leading-6">
      사진 한 장과 짧은 메모로 오늘의 요리를 남기고, 한 달의 기록을 모아보세요.
    </p>
    <HeroStickerPaper />
  </section>
);

export const CookingRecordEventView = () => (
  <EventPageShell title="요리기록" hero={<CookingRecordHero />}>
    <FeatureSection
      number="01"
      title="기록하기"
      description="오늘 먹은 음식 사진과 짧은 메모를 남겨요."
    >
      <RecordPreview />
    </FeatureSection>
    <FeatureSection
      number="02"
      title="모아보기"
      description="한 달의 기록이 귀여운 스티커북으로 채워져요."
    >
      <StickerBookPreview />
    </FeatureSection>
    <FeatureSection
      number="03"
      title="다시 찾기"
      description="달력에서 요리한 날을 한눈에 다시 확인해요."
    >
      <CalendarPreview />
    </FeatureSection>
    <div className="sticky bottom-0 z-30 border-t border-black/5 bg-white/95 px-4 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] backdrop-blur-sm">
      <CookingRecordEventCta />
    </div>
  </EventPageShell>
);
