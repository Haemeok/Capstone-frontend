import { buildEventMetadata } from "@/shared/lib/metadata/eventMetadata";

import { AppInstallEventView } from "@/features/events";

export const metadata = buildEventMetadata({
  path: "/events/app-install",
  locale: "ko",
  title: "레시피오 앱 설치",
  description:
    "YouTube 레시피 추출과 저장한 레시피 관리를 레시피오 앱에서 더 편하게 이용해보세요.",
  ogImage: "/web-app-manifest-512x512.png",
  ogImageAlt: "레시피오 앱 아이콘",
  supportedLocales: ["ko"],
  ogImageWidth: 512,
  ogImageHeight: 512,
  openGraphTitle: "레시피오 앱 설치",
});

const AppInstallPage = () => <AppInstallEventView />;

export default AppInstallPage;
