import {
  cookingHelpMessages,
  cookingUnitsMessages,
  smartAppBannerMessages,
} from "..";
import { getDictionary } from "../getDictionary";
import { findHangulInDict } from "../testing/staticScan";

it("T-09: ja 사전 전 namespace에 한국어가 없다", () => {
  expect(findHangulInDict(getDictionary("ja"))).toEqual([]);
});

it("T-09: en 사전 전 namespace에 한국어가 없다", () => {
  expect(findHangulInDict(getDictionary("en"))).toEqual([]);
});

it("T-09: smartAppBanner ja/en에 한국어가 없다", () => {
  expect(findHangulInDict(smartAppBannerMessages.ja)).toEqual([]);
  expect(findHangulInDict(smartAppBannerMessages.en)).toEqual([]);
});

it("T-09: cookingUnits ja/en에 한국어가 없다", () => {
  expect(findHangulInDict(cookingUnitsMessages.ja)).toEqual([]);
  expect(findHangulInDict(cookingUnitsMessages.en)).toEqual([]);
});

it("T-03: cookingHelp ja/en에 한국어가 없다", () => {
  expect(findHangulInDict(cookingHelpMessages.ja)).toEqual([]);
  expect(findHangulInDict(cookingHelpMessages.en)).toEqual([]);
});
