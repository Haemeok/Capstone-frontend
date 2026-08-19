import type { LucideIcon } from "lucide-react";
import { Bookmark, Link2, Smartphone } from "lucide-react";

import { AppInstallActions } from "./AppInstallActions";
import EventPageShell from "./EventPageShell";

type AppInstallBenefit = {
  label: string;
  title: string;
  description: string;
  Icon: LucideIcon;
};

const APP_INSTALL_BENEFITS: AppInstallBenefit[] = [
  {
    label: "영상 정리",
    title: "링크만 넣으면 재료와 순서가 한눈에",
    description:
      "요리 영상을 여러 번 멈추지 않고 읽기 쉬운 레시피로 확인하세요.",
    Icon: Link2,
  },
  {
    label: "레시피 저장",
    title: "다시 볼 요리는 한곳에",
    description:
      "영상 레시피와 마음에 든 레시피를 저장해 필요할 때 바로 찾아보세요.",
    Icon: Bookmark,
  },
  {
    label: "빠른 실행",
    title: "홈 화면에서 바로 시작",
    description:
      "브라우저를 다시 찾지 않고 레시피오를 열어 오늘 요리를 시작할 수 있어요.",
    Icon: Smartphone,
  },
];

const STORE_ACTIONS_CLASS_NAME =
  "mt-6 min-[351px]:[&>div]:flex-row [&_img]:!h-[46px]";

const AppInstallHero = () => (
  <section className="px-5 pt-8 pb-10 text-center break-keep">
    <img
      src="/web-app-manifest-512x512.png"
      alt="레시피오 앱 아이콘"
      className="mx-auto h-24 w-24 rounded-3xl shadow-[0_9px_24px_rgba(34,34,34,0.12)]"
      width={96}
      height={96}
    />
    <p className="text-olive-medium mt-6 text-xs font-semibold">
      레시피를 찾고, 정리하고, 다시 보는 곳
    </p>
    <h2 className="text-ink mx-auto mt-2 max-w-80 text-2xl leading-[1.34] font-bold tracking-[-0.035em] min-[351px]:text-[26px]">
      <span className="block">자주 찾는 레시피를</span>
      <span className="block">앱에서 바로 꺼내보세요</span>
    </h2>
    <p className="text-ink-sub mx-auto mt-4 max-w-[310px] text-sm leading-6">
      영상 레시피와 저장한 레시피를 한곳에서 더 편하게 이용할 수 있어요.
    </p>
    <AppInstallActions className={STORE_ACTIONS_CLASS_NAME} />
  </section>
);

const AppInstallBenefitList = () => (
  <section className="px-[22px] pb-8" aria-label="레시피오 앱의 주요 장점">
    <ol>
      {APP_INSTALL_BENEFITS.map(({ label, title, description, Icon }) => (
        <li
          key={label}
          className="grid grid-cols-[88px_minmax(0,1fr)] gap-3.5 border-t border-gray-200 py-6 first:border-t-0"
        >
          <div className="text-olive-medium flex items-center gap-1.5 pt-0.5">
            <Icon className="h-[22px] w-[22px] shrink-0" aria-hidden="true" />
            <span className="text-xs font-semibold whitespace-nowrap">
              {label}
            </span>
          </div>
          <div>
            <h3 className="text-ink text-lg leading-[1.4] font-bold tracking-[-0.025em]">
              {title}
            </h3>
            <p className="text-ink-sub mt-2 text-sm leading-[1.65]">
              {description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  </section>
);

const AppInstallFinalAction = () => (
  <section className="bg-olive-light/10 mx-4 mb-10 rounded-2xl px-5 py-7">
    <h2 className="text-ink text-xl leading-7 font-bold tracking-[-0.03em]">
      오늘 필요한 레시피를
      <span className="block">앱에서 더 빠르게 만나보세요</span>
    </h2>
    <AppInstallActions className={STORE_ACTIONS_CLASS_NAME} />
  </section>
);

export const AppInstallEventView = () => (
  <EventPageShell title="레시피오 앱" hero={<AppInstallHero />}>
    <AppInstallBenefitList />
    <AppInstallFinalAction />
  </EventPageShell>
);
