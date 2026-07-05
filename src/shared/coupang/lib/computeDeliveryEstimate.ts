const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export const computeDeliveryEstimate = (now: Date): string => {
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  return `내일(${WEEKDAYS[tomorrow.getDay()]}) 도착 예정`;
};
