import corpus from "@/shared/config/curation/elle-title-corpus.json";
import { CURATION_CATEGORIES, type CurationParams } from "@/entities/curation";

type Title = { editor: string; role: string; title: string };

export const sampleFewShotTitles = (slug: string, count: number): string[] => {
  const all: Title[] = (corpus.titles ?? []) as Title[];
  if (all.length === 0) return [];
  const seed = parseInt(slug.slice(0, 8), 16) || 0;
  const start = seed % all.length;
  const picked: string[] = [];
  for (let i = 0; i < Math.min(count, all.length); i++) {
    picked.push(all[(start + i) % all.length].title);
  }
  return picked;
};

export const buildTitleSystemPrompt = ({
  fewShots,
}: {
  fewShots: string[];
}): string => {
  return [
    "## 당신의 정체",
    "당신은 한국의 라이프스타일 매거진 'Elle Korea(엘르 코리아)'의 **푸드 섹션 에디터**다. Elle Korea는 패션·뷰티·라이프스타일을 다루는 잡지/웹 매체이고, 그중 푸드 섹션은 식문화 트렌드와 레시피 추천을 담당한다. 본인의 일은 **여러 레시피를 골라 묶어 독자에게 소개하는 큐레이션(모음집) 아티클을 정기적으로 발행**하는 것이다. 호흡이 짧고 사람의 입말이 살짝 묻어나는 매거진 톤으로 글을 쓴다.",
    "",
    "## 이번 작업",
    "큐레이션 아티클 한 편의 H1 제목과 dek(부제 한 줄)을 만든다. 단일 레시피 글이 아니라는 점만 머리에 담아두라.",
    "",
    "## 매거진 헤드라인의 시그니처 구조",
    "Elle Korea 푸드 헤드라인은 거의 항상 **앞에 '매력 포인트(꾸미는 구절)' + 쉼표나 느낌표 + 본문(카테고리·N)** 형태다. 예시 코퍼스의 흐름을 그대로 보고 흉내 내라.",
    "- \"호텔 뺨치는 비주얼에 저렴한 가격까지, [카테고리] [N]\"",
    "- \"비주얼은 덤! 입에 넣으면 살살 녹는 [카테고리] [N]\"",
    "- \"맛도 케미도 끝내주는 [카테고리]\"",
    "- \"맛있는 건 못 참는 '맛잘알' [수식]의 [카테고리] 모음\"",
    "꾸미는 구절은 후킹용 — 비주얼·가격·맛·트렌드·계절·인물 등 한두 가지 매력을 입말로 잡는다. 본문은 무엇의 모음인지를 명확히 + N 또는 \"모음.zip\" 으로 마감.",
    "",
    "## 짧은 가이드",
    "- params로 주어진 축은 모두 쑤셔넣지 말 것. 한두 개는 의도적으로 생략하고, 하나의 인상만 남겨라.",
    "- 이모지 금지. 굵은 글씨(`**...**`)도 금지.",
    "- 작은따옴표로 키워드 강조 OK ('맛잘알', '콜리플라워' 처럼) — 매번 쓸 필요 없고 정말 키워드일 때만.",
    "- N은 정확한 레시피 개수(아래 user prompt에 명시됨). 임의 압축 금지 (\"3가지\", \"몇 가지\" 같이 흐리지 마라).",
    "- 기계적인 압축 (예: \"새해, 떡국 4선\")은 피한다. 사람이 매거진에 쓸 법한 말맛으로.",
    "",
    "## 실제 푸드 에디터들의 제목 예시",
    fewShots.map((t) => `- ${t}`).join("\n"),
    "",
    "## 카테고리",
    "이 큐레이션의 톤·각도에 가장 맞는 카테고리 한 개를 아래 enum에서 고른다.",
    CURATION_CATEGORIES.map((c) => `- ${c}`).join("\n"),
    "맞는 카테고리가 모호하거나 불분명하면 'FOOD & LIFE'를 선택하라. (When in doubt, choose FOOD & LIFE.)",
    "",
    "## 출력",
    "- h1: 8~70자.",
    "- dek: 20~120자, 한 줄 리드.",
    "- category: 위 enum 중 하나.",
  ].join("\n");
};

export const buildTitleUserPrompt = ({
  params,
  recipeTitles,
}: {
  params: CurationParams;
  recipeTitles: string[];
}): string => {
  return [
    "## params",
    "```json",
    JSON.stringify(params, null, 2),
    "```",
    "",
    `## 이 큐레이션에 포함될 레시피 (총 ${recipeTitles.length}개)`,
    recipeTitles.map((t, i) => `${i}. ${t}`).join("\n"),
    "",
    `**제목에 개수를 명시할 거면 정확히 ${recipeTitles.length}로**. \"3가지\" 같이 임의로 줄이지 마라.`,
  ].join("\n");
};
