import type { Metadata } from "next";

import EventCtaButton from "../_components/EventCtaButton";
import EventFAQ from "../_components/EventFAQ";
import EventPageShell from "../_components/EventPageShell";
import EventSection from "../_components/EventSection";

export const metadata: Metadata = {
  title: "레시피에 국경은 없으니까 | 레시피오",
  description:
    "국가 필터로 한국·일본은 물론 다른 나라 유튜브 레시피까지 자유롭게 탐색해보세요.",
  openGraph: {
    title: "레시피에 국경은 없으니까 | 레시피오",
    description:
      "국가 필터로 다른 나라 유튜브 레시피까지 자유롭게 탐색해보세요.",
  },
};

const WorldRecipesEventPage = () => {
  return (
    <EventPageShell
      title="세계 레시피 탐험"
      heroSrc="/events/world-recipes/hero.png"
      heroAlt="레시피에 국경은 없으니까"
    >
      <EventSection title="다른 나라 레시피, 이제 자유롭게">
        <p className="text-sm leading-relaxed text-gray-600">
          국가 필터가 생겼어요. 한국과 일본은 물론, 그 외 나라의 유튜브 채널이
          올린 레시피까지 원하는 나라만 골라서 둘러볼 수 있어요.
        </p>
      </EventSection>
      <EventSection title="이렇게 써보세요">
        <p className="mb-4 text-sm leading-relaxed text-gray-600">
          검색 화면의 국가 칩에서 보고 싶은 나라를 선택하면, 그 나라 채널의
          레시피만 모아서 보여줘요.
        </p>
        <EventCtaButton label="다른 나라 레시피 보러가기" href="/search" />
      </EventSection>
      <EventFAQ
        items={[
          {
            question: "어떤 나라를 지원하나요?",
            answer: "한국, 일본, 그리고 그 외 기타 나라로 구분해서 보여드려요.",
          },
          {
            question: "음식 종류로 거르는 건가요?",
            answer:
              "아니요. 영상을 올린 채널·크리에이터의 국가가 기준이에요. 한국 채널이 올린 파스타 영상도 '한국'으로 분류돼요.",
          },
          {
            question: "어디서 국가를 고르나요?",
            answer: "검색 화면의 국가 칩에서 원하는 나라를 선택하면 돼요.",
          },
          {
            question: "여러 나라를 한 번에 볼 수 있나요?",
            answer: "네, 여러 나라를 함께 선택하면 모두 모아서 보여드려요.",
          },
        ]}
      />
    </EventPageShell>
  );
};

export default WorldRecipesEventPage;
