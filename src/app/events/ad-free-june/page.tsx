import type { Metadata } from "next";

import EventFAQ from "../_components/EventFAQ";
import EventPageShell from "../_components/EventPageShell";
import EventSection from "../_components/EventSection";
import AdFreeReferralCta from "./AdFreeReferralCta";

export const metadata: Metadata = {
  title: "친구 초대하고 광고 OFF | 레시피오",
  description:
    "친구를 초대하면 참여자와 친구 모두 광고가 사라져요. 6월 한 달, 최대 3개월까지 광고를 없애보세요.",
  openGraph: {
    title: "친구 초대하고 광고 OFF | 레시피오",
    description: "친구 초대로 참여자와 친구 모두 광고를 제거하는 6월 이벤트.",
  },
};

const AdFreeJuneEventPage = () => {
  return (
    <EventPageShell
      title="친구 초대하고 광고 OFF"
      heroSrc="/events/ad-free-june/hero.png"
      heroAlt="6월 광고제거 이벤트"
    >
      <EventSection
        label="Event 1"
        title="참여자 전원, 광고 최대 3개월 제거"
        align="center"
      >
        <p className="text-base leading-7 text-gray-700">
          친구를 초대하고 광고를 최대 3개월까지 없애보세요.
        </p>
      </EventSection>
      <EventSection
        label="Event 2"
        title="참여자 전원, 친구와 1+1 광고 제거"
        align="center"
      >
        <p className="text-base leading-7 text-gray-700">
          친구가 초대코드를 입력하면 참여자와 친구 모두 광고가 1개월씩 제거돼요.
          단, 초대코드는 한 번만 입력할 수 있어요.
        </p>
      </EventSection>
      <div className="px-5 pb-2">
        <AdFreeReferralCta />
      </div>
      <EventFAQ
        items={[
          {
            question: "광고는 어떻게 없애나요?",
            answer:
              "친구를 초대하고 친구가 초대코드를 입력하면, 참여자와 친구 모두 광고가 1개월씩 제거돼요.",
          },
          {
            question: "광고는 최대 얼마나 제거되나요?",
            answer:
              "초대는 한 이벤트당 최대 3명까지 보상받을 수 있어, 최대 3개월까지 광고를 없앨 수 있어요.",
          },
          {
            question: "초대코드는 누가 입력할 수 있나요?",
            answer:
              "2026년 6월 1일 이후 가입한 분이 가입 후 30일 이내에, 평생 한 번 입력할 수 있어요.",
          },
          {
            question: "기존 회원도 참여할 수 있나요?",
            answer:
              "초대코드 입력은 어렵지만, 내 초대코드를 친구에게 공유하는 건 누구나 할 수 있어요.",
          },
          {
            question: "초대코드를 여러 번 입력할 수 있나요?",
            answer: "아니요. 초대코드는 평생 한 번만 입력할 수 있어요.",
          },
        ]}
      />
    </EventPageShell>
  );
};

export default AdFreeJuneEventPage;
