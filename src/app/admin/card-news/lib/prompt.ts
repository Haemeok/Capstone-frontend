import { Recipe } from "@/entities/recipe/model/types";

const formatFilter = (filter: Record<string, unknown>): string => {
  return Object.entries(filter)
    .map(([key, val]) => `${key}: ${String(val)}`)
    .join(", ");
};

export const buildCardNewsPrompt = (filter: Record<string, unknown>, thumbnail: Recipe, recipes: Recipe[]) => {
  const recipeDetails = [thumbnail, ...recipes]
    .map((r, i) => {
      const ingredients = r.ingredients
        .map((ing) => `${ing.name} ${ing.quantity}${ing.unit}`)
        .join(", ");
      const steps = r.steps
        .sort((a, b) => a.stepNumber - b.stepNumber)
        .map((s) => `${s.stepNumber}. ${s.instruction}`)
        .join("\n");
      return `[레시피 ${i + 1}: ${r.title}]\n재료: ${ingredients}\n조리과정:\n${steps}`;
    })
    .join("\n\n");

  return `당신은 인스타그램 카드뉴스 카피라이터입니다.

아래 검색 키워드와 레시피 정보를 보고 JSON 형식으로 응답하세요.

필터 조합: ${formatFilter(filter)}

${recipeDetails}

응답 형식 (JSON만 출력, 코드블록 없이):
{
  "hooking": "후킹 문구 한 줄 (임팩트 있게, 15자 내외)",
  "subject": "주제 요약 한 줄 (예: 자취생 전자레인지 레시피 모음 zip)",
  "summaries": [
    {
      "title": "레시피 1 제목",
      "summary": "핵심 재료와 조리법을 5줄로 요약. 각 줄은 줄바꿈으로 구분."
    }
  ]
}

규칙:
- hooking: 감탄사, 강조 표현 사용. 호기심 유발. "이거 진짜...", "알면 인생이 바뀌는..." 스타일.
- subject: 필터 조합 기반으로 자연스럽게. "~모음 zip", "~top5", "~꿀조합" 스타일.
- summaries: 각 레시피마다 하나씩. 재료(이름+양)와 핵심 조리법을 간결하게 5줄로.
- summaries 배열 순서는 위 레시피 순서와 동일하게 (레시피 1이 썸네일용).`;
};
