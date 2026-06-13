import { getSodiumStatus } from "./getSodiumStatus";

describe("getSodiumStatus key (T-13/14/15)", () => {
  it.each([
    [0, "good"],
    [3000, "good"],
    [3001, "normal"],
    [4000, "normal"],
    [4001, "warning"],
  ] as const)("나트륨 %dmg이면 %s 키", (sodium, key) => {
    expect(getSodiumStatus(sodium).key).toBe(key);
  });
});
