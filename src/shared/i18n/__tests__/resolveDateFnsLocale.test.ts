import { enUS, ja, ko } from "date-fns/locale";

import { resolveDateFnsLocale } from "../resolveDateFnsLocale";

test("T-18 maps locale to date-fns locale", () => {
  expect(resolveDateFnsLocale("ko")).toBe(ko);
  expect(resolveDateFnsLocale("ja")).toBe(ja);
  expect(resolveDateFnsLocale("en")).toBe(enUS);
});
