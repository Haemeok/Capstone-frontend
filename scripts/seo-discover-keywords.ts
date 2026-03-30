/**
 * SEO 텍스트 키워드 대량 탐색 — 새로운 q 키워드를 생성 + API 검증 → allowlist 추가
 *
 * 실행: npx tsx scripts/seo-discover-keywords.ts
 *
 * 전략:
 *   1. 기존 searchKeywords.ts에 없는 새로운 조합 생성
 *   2. 롱테일 키워드 (3단어 조합)
 *   3. 트렌드/줄임말/신조어
 *   4. API 검증 → 8건 이상이면 allowlist에 즉시 추가
 */

import * as fs from "fs";
import * as path from "path";
import {
  CONCURRENCY, DELAY_MS, MIN_RESULTS, DATA_DIR, ALLOWLIST_PATH, today,
} from "./lib/seo-constants";
import {
  sleep, paramsToKey, fetchResultCount,
} from "./lib/seo-utils";

const LOG_PATH = path.join(DATA_DIR, `discover-keywords-log-${today()}.json`);

// ── 키워드 생성 엔진 ──

type TaggedKeyword = { keyword: string; strategy: string };

const generateNewKeywords = (): TaggedKeyword[] => {
  const keywords: TaggedKeyword[] = [];

  // ── 1. 재료 × 상황 × 요리법 (3단어 롱테일) ──
  const ingredients = [
    // 육류
    "닭가슴살", "닭고기", "닭다리", "닭날개", "닭안심",
    "소고기", "돼지고기", "삼겹살", "목살", "안심", "등심",
    "차돌박이", "우삼겹", "항정살", "갈비", "갈비살",
    "소불고기", "돼지불고기", "양고기", "오리고기",
    // 해산물
    "새우", "오징어", "낙지", "문어", "조개", "바지락", "홍합",
    "연어", "참치", "고등어", "갈치", "삼치", "대구", "명태",
    "꽃게", "전복", "굴", "미역", "다시마", "김",
    // 채소
    "양파", "감자", "고구마", "당근", "양배추", "브로콜리",
    "시금치", "콩나물", "애호박", "가지", "파프리카", "토마토",
    "무", "배추", "대파", "부추", "깻잎", "상추",
    "버섯", "팽이버섯", "새송이버섯", "표고버섯",
    "고추", "청양고추", "피망", "셀러리", "아스파라거스",
    "옥수수", "미나리", "쑥갓", "청경채", "비트",
    // 가공/기타
    "두부", "계란", "스팸", "베이컨", "소시지", "햄",
    "어묵", "만두", "떡", "김치", "치즈", "아보카도",
    "라면", "파스타면", "우동면", "쌀", "밥", "빵",
    "참치캔", "콘", "감자전분", "떡볶이떡",
    "크림치즈", "모짜렐라", "체다치즈",
    "닭가슴살통조림", "햄버거패티", "어묵바",
  ];

  const situations = [
    "다이어트", "혼밥", "야식", "도시락", "간식", "안주", "캠핑",
    "초간단", "자취", "브런치", "가성비", "초보", "건강", "든든한",
    "가벼운", "한끼", "간편", "뚝딱", "아이", "손님상",
    "3분", "5분", "10분", "15분", "30분",
    "피크닉", "홈파티", "술안주", "해장", "새벽",
    "직장인", "학생", "신혼", "비건", "저칼로리", "고단백",
  ];

  const methods = [
    "볶음", "구이", "조림", "찜", "튀김", "전", "무침", "샐러드",
    "볶음밥", "덮밥", "파스타", "카레", "스프", "죽",
    "샌드위치", "김밥", "토스트", "주먹밥", "비빔밥",
    "국", "찌개", "탕", "나물", "절임", "피클",
    "스테이크", "리조또", "그라탱", "타코", "부리또",
  ];

  // 재료 × 상황
  for (const ing of ingredients) {
    for (const sit of situations) {
      keywords.push({ keyword: `${sit} ${ing} 요리`, strategy: "ing_situation_method" });
      keywords.push({ keyword: `${sit} ${ing} 레시피`, strategy: "ing_situation_method" });
      keywords.push({ keyword: `${ing} ${sit}`, strategy: "ing_situation_method" });
    }
  }

  // 재료 × 요리법
  for (const ing of ingredients) {
    for (const method of methods) {
      keywords.push({ keyword: `${ing} ${method} 만들기`, strategy: "ing_situation_method" });
      keywords.push({ keyword: `간단 ${ing} ${method}`, strategy: "ing_situation_method" });
      keywords.push({ keyword: `${ing} ${method} 황금레시피`, strategy: "ing_situation_method" });
    }
  }

  // 상황 × 요리법
  for (const sit of situations) {
    for (const method of methods) {
      keywords.push({ keyword: `${sit} ${method} 레시피`, strategy: "ing_situation_method" });
    }
  }

  // ── 2. 트렌드/줄임말/신조어 ──
  const trending = [
    // SNS 유행
    "마약토스트", "마약계란", "마약옥수수", "마약김밥", "마약떡볶이",
    "크로플", "크룽지", "에그드랍", "로제떡볶이", "마라로제",
    "원팬파스타", "원팟파스타", "편스토랑 레시피", "나혼자산다 레시피",
    "전참시 레시피", "먹방 레시피", "유튜브 레시피",
    // 줄임말/신조어
    "닭볶탕", "떡볶", "치맥", "피맥", "소맥",
    "짜파구리", "불닭볶음면 레시피", "까눌레", "바스크치즈케이크",
    "당근케이크", "레몬케이크", "티라미수 만들기", "마카롱 만들기",
    // 건강 트렌드
    "키토식단", "저탄고지", "간헐적단식 식단", "벌크업 식단",
    "린매스업 식단", "체중감량 식단", "단백질 식단", "저염식",
    "당뇨식단", "고혈압 식단", "장건강 식단", "면역력 식단",
    "갱년기 식단", "성장기 식단", "수험생 간식", "임산부 식단",
    // 시간대
    "아침식사", "점심메뉴", "저녁메뉴", "새벽 야식", "주말 브런치",
    "평일 저녁 반찬", "월요일 메뉴", "주말 요리",
    // 인원/상황
    "1인분 요리", "2인분 요리", "4인분 요리", "대가족 요리",
    "냉장고 파먹기", "재료 소진 요리", "남은 밥 활용",
    "남은 치킨 활용", "남은 빵 활용", "남은 떡 활용",
    // 도구
    "에어프라이어 레시피", "전자레인지 요리", "밥솥 요리",
    "인덕션 요리", "후라이팬 하나로", "냄비 하나로",
    "오븐 없이 베이킹", "노오븐 디저트", "믹서기 레시피",
    // 가격
    "만원의행복", "오천원 저녁", "삼천원 한끼", "이천원 간식",
    "편의점 재료 요리", "마트 할인 재료 요리",
  ];
  keywords.push(...trending.map((kw) => ({ keyword: kw, strategy: "trending" })));

  // ── 3. 재료쌍 텍스트 ──
  const pairs = [
    "두부 김치", "삼겹살 김치", "닭가슴살 고구마", "닭가슴살 브로콜리",
    "계란 밥", "계란 김치", "감자 치즈", "파스타 새우", "아보카도 계란",
    "라면 계란", "떡볶이 계란", "스팸 김치", "스팸 계란", "어묵 대파",
    "소고기 무", "닭고기 감자", "돼지고기 양파", "연어 아보카도",
    "참치 밥", "베이컨 계란", "고구마 닭가슴살", "양배추 닭가슴살",
  ];
  for (const pair of pairs) {
    keywords.push({ keyword: `${pair} 요리`, strategy: "ingredient_pairs" });
    keywords.push({ keyword: `${pair} 레시피`, strategy: "ingredient_pairs" });
    keywords.push({ keyword: `${pair} 볶음`, strategy: "ingredient_pairs" });
    keywords.push({ keyword: `${pair} 덮밥`, strategy: "ingredient_pairs" });
  }

  // ── 4. "~없이" / "~대신" 패턴 ──
  const substitutions = [
    "밀가루 없이 전", "계란 없이 베이킹", "오븐 없이 빵",
    "설탕 없이 디저트", "버터 없이 쿠키", "우유 없이 크림",
    "밥 대신 두부", "면 대신 곤약", "빵 대신 요리",
    "라면 대신 건강면", "설탕 대신 스테비아",
  ];
  keywords.push(...substitutions.map((kw) => ({ keyword: kw, strategy: "substitution" })));

  // ── 5. "~로 만드는" 패턴 ──
  for (const ing of ingredients) {
    keywords.push({ keyword: `${ing}로 만드는 반찬`, strategy: "making_pattern" });
    keywords.push({ keyword: `${ing}로 만드는 한끼`, strategy: "making_pattern" });
    keywords.push({ keyword: `${ing} 하나로 만드는 요리`, strategy: "making_pattern" });
    keywords.push({ keyword: `${ing} 대량소비 레시피`, strategy: "making_pattern" });
    keywords.push({ keyword: `${ing} 활용 레시피`, strategy: "making_pattern" });
    keywords.push({ keyword: `${ing} 요리 추천`, strategy: "making_pattern" });
    keywords.push({ keyword: `${ing} 맛있게 만드는 법`, strategy: "making_pattern" });
    keywords.push({ keyword: `${ing} 황금비율`, strategy: "making_pattern" });
  }

  // ── 6. 요리명 × 수식어 (만들기, 만드는법, 레시피, 황금레시피) ──
  const dishes = [
    "김치찌개", "된장찌개", "순두부찌개", "부대찌개", "참치찌개",
    "볶음밥", "김치볶음밥", "새우볶음밥", "스팸볶음밥",
    "파스타", "크림파스타", "로제파스타", "까르보나라", "알리오올리오",
    "떡볶이", "라볶이", "불고기", "제육볶음", "잡채",
    "비빔밥", "돈카츠", "함박스테이크", "오므라이스",
    "감자탕", "갈비탕", "삼계탕", "설렁탕", "육개장",
    "찜닭", "갈비찜", "닭강정", "탕수육", "짜장면", "짬뽕",
    "계란말이", "김밥", "주먹밥", "샌드위치", "토스트",
    "카레", "리조또", "그라탱", "스테이크",
    "감바스", "아히요", "마라탕", "마라샹궈",
    "초밥", "라멘", "우동", "돈카츠", "타코야끼",
    "팟타이", "쌀국수", "월남쌈", "반미",
    "피자", "치킨", "햄버거", "핫도그",
  ];
  const suffixes = ["만들기", "만드는법", "레시피", "황금레시피", "맛있게 만드는 법", "간단 레시피", "초간단"];
  for (const dish of dishes) {
    for (const suf of suffixes) {
      keywords.push({ keyword: `${dish} ${suf}`, strategy: "dish_suffix" });
    }
  }

  // ── 7. 재료 × 재료 (자연스러운 쌍) 대량 확장 ──
  const pairIngredients = ingredients.slice(0, 40); // 상위 40개
  for (let i = 0; i < pairIngredients.length; i++) {
    for (let j = i + 1; j < pairIngredients.length; j++) {
      keywords.push({ keyword: `${pairIngredients[i]} ${pairIngredients[j]} 요리`, strategy: "pair_expansion" });
      keywords.push({ keyword: `${pairIngredients[i]} ${pairIngredients[j]} 레시피`, strategy: "pair_expansion" });
    }
  }

  // ── 8. 상황 × 상황 × 요리 (초구체적 롱테일) ──
  const quickSits = ["초간단", "5분", "10분", "간편", "뚝딱"];
  const targetSits = ["혼밥", "다이어트", "도시락", "야식", "아이", "자취"];
  const quickMethods = ["볶음밥", "덮밥", "파스타", "샌드위치", "토스트", "국수", "라면", "죽"];
  for (const q of quickSits) {
    for (const t of targetSits) {
      for (const m of quickMethods) {
        keywords.push({ keyword: `${q} ${t} ${m}`, strategy: "situation_method" });
      }
    }
  }

  // 중복 제거 (keyword 필드 기준)
  const seen = new Set<string>();
  return keywords.filter(({ keyword }) => {
    if (seen.has(keyword)) return false;
    seen.add(keyword);
    return true;
  });
};

