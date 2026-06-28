import { TOTAL_RECIPE_COUNT } from "@/shared/config/constants/siteStats";

import {
  getOfficialProfileOverride,
  OFFICIAL_ACCOUNT_ID,
} from "../officialAccount";

describe("getOfficialProfileOverride", () => {
  it("returns the Japanese profile for the official account on ja", () => {
    const profile = getOfficialProfileOverride(OFFICIAL_ACCOUNT_ID, "ja");

    expect(profile?.nickname).toBe("レシピオ");
    expect(profile?.introduction).toContain("公式アカウント");
    expect(profile?.introduction).toContain(TOTAL_RECIPE_COUNT.ja);
  });

  it("returns the English profile for the official account on en", () => {
    const profile = getOfficialProfileOverride(OFFICIAL_ACCOUNT_ID, "en");

    expect(profile?.nickname).toBe("Recipio");
    expect(profile?.introduction).toContain("official Recipio account");
    expect(profile?.introduction).toContain(TOTAL_RECIPE_COUNT.en);
  });

  it("returns null on ko so the original data is used", () => {
    expect(getOfficialProfileOverride(OFFICIAL_ACCOUNT_ID, "ko")).toBeNull();
  });

  it("returns null for a non-official account", () => {
    expect(getOfficialProfileOverride("someOtherId", "ja")).toBeNull();
  });
});
