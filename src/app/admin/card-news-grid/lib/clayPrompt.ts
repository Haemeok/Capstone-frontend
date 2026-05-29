// src/app/admin/card-news-grid/lib/clayPrompt.ts
import { GRID_COUNT } from "./gridLayout";
import type { CardMode } from "./schema";

const STYLE_BASE =
  "스타일: 말랑한 점토(claymation) 느낌의 3D 렌더링, 둥글둥글한 입체 형태, " +
  "부드러운 무광 질감, 은은한 부드러운 그림자, 파스텔 톤. " +
  "흰 배경, 9칸 동일 재질·조명으로 통일.";

const INTRO: Record<CardMode, string> = {
  recipe:
    "3×3 그리드로 9개의 한국 가정식 음식 일러스트, 텍스트 없음. " +
    STYLE_BASE +
    " 각 음식 중앙 배치, 넉넉한 여백, 귀엽고 만질 것 같은 느낌.",
  tips:
    "3×3 그리드로 하나의 주제를 설명하는 9개 일러스트, 텍스트 없음. " +
    STYLE_BASE +
    " 각 칸은 해당 포인트를 또렷이 보여주는 장면/오브젝트, 모두 같은 대상·톤으로 통일.",
};

export const buildClayPrompt = (
  subjects: readonly string[],
  mode: CardMode,
): string => {
  if (subjects.length !== GRID_COUNT) {
    throw new Error(`buildClayPrompt: expected ${GRID_COUNT} subjects, got ${subjects.length}`);
  }
  const list = subjects.map((s, i) => `${i + 1}. ${s}`).join(" ");
  return `${INTRO[mode]}\n칸 목록 (왼→오, 위→아래 순): ${list}`;
};
