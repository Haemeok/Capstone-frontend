import { resolveLocaleHome } from "../resolveLocaleHome";

describe("resolveLocaleHome (T-30)", () => {
  it("ko → '/'", () => {
    expect(resolveLocaleHome("ko")).toBe("/");
  });

  it("ja → '/ja'", () => {
    expect(resolveLocaleHome("ja")).toBe("/ja");
  });

  it("en → '/en'", () => {
    expect(resolveLocaleHome("en")).toBe("/en");
  });
});
