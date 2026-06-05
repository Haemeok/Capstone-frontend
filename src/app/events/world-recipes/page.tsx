import type { Metadata } from "next";

import {
  COUNTRY_DEFINITIONS,
  SORT_TYPE_CODES,
} from "@/shared/config/constants/recipe";

import EventCtaButton from "../_components/EventCtaButton";
import EventFAQ from "../_components/EventFAQ";
import EventPageShell from "../_components/EventPageShell";
import EventSection from "../_components/EventSection";

const popularWorldSearchHref = `/search/results?${new URLSearchParams({
  sort: SORT_TYPE_CODES.인기순,
  creatorCountryTags: COUNTRY_DEFINITIONS.filter(
    (country) => country.code !== "KR"
  )
    .map((country) => country.code)
    .join(","),
}).toString()}`;

export const metadata: Metadata = {
  title: "레시피에 국경은 없으니까 | 레시피오",
  description:
    "국가 필터로 한국·일본은 물론 다른 나라 유튜브 레시피까지 자유롭게 둘러보세요.",
  openGraph: {
    title: "레시피에 국경은 없으니까 | 레시피오",
    description: "국가 필터로 다른 나라 유튜브 레시피까지 자유롭게 둘러보세요.",
  },
};

const WorldRecipesEventPage = () => {
  return (
    <EventPageShell
      title="전 세계 유튜브 레시피 둘러보기"
      heroSrc="/events/world-recipes/hero.png"
      heroAlt="레시피에 국경은 없으니까"
    >
      <EventSection
        label="Beyond Borders"
        title="다른 나라 레시피, 이제 자유롭게"
      >
        <p className="text-base leading-7 text-gray-700">
          국가 필터가 생겼어요. 한국과 일본은 물론, 그 외 나라의 유튜브 채널이
          올린 레시피까지 원하는 나라만 골라서 둘러볼 수 있어요.
        </p>
      </EventSection>
      <EventSection label="How to use" title="이렇게 골라보세요">
        <p className="mb-5 text-base leading-7 text-gray-700">
          검색 화면에서 <b className="font-semibold text-gray-900">필터</b>를
          열고 <b className="font-semibold text-gray-900">크리에이터 국가</b>
          에서 보고 싶은 나라를 선택하면, 그 나라 채널의 레시피만 모아서
          보여줘요.
        </p>
        <EventCtaButton
          label="다른 나라 레시피 찾으러 가기"
          href={popularWorldSearchHref}
        />
      </EventSection>
      <EventFAQ
        items={[
          {
            question: "어떤 나라를 지원하나요?",
            answer:
              "한국, 일본, 기타 세 가지로 구분해서 보여드려요. '기타'는 한국·일본 외 채널을 모두 포함해요.",
          },
          {
            question: "음식 종류로 거르는 건가요?",
            answer:
              "아니요. 영상을 올린 채널·크리에이터의 국가가 기준이에요. 한국 채널이 올린 파스타 영상도 '한국'으로 분류돼요.",
          },
          {
            question: "어디서 국가를 고르나요?",
            answer:
              "검색 화면에서 '필터'를 누르면 '크리에이터 국가' 항목이 있어요. 거기서 한국·일본·기타를 선택하면 돼요.",
          },
          {
            question: "여러 나라를 한 번에 볼 수 있나요?",
            answer:
              "네, 한국과 일본처럼 여러 나라를 함께 선택하면 모두 모아서 보여드려요.",
          },
        ]}
      />
    </EventPageShell>
  );
};

export default WorldRecipesEventPage;
