/** @jest-environment node */

import {
  type PagesDependencies,
  runAdsensePagesCommand,
} from "../adsense-pages";
import {
  type AdsenseReportResponse,
  mapPageReport,
  normalizePageUrl,
  parsePagesArguments,
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
  networkCalls: { count: number };
  requestedPeriods: unknown[];
  stderr: string[];
  stdout: string[];
};

const createPagesFixture = (report: AdsenseReportResponse): PagesFixture => {
  const requestedPeriods: unknown[] = [];
  const stderr: string[] = [];
  const stdout: string[] = [];
  const networkCalls = { count: 0 };

  return {
    networkCalls,
    requestedPeriods,
    stderr,
    stdout,
    dependencies: {
      getAccessToken: async () => {
        networkCalls.count += 1;
        return "access-token";
      },
      listAccounts: async () => {
        networkCalls.count += 1;
        return ["accounts/pub-111"];
      },
      generateReport: async (_accessToken, _account, period) => {
        networkCalls.count += 1;
        requestedPeriods.push(period);
        return report;
      },
      stdout: (message) => stdout.push(message),
      stderr: (message) => stderr.push(message),
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

test("T-05: named range를 지정하면 기본 기간 대신 해당 기간을 요청합니다", async () => {
  const fixture = createPagesFixture(createReportResponse([]));

  await expect(
    runAdsensePagesCommand(["--range", "YEAR_TO_DATE"], fixture.dependencies)
  ).resolves.toBe(0);

  expect(fixture.requestedPeriods).toEqual([
    { kind: "named", value: "YEAR_TO_DATE" },
  ]);
});

test("T-06: custom period를 30일 제한 없이 정확한 inclusive 날짜로 요청합니다", async () => {
  const fixture = createPagesFixture(createReportResponse([]));

  await expect(
    runAdsensePagesCommand(
      ["--start", "2024-01-01", "--end", "2024-12-31"],
      fixture.dependencies
    )
  ).resolves.toBe(0);

  expect(fixture.requestedPeriods).toEqual([
    { kind: "custom", start: "2024-01-01", end: "2024-12-31" },
  ]);
});

test.each([
  [["--start", "2025-01-01"], "--end"],
  [["--start", "2025-02-30", "--end", "2025-03-01"], "2025-02-30"],
  [["--start", "2025-03-02", "--end", "2025-03-01"], "시작일"],
  [
    ["--range", "LAST_7_DAYS", "--start", "2025-03-01", "--end", "2025-03-02"],
    "함께",
  ],
])(
  "T-07: 잘못된 기간 %j은 API 요청 전에 거부됩니다",
  async (args, expectedMessage) => {
    const fixture = createPagesFixture(createReportResponse([]));

    await expect(
      runAdsensePagesCommand(args, fixture.dependencies)
    ).resolves.toBe(1);

    expect(fixture.networkCalls.count).toBe(0);
    expect(fixture.stderr.join("\n")).toContain(expectedMessage);
  }
);

test("T-08: JSON 출력은 동일한 report 계약과 모든 grouped page를 보존합니다", async () => {
  const fixture = createPagesFixture(
    createReportResponse(
      [
        pageRow("https://recipio.kr/recipes/a?from=x", "1.00", "10", "1"),
        pageRow("https://recipio.kr/recipes/a?from=y", "2.00", "20", "2"),
        pageRow("https://recipio.kr/search", "0.50", "5", "0"),
      ],
      ["Some rows were omitted"]
    )
  );

  await expect(
    runAdsensePagesCommand(["--json"], fixture.dependencies)
  ).resolves.toBe(0);

  expect(fixture.stdout).toHaveLength(1);
  const output = JSON.parse(fixture.stdout[0]) as {
    account: string;
    currency: string;
    groupedPageCount: number;
    isTruncated: boolean;
    pages: Array<{ sourceUrls: string[] }>;
    requestedPeriod: unknown;
    summary: { estimatedEarnings: string };
    warnings: string[];
  };
  expect(output).toMatchObject({
    account: "accounts/pub-111",
    requestedPeriod: { kind: "named", value: "LAST_30_DAYS" },
    currency: "KRW",
    groupedPageCount: 2,
    isTruncated: false,
    summary: { estimatedEarnings: "3.50" },
    warnings: ["Some rows were omitted"],
  });
  expect(output.pages[0].sourceUrls).toEqual([
    "https://recipio.kr/recipes/a?from=x",
    "https://recipio.kr/recipes/a?from=y",
  ]);
});

test.each([
  "TODAY",
  "YESTERDAY",
  "MONTH_TO_DATE",
  "YEAR_TO_DATE",
  "LAST_7_DAYS",
  "LAST_30_DAYS",
])("U-03: %s는 지원하는 named range입니다", (range) => {
  expect(parsePagesArguments(["--range", range]).period).toEqual({
    kind: "named",
    value: range,
  });
});

test("U-03: 지원하지 않는 named range는 API 요청 전에 거부됩니다", () => {
  expect(() => parsePagesArguments(["--range", "FOREVER"])).toThrow("FOREVER");
});
