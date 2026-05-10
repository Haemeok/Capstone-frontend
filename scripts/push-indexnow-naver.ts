/**
 * Naver IndexNow 일괄 푸시 (수동 실행, 1~2주 주기)
 *
 * 사전 준비:
 *   1) 16진수 랜덤 key 생성 (예: node -e "console.log(require('crypto').randomBytes(16).toString('hex'))")
 *   2) public/{key}.txt 파일 생성, 내용은 key 한 줄
 *   3) .env.local 에 INDEXNOW_KEY={key} 추가
 *   4) Naver Search Advisor에서 https://www.recipio.kr 사이트 등록
 *
 * 실행:
 *   npx tsx scripts/push-indexnow-naver.ts
 *
 * 옵션:
 *   --all       state 무시하고 전체 풀백필
 *   --dry-run   요청 보내지 않고 카운트/샘플만 출력
 */

import * as fs from "fs";
import * as path from "path";

const HOST = "www.recipio.kr";
const SITE_URL = "https://www.recipio.kr";
const SITEMAP_API = "https://api.recipio.kr/api/recipes/sitemap";
const INDEXNOW_ENDPOINT = "https://searchadvisor.naver.com/indexnow";
const CHUNK_SIZE = 10_000;
const CHUNK_DELAY_MS = 10_000;
const STATE_PATH = path.resolve(process.cwd(), ".indexnow-state.json");

type SitemapRecipe = { id: string; updatedAt: string };
type State = { lastPushedAt: string | null; lastPushedCount: number };

const argAll = process.argv.includes("--all");
const argDry = process.argv.includes("--dry-run");

// .env.local 단순 로더 (KEY=VALUE 줄만)
const loadEnvLocal = () => {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf-8").split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
    }
  }
};

const readState = (): State => {
  if (!fs.existsSync(STATE_PATH)) return { lastPushedAt: null, lastPushedCount: 0 };
  return JSON.parse(fs.readFileSync(STATE_PATH, "utf-8")) as State;
};

const writeState = (s: State) => {
  fs.writeFileSync(STATE_PATH, JSON.stringify(s, null, 2), "utf-8");
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const main = async () => {
  loadEnvLocal();

  const key = process.env.INDEXNOW_KEY;
  if (!key || !/^[a-fA-F0-9-]{8,128}$/.test(key)) {
    console.error(
      "INDEXNOW_KEY 가 비었거나 형식이 잘못됨. 16진수 + dash, 8~128자."
    );
    process.exit(1);
  }

  const state = argAll
    ? { lastPushedAt: null, lastPushedCount: 0 }
    : readState();
  console.log(`[state] lastPushedAt=${state.lastPushedAt ?? "(없음 → 풀백필)"}`);

  console.log(`[fetch] ${SITEMAP_API}`);
  const res = await fetch(SITEMAP_API);
  if (!res.ok) {
    console.error(`[fetch] 실패: HTTP ${res.status} ${res.statusText}`);
    process.exit(1);
  }
  const recipes = (await res.json()) as SitemapRecipe[];
  console.log(`[fetch] 총 ${recipes.length.toLocaleString()}개 레시피`);

  const lastTs = state.lastPushedAt ? Date.parse(state.lastPushedAt) : 0;
  const filtered =
    lastTs === 0
      ? recipes
      : recipes.filter((r) => Date.parse(r.updatedAt) > lastTs);

  console.log(
    `[filter] push 대상: ${filtered.length.toLocaleString()}개${
      lastTs ? ` (${state.lastPushedAt} 이후 변경분)` : " (풀백필)"
    }`
  );

  if (filtered.length === 0) {
    console.log("[done] push 할 URL 없음. 종료.");
    return;
  }

  const urls = filtered.map((r) => `${SITE_URL}/recipes/${r.id}`);
  const chunks: string[][] = [];
  for (let i = 0; i < urls.length; i += CHUNK_SIZE) {
    chunks.push(urls.slice(i, i + CHUNK_SIZE));
  }
  console.log(
    `[chunk] ${chunks.length}개 청크 (각 최대 ${CHUNK_SIZE.toLocaleString()})`
  );

  if (argDry) {
    console.log(`[dry-run] 첫 3개 URL: ${urls.slice(0, 3).join(", ")}`);
    console.log("[dry-run] 요청 보내지 않고 종료.");
    return;
  }

  const startedAt = new Date().toISOString();
  const keyLocation = `${SITE_URL}/${key}.txt`;
  let okCount = 0;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const body = { host: HOST, key, keyLocation, urlList: chunk };

    console.log(
      `[push ${i + 1}/${chunks.length}] ${chunk.length.toLocaleString()}개 전송 중...`
    );
    const r = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    const text = await r.text().catch(() => "");
    console.log(
      `[push ${i + 1}/${chunks.length}] HTTP ${r.status} ${r.statusText}${
        text ? ` — ${text.slice(0, 200)}` : ""
      }`
    );
    if (r.status === 200 || r.status === 202) okCount++;

    if (i < chunks.length - 1) {
      console.log(`[push] ${CHUNK_DELAY_MS / 1000}s 대기...`);
      await sleep(CHUNK_DELAY_MS);
    }
  }

  if (okCount === chunks.length) {
    writeState({ lastPushedAt: startedAt, lastPushedCount: filtered.length });
    console.log(
      `[state] 갱신: lastPushedAt=${startedAt}, count=${filtered.length}`
    );
  } else {
    console.log(
      `[state] 일부 청크 실패(${okCount}/${chunks.length}) → state 갱신 생략. 응답 확인 후 재실행.`
    );
  }

  console.log(`[done] ${okCount}/${chunks.length} 청크 성공.`);
};

main().catch((e) => {
  console.error("[fatal]", e);
  process.exit(1);
});
