/**
 * Google Search Console API 연동 — 실제 검색 성과 데이터 수집
 *
 * 실행: npx tsx scripts/seo-trend-gsc.ts
 *
 * 환경변수 필요:
 *   GOOGLE_SERVICE_ACCOUNT_KEY_PATH — 서비스 계정 JSON 키 파일 경로
 *
 * 설정 방법:
 *   1. Google Cloud Console → API 라이브러리 → Search Console API 활성화
 *   2. 서비스 계정 생성 → JSON 키 다운로드
 *   3. Search Console → 설정 → 사용자 → 서비스 계정 이메일 추가 (전체 권한)
 *   4. GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./gsc-key.json npx tsx scripts/seo-trend-gsc.ts
 */

import * as fs from "fs";
import * as path from "path";
import { DATA_DIR, today } from "./lib/seo-constants";
import { classifyCategory } from "./lib/seo-utils";

const OUTPUT_PATH = path.join(DATA_DIR, `seo-trend-gsc-${today()}.json`);

const KEY_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH;
const SITE_URL = "https://www.recipio.kr";
const GSC_API = "https://searchconsole.googleapis.com/webmasters/v3";

// ── Google Auth (서비스 계정 JWT) ──

const createJwt = async (
  serviceAccount: { client_email: string; private_key: string }
): Promise<string> => {
  // JWT 수동 생성 (외부 라이브러리 없이)
  const header = Buffer.from(
    JSON.stringify({ alg: "RS256", typ: "JWT" })
  ).toString("base64url");

  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(
    JSON.stringify({
      iss: serviceAccount.client_email,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  ).toString("base64url");

  const crypto = await import("crypto");
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(`${header}.${payload}`);
  const signature = sign.sign(serviceAccount.private_key, "base64url");

  return `${header}.${payload}.${signature}`;
};

const getAccessToken = async (
  serviceAccount: { client_email: string; private_key: string }
): Promise<string> => {
  const jwt = await createJwt(serviceAccount);

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Auth failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.access_token;
};

// ── GSC API 호출 ──

type GscRow = {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

const queryGsc = async (
  accessToken: string,
  body: Record<string, unknown>
): Promise<GscRow[]> => {
  const encodedSite = encodeURIComponent(SITE_URL);
  const res = await fetch(
    `${GSC_API}/sites/${encodedSite}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GSC API ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.rows || [];
};

// ── 메인 ──

const main = async () => {
  if (!KEY_PATH) {
    console.error(
      "환경변수 GOOGLE_SERVICE_ACCOUNT_KEY_PATH 가 필요합니다.\n\n" +
        "설정 방법:\n" +
        "  1. Google Cloud Console → API 라이브러리 → Search Console API 활성화\n" +
        "  2. 서비스 계정 생성 → JSON 키 다운로드\n" +
        "  3. Search Console → 설정 → 사용자 → 서비스 계정 이메일 추가\n" +
        "  4. GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./gsc-key.json npx tsx scripts/seo-trend-gsc.ts"
    );
    process.exit(1);
  }

  if (!fs.existsSync(KEY_PATH)) {
    console.error(`키 파일을 찾을 수 없습니다: ${KEY_PATH}`);
    process.exit(1);
  }

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const serviceAccount = JSON.parse(fs.readFileSync(KEY_PATH, "utf-8"));
  console.log(`서비스 계정: ${serviceAccount.client_email}`);

  const accessToken = await getAccessToken(serviceAccount);
  console.log("인증 성공\n");

  const endDate = today();
  const startDate = new Date(Date.now() - 30 * 86400000)
    .toISOString()
    .split("T")[0];

  // ── 1. 기회 키워드 (높은 노출, 낮은 CTR) ──
  console.log("=== 기회 키워드 수집 ===");
  const queryRows = await queryGsc(accessToken, {
    startDate,
    endDate,
    dimensions: ["query"],
    rowLimit: 1000,
    dimensionFilterGroups: [
      {
        filters: [
          {
            dimension: "page",
            operator: "contains",
            expression: "/search/results",
          },
        ],
      },
    ],
  });

  const opportunityKeywords = queryRows
    .filter((r) => r.impressions > 50 && r.ctr < 0.03 && r.position > 10)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 50)
    .map((r) => ({
      query: r.keys[0],
      impressions: r.impressions,
      clicks: r.clicks,
      ctr: Math.round(r.ctr * 10000) / 100,
      position: Math.round(r.position * 10) / 10,
    }));

  console.log(`  기회 키워드: ${opportunityKeywords.length}개`);

  // ── 2. 페이지별 성과 (검색 결과 페이지) ──
  console.log("=== 페이지별 성과 수집 ===");
  const pageRows = await queryGsc(accessToken, {
    startDate,
    endDate,
    dimensions: ["page"],
    rowLimit: 5000,
    dimensionFilterGroups: [
      {
        filters: [
          {
            dimension: "page",
            operator: "contains",
            expression: "/search/results",
          },
        ],
      },
    ],
  });

  const topPages = pageRows
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 100)
    .map((r) => ({
      url: r.keys[0].replace(SITE_URL, ""),
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: Math.round(r.ctr * 10000) / 100,
      position: Math.round(r.position * 10) / 10,
    }));

  console.log(`  성과 페이지: ${topPages.length}개`);

  // ── 3. 카테고리별 ROI (URL 패턴 기반) ──
  const categoryROI: Record<
    string,
    { totalClicks: number; totalImpressions: number; avgCTR: number; pageCount: number }
  > = {};

  for (const row of pageRows) {
    const url = row.keys[0];
    const queryString = url.includes("?") ? url.split("?")[1] : "";
    const urlParams = Object.fromEntries(new URLSearchParams(queryString).entries());
    const cat = classifyCategory(urlParams);

    if (!categoryROI[cat]) {
      categoryROI[cat] = { totalClicks: 0, totalImpressions: 0, avgCTR: 0, pageCount: 0 };
    }
    categoryROI[cat].totalClicks += row.clicks;
    categoryROI[cat].totalImpressions += row.impressions;
    categoryROI[cat].pageCount++;
  }

  for (const cat of Object.values(categoryROI)) {
    cat.avgCTR =
      cat.totalImpressions > 0
        ? Math.round((cat.totalClicks / cat.totalImpressions) * 10000) / 100
        : 0;
  }

  // ── 4. 전체 검색 결과 페이지 통계 ──
  const totalClicks = pageRows.reduce((sum, r) => sum + r.clicks, 0);
  const totalImpressions = pageRows.reduce((sum, r) => sum + r.impressions, 0);

  // ── 저장 ──
  const output = {
    generatedAt: new Date().toISOString(),
    period: `${startDate}~${endDate}`,
    overall: {
      totalPages: pageRows.length,
      totalClicks,
      totalImpressions,
      avgCTR:
        totalImpressions > 0
          ? Math.round((totalClicks / totalImpressions) * 10000) / 100
          : 0,
    },
    opportunityKeywords,
    topPerformingPages: topPages.slice(0, 30),
    categoryROI,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");
  console.log(`\n저장: ${OUTPUT_PATH}`);

  // 요약
  console.log("\n=== 전체 요약 ===");
  console.log(`  검색 결과 페이지: ${pageRows.length}개`);
  console.log(`  총 클릭: ${totalClicks}`);
  console.log(`  총 노출: ${totalImpressions}`);
  console.log(`  평균 CTR: ${output.overall.avgCTR}%`);

  console.log("\n=== 기회 키워드 (상위 10) ===");
  opportunityKeywords.slice(0, 10).forEach((k) =>
    console.log(`  "${k.query}": 노출 ${k.impressions}, 클릭 ${k.clicks}, 순위 ${k.position}`)
  );

  console.log("\n=== 카테고리별 ROI ===");
  for (const [cat, roi] of Object.entries(categoryROI).sort(
    ([, a], [, b]) => b.totalClicks - a.totalClicks
  )) {
    console.log(
      `  ${cat}: 클릭 ${roi.totalClicks}, 노출 ${roi.totalImpressions}, CTR ${roi.avgCTR}%, 페이지 ${roi.pageCount}개`
    );
  }
};

main().catch((err) => {
  console.error("GSC 데이터 수집 실패:", err);
  process.exit(1);
});
