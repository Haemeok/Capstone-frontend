import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

import {
  type AdsenseReportResponse,
  type ReportPeriod,
} from "./adsense-report";

const ADSENSE_API = "https://adsense.googleapis.com/v2/";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

const OAuthClientSchema = z.object({
  installed: z.object({
    client_id: z.string().min(1),
    client_secret: z.string().min(1),
  }),
});

const OAuthTokenSchema = z.object({
  refresh_token: z.string().min(1),
});

const AccessTokenSchema = z.object({
  access_token: z.string().min(1),
});

const AccountsSchema = z.object({
  accounts: z.array(z.object({ name: z.string().min(1) })).default([]),
});

const AdsenseDateSchema = z.object({
  year: z.number().int(),
  month: z.number().int(),
  day: z.number().int(),
});

const AdsenseReportSchema = z.object({
  totalMatchedRows: z.string(),
  headers: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      currencyCode: z.string().optional(),
    })
  ),
  rows: z
    .array(
      z.object({
        cells: z.array(z.object({ value: z.string() })),
      })
    )
    .default([]),
  warnings: z.array(z.string()).default([]),
  startDate: AdsenseDateSchema,
  endDate: AdsenseDateSchema,
});

type AdsenseClientDependencies = {
  credentialDirectory: string;
  readFile: (filePath: string, encoding: BufferEncoding) => Promise<string>;
  fetch: typeof fetch;
};

export type AdsenseClient = {
  getAccessToken: () => Promise<string>;
  listAccounts: (accessToken: string) => Promise<string[]>;
  generateReport: (
    accessToken: string,
    account: string,
    period: ReportPeriod
  ) => Promise<AdsenseReportResponse>;
};

const parseJson = (raw: string, label: string): unknown => {
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`${label} JSON 형식이 올바르지 않습니다`);
  }
};

const displayPath = (directory: string, fileName: string): string =>
  `${directory.replaceAll("\\", "/").replace(/\/$/, "")}/${fileName}`;

const loadJsonFile = async (
  dependencies: AdsenseClientDependencies,
  fileName: string,
  label: string
): Promise<unknown> => {
  const filePath = path.join(dependencies.credentialDirectory, fileName);
  try {
    return parseJson(await dependencies.readFile(filePath, "utf8"), label);
  } catch (error) {
    if (error instanceof Error && error.message.includes("JSON 형식")) {
      throw error;
    }
    throw new Error(
      `${label} 파일이 없습니다: ${displayPath(
        dependencies.credentialDirectory,
        fileName
      )}`
    );
  }
};

const readGoogleErrorMessage = (data: unknown, status: number): string => {
  const parsed = z
    .object({
      error: z
        .union([z.string(), z.object({ message: z.string().optional() })])
        .optional(),
      error_description: z.string().optional(),
      message: z.string().optional(),
    })
    .safeParse(data);
  if (!parsed.success) return `Google API request failed (${status})`;
  if (typeof parsed.data.error === "string") return parsed.data.error;
  return (
    parsed.data.error?.message ??
    parsed.data.error_description ??
    parsed.data.message ??
    `Google API request failed (${status})`
  );
};

const fetchJson = async (
  dependencies: AdsenseClientDependencies,
  url: URL,
  init?: RequestInit
): Promise<unknown> => {
  const response = await dependencies.fetch(url, init);
  const raw = await response.text();
  const data = raw === "" ? {} : parseJson(raw, "Google API 응답");
  if (!response.ok) {
    throw new Error(readGoogleErrorMessage(data, response.status));
  }
  return data;
};

const appendDate = (
  params: URLSearchParams,
  prefix: "startDate" | "endDate",
  value: string
): void => {
  const [year, month, day] = value.split("-");
  params.set(`${prefix}.year`, String(Number(year)));
  params.set(`${prefix}.month`, String(Number(month)));
  params.set(`${prefix}.day`, String(Number(day)));
};

export const buildReportSearchParams = (
  period: ReportPeriod
): URLSearchParams => {
  const params = new URLSearchParams({
    limit: "100000",
    reportingTimeZone: "ACCOUNT_TIME_ZONE",
  });
  params.append("dimensions", "PAGE_URL");
  ["ESTIMATED_EARNINGS", "PAGE_VIEWS", "CLICKS"].forEach((metric) =>
    params.append("metrics", metric)
  );
  if (period.kind === "named") {
    params.set("dateRange", period.value);
    return params;
  }
  params.set("dateRange", "CUSTOM");
  appendDate(params, "startDate", period.start);
  appendDate(params, "endDate", period.end);
  return params;
};

const loadOAuthInputs = async (dependencies: AdsenseClientDependencies) => {
  const clientData = await loadJsonFile(
    dependencies,
    "client-secret.json",
    "OAuth client"
  );
  const tokenData = await loadJsonFile(
    dependencies,
    "token.json",
    "OAuth token"
  );
  const client = OAuthClientSchema.safeParse(clientData);
  if (!client.success) {
    throw new Error("OAuth client JSON 형식이 올바르지 않습니다");
  }
  const token = OAuthTokenSchema.safeParse(tokenData);
  if (!token.success) {
    throw new Error("OAuth token JSON 형식이 올바르지 않습니다");
  }
  return { client: client.data.installed, token: token.data };
};

const getAccessToken = async (
  dependencies: AdsenseClientDependencies
): Promise<string> => {
  const { client, token } = await loadOAuthInputs(dependencies);
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: client.client_id,
    client_secret: client.client_secret,
    refresh_token: token.refresh_token,
  });
  const data = await fetchJson(dependencies, new URL(TOKEN_ENDPOINT), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  return AccessTokenSchema.parse(data).access_token;
};

const listAccounts = async (
  dependencies: AdsenseClientDependencies,
  accessToken: string
): Promise<string[]> => {
  const data = await fetchJson(dependencies, new URL("accounts", ADSENSE_API), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return AccountsSchema.parse(data).accounts.map(({ name }) => name);
};

const generateReport = async (
  dependencies: AdsenseClientDependencies,
  accessToken: string,
  account: string,
  period: ReportPeriod
): Promise<AdsenseReportResponse> => {
  const url = new URL(`${account}/reports:generate`, ADSENSE_API);
  url.search = buildReportSearchParams(period).toString();
  const data = await fetchJson(dependencies, url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return AdsenseReportSchema.parse(data);
};

export const createAdsenseClient = (
  dependencies: AdsenseClientDependencies
): AdsenseClient => ({
  getAccessToken: () => getAccessToken(dependencies),
  listAccounts: (accessToken) => listAccounts(dependencies, accessToken),
  generateReport: (accessToken, account, period) =>
    generateReport(dependencies, accessToken, account, period),
});

export const createDefaultAdsenseClient = (): AdsenseClient =>
  createAdsenseClient({
    credentialDirectory: ".adsense",
    readFile,
    fetch,
  });

export const redactSensitive = (message: string): string =>
  message
    .replace(
      /Authorization\s*:?[ \t]*Bearer[ \t]+[^\s,;]+/gi,
      "Authorization: Bearer [REDACTED]"
    )
    .replace(
      /((?:client[_-]?secret|refresh[_-]?token|access[_-]?token)\s*[:=]\s*["']?)[^"'\s,;}]+/gi,
      "$1[REDACTED]"
    );
