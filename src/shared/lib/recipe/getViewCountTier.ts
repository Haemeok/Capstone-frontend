import { Crown, Eye, Flame, type LucideIcon } from "lucide-react";

export type ViewCountTier = {
  icon: LucideIcon;
  iconColor: string;
  strokeWidth: number;
};

export const getViewCountTier = (count: number): ViewCountTier => {
  if (count >= 1000000) {
    return { icon: Crown, iconColor: "text-amber-500", strokeWidth: 2.5 };
  }
  if (count >= 100000) {
    return { icon: Flame, iconColor: "text-orange-500", strokeWidth: 2.5 };
  }
  return { icon: Eye, iconColor: "text-gray-400", strokeWidth: 2 };
};
