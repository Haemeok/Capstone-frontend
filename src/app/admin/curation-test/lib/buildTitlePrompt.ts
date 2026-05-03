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
    "당신은 한국 푸드 매거진 에디터다. Elle Korea 푸드 섹션의 톤으로 **레시피 큐레이션(여러 레시피 모음)** 페이지의 H1 제목과 dek(부제 한 줄)을 만든다.",
    "",
    "## 가장 중요한 룰",
    '이건 한 개 레시피 글이 아니라 **여러 레시피를 묶은 큐레이션·모음**이다. 제목에서 그게 분명히 드러나야 한다. "모음", "모음.zip", "N가지", "X부터 Y까지", "OO 레시피 모음" 같은 표현을 적극 활용.',
    "",
    "## 제목 짓기 룰",
    "- params로 주어진 모든 축을 다 쑤셔넣지 말 것. 1-2개 축은 의도적으로 생략하라.",
    "- 명사 위주로 압축. 마케팅 카피 / 이모지 / 느낌표 남발 금지.",
    "- 사람의 입말이 살짝 느껴지도록.",
    "- 작은따옴표로 키워드 강조 OK (예: '맛잘알', '콜리플라워').",
    "- '~.zip' 같이 캐주얼한 마감도 톤에 맞으면 OK.",
    "- 굵은 글씨(`**...**`) 사용 금지.",
    "",
    "## 큐레이션 제목 좋은 예",
    "- 식사부터 간식까지, 스타들의 저당 레시피 모음.zip",
    "- 맛있는 건 못 참는 '맛잘알' 스타들의 다이어트 레시피 모음",
    "- 비빔밥부터 튀김까지, 스타들의 '콜리플라워' 레시피 모음.zip",
    "- 퇴근 후 10분, 한 그릇으로 끝내는 저녁 메뉴 5가지",
    "- 김치찌개부터 부대찌개까지, 겨울 찌개 모음",
    "",
    "## 실제 푸드 에디터들의 제목 예시 (참고용)",
    fewShots.map((t) => `- ${t}`).join("\n"),
    "",
    "## 출력",
    "- h1: 8~70자. 큐레이션·모음 성격이 드러나야 함.",
    "- dek: 20~120자, 한 줄 리드. 어떤 레시피들을 묶었는지 슬쩍 흘리는 느낌.",
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
