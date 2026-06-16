import type { LandingDict } from "../../types";

export const landing: LandingDict = {
  recipeCount: {
    label: "5만+",
    phrase: "5만개 이상",
  },
  hero: {
    badge: "{count} 레시피 · YouTube 링크 추출 · AI 맞춤 추천",
    titleLine1: "매일의 요리를",
    titleHighlight: "더 쉽고 즐겁게",
    subjectHighlight: "YouTube 링크 하나로 레시피를 저장",
    subjectRest: "하고, {count} 레시피에서 AI가 맞춤 추천해드려요",
    cta: "무료로 시작하기",
    checklist: ["회원가입 불필요", "무료로 모든 기능 이용", "1분만에 시작"],
  },
  problems: {
    eyebrow: "이런 경험 있으신가요?",
    title: "요리, 왜 이렇게 어려울까요?",
    subtitle:
      "많은 분들이 겪고 있는 요리의 어려움, 더 이상 혼자 고민하지 마세요",
    items: [
      {
        title: "치솟는 외식물가와 배달물가",
        description:
          "매일 오르는 외식 비용, 이제는 집에서 요리하는 것이 더 경제적이에요",
      },
      {
        title: "재료 정리가 불편한 유튜브 영상",
        description:
          "영상을 보며 재료를 일일이 메모하고 정리하는 번거로움, 이제 그만!",
      },
      {
        title: "남은 재료, 어떻게 처리하죠?",
        description: "레시피대로 만들었는데 남은 재료 처리가 고민이신가요?",
      },
      {
        title: "요리 시간이 너무 오래 걸려요",
        description:
          "바쁜 일상 속에서도 빠르고 간편하게 만들 수 있는 레시피가 필요해요",
      },
    ],
  },
  stats: {
    title: "실제 사용자들의 결과",
    subtitle:
      "레시피오에서 요리를 시작한 사용자들이 경험한 실제 변화를 확인하세요",
    items: [
      {
        metric: "5만+",
        label: "큐레이션 레시피",
        description: "YouTube · 유명 레시피 · AI 생성까지",
      },
      {
        metric: "45%",
        label: "월 평균 식비 절감",
        description: "배달·외식 대비 절약 효과",
      },
      {
        metric: "48분",
        label: "일 평균 고민 시간 단축",
        description: "'오늘 뭐 먹지?' 결정 시간",
      },
      {
        metric: "98%",
        label: "냉장고 재료 소진율",
        description: "버려지는 식재료 최소화",
      },
    ],
  },
  tagChips: {
    eyebrow: "상황별 레시피",
    title: "이런 날에도, 이런 상황에도",
    subtitle: "원하는 상황에 딱 맞는 레시피를 바로 찾아보세요",
    groupLabels: {
      occasion: "기념일·특별한 날",
      situation: "일상·상황별",
      speed: "빠르게 만드는",
    },
    chipNames: {
      HOME_PARTY: "홈파티",
      HOLIDAY: "기념일",
      BRUNCH: "브런치",
      PICNIC: "피크닉",
      SOLO: "혼밥",
      LUNCHBOX: "도시락",
      HEALTHY: "다이어트",
      LATE_NIGHT: "야식",
      DRINK: "술안주",
      HANGOVER: "해장",
      CAMPING: "캠핑",
      KIDS: "아이 반찬",
      QUICK: "초스피드",
      AIR_FRYER: "에어프라이어",
    },
  },
  features: {
    eyebrow: "핵심 기능",
    title: "요리를 더 쉽게 만드는 방법",
    subtitle: "복잡한 요리 과정을 단순하게, 당신의 주방을 스마트하게",
    items: [
      {
        badge: "YouTube 추출",
        title: "YouTube 링크 하나로 레시피 완성",
        description:
          "영상을 멈추고 재료를 메모할 필요 없어요. 링크만 붙여넣으면 재료·조리순서·분량까지 자동 추출됩니다.",
        benefits: [
          "재료 자동 정리",
          "조리 순서 단계별 정리",
          "영상과 함께 보관",
          "좋아하는 유튜버 레시피 그대로",
        ],
      },
      {
        badge: "{count} 레시피",
        title: "국내 최대 규모의 큐레이션 레시피",
        description:
          "YouTube 기반 레시피부터 AI 생성, 유명 홈쿡 레시피까지 {phrase}을 한 곳에서 탐색할 수 있어요.",
        benefits: [
          "유명 최신 레시피",
          "YouTube 기반 레시피 다수 보유",
          "상황별·기념일별 태그 분류",
        ],
      },
      {
        badge: "AI 추천",
        title: "당신만을 위한 맞춤 레시피",
        description:
          "다양한 요소로 레시피를 생성해드려요. 국내 유일의 AI 레시피 생성 플랫폼",
        benefits: [
          "가성비 레시피 생성",
          "특정 영양성분 조합 레시피 생성",
          "파인다이닝 레시피 생성",
          "냉장고 남은 재료로 레시피 생성",
        ],
      },
      {
        badge: "스마트 관리",
        title: "냉장고 재료로 레시피 자동 추천",
        description:
          "보유한 재료를 등록하면 AI가 만들 수 있는 레시피를 자동으로 찾아드려요. 재료 낭비 없이 효율적으로!",
        benefits: ["남은 재료 활용 레시피"],
      },
    ],
  },
  testimonials: {
    eyebrow: "사용자 후기",
    title: "이미 많은 분들이 경험하고 있어요",
    subtitle: "실제 사용자들의 솔직한 이야기를 들어보세요",
    items: [
      {
        name: "강준영",
        role: "자취 3년차 · 수원",
        content:
          "냉장고에 남은 애매한 자투리 채소들 처리가 제일 골치였는데, 재료 입력하니까 바로 볶음밥이랑 찌개 레시피 뜨는 게 진짜 편하네요. 덕분에 이번 달은 음식물 쓰레기 봉투 거의 안 썼습니다.",
        avatar: "🏠",
        rating: 5,
        highlight: "냉장고 속 재료 100% 활용",
      },
      {
        name: "이미소",
        role: "필라테스 강사 · 서울",
        content:
          "식단 조절 중이라 칼로리랑 단백질 함량이 중요한데, 유튜브 레시피 보면서 영양성분까지 같이 볼 수 있는 앱은 처음 봐요. 닭가슴살 요리 질릴 때쯤 새로운 레시피 찾아서 잘 해먹고 있어요.",
        avatar: "🧘‍♀️",
        rating: 5,
        highlight: "영양 성분 한눈에 확인",
      },
      {
        name: "김태우",
        role: "직장인 · 판교",
        content:
          "유튜브로 요리 배울 때마다 영상 멈추고 광고 보고 손에 물 묻은 채로 스킵하는 거 짜증 났는데, 여기선 텍스트로 깔끔하게 정리되어 있어서 요리 속도가 훨씬 빨라짐. 개발자님 복 받으세요.",
        avatar: "👨‍💻",
        rating: 5,
        highlight: "요리 시간 20분 단축",
      },
      {
        name: "정혜림",
        role: "가계부 쓰는 주부 · 동탄",
        content:
          "레시피마다 대략적인 원가를 알려주는 기능이 신의 한 수네요. 오늘 저녁 메뉴가 배달 시켜 먹는 것보다 15,000원이나 아꼈다는 걸 눈으로 확인하니까 요리할 맛이 납니다.",
        avatar: "📝",
        rating: 5,
        highlight: "배달 대비 70% 비용 절감",
      },
      {
        name: "한승우",
        role: "미식가 · 부산",
        content:
          "솔직히 일반 블로그 레시피는 믿고 거르는데, 여긴 검증된 셰프들 유튜브 기반이라 맛 보장은 확실함. 저번 주말에 성시경 레시피 그대로 따라 했는데 와이프가 식당 차리자고 함 ㅋㅋ",
        avatar: "🍷",
        rating: 5,
        highlight: "실패 없는 고퀄리티 맛",
      },
      {
        name: "박지민",
        role: "대학생 · 서울",
        content:
          "식비 아끼려고 깔았음. 편의점 도시락보다 싸고 맛있게 먹기 가능. 자취생 필수앱 ㅇㅈ",
        avatar: "🎓",
        rating: 4,
        highlight: "월 생활비 20만원 세이브",
      },
      {
        name: "오연주",
        role: "푸드 스타일리스트 · 인천",
        content:
          "홈파티 카테고리에 있는 요리들 비주얼이 너무 좋아요. 친구들 놀러 왔을 때 '오븐 요리' 추천해 준 거 했는데, 다들 어디서 샀냐고 물어보더라고요. 플레이팅 팁도 있어서 좋아요!",
        avatar: "🎉",
        rating: 5,
        highlight: "홈파티 성공률 100%",
      },
      {
        name: "이동혁",
        role: "요리 입문 1개월 · 대구",
        content:
          "라면 물도 못 맞추던 사람입니다... '이게 될까?' 싶어서 따라 해봤는데 진짜 되네요? 특히 계량 정보가 정확해서 저 같은 똥손도 실패 안 하게 해주는 게 제일 맘에 듭니다.",
        avatar: "🍳",
        rating: 5,
        highlight: "요리 자신감 급상승",
      },
      {
        name: "최현석",
        role: "카페 운영 · 제주",
        content:
          "매장에서 브런치 메뉴 개발할 때 참고하고 있습니다. 재료비 원가 계산 기능이 있어서 마진율 따져보기 너무 좋네요. 개인 카페 사장님들한테도 추천할 만합니다.",
        avatar: "☕",
        rating: 5,
        highlight: "메뉴 개발 시간 단축",
      },
      {
        name: "송지아",
        role: "트렌드세터 · 서울",
        content:
          "요즘 릴스나 쇼츠에서 뜨는 핫한 레시피들이 업데이트가 진짜 빨라요. 유행하는 거 먹어보고 싶은데 유튜브 찾아다니기 귀찮을 때 그냥 들어오면 다 있음.",
        avatar: "✨",
        rating: 5,
        highlight: "최신 유행 레시피 반영",
      },
      {
        name: "김영희",
        role: "워킹맘 · 일산",
        content:
          "퇴근하고 장 볼 시간 없을 때 냉장고에 있는 계란이랑 두부만 체크했는데 훌륭한 반찬이 뚝딱 나왔어요. '오늘 뭐 먹지' 고민하는 시간이 줄어든 게 제일 큽니다.",
        avatar: "👩‍👧‍👦",
        rating: 5,
        highlight: "저녁 메뉴 고민 해결",
      },
      {
        name: "박성훈",
        role: "다이어터 · 광주",
        content:
          "맨날 샐러드만 먹다 지쳤는데, '맛있는 다이어트' 카테고리 보고 광명 찾음. 칼로리 낮은데 맛있는 게 이렇게 많은 줄 몰랐음. 3kg 감량하는데 도움 됨.",
        avatar: "🥗",
        rating: 5,
        highlight: "맛있게 다이어트 성공",
      },
      {
        name: "장민석",
        role: "앱 기획자 · 판교",
        content:
          "앱 UI가 군더더기 없이 깔끔해서 좋네요. 레시피 보는데 광고 덕지덕지 붙어있는 다른 앱들이랑 다르게 사용자 경험에 신경 쓴 게 보입니다. 스크랩 기능도 유용해요.",
        avatar: "📱",
        rating: 4,
        highlight: "깔끔하고 직관적인 UI",
      },
      {
        name: "윤서아",
        role: "신혼부부 · 하남",
        content:
          "매일 된장찌개 김치찌개만 먹다가 '세계 요리' 카테고리 보고 감바스 처음 도전해 봤어요! 남편이 깜짝 놀라네요. 특별한 날 요리 찾을 때 딱이에요.",
        avatar: "💑",
        rating: 5,
        highlight: "식탁 메뉴의 다양화",
      },
      {
        name: "강호동(가명)",
        role: "대식가 · 부산",
        content:
          "시켜 먹으면 배달비까지 3만 원인데, 여기서 알려준 대로 마트 가서 장보니까 8천 원 컷. 귀찮긴 해도 통장 잔고 보면 요리하게 됨. 돈 아끼고 싶으면 걍 까세요.",
        avatar: "💸",
        rating: 5,
        highlight: "압도적인 가성비",
      },
    ],
  },
  finalCta: {
    titleLine1: "오늘부터 시작하는",
    titleHighlight: "더 쉬운 요리 생활",
    subtitle:
      "{count} 레시피와 AI 추천, YouTube 링크 추출까지 지금 바로 무료로 시작해보세요",
    primaryCta: "무료로 시작하기",
    secondaryCta: "인기 레시피 둘러보기",
  },
};
