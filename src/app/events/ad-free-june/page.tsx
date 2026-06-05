import type { Metadata } from "next";

import EventCtaButton from "../_components/EventCtaButton";
import EventFAQ from "../_components/EventFAQ";
import EventPageShell from "../_components/EventPageShell";
import EventSection from "../_components/EventSection";

export const metadata: Metadata = {
  title: "6월 광고제거 이벤트 | 레시피오",
  description:
    "친구를 추천하면 광고가 사라져요. 6월 1일부터 시작하는 추천 이벤트로 더 쾌적하게 즐겨보세요.",
  openGraph: {
    title: "6월 광고제거 이벤트 | 레시피오",
    description: "친구 추천으로 광고를 제거하는 6월 이벤트.",
  },
};

const AdFreeJuneEventPage = () => {
  return (
    <EventPageShell
      title="6월 광고제거 이벤트"
      heroSrc="/events/ad-free-june/hero.png"
      heroAlt="6월 광고제거 이벤트"
    >
      <EventSection title="6월 한 달, 광고 없이 깔끔하게">
        <p className="text-sm leading-relaxed text-gray-600">
          친구를 추천하면 광고가 사라져요. 6월 1일부터 시작하는 추천 이벤트로 더
          쾌적하게 레시피오를 즐겨보세요.
        </p>
      </EventSection>
      <EventSection title="참여 방법">
        <p className="mb-4 text-sm leading-relaxed text-gray-600">
          내 추천 코드를 친구에게 공유하거나, 친구에게 받은 추천 코드를 입력하면
          광고 제거 혜택이 적용돼요.
        </p>
        <EventCtaButton label="추천하고 광고 제거하기" />
      </EventSection>
      <EventFAQ
        items={[
          {
            question: "광고는 어떻게 없애나요?",
            answer:
              "추천 코드를 공유하거나 입력하면 광고 제거 혜택이 적용돼요.",
          },
          {
            question: "누가 추천 코드를 입력할 수 있나요?",
            answer:
              "2026년 6월 1일 이후 가입한 분이 가입 후 30일 이내에 한 번 입력할 수 있어요.",
          },
          {
            question: "기존 회원도 참여할 수 있나요?",
            answer:
              "추천 코드 입력은 어렵지만, 내 추천 코드를 친구에게 공유하는 건 누구나 할 수 있어요.",
          },
          {
            question: "추천은 몇 명까지 되나요?",
            answer: "한 이벤트당 최대 3명까지 추천 보상을 받을 수 있어요.",
          },
          {
            question: "광고 제거는 얼마나 유지되나요?",
            answer:
              "추천 보상은 누적돼서 광고가 사라지는 기간이 점점 늘어나요.",
          },
        ]}
      />
    </EventPageShell>
  );
};

export default AdFreeJuneEventPage;
