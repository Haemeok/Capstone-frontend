import type { InfiniteData } from "@tanstack/react-query";

import { keepFirstInfinitePage } from "..";

describe("keepFirstInfinitePage", () => {
  it("여러 페이지 캐시에서 첫 page와 대응하는 첫 pageParam만 남긴다", () => {
    const data: InfiniteData<{ items: string[] }, number> = {
      pages: [{ items: ["first"] }, { items: ["second"] }],
      pageParams: [0, 1],
    };

    expect(keepFirstInfinitePage(data)).toEqual({
      pages: [{ items: ["first"] }],
      pageParams: [0],
    });
  });

  it("캐시가 없으면 undefined를 유지한다", () => {
    expect(keepFirstInfinitePage(undefined)).toBeUndefined();
  });

  it("빈 페이지 캐시는 빈 배열을 유지한다", () => {
    const data: InfiniteData<{ items: string[] }, number> = {
      pages: [],
      pageParams: [],
    };

    expect(keepFirstInfinitePage(data)).toEqual({
      pages: [],
      pageParams: [],
    });
  });
});
