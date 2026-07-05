import { buildRecipeSearchBaseKey } from "@/shared/lib/search/recipeSearchQueryKey";

import { parseSearchQueryParams } from "../parseSearchParams";

const serverKey = (params: Parameters<typeof parseSearchQueryParams>[0]) => {
  const {
    tags,
    q,
    dishTypeCode,
    sortCode,
    types,
    ingredientIds,
    creatorCountryTags,
    nutritionQueryParams,
  } = parseSearchQueryParams(params);
  return buildRecipeSearchBaseKey({
    dishTypeCode,
    sortCode,
    tagCodes: tags,
    q,
    nutritionQueryParams,
    types,
    ingredientIds,
    creatorCountryTags,
  });
};

describe("ko 검색 결과 SSR prefetch 키 ↔ 클라이언트 스냅샷 키 정합성", () => {
  it("빈 필터일 때 클라이언트 스냅샷의 기본값 키와 byte-match (9칸)", () => {
    const clientEmptyKey = [
      "recipes",
      null,
      "popularityScore,DESC",
      "",
      "",
      "{}",
      "USER,AI,YOUTUBE",
      "",
      "",
    ];
    expect(serverKey({})).toEqual(clientEmptyKey);
    expect(serverKey({})).toHaveLength(9);
  });

  it("creatorCountryTags를 파싱해 키 마지막 칸과 query에 반영하고, 미정의 코드는 버린다", () => {
    const params = { creatorCountryTags: "KR,XX,JP" };
    const parsed = parseSearchQueryParams(params);

    expect(parsed.creatorCountryTags).toEqual(["KR", "JP"]);
    expect(parsed.query.creatorCountryTags).toEqual(["KR", "JP"]);
    expect(serverKey(params)[8]).toBe("KR,JP");
  });

  it("dishType/sort를 코덱 라운드트립으로 정규화한다", () => {
    const key = serverKey({ dishType: "FRYING", sort: "createdAt,DESC" });
    expect(key[1]).toBe("FRYING");
    expect(key[2]).toBe("createdAt,DESC");
  });
});
