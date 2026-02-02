const KST_OFFSET_MS = 9 * 60 * 60 * 1000; // UTC+9

/**
 * 한국 시간(KST) 기준 YYYY-MM-DD 형식의 날짜 문자열 반환
 * UTC 타임스탬프를 KST로 변환하여 날짜 계산
 */
export const getKSTDateString = (timestamp: number = Date.now()): string => {
  const kstDate = new Date(timestamp + KST_OFFSET_MS);
  const year = kstDate.getUTCFullYear();
  const month = String(kstDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(kstDate.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