// ── 메인 ──

const main = async () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // allowlist 로드
  let allowlist: { generatedAt: string; stats: any; pages: Array<Record<string, string | number>> };
  if (fs.existsSync(ALLOWLIST_PATH)) {
    allowlist = JSON.parse(fs.readFileSync(ALLOWLIST_PATH, "utf-8"));
  } else {
    allowlist = { generatedAt: "", stats: { totalActive: 0, addedThisCycle: 0, promotedFromImmature: 0 }, pages: [] };
  }

  // 기존 q 키워드 수집 (중복 방지)
  const existingKeys = new Set(allowlist.pages.map(paramsToKey));
  const existingQs = new Set(
    allowlist.pages.filter((p) => p.q).map((p) => String(p.q))
  );

  // 새 키워드 생성
  const allKeywords = generateNewKeywords();
  const newKeywords = allKeywords.filter(({ keyword }) => !existingQs.has(keyword));

  console.log(`=== SEO 키워드 탐색 ===`);
  console.log(`생성된 키워드: ${allKeywords.length}개`);
  console.log(`신규 (중복 제거): ${newKeywords.length}개`);
  console.log(`기존 allowlist: ${allowlist.pages.length}개\n`);

  // 배치 검증
  let addedCount = 0;
  let immatureCount = 0;
  let emptyCount = 0;
  const added: string[] = [];
  const startTime = Date.now();
  const strategyStats: Record<string, { generated: number; active: number }> = {};

  for (let i = 0; i < newKeywords.length; i += CONCURRENCY) {
    const batch = newKeywords.slice(i, i + CONCURRENCY);

    const results = await Promise.all(
      batch.map(async (item) => {
        const count = await fetchResultCount(item.keyword);
        return { keyword: item.keyword, strategy: item.strategy, count };
      })
    );

    for (const { keyword, strategy, count } of results) {
      const stat = (strategyStats[strategy] ??= { generated: 0, active: 0 });
      stat.generated++;
      if (count >= MIN_RESULTS) {
        const params = { q: keyword };
        const key = paramsToKey(params);
        if (!existingKeys.has(key)) {
          allowlist.pages.push(params);
          existingKeys.add(key);
          addedCount++;
          added.push(keyword);
        }
        stat.active++;
      } else if (count > 0) {
        immatureCount++;
      } else {
        emptyCount++;
      }
    }

    const checked = Math.min(i + CONCURRENCY, newKeywords.length);
    const pct = ((checked / newKeywords.length) * 100).toFixed(1);
    const eta = Math.round(((Date.now() - startTime) / checked) * (newKeywords.length - checked) / 1000);
    process.stdout.write(
      `\r[${checked}/${newKeywords.length}] ${pct}% | +ACTIVE: ${addedCount} | IMMATURE: ${immatureCount} | ETA: ${eta}s`
    );

    if (i + CONCURRENCY < newKeywords.length) {
      await sleep(DELAY_MS);
    }
  }

  const durationMs = Date.now() - startTime;
  console.log(`\n\n완료: ${(durationMs / 1000).toFixed(1)}초`);

  // allowlist 저장
  allowlist.generatedAt = new Date().toISOString();
  allowlist.stats = {
    ...allowlist.stats,
    totalActive: allowlist.pages.length,
    addedThisCycle: (allowlist.stats.addedThisCycle || 0) + addedCount,
  };

  fs.writeFileSync(ALLOWLIST_PATH, JSON.stringify(allowlist, null, 2), "utf-8");

  // 로그 저장
  const log = {
    date: today(),
    totalGenerated: allKeywords.length,
    newKeywords: newKeywords.length,
    added: addedCount,
    immature: immatureCount,
    empty: emptyCount,
    durationMs,
    sampleAdded: added.slice(0, 30),
    strategyStats,
  };
  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2), "utf-8");

  // 결과
  console.log(`\n=== 결과 ===`);
  console.log(`사이트맵: ${allowlist.pages.length - addedCount} → ${allowlist.pages.length} (+${addedCount})`);
  console.log(`IMMATURE: ${immatureCount}개`);
  console.log(`EMPTY: ${emptyCount}개`);

  if (added.length > 0) {
    console.log(`\n=== 추가된 키워드 (상위 20) ===`);
    added.slice(0, 20).forEach((kw) => console.log(`  + "${kw}"`));
    if (added.length > 20) console.log(`  ... 외 ${added.length - 20}개`);
  }

  console.log("\n=== 전략별 전환율 ===");
  for (const [strategy, stat] of Object.entries(strategyStats).sort(([, a], [, b]) => b.active - a.active)) {
    const rate = stat.generated > 0 ? ((stat.active / stat.generated) * 100).toFixed(1) : "0.0";
    console.log(`  ${strategy.padEnd(25)} ${String(stat.generated).padStart(6)} 생성 → ${String(stat.active).padStart(5)} ACTIVE (${rate}%)`);
  }

  console.log(`\nallowlist: ${ALLOWLIST_PATH}`);
  console.log(`log: ${LOG_PATH}`);
};

main().catch((err) => {
  console.error("키워드 탐색 실패:", err);
  process.exit(1);
});
