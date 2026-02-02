import { getKSTDateString } from "./dateUtils";

describe("getKSTDateString", () => {
  describe("기본 동작", () => {
    it("UTC 자정을 KST 오전 9시로 변환하여 같은 날짜 반환", () => {
      // UTC 2024-01-15 00:00:00 = KST 2024-01-15 09:00:00
      const utcMidnight = Date.UTC(2024, 0, 15, 0, 0, 0);
      expect(getKSTDateString(utcMidnight)).toBe("2024-01-15");
    });

    it("UTC 오후 3시를 KST 다음날 자정으로 변환", () => {
      // UTC 2024-01-15 15:00:00 = KST 2024-01-16 00:00:00
      const lateUTC = Date.UTC(2024, 0, 15, 15, 0, 0);
      expect(getKSTDateString(lateUTC)).toBe("2024-01-16");
    });

    it("UTC 오후 2시 59분은 KST 같은 날", () => {
      // UTC 2024-01-15 14:59:59 = KST 2024-01-15 23:59:59
      const beforeKSTMidnight = Date.UTC(2024, 0, 15, 14, 59, 59);
      expect(getKSTDateString(beforeKSTMidnight)).toBe("2024-01-15");
    });
  });

  describe("날짜 경계 케이스", () => {
    it("월말 → 다음달 1일 전환", () => {
      // UTC 2024-01-31 15:00:00 = KST 2024-02-01 00:00:00
      const endOfJanuary = Date.UTC(2024, 0, 31, 15, 0, 0);
      expect(getKSTDateString(endOfJanuary)).toBe("2024-02-01");
    });

    it("연말 → 다음해 1월 1일 전환", () => {
      // UTC 2024-12-31 15:00:00 = KST 2025-01-01 00:00:00
      const endOfYear = Date.UTC(2024, 11, 31, 15, 0, 0);
      expect(getKSTDateString(endOfYear)).toBe("2025-01-01");
    });

    it("윤년 2월 28일 → 2월 29일", () => {
      // UTC 2024-02-28 15:00:00 = KST 2024-02-29 00:00:00
      const leapYear = Date.UTC(2024, 1, 28, 15, 0, 0);
      expect(getKSTDateString(leapYear)).toBe("2024-02-29");
    });
  });

  describe("포맷 검증", () => {
    it("월/일이 한 자리일 때 0으로 패딩", () => {
      // 2024-01-05
      const singleDigit = Date.UTC(2024, 0, 5, 0, 0, 0);
      expect(getKSTDateString(singleDigit)).toBe("2024-01-05");
    });

    it("timestamp 없이 호출하면 현재 KST 날짜 반환", () => {
      const result = getKSTDateString();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
