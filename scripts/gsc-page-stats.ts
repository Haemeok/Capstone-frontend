import { getAccessToken, inspectUrl, runPool } from "./lib/gsc";

const PROPERTY = "sc-domain:recipio.kr";
const API = "https://searchconsole.googleapis.com/webmasters/v3/sites";

const arg = (name: string, fallback: string) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

type Row = {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

const query = async (token: string, body: Record<string, unknown>) => {
  const res = await fetch(
    `${API}/${encodeURIComponent(PROPERTY)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return ((await res.json()).rows ?? []) as Row[];
};

const main = async () => {
  const startDate = arg("start", "2026-07-01");
  const endDate = arg("end", "2026-08-01");
  const token = await getAccessToken();

  const pages = await query(token, {
    startDate,
    endDate,
    dimensions: ["page"],
    rowLimit: 25000,
    dataState: "all",
  });

  const bucket = (url: string) => {
    const p = new URL(url).pathname;
    if (/^\/(en|ja)\//.test(p)) return "locale(en/ja)";
    if (p.startsWith("/recipes/")) return "레시피 상세";
    if (p.startsWith("/search/results")) return "검색결과 페이지";
    if (p.startsWith("/ingredients")) return "재료";
    return "기타";
  };

  const agg: Record<
    string,
    { urls: number; impressions: number; clicks: number }
  > = {};
  for (const r of pages) {
    const k = bucket(r.keys[0]);
    agg[k] ??= { urls: 0, impressions: 0, clicks: 0 };
    agg[k].urls += 1;
    agg[k].impressions += r.impressions;
    agg[k].clicks += r.clicks;
  }

  console.log(`── ${startDate} ~ ${endDate} 구글 노출 페이지 ──`);
  console.log(`전체 노출 URL: ${pages.length.toLocaleString()}개\n`);
  for (const [k, v] of Object.entries(agg).sort(
    (a, b) => b[1].impressions - a[1].impressions
  )) {
    console.log(
      `${k.padEnd(16)} URL ${v.urls.toString().padStart(6)}  노출 ${v.impressions
        .toLocaleString()
        .padStart(9)}  클릭 ${v.clicks.toLocaleString().padStart(6)}`
    );
  }

  const recipes = pages.filter((r) => bucket(r.keys[0]) === "레시피 상세");
  console.log(`\n레시피 상세 상위 10개`);
  for (const r of recipes.slice(0, 10)) {
    console.log(
      `  노출 ${String(r.impressions).padStart(5)}  클릭 ${String(r.clicks).padStart(3)}  순위 ${r.position.toFixed(1).padStart(5)}  ${r.keys[0]}`
    );
  }

  const verify = Number(arg("verify", "0"));
  if (verify > 0) {
    console.log(`\n── 노출 상위 ${verify}개를 Inspection API로 교차검증 ──`);
    const targets = recipes.slice(0, verify).map((r) => r.keys[0]);
    const checked = await runPool(targets, 4, 120, async (url) => ({
      url,
      ...(await inspectUrl(token, PROPERTY, url)),
    }));
    for (const c of checked) {
      console.log(
        `  ${c.verdict === "PASS" ? "✓" : "✗"} ${c.url.split("/").pop()}  ${c.verdict ?? "?"}  ${c.coverageState ?? c.error?.slice(0, 60)}`
      );
    }
    const pass = checked.filter((c) => c.verdict === "PASS").length;
    console.log(`\n  PASS ${pass}/${checked.length}`);
  }
};

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
