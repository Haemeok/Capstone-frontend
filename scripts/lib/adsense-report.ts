export type NamedRange =
  | "TODAY"
  | "YESTERDAY"
  | "MONTH_TO_DATE"
  | "YEAR_TO_DATE"
  | "LAST_7_DAYS"
  | "LAST_30_DAYS";

export type ReportPeriod =
  | { kind: "named"; value: NamedRange }
  | { kind: "custom"; start: string; end: string };

type AdsenseHeader = {
  name: string;
  type: string;
  currencyCode?: string;
};

type AdsenseDate = {
  year: number;
  month: number;
  day: number;
};

type AdsenseRow = {
  cells: Array<{ value: string }>;
};

export type AdsenseReportResponse = {
  totalMatchedRows: string;
  headers: AdsenseHeader[];
  rows: AdsenseRow[];
  warnings: string[];
  startDate: AdsenseDate;
  endDate: AdsenseDate;
};

export type GroupedPage = {
  url: string;
  sourceUrls: string[];
  estimatedEarnings: string;
  pageViews: number;
  clicks: number;
  pageViewsRpm: string;
};

type PageReportSummary = {
  estimatedEarnings: string;
  pageViews: number;
  clicks: number;
  pageViewsRpm: string;
};

export type PageReport = {
  account: string;
  requestedPeriod: ReportPeriod;
  startDate: string;
  endDate: string;
  currency: string;
  rawPageRowCount: number;
  groupedPageCount: number;
  totalMatchedRows: number;
  isTruncated: boolean;
  summary: PageReportSummary;
  warnings: string[];
  pages: GroupedPage[];
};

type Decimal = {
  coefficient: bigint;
  scale: number;
};

type MutableGroupedPage = {
  url: string;
  sourceUrls: Set<string>;
  estimatedEarnings: Decimal;
  pageViews: number;
  clicks: number;
};

const TEN = 10n;
const RPM_SCALE = 6;

const pow10 = (exponent: number): bigint => TEN ** BigInt(exponent);

const parseDecimal = (value: string): Decimal => {
  const match = /^(-?)(\d+)(?:\.(\d+))?$/.exec(value);
  if (match === null) throw new Error(`Invalid decimal value: ${value}`);
  const fraction = match[3] ?? "";
  const sign = match[1] === "-" ? -1n : 1n;
  return {
    coefficient: sign * BigInt(`${match[2]}${fraction}`),
    scale: fraction.length,
  };
};

const addDecimal = (left: Decimal, right: Decimal): Decimal => {
  const scale = Math.max(left.scale, right.scale);
  return {
    coefficient:
      left.coefficient * pow10(scale - left.scale) +
      right.coefficient * pow10(scale - right.scale),
    scale,
  };
};

const compareDecimal = (left: Decimal, right: Decimal): number => {
  const difference = addDecimal(left, {
    coefficient: -right.coefficient,
    scale: right.scale,
  }).coefficient;
  return difference < 0n ? -1 : difference > 0n ? 1 : 0;
};

const formatDecimal = ({ coefficient, scale }: Decimal): string => {
  const isNegative = coefficient < 0n;
  const digits = (isNegative ? -coefficient : coefficient).toString();
  if (scale === 0) return `${isNegative ? "-" : ""}${digits}`;
  const padded = digits.padStart(scale + 1, "0");
  const whole = padded.slice(0, -scale);
  const fraction = padded.slice(-scale);
  return `${isNegative ? "-" : ""}${whole}.${fraction}`;
};

const calculateRpm = (earnings: Decimal, pageViews: number): Decimal => {
  if (pageViews === 0) return { coefficient: 0n, scale: RPM_SCALE };
  const coefficient =
    (earnings.coefficient * 1000n * pow10(RPM_SCALE)) /
    (BigInt(pageViews) * pow10(earnings.scale));
  return { coefficient, scale: RPM_SCALE };
};

const parseTally = (value: string, name: string): number => {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    throw new Error(`Invalid ${name} value: ${value}`);
  }
  return parsed;
};

const formatDate = ({ year, month, day }: AdsenseDate): string =>
  [year, String(month).padStart(2, "0"), String(day).padStart(2, "0")].join(
    "-"
  );

const getHeaderIndex = (headers: AdsenseHeader[], name: string): number => {
  const index = headers.findIndex((header) => header.name === name);
  if (index === -1) throw new Error(`Missing report header: ${name}`);
  return index;
};

export const normalizePageUrl = (rawUrl: string): string => {
  const url = new URL(rawUrl);
  url.search = "";
  url.hash = "";
  if (url.pathname !== "/") url.pathname = url.pathname.replace(/\/$/, "");
  return url.toString();
};

