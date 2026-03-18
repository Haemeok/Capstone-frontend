/**
 * 네이버 DataLab API 연동 — 키워드 검색 트렌드 수집
 *
 * 실행: npx tsx scripts/seo-trend-naver.ts
 *
 * 환경변수 필요:
 *   NAVER_CLIENT_ID — 네이버 개발자센터 애플리케이션 Client ID
 *   NAVER_CLIENT_SECRET — 네이버 개발자센터 애플리케이션 Client Secret
 *
 * API 문서: https://developers.naver.com/docs/serviceapi/datalab/search/search.md
 * 제한: 일 1,000회, 요청당 최대 5개 키워드 그룹
 */

import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.resolve(process.cwd(), "data");
const AUDIT_PATH = path.join(DATA_DIR, "seo-audit-latest.json");
const today = new Date().toISOString().split("T")[0];
const OUTPUT_PATH = path.join(DATA_DIR, `seo-trend-naver-${today}.json`);

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

const API_URL = "https://openapi.naver.com/v1/datalab/search";

// 한 번에 5개 키워드 그룹까지 비교 가능
const BATCH_SIZE = 5;
const DELAY_MS = 200;

// ── 타입 ──

type NaverTrendRequest = {
  startDate: string;
  endDate: string;
  timeUnit: "date" | "week" | "month";
  keywordGroups: Array<{
    groupName: string;
    keywords: string[];
  }>;
};

type NaverTrendResult = {
  title: string;
  keywords: string[];
  data: Array<{ period: string; ratio: number }>;
};

type NaverTrendResponse = {
  startDate: string;
  endDate: string;
  timeUnit: string;
  results: NaverTrendResult[];
};

type TrendKeyword = {
  keyword: string;
  relativeVolume: number;
  trend: "rising" | "stable" | "declining";
  trendScore: number;
};

// ── API 호출 ──

