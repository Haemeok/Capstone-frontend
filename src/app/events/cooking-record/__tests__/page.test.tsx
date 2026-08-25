import { metadata } from "../page";

describe("요리기록 이벤트 페이지 metadata", () => {
  it("T-10: 검색과 공유에 요리기록 설명과 한국어 URL만 제공합니다", () => {
    expect(metadata.title).toBe("요리기록 시작하기 | 레시피오");
    expect(metadata.openGraph?.title).toBe("요리기록 시작하기");
    expect(metadata.description).toContain("사진 한 장");
    expect(metadata.description).toContain("월간 스티커북");
    expect(metadata.description).toContain("달력");
    expect(metadata.alternates?.languages).toEqual({
      ko: "https://www.recipio.kr/events/cooking-record",
      "x-default": "https://www.recipio.kr/events/cooking-record",
    });
  });
});
