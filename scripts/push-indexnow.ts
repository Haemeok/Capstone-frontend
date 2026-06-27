import * as fs from "fs";
import * as path from "path";

const HOST = "www.recipio.kr";
const SITE_URL = "https://www.recipio.kr";
// 페이지네이션 필수: 파라미터 없이 호출하면 기본 5,000개만 옴 (전체는 page/size로 훑어야 함)
const SITEMAP_API = "https://api.recipio.kr/api/recipes/sitemap";
const FETCH_PAGE_SIZE = 10_000;
const MAX_FETCH_PAGES = 100; // 안전 상한 (현재 ~6페이지)

// 양쪽 엔드포인트에 직접 제출 (공식 FAQ 상 한 곳만 보내도 공유되지만, 직접 전송으로 확실히)
const ENDPOINTS = [
  { name: "naver", url: "https://searchadvisor.naver.com/indexnow" },
  { name: "bing", url: "https://www.bing.com/indexnow" },
] as const;

const CHUNK_SIZE = 10_000; // 공식 상한
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
  if (!fs.existsSync(STATE_PATH))
    return { lastPushedAt: null, lastPushedCount: 0 };
  return JSON.parse(fs.readFileSync(STATE_PATH, "utf-8")) as State;
};

const writeState = (s: State) => {
  fs.writeFileSync(STATE_PATH, JSON.stringify(s, null, 2), "utf-8");
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// page/size로 사이트맵 전체를 페이지네이션해 모은다 (마지막 페이지는 size 미만)
const fetchAllRecipes = async (): Promise<SitemapRecipe[]> => {
  const all: SitemapRecipe[] = [];
  for (let page = 0; page < MAX_FETCH_PAGES; page++) {
    const url = `${SITEMAP_API}?page=${page}&size=${FETCH_PAGE_SIZE}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error(
        `[fetch] page=${page} 실패: HTTP ${res.status} ${res.statusText}`
      );
      process.exit(1);
    }
    const batch = (await res.json()) as SitemapRecipe[];
    all.push(...batch);
    console.log(
      `[fetch] page=${page} → ${batch.length.toLocaleString()}개 (누적 ${all.length.toLocaleString()})`
    );
    if (batch.length < FETCH_PAGE_SIZE) break;
    if (page === MAX_FETCH_PAGES - 1) {
      console.warn(
        "[fetch] MAX_FETCH_PAGES 도달 — 더 있을 수 있으니 상한 확인 필요"
      );
    }
  }
  return all;
};

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
  console.log(
    `[state] lastPushedAt=${state.lastPushedAt ?? "(없음 → 풀백필)"}`
  );
  console.log(`[engines] ${ENDPOINTS.map((e) => e.name).join(", ")}`);

  console.log(`[fetch] ${SITEMAP_API} (page/size 페이지네이션)`);
  const recipes = await fetchAllRecipes();
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
  // 엔드포인트별로 "모든 청크 성공" 여부 추적
  const allChunksOk: Record<string, boolean> = Object.fromEntries(
    ENDPOINTS.map((e) => [e.name, true])
  );

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const body = JSON.stringify({
      host: HOST,
      key,
      keyLocation,
      urlList: chunk,
    });

    for (const ep of ENDPOINTS) {
      console.log(
        `[push ${i + 1}/${chunks.length}][${ep.name}] ${chunk.length.toLocaleString()}개 전송 중...`
      );
      try {
        const r = await fetch(ep.url, {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body,
        });
        const text = await r.text().catch(() => "");
        console.log(
          `[push ${i + 1}/${chunks.length}][${ep.name}] HTTP ${r.status} ${r.statusText}${
            text ? ` — ${text.slice(0, 200)}` : ""
          }`
        );
        if (r.status !== 200 && r.status !== 202) allChunksOk[ep.name] = false;
      } catch (err) {
        console.error(
          `[push ${i + 1}/${chunks.length}][${ep.name}] 네트워크 오류:`,
          err
        );
        allChunksOk[ep.name] = false;
      }
    }

    if (i < chunks.length - 1) {
      console.log(`[push] ${CHUNK_DELAY_MS / 1000}s 대기...`);
      await sleep(CHUNK_DELAY_MS);
    }
  }

  for (const ep of ENDPOINTS) {
    console.log(
      `[result][${ep.name}] ${allChunksOk[ep.name] ? "전체 성공" : "일부 실패"}`
    );
  }

  // 모든 엔드포인트가 전 청크 성공했을 때만 state 갱신 (실패 시 재실행으로 보강)
  if (ENDPOINTS.every((e) => allChunksOk[e.name])) {
    writeState({ lastPushedAt: startedAt, lastPushedCount: filtered.length });
    console.log(
      `[state] 갱신: lastPushedAt=${startedAt}, count=${filtered.length}`
    );
  } else {
    console.log(
      "[state] 일부 엔드포인트 실패 → state 갱신 생략. 응답 확인 후 재실행."
    );
  }

  console.log("[done] 완료.");
};

main().catch((e) => {
  console.error("[fatal]", e);
  process.exit(1);
});
