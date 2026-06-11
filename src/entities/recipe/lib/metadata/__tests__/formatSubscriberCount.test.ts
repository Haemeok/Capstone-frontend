/**
 * @jest-environment node
 */
import { formatSubscriberCount } from "../youtube";

describe("formatSubscriberCount", () => {
  it("100만 구독자는 100만명으로 표기된다", () => {
    expect(formatSubscriberCount(1_000_000)).toBe("100만명"); // T-23
  });

  it("150만 구독자는 150만명으로 표기된다", () => {
    expect(formatSubscriberCount(1_500_000)).toBe("150만명"); // T-24
  });

  it("2만 구독자는 2만명으로 표기된다 (회귀)", () => {
    expect(formatSubscriberCount(20_000)).toBe("2만명"); // T-25
  });
});
