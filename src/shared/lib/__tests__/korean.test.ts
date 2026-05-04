import {
  getEulReulParticle,
  getEuroParticle,
  normalizeEulReulInText,
} from "../korean";

describe("getEuroParticle", () => {
  it("returns 로 for words ending without 받침", () => {
    expect(getEuroParticle("양파")).toBe("로");
    expect(getEuroParticle("양배추")).toBe("로");
    expect(getEuroParticle("토마토")).toBe("로");
    expect(getEuroParticle("감자")).toBe("로");
  });

  it("returns 로 for words ending with ㄹ 받침 (Korean exception)", () => {
    expect(getEuroParticle("마늘")).toBe("로");
    expect(getEuroParticle("쌀")).toBe("로");
    expect(getEuroParticle("나물")).toBe("로");
  });

  it("returns 으로 for words ending with non-ㄹ 받침", () => {
    expect(getEuroParticle("당근")).toBe("으로");
    expect(getEuroParticle("콩")).toBe("으로");
    expect(getEuroParticle("호박")).toBe("으로");
    expect(getEuroParticle("배추")).toBe("로"); // ends in vowel
    expect(getEuroParticle("양상추")).toBe("로");
  });

  it("falls back to 으로 for empty or non-Hangul input", () => {
    expect(getEuroParticle("")).toBe("으로");
    expect(getEuroParticle("tomato")).toBe("으로");
    expect(getEuroParticle("123")).toBe("으로");
  });
});

describe("getEulReulParticle", () => {
  it("받침이 있으면 '을'", () => {
    expect(getEulReulParticle("문어미역초무침")).toBe("을");
    expect(getEulReulParticle("어리굴젓")).toBe("을");
    expect(getEulReulParticle("미역국")).toBe("을");
  });

  it("ㄹ 받침도 '을' (받침 있음으로 처리)", () => {
    expect(getEulReulParticle("거울")).toBe("을");
    expect(getEulReulParticle("쌀")).toBe("을");
  });

  it("받침이 없으면 '를'", () => {
    expect(getEulReulParticle("폰즈")).toBe("를");
    expect(getEulReulParticle("소스")).toBe("를");
    expect(getEulReulParticle("사과")).toBe("를");
  });

  it("끝에 영문·괄호가 붙어도 마지막 한글 음절로 판정", () => {
    expect(getEulReulParticle("홀리키(Holi.ky) · 문어미역초무침")).toBe("을");
    expect(getEulReulParticle("이리(시라코) 폰즈")).toBe("를");
  });

  it("한글이 전혀 없으면 fallback '를'", () => {
    expect(getEulReulParticle("Holi.ky")).toBe("를");
    expect(getEulReulParticle("")).toBe("를");
  });
});

describe("normalizeEulReulInText", () => {
  it("받침 없는 단어 뒤의 잘못된 '을'을 '를'로 교정", () => {
    const before = "이리(시라코) 폰즈을, 캐롯 오렌지 버터 소스을 추천한다.";
    const after = "이리(시라코) 폰즈를, 캐롯 오렌지 버터 소스를 추천한다.";
    expect(normalizeEulReulInText(before)).toBe(after);
  });

  it("받침 있는 단어 뒤의 잘못된 '를'을 '을'로 교정", () => {
    expect(normalizeEulReulInText("어리굴젓를 선택")).toBe("어리굴젓을 선택");
    expect(normalizeEulReulInText("미역국를 끓인다.")).toBe("미역국을 끓인다.");
  });

  it("이미 맞게 박힌 조사는 그대로 (자기교정)", () => {
    const correct =
      "문어미역초무침을 곁들이면 폰즈를 곁들인 대구를 부드럽게 받쳐준다.";
    expect(normalizeEulReulInText(correct)).toBe(correct);
  });

  it("동사 어미 '잡을', '먹을' 같은 케이스는 변형 없음 (받침 있어 '을' 그대로)", () => {
    expect(normalizeEulReulInText("잡을 수 있다")).toBe("잡을 수 있다");
    expect(normalizeEulReulInText("먹을 만하다")).toBe("먹을 만하다");
  });

  it("한글이 전혀 없는 단어 뒤 조사는 건드리지 않음", () => {
    expect(normalizeEulReulInText("Holi.ky를 본다")).toBe("Holi.ky를 본다");
  });

  it("문장 끝의 조사도 잡는다", () => {
    expect(normalizeEulReulInText("폰즈을")).toBe("폰즈를");
    expect(normalizeEulReulInText("어리굴젓를")).toBe("어리굴젓을");
  });

  it("일본어가 끝에 붙은 단어 + 한글 단어 + 잘못된 을", () => {
    const before = "おっくんの宅飲みグルメ · 수제 유자 폰즈을 곁들였다.";
    const after = "おっくんの宅飲みグルメ · 수제 유자 폰즈를 곁들였다.";
    expect(normalizeEulReulInText(before)).toBe(after);
  });
});
