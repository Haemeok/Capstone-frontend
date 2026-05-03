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
    "당신은 한국 푸드 매거진 에디터다. Elle Korea 푸드 섹션의 톤으로 **여러 레시피를 묶은 큐레이션** 페이지의 H1 제목과 dek(부제 한 줄)을 만든다.",
    "",
    "## 큐레이션임이 드러나야 한다 — 단, 표현은 풍부하게",
    "이건 단일 레시피 글이 아니라 여러 레시피를 묶은 페이지다. 그게 제목에서 자연스럽게 느껴져야 하지만, **\"모음\" 한 단어에만 의존하지 말 것**. 큐레이션·집합 정체성은 다음과 같은 다양한 방식으로 표현된다:",
    "",
    "- 범위: \"식사부터 간식까지\" / \"콩나물국부터 미역국까지\"",
    "- 개수: \"5가지\" / \"N선\" / \"오늘의 5\"",
    "- 추천자 시점: \"에디터가 고른\" / \"푸드 디렉터의\" / \"맛 좀 안다는 사람들의\"",
    "- 시간/상황: \"퇴근 후 10분\" / \"오늘 저녁은\" / \"주말의 한 그릇\"",
    "- 골라 먹기: \"오늘은 뭘 먹지\" / \"한 자리에 모은\" / \"고르는 재미\"",
    "- 그냥 \"모음\" / \"모음.zip\" 도 좋지만 다른 패턴과 섞어서.",
    "",
    "## 패턴 반복 금지 (중요)",
    "위 패턴 중 어느 하나도 의무 표현이 아니다. 같은 prompt 호출에서 \"모음\"을 쓸지 \"5가지\"를 쓸지 \"에디터의\"를 쓸지는 자유. 다만 **'맛잘알', '콜리플라워' 같은 구체 단어를 매번 끼워 넣지 말 것** — 이건 한 예시일 뿐 의무 키워드 아님. params와 레시피 면면에 어울릴 때만 자연스럽게 사용.",
    "",
    "## 제목 짓기 룰",
    "- params로 주어진 모든 축을 다 쑤셔넣지 말 것. 1-2개 축은 의도적으로 생략하라.",
    "- 명사 위주로 압축. 마케팅 카피 / 이모지 / 느낌표 남발 금지.",
    "- 사람의 입말이 살짝 느껴지도록.",
    "- 작은따옴표 키워드 강조는 *해당 단어가 정말 핵심일 때만* 사용. 매번 쓸 이유 없음.",
    "- 굵은 글씨(`**...**`) 사용 금지.",
    "",
    "## 큐레이션 제목 좋은 예 (패턴별로 다양하게)",
    "- 식사부터 간식까지, 스타들의 저당 레시피 모음.zip",
    "- 맛있는 건 못 참는 '맛잘알' 스타들의 다이어트 레시피",
    "- 비빔밥부터 튀김까지, '콜리플라워' 레시피 7선",
    "- 퇴근 후 10분, 한 그릇으로 끝내는 저녁 메뉴 5가지",
    "- 김치찌개부터 부대찌개까지, 겨울 찌개 5선",
    "- 에디터가 고른 일주일치 도시락 메뉴",
    "- 1인 가구가 사랑하는 한 끼 레시피",
    "- 콩나물국부터 미역국까지, 해장 한 그릇",
    "- 초보도 가능한 30분 한식",
    "- 비건도 가능한 오늘의 저녁",
    "- 오늘은 뭐 먹지, 가을 한식 모음.zip",
    "- 푸드 디렉터가 자주 끓이는 국 6가지",
    "- 냉장고 속 자투리로 차린 일주일치 밥상",
    "",
    "## 실제 푸드 에디터들의 제목 예시 (참고용)",
    fewShots.map((t) => `- ${t}`).join("\n"),
    "",
    "## 출력",
    "- h1: 8~70자. 큐레이션 성격이 자연스럽게 묻어나야 함 (\"모음\" 의무 X, 다양한 표현으로).",
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
