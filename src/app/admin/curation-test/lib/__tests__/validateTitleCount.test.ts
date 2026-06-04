import { validateTitleCount } from "../validateTitleCount";

describe("validateTitleCount", () => {
  it("h1 에 expected 와 일치하는 'N선' 이 있으면 ok", () => {
    expect(
      validateTitleCount({
        h1: "겨울철 든든한 김치찜 5선",
        dek: "추운 날 어울리는 매콤한 한 그릇.",
        expected: 5,
      }).ok
    ).toBe(true);
  });

  it("h1 에 'N가지' 가 expected 와 다르면 fail + 발견된 N 보고", () => {
    const r = validateTitleCount({
      h1: "주말 아침을 깨우는 토스트 3가지",
      dek: "버터·치즈·잼 조합으로 즐기기.",
      expected: 5,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.join("\n")).toMatch(/h1.*3.*expected.*5/i);
    }
  });

  it("dek 에 'TOP N' 이 expected 와 다르면 fail", () => {
    const r = validateTitleCount({
      h1: "비오는 날의 파스타",
      dek: "에디터가 추천하는 TOP 4 라인업.",
      expected: 5,
    });
    expect(r.ok).toBe(false);
  });

  it("'BEST N' 케이스 (대소문자 무시)", () => {
    const r = validateTitleCount({
      h1: "best 3 김치찜",
      dek: "추천 라인업.",
      expected: 5,
    });
    expect(r.ok).toBe(false);
  });

  it("h1 에 N 표기가 아예 없으면 ok (모델이 N 안 박는 건 허용)", () => {
    expect(
      validateTitleCount({
        h1: "매운맛이 그리운 날엔, 집밥 김치찜 모음.zip",
        dek: "추억의 매운맛.",
        expected: 5,
      }).ok
    ).toBe(true);
  });

  it("시간 단위 (N분/N시간/N일/N월/N년) 는 false-positive 회피", () => {
    expect(
      validateTitleCount({
        h1: "10분 만에 끝내는 파스타 5선",
        dek: "30분 안에 두 끼.",
        expected: 5,
      }).ok
    ).toBe(true);
  });

  it("kcal/원/℃ 단위도 false-positive 회피", () => {
    expect(
      validateTitleCount({
        h1: "300kcal 다이어트 도시락 5선",
        dek: "1만원 미만으로 끝.",
        expected: 5,
      }).ok
    ).toBe(true);
  });

  it("h1·dek 에 일치하는 N 과 mismatch N 이 모두 있으면 fail", () => {
    const r = validateTitleCount({
      h1: "김치찜 5선",
      dek: "추천하는 3가지 변주.",
      expected: 5,
    });
    expect(r.ok).toBe(false);
  });

  it("'몇 가지' 같은 흐림 표현은 ok (숫자 없음)", () => {
    expect(
      validateTitleCount({
        h1: "오늘 저녁 떡볶이 몇 가지",
        dek: "골라 먹는 재미.",
        expected: 5,
      }).ok
    ).toBe(true);
  });
});
