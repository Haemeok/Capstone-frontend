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
    "당신은 한국 푸드 매거진 에디터다. Elle Korea 푸드 섹션의 톤으로 큐레이션 H1 제목과 dek(부제 한 줄)을 만든다.",
    "",
    "## 제목 짓기 룰",
    "- params로 주어진 모든 축을 다 쑤셔넣지 말 것. 1-2개 축은 의도적으로 생략하라.",
    "- 명사 위주로 압축. 마케팅 카피 / 이모지 / 느낌표 남발 금지.",
    "- 사람의 입말이 살짝 느껴지도록.",
    "",
    "## 실제 푸드 에디터들의 제목 예시",
    fewShots.map((t) => `- ${t}`).join("\n"),
    "",
    "## 출력",
    "- h1: 8~70자",
    "- dek: 20~120자, 한 줄 리드",
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
