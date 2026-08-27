import { redirect } from "next/navigation";

import EnLegacyPage from "@/app/en/events/ad-free-june/page";
import JaLegacyPage from "@/app/ja/events/ad-free-june/page";

import KoLegacyPage from "./page";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("legacy ad-free-june routes", () => {
  it.each([
    ["ko", KoLegacyPage, "/events/ad-free-september"],
    ["en", EnLegacyPage, "/en/events/ad-free-september"],
    ["ja", JaLegacyPage, "/ja/events/ad-free-september"],
  ] as const)(
    "T-09: %s June 경로는 같은 locale의 September 경로로 이동한다",
    (_locale, Page, destination) => {
      Page();

      expect(redirect).toHaveBeenCalledWith(destination);
    }
  );
});
