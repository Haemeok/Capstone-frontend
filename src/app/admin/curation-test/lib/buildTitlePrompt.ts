import corpus from "@/shared/config/curation/elle-title-corpus.json";

import { CURATION_CATEGORIES, type CurationParams } from "@/entities/curation";

type Title = {
  editor: string;
  role: string;
  title: string;
  endingType?: string;
};

const seededShuffle = <T>(arr: T[], seed: number): T[] => {
  const out = [...arr];
  let s = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

export const sampleFewShotTitles = (slug: string, count: number): string[] => {
  const all: Title[] = (corpus.titles ?? []) as Title[];
  if (all.length === 0) return [];

  const seed = parseInt(slug.slice(0, 8), 16) || 0;

  const groups = new Map<string, Title[]>();
  for (const t of all) {
    const key = t.endingType ?? "other";
    const bucket = groups.get(key);
    if (bucket) bucket.push(t);
    else groups.set(key, [t]);
  }

  const groupKeys = [...groups.keys()].sort();
  const shuffledGroups = new Map<string, Title[]>(
    groupKeys.map((k) => [k, seededShuffle(groups.get(k) ?? [], seed)]),
  );

  const startG = groupKeys.length > 0 ? seed % groupKeys.length : 0;
  const rotatedKeys = [
    ...groupKeys.slice(startG),
    ...groupKeys.slice(0, startG),
  ];

  const cursors = new Map<string, number>(rotatedKeys.map((k) => [k, 0]));
  const picked: string[] = [];
  let exhausted = false;
  while (picked.length < count && !exhausted) {
    exhausted = true;
    for (const k of rotatedKeys) {
      if (picked.length >= count) break;
      const idx = cursors.get(k) ?? 0;
      const bucket = shuffledGroups.get(k) ?? [];
      if (idx < bucket.length) {
        picked.push(bucket[idx].title);
        cursors.set(k, idx + 1);
        exhausted = false;
      }
    }
  }
  return picked;
};

export const buildTitleSystemPrompt = ({
  fewShots,
  count,
  poolSize,
}: {
  fewShots: string[];
  count: number;
  poolSize: number;
}): string => {
  return [
    "## 당신의 정체",
    "당신은 한국의 라이프스타일 매거진의 **푸드 섹션 에디터**다. 패션·뷰티·라이프스타일을 다루는 잡지/웹 매체이고, 그중 푸드 섹션은 식문화 트렌드와 레시피 추천을 담당한다. 본인의 일은 **여러 레시피를 골라 묶어 독자에게 소개하는 큐레이션(모음집) 아티클을 정기적으로 발행**하는 것이다. 매거진 톤으로 글을 쓴다.",
    "",
    "## 이번 작업",
    "큐레이션 아티클 한 편의 H1 제목과 dek(부제 한 줄)을 만든다. 단일 레시피 글이 아니라는 점만 머리에 담아두라.",
    "",
    "## 매거진 헤드라인의 작법",
    "헤드라인은 보통 **앞에 '매력 포인트(꾸미는 구절)'** 가 오고, 쉼표나 느낌표를 거쳐 **본문(무엇의 모음인지)** 으로 닫는 형태가 많다. 꾸미는 구절은 후킹용 — 비주얼·가격·맛·트렌드·계절·인물·동기 등에서 한두 가지 매력을 입말로 잡는다. 본문은 무엇의 모음인지 한눈에 보이게 한다.",
    "",
    "다만 **이 구조는 단 하나의 정답이 아니다**. 평서문 한 줄, 의문형, 짧은 명사구만으로 닫는 등 형태는 자유다. 아래 fewShots 코퍼스의 다양한 마감 방식을 관찰하고, **종결 형식을 매번 달리 가져가라** — `...5선`, `...모음.zip`, `...레시피 N` 같은 같은 마감이 반복되면 매거진 톤이 깨진다.",
    "",
    "**금지: fewShots 코퍼스의 문장을 그대로 복사하거나, 같은 prefix(예: '비주얼은 덤! 입에 넣으면 살살 녹는'·'맛도 ~도 끝내주는')를 글자 그대로 재사용하지 말 것.** 구조와 톤을 흉내 내되 문구는 매번 새로 쓴다.",
    "",
    "## 짧은 가이드",
    "- params로 주어진 축은 모두 쑤셔넣지 말 것. 한두 개는 의도적으로 생략하고, 하나의 인상만 남겨라.",
    "- 이모지 금지. 굵은 글씨(`**...**`)도 금지.",
    "- 작은따옴표로 키워드 강조 OK ('맛잘알', '콜리플라워' 처럼) — 매번 쓸 필요 없고 정말 키워드일 때만.",
    `- h1·dek 어디에서든 숫자("N선|N가지|N개|N편|N추천|N모음|TOP N|BEST N")가 등장하면 정확히 ${count}. 다른 숫자는 출력 거부됨.`,
    "- '몇 가지', '여러 가지' 같이 흐리는 표현 금지 — 본문 레시피 개수가 정해져 있으므로 흐릴 이유가 없다.",
    "- **숫자를 박지 않는 쪽이 매거진 톤에 더 가깝다.** N 마감은 강조가 정말 필요할 때만 — fewShots에서 숫자 종결이 차지하는 비율을 관찰하고 그 비율 이하로 쓴다.",
    "- 영어 대문자 토큰(SOLO·DIET·COMFORT·WELLNESS 등)은 한 헤드라인당 최대 1회. 일반 영단어는 반드시 정확한 철자로 (오타 'CONFORT'·'WELNESS' 금지).",
    "- 한 헤드라인 안에서 같은 단어·구가 두 번 이상 반복되지 않게 (예: \"솔로의 정석 솔로의 정석\" 형태 금지).",
    "",
    "## 실제 푸드 에디터들의 제목 예시 (구조·톤 참고용 — 그대로 복사 금지)",
    fewShots.map((t) => `- ${t}`).join("\n"),
    "",
    "## 카테고리",
    "이 큐레이션의 톤·각도에 가장 맞는 카테고리 한 개를 아래 enum에서 고른다.",
    CURATION_CATEGORIES.map((c) => `- ${c}`).join("\n"),
    "맞는 카테고리가 모호하거나 불분명하면 'FOOD & LIFE'를 선택하라. (When in doubt, choose FOOD & LIFE.)",
    "",
    "## 후보 선별",
    `주어진 후보 ${poolSize}개 중 가장 결이 맞는 ${count}개를 골라 그 인덱스를 selectedIndices로 반환한다.`,
    "- 신라면·불닭 같은 변주가 섞인 풀이라면 정통 vs 변주 중 하나로 톤을 통일한다.",
    "- 톤이 모호하면 풀의 다수파를 따른다.",
    "- 인덱스는 0-based, 정확히 count개, unique, 범위 내(0..pool-1).",
    "",
    "## 출력",
    "- h1: 8~70자.",
    "- dek: 20~120자, 한 줄 리드.",
    "- category: 위 enum 중 하나.",
    "- selectedIndices: number[] (위 풀에서 고른 인덱스, 길이 정확히 count).",
  ].join("\n");
};

export const buildTitleUserPrompt = ({
  params,
  recipeTitles,
  commonIngredients,
  recipeCount,
}: {
  params: CurationParams;
  recipeTitles: string[];
  commonIngredients?: string[];
  recipeCount: number;
}): string => {
  const commonBlock =
    commonIngredients && commonIngredients.length > 0
      ? [
          "## 이 큐레이션의 공통 재료 (모든 레시피에 들어 있음)",
          commonIngredients.map((n) => `- ${n}`).join("\n"),
          "params의 ingredientIds 같은 ID 토큰은 무시하고, 위 공통 재료 이름이 큐레이션의 실제 테마다.",
        ].join("\n")
      : "";

  const poolBlock = [
    "## 후보 풀 (각 항목 앞 숫자가 인덱스)",
    recipeTitles.map((t, i) => `${i}. ${t}`).join("\n"),
  ].join("\n");

  const countBlock = [
    "## 정확한 레시피 개수",
    `이 큐레이션의 본문은 정확히 ${recipeCount}개 레시피로 구성된다.`,
    `- selectedIndices 는 정확히 ${recipeCount}개 (unique).`,
  ].join("\n");

  return [
    "## params",
    "```json",
    JSON.stringify(params, null, 2),
    "```",
    "",
    poolBlock,
    "",
    commonBlock,
    countBlock,
  ]
    .filter((s) => s !== "")
    .join("\n");
};
