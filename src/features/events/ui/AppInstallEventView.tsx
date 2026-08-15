import { StoreBadges } from "@/shared/ui/StoreBadges";

import EventPageShell from "./EventPageShell";

export const AppInstallEventView = () => (
  <EventPageShell
    title="레시피오 앱"
    heroSrc="/web-app-manifest-512x512.png"
    heroAlt="레시피오 앱 아이콘"
  >
    <section className="px-5 py-8 text-center">
      <h2 className="text-ink text-2xl font-bold">
        매일 찾는 레시피, 앱에서 더 편하게
      </h2>
      <p className="text-ink-sub mt-3 text-base leading-7">
        YouTube 레시피를 정리하고, 저장한 레시피를 필요할 때 바로 꺼내보세요.
      </p>
      <StoreBadges className="mt-6" />
    </section>
  </EventPageShell>
);
