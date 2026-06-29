import type { SliceResponse } from "@/shared/api/types";

import { getNextSlicePageParam } from "../utils";

const make = (number: number, hasNext: boolean): SliceResponse<unknown> => ({
  content: [],
  slice: { size: 10, number, numberOfElements: 10, hasNext },
});

describe("getNextSlicePageParam (T-01~T-04)", () => {
  it("T-01: hasNext=true, number=0이면 다음 페이지 1을 반환한다", () => {
    expect(getNextSlicePageParam(make(0, true))).toBe(1);
  });

  it("T-02: hasNext=false면 undefined를 반환한다 (마지막 페이지)", () => {
    expect(getNextSlicePageParam(make(5, false))).toBeUndefined();
  });

  it("T-03: 딥링크 number=3, hasNext=true면 4를 반환한다 (절대 페이지 번호 보존)", () => {
    expect(getNextSlicePageParam(make(3, true))).toBe(4);
  });

  it("T-04: lastPage가 slice 없이 들어오면 undefined를 반환한다", () => {
    expect(
      getNextSlicePageParam(undefined as unknown as SliceResponse<unknown>)
    ).toBeUndefined();
  });
});
