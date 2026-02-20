import { calculateFakeProgress } from "../progress";

describe("calculateFakeProgress", () => {
  const mockStartTime = (elapsedSeconds: number) =>
    Date.now() - elapsedSeconds * 1000;

  it("0초에 0%를 반환해야 함", () => {
    expect(calculateFakeProgress(mockStartTime(0))).toBe(0);
  });

  it("5초에 10%를 반환해야 함", () => {
    expect(calculateFakeProgress(mockStartTime(5))).toBe(10);
  });

  it("15초에 25%를 반환해야 함", () => {
    expect(calculateFakeProgress(mockStartTime(15))).toBe(25);
  });

  it("40초에 45%를 반환해야 함", () => {
    expect(calculateFakeProgress(mockStartTime(40))).toBe(45);
  });

  it("90초에 65%를 반환해야 함", () => {
    expect(calculateFakeProgress(mockStartTime(90))).toBe(65);
  });

  it("150초에 85%를 반환해야 함", () => {
    expect(calculateFakeProgress(mockStartTime(150))).toBe(85);
  });

  it("210초에 95%를 반환해야 함", () => {
    expect(calculateFakeProgress(mockStartTime(210))).toBe(95);
  });

  it("중간값을 올바르게 보간해야 함 (2.5초 → 5%)", () => {
    const progress = calculateFakeProgress(mockStartTime(2.5));
    expect(progress).toBe(5);
  });

  it("중간값을 올바르게 보간해야 함 (10초 → 17~18%)", () => {
    const progress = calculateFakeProgress(mockStartTime(10));
    expect(progress).toBeGreaterThanOrEqual(17);
    expect(progress).toBeLessThanOrEqual(18);
  });

  describe("100% 초과 방지", () => {
    it("210초 이후에도 95%를 초과하지 않아야 함", () => {
      expect(calculateFakeProgress(mockStartTime(300))).toBe(95);
    });

    it("매우 긴 시간이 지나도 95%를 초과하지 않아야 함", () => {
      expect(calculateFakeProgress(mockStartTime(3600))).toBe(95);
    });

    it("어떤 시점에서도 100%를 넘지 않아야 함", () => {
      const timePoints = [0, 1, 5, 10, 15, 30, 40, 60, 90, 120, 150, 180, 210, 300, 600, 1800];
      for (const seconds of timePoints) {
        const progress = calculateFakeProgress(mockStartTime(seconds));
        expect(progress).toBeLessThanOrEqual(100);
        expect(progress).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe("단조 증가", () => {
    it("시간이 지남에 따라 progress가 감소하지 않아야 함", () => {
      let prevProgress = 0;
      for (let seconds = 0; seconds <= 300; seconds += 5) {
        const progress = calculateFakeProgress(mockStartTime(seconds));
        expect(progress).toBeGreaterThanOrEqual(prevProgress);
        prevProgress = progress;
      }
    });
  });

  describe("초반 즉각 피드백", () => {
    it("3초에 이미 0보다 큰 값을 반환해야 함", () => {
      expect(calculateFakeProgress(mockStartTime(3))).toBeGreaterThan(0);
    });

    it("7초(첫 폴링 전)에 10% 이상이어야 함", () => {
      expect(calculateFakeProgress(mockStartTime(7))).toBeGreaterThanOrEqual(10);
    });
  });
});
