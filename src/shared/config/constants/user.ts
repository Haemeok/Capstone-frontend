import { Bookmark, Calendar, LucideIcon } from "lucide-react";
import { Award } from "lucide-react";

import { User } from "@/entities/user/model/types";

import { UI_BASE_URL } from "./recipe";

export const guestUser: User = {
  id: 0,
  nickname: "게스트",
  profileImage: "",
  username: "@guest",
  introduction: "",
  hasFirstRecord: false,
  remainingAiQuota: 0,
};

export type Tab = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export const MyTabs: Tab[] = [
  { id: "나의 레시피", label: "나의 레시피", icon: Award },
  { id: "북마크", label: "북마크", icon: Bookmark },
  { id: "캘린더", label: "캘린더", icon: Calendar },
];

export const OtherTabs: Tab[] = [
  { id: "나의 레시피", label: "나의 레시피", icon: Award },
];

type SurveyStepType = "radio" | "textarea" | "checkbox" | "range" | "slider";

export type SurveyStep = {
  id: number;
  question: string;
  type: SurveyStepType;
  options?: { value: string; label: string }[];
  isRadio: boolean;
  min?: number;
  max?: number;
  isMultiple?: boolean;
  required?: boolean;
};

export const surveySteps: SurveyStep[] = [
  {
    id: 1,
    question: "매운맛 선호도를 선택해주세요",
    type: "slider",
    isRadio: false,
    min: 1,
    max: 5,
  },
  {
    id: 2,
    question: "알레르기가 있는 음식이 있나요? 있다면 알려주세요.",
    type: "textarea",
    isRadio: false,
    required: false,
  },
  {
    id: 3,
    question: "선호하는 요리 테마를 선택해주세요 (복수 선택 가능)",
    type: "checkbox",
    isRadio: false,
    isMultiple: true,
    options: [
      { value: "홈파티", label: "🏠 홈파티" },
      { value: "피크닉", label: "🌼 피크닉" },
      { value: "캠핑", label: "🏕️ 캠핑" },
      { value: "다이어트 / 건강식", label: "🥗 다이어트 / 건강식" },
      { value: "아이와 함께", label: "👶 아이와 함께" },
      { value: "혼밥", label: "🍽️ 혼밥" },
      { value: "술안주", label: "🍶 술안주" },
      { value: "브런치", label: "🥐 브런치" },
      { value: "야식", label: "🌙 야식" },
      { value: "초스피드 / 간단 요리", label: "⚡ 초스피드 / 간단 요리" },
      { value: "기념일 / 명절", label: "🎉 기념일 / 명절" },
      { value: "도시락", label: "🍱 도시락" },
      { value: "에어프라이어", label: "🔌 에어프라이어" },
      { value: "해장", label: "🍲 해장" },
      { value: "셰프 레시피", label: "👨‍🍳 셰프 레시피" },
    ],
  },
];

export const LOGIN_IMAGE_URL = `${UI_BASE_URL}login.webp`;
export const NO_IMAGE_URL = `${UI_BASE_URL}no_image.webp`;
