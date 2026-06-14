import { motivationalMessage } from "../motivationalMessage";

const M = {
  start: "s",
  day1: "d1",
  streak: "{n} streak",
  homeCooking: "{n} home",
  great: "{n} great",
  onFire: "{n} fire",
  incredible: "{n} inc",
};

test("T-15 band selection boundaries", () => {
  expect(motivationalMessage(0, M)).toBe("s");
  expect(motivationalMessage(1, M)).toBe("d1");
  expect(motivationalMessage(3, M)).toBe("3 streak");
  expect(motivationalMessage(6, M)).toBe("6 home");
  expect(motivationalMessage(9, M)).toBe("9 great");
  expect(motivationalMessage(19, M)).toBe("19 fire");
  expect(motivationalMessage(20, M)).toBe("20 inc");
});