const fetchTrend = async (
  keywordGroups: Array<{ groupName: string; keywords: string[] }>
): Promise<NaverTrendResult[]> => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const body: NaverTrendRequest = {
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
    timeUnit: "week",
    keywordGroups,
  };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Naver-Client-Id": NAVER_CLIENT_ID!,
      "X-Naver-Client-Secret": NAVER_CLIENT_SECRET!,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Naver API ${res.status}: ${text}`);
  }

  const data: NaverTrendResponse = await res.json();
  return data.results;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// 최근 4주간 평균 ratio → relativeVolume
const calcRelativeVolume = (data: Array<{ ratio: number }>): number => {
  if (data.length === 0) return 0;
  const sum = data.reduce((a, b) => a + b.ratio, 0);
  return Math.round((sum / data.length) * 10) / 10;
};

// 트렌드 방향: 최근 2주 vs 이전 2주 비교
const calcTrendDirection = (
  data: Array<{ ratio: number }>
): "rising" | "stable" | "declining" => {
  if (data.length < 4) return "stable";
  const recent = data.slice(-2).reduce((a, b) => a + b.ratio, 0) / 2;
  const prev = data.slice(-4, -2).reduce((a, b) => a + b.ratio, 0) / 2;
  const change = prev > 0 ? (recent - prev) / prev : 0;
  if (change > 0.15) return "rising";
  if (change < -0.15) return "declining";
  return "stable";
};

// ── 메인 ──

const main = async () => {
  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
    console.error(
      "환경변수 NAVER_CLIENT_ID, NAVER_CLIENT_SECRET 이 필요합니다.\n" +
        "https://developers.naver.com 에서 애플리케이션 등록 후 설정하세요.\n\n" +
        "예: NAVER_CLIENT_ID=xxx NAVER_CLIENT_SECRET=yyy npx tsx scripts/seo-trend-naver.ts"
    );
    process.exit(1);
  }

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // 감사 데이터에서 대표 키워드 추출
  let keywords: string[] = [];

  if (fs.existsSync(AUDIT_PATH)) {
    const audit = JSON.parse(fs.readFileSync(AUDIT_PATH, "utf-8"));
    // ACTIVE 텍스트 키워드 중 상위 결과 수 기준 100개
    const textPages = audit.pages
      .filter((p: any) => p.category === "A_TEXT_KEYWORD" && p.status === "ACTIVE")
      .sort((a: any, b: any) => b.resultCount - a.resultCount)
      .slice(0, 100);

    keywords = textPages.map((p: any) => String(p.params.q));
  } else {
    // 감사 데이터 없으면 기본 키워드
    keywords = [
      "김치찌개", "된장찌개", "볶음밥", "파스타", "닭가슴살",
      "다이어트 레시피", "에어프라이어", "혼밥", "야식", "도시락",
      "삼겹살 구이", "불고기", "잡채", "떡볶이", "라면",
      "샐러드", "스테이크", "카레", "냉면", "비빔밥",
    ];
  }

  console.log(`검색 트렌드 조회: ${keywords.length}개 키워드`);

  const results: TrendKeyword[] = [];
  let apiCalls = 0;

  // BATCH_SIZE(5개)씩 묶어서 API 호출
  for (let i = 0; i < keywords.length; i += BATCH_SIZE) {
    const batch = keywords.slice(i, i + BATCH_SIZE);
    const groups = batch.map((kw) => ({
      groupName: kw,
      keywords: [kw.includes("레시피") ? kw : `${kw} 레시피`],
    }));

    try {
      const trendResults = await fetchTrend(groups);
      apiCalls++;

      for (const result of trendResults) {
        const volume = calcRelativeVolume(result.data);
        const direction = calcTrendDirection(result.data);

        let trendScore = Math.round(volume * 0.3);
        if (direction === "rising") trendScore = Math.min(trendScore + 5, 30);
        if (direction === "declining") trendScore = Math.max(trendScore - 5, 0);

        results.push({
          keyword: result.title,
          relativeVolume: volume,
          trend: direction,
          trendScore,
        });
      }

      process.stdout.write(
        `\r[${Math.min(i + BATCH_SIZE, keywords.length)}/${keywords.length}] API calls: ${apiCalls}`
      );
    } catch (err) {
      console.error(`\n배치 ${i}-${i + BATCH_SIZE} 실패:`, err);
    }

    if (i + BATCH_SIZE < keywords.length) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`\n\n완료: ${results.length}개 키워드 트렌드 수집 (API ${apiCalls}회)`);

  // 분류
  const rising = results.filter((r) => r.trend === "rising").sort((a, b) => b.relativeVolume - a.relativeVolume);
  const declining = results.filter((r) => r.trend === "declining").sort((a, b) => b.relativeVolume - a.relativeVolume);
  const topVolume = [...results].sort((a, b) => b.relativeVolume - a.relativeVolume).slice(0, 20);

  // 저장
  const output = {
    generatedAt: new Date().toISOString(),
    period: `${new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0]}~${today}`,
    apiCalls,
    totalKeywords: results.length,
    keywords: results.sort((a, b) => b.trendScore - a.trendScore),
    rising: rising.map((r) => r.keyword),
    declining: declining.map((r) => r.keyword),
    topVolume: topVolume.map((r) => ({ keyword: r.keyword, volume: r.relativeVolume })),
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");
  console.log(`저장: ${OUTPUT_PATH}`);

  // 요약
  console.log("\n=== 상승 트렌드 키워드 ===");
  rising.slice(0, 10).forEach((r) =>
    console.log(`  ↑ ${r.keyword}: ${r.relativeVolume} (score: ${r.trendScore})`)
  );

  console.log("\n=== 하락 트렌드 키워드 ===");
  declining.slice(0, 10).forEach((r) =>
    console.log(`  ↓ ${r.keyword}: ${r.relativeVolume} (score: ${r.trendScore})`)
  );

  console.log("\n=== 검색량 상위 ===");
  topVolume.slice(0, 10).forEach((r) =>
    console.log(`  ${r.keyword}: ${r.relativeVolume}`)
  );
};

main().catch((err) => {
  console.error("트렌드 수집 실패:", err);
  process.exit(1);
});
