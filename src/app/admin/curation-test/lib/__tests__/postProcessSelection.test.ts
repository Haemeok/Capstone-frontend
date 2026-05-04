import { postProcessSelection } from "../postProcessSelection";

describe("postProcessSelection", () => {
  it("정확히 count개 unique valid 인덱스를 반환 (정상 케이스)", () => {
    expect(postProcessSelection([2, 0, 5], 3, 8)).toEqual([2, 0, 5]);
  });

  it("범위 밖 인덱스는 버리고 앞에서 채운다", () => {
    expect(postProcessSelection([10, 0, 5], 3, 6)).toEqual([0, 5, 1]);
  });

  it("중복은 unique화 후 모자라면 앞에서 채운다", () => {
    expect(postProcessSelection([2, 2, 2], 3, 5)).toEqual([2, 0, 1]);
  });

  it("count보다 많이 와도 앞 count개만 사용 (valid 한정)", () => {
    expect(postProcessSelection([0, 1, 2, 3, 4], 3, 5)).toEqual([0, 1, 2]);
  });

  it("count보다 적게 와도 부족분을 0..pool-1에서 보충", () => {
    expect(postProcessSelection([3], 3, 5)).toEqual([3, 0, 1]);
  });

  it("pool < count면 pool 길이까지만 반환", () => {
    expect(postProcessSelection([0, 1], 5, 2)).toEqual([0, 1]);
  });

  it("빈 배열이면 0..count-1로 폴백", () => {
    expect(postProcessSelection([], 3, 5)).toEqual([0, 1, 2]);
  });
});
