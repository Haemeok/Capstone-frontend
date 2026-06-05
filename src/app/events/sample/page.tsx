import type { Metadata } from "next";

import EventFAQ from "../_components/EventFAQ";
import EventPageShell from "../_components/EventPageShell";
import EventSection from "../_components/EventSection";

export const metadata: Metadata = {
  title: "여름 특가 이벤트 | 레시피오",
  description: "레시피오 여름 특가 이벤트 안내.",
  openGraph: {
    title: "여름 특가 이벤트 | 레시피오",
    description: "레시피오 여름 특가 이벤트 안내.",
  },
};

const SampleEventPage = () => {
  return (
    <EventPageShell
      title="여름 특가 이벤트"
      heroSrc="/events/sample/hero.png"
      heroAlt="여름 특가 이벤트 배너"
    >
      <EventSection title="EVENT 1">
        <p className="text-sm text-gray-600">
          첫 번째 이벤트 안내 영역입니다. 실제 콘텐츠는 이후 직접 코딩합니다.
        </p>
      </EventSection>
      <EventSection title="EVENT 2">
        <p className="text-sm text-gray-600">
          두 번째 이벤트 안내 영역입니다. 실제 콘텐츠는 이후 직접 코딩합니다.
        </p>
      </EventSection>
      <EventFAQ
        items={[
          {
            question: "이벤트 기간은 언제인가요?",
            answer: "이벤트 페이지에 안내된 기간 동안 진행됩니다.",
          },
          {
            question: "참여 방법이 궁금해요.",
            answer: "각 이벤트 영역의 안내를 따라 참여하시면 됩니다.",
          },
        ]}
      />
    </EventPageShell>
  );
};

export default SampleEventPage;
