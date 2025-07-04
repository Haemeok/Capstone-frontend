import { Calendar, LucideIcon } from "lucide-react";
import { Award } from "lucide-react";
import { BookOpen } from "lucide-react";

import { User } from "@/entities/user/model/types";

import { UI_BASE_URL } from "./recipe";

export const guestUser: User = {
  id: 0,
  nickname: "게스트",
  profileImage: "/default-profile.png",
  username: "@guest",
  introduction: "",
};

export type Tab = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export const MyTabs: Tab[] = [
  { id: "나의 레시피", label: "나의 레시피", icon: Award },
  { id: "북마크", label: "북마크", icon: BookOpen },
  { id: "캘린더", label: "캘린더", icon: Calendar },
];

export const OtherTabs: Tab[] = [
  { id: "나의 레시피", label: "나의 레시피", icon: Award },
];

interface SurveyStep {
  id: number;
  question: string;
  options?: { value: string; label: string }[];
  isRadio: boolean;
}

export const surveySteps: SurveyStep[] = [
  {
    id: 1,
    question: "가장 선호하는 음식 종류는 무엇인가요?",
    options: [
      { value: "soup", label: "국/찌개" },
      { value: "main", label: "메인" },
      { value: "side", label: "반찬" },
      { value: "dessert", label: "디저트" },
      { value: "drink", label: "음료" },
    ],
    isRadio: true,
  },
  {
    id: 2,
    question: "알레르기가 있는 음식이 있나요? 있다면 알려주세요.",
    isRadio: false,
  },
  {
    id: 3,
    question: "매운 것을 얼마나 좋아하시나요?",
    options: [
      { value: "love", label: "매우 좋아함" },
      { value: "like", label: " 좋아함" },
      { value: "dislike", label: " 싫어함" },
      { value: "hate", label: " 못 먹음" },
    ],
    isRadio: true,
  },
];

export const LOGIN_IMAGE_URL = `${UI_BASE_URL}login.webp`;
export const NO_IMAGE_URL = `${UI_BASE_URL}no_image.webp`;
