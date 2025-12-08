import { ArchetypeQuestion } from "./types";

export const ARCHETYPE_QUESTIONS: ArchetypeQuestion[] = [
  {
    id: 1,
    category: "메뉴 선정",
    question: "처음 가보는 파인 다이닝, 메뉴판을 든 당신은?",
    answers: [
      {
        type: "S",
        label: "Safety (안전)",
        description: "실패는 없다. 여기 시그니처(Best) 메뉴가 뭐죠?",
      },
      {
        type: "A",
        label: "Adventure (모험)",
        description: "오, 이게 뭐지? 셰프의 도전 정신이 담긴 독특한 시즌 메뉴.",
      },
    ],
  },
  {
    id: 2,
    category: "식사 전략",
    question: "밥도둑 간장게장 정식을 먹는 중이다. 밥과 반찬의 비율은?",
    answers: [
      {
        type: "P",
        label: "Planner (계획)",
        description:
          "마지막 게딱지에 비빌 밥 3숟가락을 정확히 남겨두는 치밀함.",
      },
      {
        type: "I",
        label: "Instinct (본능)",
        description:
          '밥이랑 게장을 미친 듯이 먹다 보니 게장은 남았는데 밥이 없다. "사장님, 공깃밥 추가요!"',
      },
    ],
  },
  {
    id: 3,
    category: "도구 사용",
    question: "내 얼굴만 한 거대한 수제버거가 나왔다.",
    answers: [
      {
        type: "N",
        label: "Noble (귀족)",
        description: "소스 묻는 건 질색. 나이프와 포크로 우아하게 썰어서 먹는다.",
      },
      {
        type: "W",
        label: "Wild (야생)",
        description: "버거는 손맛이지. 꾹 눌러서 입 크게 벌리고 와앙 베어 문다.",
      },
    ],
  },
  {
    id: 4,
    category: "미각 스타일",
    question: "뜨끈한 라면이 나왔다. 나의 면치기 스타일은?",
    answers: [
      {
        type: "D",
        label: "Dynamic (다이나믹)",
        description: '"후루룩 챱챱!" 공기와 함께 면을 흡입하며 소리까지 즐긴다.',
      },
      {
        type: "Q",
        label: "Quiet (정갈)",
        description:
          "국물 튀는 거 싫어. 숟가락에 면을 예쁘게 돌돌 말아 한 입에 쏙 넣는다.",
      },
    ],
  },
  {
    id: 5,
    category: "속도 배려",
    question: "친구가 나보다 밥을 현저히 늦게 먹는다.",
    answers: [
      {
        type: "H",
        label: "Harmony (조화)",
        description:
          "민망하지 않게 물을 마시거나 빈 반찬을 집어먹으며 속도를 맞춰준다.",
      },
      {
        type: "M",
        label: "My way (마이웨이)",
        description:
          "식사는 타이밍. 내 밥이 식는 건 못 참으니 그냥 내 속도대로 먹고 기다린다.",
      },
    ],
  },
];