export const mapPageReport = (
  account: string,
  requestedPeriod: ReportPeriod,
  response: AdsenseReportResponse
): PageReport => {
  const pageUrlIndex = getHeaderIndex(response.headers, "PAGE_URL");
  const earningsIndex = getHeaderIndex(response.headers, "ESTIMATED_EARNINGS");
  const pageViewsIndex = getHeaderIndex(response.headers, "PAGE_VIEWS");
  const clicksIndex = getHeaderIndex(response.headers, "CLICKS");
  const groups = new Map<string, MutableGroupedPage>();

  response.rows.forEach(({ cells }) => {
    const sourceUrl = cells[pageUrlIndex]?.value;
    const earningsValue = cells[earningsIndex]?.value;
    const pageViewsValue = cells[pageViewsIndex]?.value;
    const clicksValue = cells[clicksIndex]?.value;
    if (
      sourceUrl === undefined ||
      earningsValue === undefined ||
      pageViewsValue === undefined ||
      clicksValue === undefined
    ) {
      throw new Error("Report row does not match its headers");
    }
    const url = normalizePageUrl(sourceUrl);
    const earnings = parseDecimal(earningsValue);
    const pageViews = parseTally(pageViewsValue, "PAGE_VIEWS");
    const clicks = parseTally(clicksValue, "CLICKS");
    const current = groups.get(url);
    if (current === undefined) {
      groups.set(url, {
        url,
        sourceUrls: new Set([sourceUrl]),
        estimatedEarnings: earnings,
        pageViews,
        clicks,
      });
      return;
    }
    current.sourceUrls.add(sourceUrl);
    current.estimatedEarnings = addDecimal(current.estimatedEarnings, earnings);
    current.pageViews += pageViews;
    current.clicks += clicks;
  });

  const mutablePages = [...groups.values()].sort((left, right) => {
    const earningsOrder = compareDecimal(
      right.estimatedEarnings,
      left.estimatedEarnings
    );
    return earningsOrder !== 0
      ? earningsOrder
      : left.url.localeCompare(right.url);
  });
  const pages = mutablePages.map<GroupedPage>((page) => ({
    url: page.url,
    sourceUrls: [...page.sourceUrls].sort(),
    estimatedEarnings: formatDecimal(page.estimatedEarnings),
    pageViews: page.pageViews,
    clicks: page.clicks,
    pageViewsRpm: formatDecimal(
      calculateRpm(page.estimatedEarnings, page.pageViews)
    ),
  }));
  const summaryValues = mutablePages.reduce(
    (summary, page) => ({
      estimatedEarnings: addDecimal(
        summary.estimatedEarnings,
        page.estimatedEarnings
      ),
      pageViews: summary.pageViews + page.pageViews,
      clicks: summary.clicks + page.clicks,
    }),
    {
      estimatedEarnings: { coefficient: 0n, scale: 0 },
      pageViews: 0,
      clicks: 0,
    }
  );
  const totalMatchedRows = parseTally(
    response.totalMatchedRows,
    "totalMatchedRows"
  );

  return {
    account,
    requestedPeriod,
    startDate: formatDate(response.startDate),
    endDate: formatDate(response.endDate),
    currency:
      response.headers[earningsIndex]?.currencyCode ?? "UNKNOWN_CURRENCY",
    rawPageRowCount: response.rows.length,
    groupedPageCount: pages.length,
    totalMatchedRows,
    isTruncated: totalMatchedRows > response.rows.length,
    summary: {
      estimatedEarnings: formatDecimal(summaryValues.estimatedEarnings),
      pageViews: summaryValues.pageViews,
      clicks: summaryValues.clicks,
      pageViewsRpm: formatDecimal(
        calculateRpm(summaryValues.estimatedEarnings, summaryValues.pageViews)
      ),
    },
    warnings: response.warnings,
    pages,
  };
};

export const renderHumanPageReport = (report: PageReport): string => {
  const lines = [
    `계정: ${report.account}`,
    `기간: ${report.startDate} ~ ${report.endDate}`,
    `통화: ${report.currency}`,
    `반환된 페이지 합계: ${report.summary.estimatedEarnings} ${report.currency}`,
    `페이지뷰: ${report.summary.pageViews}`,
    `클릭: ${report.summary.clicks}`,
    `페이지 RPM: ${report.summary.pageViewsRpm} ${report.currency}`,
    `페이지 행: ${report.rawPageRowCount}개 → ${report.groupedPageCount}개`,
  ];
  if (report.warnings.length > 0) {
    lines.push("경고:", ...report.warnings.map((warning) => `- ${warning}`));
  }
  lines.push(
    "페이지:",
    ...report.pages.map(
      (page) =>
        `${page.estimatedEarnings} ${report.currency} | ${page.pageViews} views | ${page.clicks} clicks | ${page.url}`
    )
  );
  return lines.join("\n");
};
