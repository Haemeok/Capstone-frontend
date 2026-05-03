import corpus from "@/shared/config/curation/elle-title-corpus.json";
import type { CurationParams } from "@/entities/curation";

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
    "## 짧은 가이드",
    "- params로 주어진 축은 모두 쑤셔넣지 말 것. 한두 개는 의도적으로 생략하고, 하나의 인상만 남겨라.",
    "- 이모지 금지. 굵은 글씨(`**...**`)도 금지.",
    "- 표현 패턴은 본인 판단. \"N선\", \"모음\", \"부터-까지\", \"에디터가 고른\" 같은 형식은 도구일 뿐 의무 아님 — 매번 같은 구조 반복하지 마라.",
    "- 기계적인 압축 (예: \"새해, 떡국 4선\")은 피한다. 사람이 매거진에 쓸 법한 말맛으로.",
    "",
    "## 실제 푸드 에디터들의 제목 예시",
    fewShots.map((t) => `- ${t}`).join("\n"),
    "",
    "## 출력",
    "- h1: 8~70자.",
    "- dek: 20~120자, 한 줄 리드.",
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
    "## 이 큐레이션에 포함될 레시피들",
    recipeTitles.map((t, i) => `${i}. ${t}`).join("\n"),
  ].join("\n");
};
