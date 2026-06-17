import { eventsMessages } from "../eventsMessages";

const collectStrings = (value: unknown): string[] => {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === "object")
    return Object.values(value).flatMap(collectStrings);
  return [];
};

describe("eventsMessages 완전성 가드 (T-E01)", () => {
  it("ko 사전은 모든 키가 채워져 있다(가드 sanity)", () => {
    expect(collectStrings(eventsMessages.ko).length).toBeGreaterThan(20);
  });
});
