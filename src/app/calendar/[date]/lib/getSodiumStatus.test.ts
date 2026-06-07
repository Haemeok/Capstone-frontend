import { getSodiumStatus } from "./getSodiumStatus";

describe("getSodiumStatus (T-02)", () => {
  it.each([
    [0, "좋음"],
    [3000, "좋음"],
    [3001, "보통"],
    [4000, "보통"],
    [4001, "주의"],
  ])("나트륨 %dmg이면 %s 라벨", (sodium, label) => {
    expect(getSodiumStatus(sodium).label).toBe(label);
  });
});
