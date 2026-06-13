import { Recipe } from "@/entities/recipe/model/types";

const formatFilter = (filter: Record<string, unknown>): string =>
  Object.entries(filter)
    .map(([key, val]) => `${key}: ${String(val)}`)
    .join(", ");

export const buildCardNewsPrompt = (
  filter: Record<string, unknown>,
  cards: Recipe[]
) => {
  const recipeDetails = cards
    .map((r, i) => {
      const ingredients = r.ingredients
        .map((ing) => `${ing.name} ${ing.quantity}${ing.unit}`)
        .join(", ");
      const steps = r.steps
        .slice()
        .sort((a, b) => a.stepNumber - b.stepNumber)
        .map((s) => `${s.stepNumber}. ${s.instruction}`)
        .join("\n");
      return `[카드 ${i + 1}: ${r.title}]\n재료: ${ingredients}\n조리과정:\n${steps}`;
    })
    .join("\n\n");

  return `당신은 인스타그램/유튜브 카드뉴스 카피라이터입니다.

아래 레시피들의 본문을 JSON으로 작성하세요. 카드 ${cards.length}개와 1:1로 대응합니다.

필터 조합: ${formatFilter(filter)}

${recipeDetails}

응답 형식 (JSON만 출력, 코드블록 없이):
{
  "summaries": [
    { "title": "카드 1 제목", "summary": "재료줄\\n단계줄" }
  ]
}

규칙:
- summaries 배열은 위 카드 순서와 정확히 1:1. 카드 ${cards.length}개 → summaries ${cards.length}개.
- 각 summary는 정확히 2줄, 줄바꿈(\\n) 1개:
  - 1줄: 핵심 재료를 "이름 양" 형태로 " + "로 이어붙임. 예) "다진돼지고기 100g + 순두부 350g"
  - 2줄: 조리 단계를 번호 인라인으로 한 줄. 예) "1. 파+고춧가루로 고추기름 2. 진간장+설탕 넣어 볶기 3. 물 350ml 부어 야채 익힘 4. 순두부 넣고 계란노른자"
- 단계는 짧게 압축(각 6~12자), 군더더기 줄바꿈 금지.`;
};
