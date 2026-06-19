import { getCreatorCountryFlag } from "../getCreatorCountryFlag";

describe("getCreatorCountryFlag", () => {
  it("KR은 국기를 노출하지 않는다", () => {
    expect(getCreatorCountryFlag("KR")).toBeNull();
  });

  it("JP는 일본 국기 variant를 반환한다", () => {
    expect(getCreatorCountryFlag("JP")).toEqual({
      variant: "jp",
      label: "일본 채널",
    });
  });

  it("OTHER는 globe variant를 반환한다", () => {
    expect(getCreatorCountryFlag("OTHER")).toEqual({
      variant: "globe",
      label: "해외 채널",
    });
  });

  it("null/undefined는 국기를 노출하지 않는다", () => {
    expect(getCreatorCountryFlag(null)).toBeNull();
    expect(getCreatorCountryFlag(undefined)).toBeNull();
  });

  it("US는 미국 채널 variant를 반환한다 (T-A1)", () => {
    expect(getCreatorCountryFlag("US")).toEqual({
      variant: "us",
      label: "미국 채널",
    });
  });
});
