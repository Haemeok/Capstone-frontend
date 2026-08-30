/** @jest-environment node */

import {
  type PagesDependencies,
  runAdsensePagesCommand,
} from "../adsense-pages";
import {
  type AdsenseReportResponse,
  mapPageReport,
  normalizePageUrl,
} from "../lib/adsense-report";

const pageRow = (
  url: string,
  estimatedEarnings: string,
  pageViews: string,
  clicks: string
) => ({
  cells: [url, estimatedEarnings, pageViews, clicks].map((value) => ({
    value,
  })),
});

const createReportResponse = (
  rows: AdsenseReportResponse["rows"],
  warnings: string[] = []
): AdsenseReportResponse => ({
  totalMatchedRows: String(rows.length),
  headers: [
    { name: "PAGE_URL", type: "DIMENSION" },
    {
      name: "ESTIMATED_EARNINGS",
      type: "METRIC_CURRENCY",
      currencyCode: "KRW",
    },
    { name: "PAGE_VIEWS", type: "METRIC_TALLY" },
    { name: "CLICKS", type: "METRIC_TALLY" },
  ],
  rows,
  warnings,
  startDate: { year: 2026, month: 8, day: 1 },
  endDate: { year: 2026, month: 8, day: 30 },
});

type PagesFixture = {
  dependencies: PagesDependencies;
  requestedPeriods: unknown[];
  stdout: string[];
};

const createPagesFixture = (report: AdsenseReportResponse): PagesFixture => {
  const requestedPeriods: unknown[] = [];
  const stdout: string[] = [];

  return {
    requestedPeriods,
    stdout,
    dependencies: {
      getAccessToken: async () => "access-token",
      listAccounts: async () => ["accounts/pub-111"],
      generateReport: async (_accessToken, _account, period) => {
        requestedPeriods.push(period);
        return report;
      },
      stdout: (message) => stdout.push(message),
      stderr: () => undefined,
    },
  };
};

test("T-02: 기본 기간의 page row를 grouped page로 합쳐 수익순으로 보여줍니다", async () => {
  const fixture = createPagesFixture(
    createReportResponse(
      [
        pageRow(
          "https://recipio.kr/recipes/a?utm_source=x",
          "1.20",
          "100",
          "2"
        ),
        pageRow("https://recipio.kr/recipes/a/", "2.30", "200", "3"),
        pageRow("https://recipio.kr/", "0.50", "50", "1"),
      ],
      ["Some rows were omitted"]
    )
  );

  await expect(runAdsensePagesCommand([], fixture.dependencies)).resolves.toBe(
    0
  );

  expect(fixture.requestedPeriods).toEqual([
    { kind: "named", value: "LAST_30_DAYS" },
  ]);
  const output = fixture.stdout.join("\n");
  expect(output).toContain("4.00 KRW");
  expect(output).toContain("페이지뷰: 350");
  expect(output).toContain("클릭: 6");
  expect(output).toContain("Some rows were omitted");
  const lines = output.split("\n");
  const recipeIndex = lines.findIndex((line) =>
    line.endsWith("| https://recipio.kr/recipes/a")
  );
  const homeIndex = lines.findIndex((line) =>
    line.endsWith("| https://recipio.kr/")
  );
  expect(recipeIndex).toBeGreaterThan(-1);
  expect(homeIndex).toBeGreaterThan(-1);
  expect(recipeIndex).toBeLessThan(homeIndex);
});

test("U-01: query와 fragment만 다른 page row는 같은 grouped page입니다", () => {
  expect(normalizePageUrl("https://RECIPIO.kr/recipes/a/?x=1#top")).toBe(
    "https://recipio.kr/recipes/a"
  );
  expect(normalizePageUrl("https://recipio.kr/")).toBe("https://recipio.kr/");
  expect(normalizePageUrl("https://recipio.kr/recipes/a/comments")).not.toBe(
    "https://recipio.kr/recipes/a"
  );
});

test("U-02: returned-page total은 소수 수익을 정확히 더하고 weighted RPM을 계산합니다", () => {
  const report = mapPageReport(
    "accounts/pub-111",
    { kind: "named", value: "LAST_30_DAYS" },
    createReportResponse([
      pageRow("https://recipio.kr/a", "0.10", "0", "0"),
      pageRow("https://recipio.kr/b", "0.20", "1", "0"),
      pageRow("https://recipio.kr/c", "1234.567890", "999", "0"),
    ])
  );

  expect(report.summary.estimatedEarnings).toBe("1234.867890");
  expect(report.summary.pageViewsRpm).toBe("1234.867890");
});
