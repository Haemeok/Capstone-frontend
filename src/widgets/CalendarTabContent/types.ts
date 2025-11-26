export type CalendarMode = "streak" | "photo";

export type FlameLevel = 1 | 2 | 3;

export type FlameLevelConfig = {
  level: FlameLevel;
  label: string;
  panColor: string;
  flameColor: string;
  bgColor: string;
  className: string;
};

export type ConsecutiveRange = {
  startDate: Date;
  endDate: Date;
  dates: Date[];
  flameLevel: FlameLevel;
};
