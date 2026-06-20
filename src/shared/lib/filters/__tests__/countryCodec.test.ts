import { countryCodec } from "../codecs";

describe("countryCodec", () => {
  it("일본 라벨을 JP 코드로 인코딩한다", () => {
    expect(countryCodec.encode(["일본"])).toBe("JP");
  });

  it("미국 라벨을 US 코드로 인코딩한다", () => {
    expect(countryCodec.encode(["미국"])).toBe("US");
  });

  it("US 코드를 미국 라벨로 디코딩한다", () => {
    expect(countryCodec.decode("US")).toEqual(["미국"]);
  });

  it("일본+기타를 OR 코드 문자열로 인코딩한다", () => {
    expect(countryCodec.encode(["일본", "기타"])).toBe("JP,OTHER");
  });

  it("빈 선택은 null로 인코딩한다", () => {
    expect(countryCodec.encode([])).toBeNull();
  });

  it("JP 코드를 일본 라벨로 디코딩한다", () => {
    expect(countryCodec.decode("JP")).toEqual(["일본"]);
  });

  it("JP,OTHER를 일본+기타로 디코딩한다", () => {
    expect(countryCodec.decode("JP,OTHER")).toEqual(["일본", "기타"]);
  });

  it("null은 빈 배열로 디코딩한다", () => {
    expect(countryCodec.decode(null)).toEqual([]);
  });
});
