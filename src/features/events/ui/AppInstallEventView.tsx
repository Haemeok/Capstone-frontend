import { StoreBadges } from "@/shared/ui/StoreBadges";

import EventPageShell from "./EventPageShell";

const APP_INSTALL_BENEFITS = [
  {
    title: "링크 하나로 레시피 정리",
    description: "YouTube 링크에서 재료와 조리 순서를 보기 쉽게 정리해드려요.",
  },
  {
    title: "마음에 든 레시피를 한곳에 저장",
    description: "다시 보고 싶은 레시피를 저장하고 편하게 관리해보세요.",
  },
  {
    title: "홈 화면에서 바로 시작",
    description: "브라우저를 다시 찾지 않고 레시피오를 바로 열 수 있어요.",
  },
];

const AppInstallHero = () => (
  <div className="bg-beige flex h-52 items-center justify-center px-10">
    <img
      src="/web-app-manifest-512x512.png"
      alt="레시피오 앱 아이콘"
      className="h-36 w-36 rounded-3xl"
      width={144}
      height={144}
    />
  </div>
);

export const AppInstallEventView = () => (
  <EventPageShell title="레시피오 앱" hero={<AppInstallHero />}>
    <section className="px-5 py-8 text-center">
      <h2 className="text-ink text-2xl font-bold">
        매일 찾는 레시피, 앱에서 더 편하게
      </h2>
      <p className="text-ink-sub mt-3 text-base leading-7">
        YouTube 레시피를 정리하고, 저장한 레시피를 필요할 때 바로 꺼내보세요.
      </p>
      <StoreBadges className="mt-6" />
    </section>
    <section className="border-t border-gray-100 px-5 py-8">
      <ol>
        {APP_INSTALL_BENEFITS.map((benefit) => (
          <li
            key={benefit.title}
            className="border-b border-gray-100 py-6 first:pt-0 last:border-b-0 last:pb-0"
          >
            <h3 className="text-ink text-lg font-bold">{benefit.title}</h3>
            <p className="text-ink-sub mt-2 text-base leading-7">
              {benefit.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
    <section className="border-t border-gray-100 px-5 py-10 text-center">
      <h2 className="text-ink text-xl font-bold">
        오늘 요리도 레시피오 앱과 함께
      </h2>
      <StoreBadges className="mt-6" />
    </section>
  </EventPageShell>
);
