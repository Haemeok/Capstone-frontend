import { getDictionary } from "../getDictionary";
import { findHangulInDict } from "../testing/staticScan";

it("T-09: ja 사전 전 namespace에 한국어가 없다", () => {
  expect(findHangulInDict(getDictionary("ja"))).toEqual([]);
});

it("T-09: en 사전 전 namespace에 한국어가 없다", () => {
  expect(findHangulInDict(getDictionary("en"))).toEqual([]);
});
