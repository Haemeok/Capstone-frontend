export type RankType = "TOP" | "BEST";

export const buildHooking = (
  foodName: string,
  rankType: RankType,
  count: number
): string => `유튜브 ${foodName} 레시피 ${rankType} ${count}`;
