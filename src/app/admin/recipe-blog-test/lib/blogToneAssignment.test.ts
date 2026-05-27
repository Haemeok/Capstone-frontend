import { ALL_TONES, assignTonesToAccounts } from "./blogToneAssignment";

describe("assignTonesToAccounts", () => {
  it("accounts 빈 배열이면 빈 map", () => {
    expect(assignTonesToAccounts(ALL_TONES, [])).toEqual({});
  });

  it("6톤/3계정 → 2씩 균등", () => {
    const tones = ["t1", "t2", "t3", "t4", "t5", "t6"] as never[];
    expect(assignTonesToAccounts(tones, ["a1", "a2", "a3"])).toEqual({
      a1: ["t1", "t2"],
      a2: ["t3", "t4"],
      a3: ["t5", "t6"],
    });
  });

  it("9톤/3계정 → 3씩 균등", () => {
    const tones = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9"] as never[];
    expect(assignTonesToAccounts(tones, ["a1", "a2", "a3"])).toEqual({
      a1: ["t1", "t2", "t3"],
      a2: ["t4", "t5", "t6"],
      a3: ["t7", "t8", "t9"],
    });
  });

  it("5톤/3계정 → ceil(5/3)=2 그룹, 마지막은 남는 1개", () => {
    const tones = ["t1", "t2", "t3", "t4", "t5"] as never[];
    expect(assignTonesToAccounts(tones, ["a1", "a2", "a3"])).toEqual({
      a1: ["t1", "t2"],
      a2: ["t3", "t4"],
      a3: ["t5"],
    });
  });

  it("1계정 → 모든 톤이 그 계정에", () => {
    const tones = ALL_TONES;
    expect(assignTonesToAccounts(tones, ["solo"])).toEqual({ solo: tones });
  });

  it("실제 BlogTone 5개 / 3계정 → epigung·ellymom / elarpi·minnie46 / haetsal", () => {
    expect(assignTonesToAccounts(ALL_TONES, ["acc1", "acc2", "acc3"])).toEqual({
      acc1: ["epigung", "ellymom"],
      acc2: ["elarpi", "minnie46"],
      acc3: ["haetsal"],
    });
  });
});
