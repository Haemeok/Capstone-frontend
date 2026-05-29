// src/app/admin/card-news-grid/lib/clayPrompt.ts
import { GRID_COUNT } from "./gridLayout";

const STYLE =
  "3×3 그리드로 9개의 한국 가정식 음식 일러스트, 텍스트 없음. " +
  "스타일: 말랑한 점토(claymation) 느낌의 3D 렌더링, 둥글둥글한 입체 형태, " +
  "부드러운 무광 질감, 은은한 부드러운 그림자, 파스텔 톤. " +
  "흰 배경, 9개 동일 재질·조명으로 통일. 각 음식 중앙 배치, 넉넉한 여백, 귀엽고 만질 것 같은 느낌.";

export const buildClayPrompt = (dishNames: readonly string[]): string => {
  if (dishNames.length !== GRID_COUNT) {
    throw new Error(`buildClayPrompt: expected ${GRID_COUNT} names, got ${dishNames.length}`);
  }
  const list = dishNames.map((name, i) => `${i + 1}. ${name}`).join(" ");
  return `${STYLE}\n음식 목록 (왼→오, 위→아래 순): ${list}`;
};
