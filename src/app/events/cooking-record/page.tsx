import { buildEventMetadata } from "@/shared/lib/metadata/eventMetadata";

import { CookingRecordEventView } from "@/features/events";

export const metadata = buildEventMetadata({
  path: "/events/cooking-record",
  locale: "ko",
  title: "요리기록 시작하기",
  description:
    "사진 한 장과 짧은 메모로 오늘의 요리를 남기고, 월간 스티커북과 달력에서 다시 확인해보세요.",
  ogImage: "/events/cooking-record/food-cluster.webp",
  ogImageAlt: "요리기록을 채우는 여러 음식",
  supportedLocales: ["ko"],
  ogImageWidth: 640,
  ogImageHeight: 960,
  openGraphTitle: "요리기록 시작하기",
});

const CookingRecordEventPage = () => <CookingRecordEventView />;

export default CookingRecordEventPage;
