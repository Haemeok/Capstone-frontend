import { ICON_BASE_URL } from "@/shared/config/constants/recipe";

import { BannerSlide } from "./types";

export const APP_INSTALL_BANNER_ID = "app-install";
export const COOKING_RECORD_LAUNCH_BANNER_ID = "cooking-record-launch";

export const HOME_BANNER_SLIDES: BannerSlide[] = [
  {
    id: COOKING_RECORD_LAUNCH_BANNER_ID,
    chip: "새로 나온 요리기록",
    title: "요리한 날을 차곡차곡 모아보세요",
    link: "/events/cooking-record",
    backgroundColor: "#edf4eb",
    mainImage: "/events/cooking-record/food-cluster.webp",
  },
  {
    id: APP_INSTALL_BANNER_ID,
    chip: "#레시피오 앱",
    title: "레시피오 앱에서 더 편하게",
    link: "/events/app-install",
    backgroundColor: "#f7f4ee",
    mainImage: "/web-app-manifest-512x512.png",
  },
  {
    id: "youtube",
    chip: "#유튜브 레시피",
    title: "링크만 넣으면 레시피 완성",
    link: "/recipes/new/youtube",
    backgroundColor: "#fee2e2",
    mainImage: `${ICON_BASE_URL}youtube.webp`,
  },
  {
    id: "world-recipes",
    chip: "#전 세계 레시피",
    title: "세계 각국 레시피 구경하기",
    link: "/events/world-recipes",
    backgroundColor: "#dbeafe",
    mainImage: "/events/world-recipes/hero.png",
  },
  {
    id: "ad-free-june",
    chip: "#기간한정 이벤트",
    title: "친구 초대하고 광고 없애봐요",
    link: "/events/ad-free-june",
    backgroundColor: "#ede9fe",
    mainImage: "/events/ad-free-june/hero.png",
  },
];
