import { FlameLevel, FlameLevelConfig } from "../types";

export const FLAME_LEVELS: Record<FlameLevel, FlameLevelConfig> = {
  1: {
    level: 1,
    label: "예열 중",
    panColor: "",
    flameColor: "text-violet-300",
    bgColor: "bg-violet-100",
    className: "scale-90",
  },
  2: {
    level: 2,
    label: "조리 중",
    panColor: "",
    flameColor: "text-violet-500",
    bgColor: "bg-violet-200",
    className: "scale-100",
  },
  3: {
    level: 3,
    label: "마스터 셰프",
    panColor: "",
    flameColor: "text-violet-700",
    bgColor: "bg-violet-300",
    className: "scale-110 animate-pulse drop-shadow-lg",
  },
};

export const getFlameLevel = (streakDays: number): FlameLevelConfig => {
  if (streakDays >= 10) return FLAME_LEVELS[3];
  if (streakDays >= 4) return FLAME_LEVELS[2];
  return FLAME_LEVELS[1];
};
