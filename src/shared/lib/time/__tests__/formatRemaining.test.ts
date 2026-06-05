import { formatRemaining } from "../formatRemaining";

describe("formatRemaining", () => {
  it("T-501: 일/시:분:초 포맷", () => {
    const ms = ((1 * 24 + 2) * 3600 + 3 * 60 + 4) * 1000;
    expect(formatRemaining(ms)).toBe("1일 02:03:04");
  });
  it("T-502: 0 이하면 00:00:00", () => {
    expect(formatRemaining(0)).toBe("00:00:00");
    expect(formatRemaining(-5000)).toBe("00:00:00");
  });
});
