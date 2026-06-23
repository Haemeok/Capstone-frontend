import type { LandingDict } from "../../types";

export const landing: LandingDict = {
  recipeCount: {
    label: "10만+",
    phrase: "10만개 이상",
  },
  hero: {
    badge: "{count} 레시피 · YouTube 추출 · 현지인 레시피 · AI 맞춤 추천",
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
        title: "레시피 영상은 많은데, 따라 하긴 어려워요",
        description:
          "쏟아지는 영상 중에 뭘 고를지, 멈춰가며 재료를 메모하기도 번거롭죠",
      },
      {
        title: "외국 현지인은 뭘 해먹는지 궁금해요",
        description:
          "진짜 현지 가정식이 궁금한데, 외국어 영상도 댓글도 알아보기 어렵죠",
      },
      {
        title: "남은 재료, 어떻게 활용하죠?",
        description:
          "레시피대로 만들고 남은 재료, 버리긴 아깝고 쓸 데는 모르겠고",
      },
      {
        title: "실제 셰프들의 팁도 보고 싶어요",
        description:
          "검증된 셰프·유명 크리에이터의 진짜 노하우, 흩어진 영상에서 찾기 번거롭죠",
      },
    ],
  },
  stats: {
    title: "실제 사용자들의 결과",
    subtitle:
      "레시피오에서 요리를 시작한 사용자들이 경험한 실제 변화를 확인하세요",
    items: [
      {
        metric: "10만+",
        label: "큐레이션 레시피",
        description: "YouTube · 유명 레시피 · AI 생성까지",
      },
      {
        metric: "2만+",
        label: "나라별 현지 레시피",
        description: "한국·일본 각 2만개 이상",
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
        badge: "현지인 레시피",
        title: "현지인이 진짜 해먹는 집밥, 그대로",
        description:
          "일본·해외 현지 가정식을 현지인 평점과 번역된 댓글까지 그대로 볼 수 있어요. 한국·일본 현지 인기 레시피만 각 2만개 이상.",
        benefits: [
          "한국·일본 현지 인기 레시피 각 2만+",
          "현지인 평점으로 진짜 인기 메뉴 확인",
          "현지 댓글·후기 자동 번역 (무료)",
          "나라별로 골라보기 (한국·일본·기타)",
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
        name: "서지원",
        role: "일본 가정식 덕후 · 서울",
        content:
          "진짜 일본인들이 뭘 해먹는지 궁금했는데, 현지 레시피는 확실히 다르더라고요. 같은 가츠동이어도 한끗 차이가 이렇게 큰 줄 몰랐어요. 일본어 댓글도 번역돼서 떠서 꿀팁까지 챙겼습니다.",
        avatar: "🍱",
        rating: 5,
        highlight: "현지 레시피는 차원이 다름",
      },
      {
        name: "문가영",
        role: "세계요리 탐험가 · 성남",
        content:
          "나라별로 필터를 걸어서 일본·해외 레시피만 골라보는 게 좋아요. 현지에서 실제로 유행하는 메뉴를 댓글 번역까지 보면서 따라 할 수 있어서 편합니다.",
        avatar: "🌏",
        rating: 5,
        highlight: "댓글까지 번역돼서 나옴",
      },
      {
        name: "강준영",
        role: "자취 3년차 · 수원",
        content:
          "냉장고에 자투리 채소 굴러다니는 거 처리 못 해서 맨날 버렸는데, 재료 입력하니까 볶음밥이고 찌개고 바로 떠서 편함. 이번 달은 음쓰 봉투 거의 안 삼 ㅋㅋ",
        avatar: "🏠",
        rating: 5,
        highlight: "냉장고 털이 됨",
      },
      {
        name: "이미소",
        role: "필라테스 강사 · 서울",
        content:
          "식단 관리하면서 칼로리랑 단백질을 챙기는데, 유튜브 레시피에 영양성분까지 같이 나오는 앱은 처음 봤어요. 닭가슴살 질릴 때마다 새 레시피 찾아서 잘 해먹고 있습니다.",
        avatar: "🧘‍♀️",
        rating: 5,
        highlight: "영양성분까지 보임",
      },
      {
        name: "김태우",
        role: "직장인 · 판교",
        content:
          "유튜브로 요리 배울 때 영상 멈추고 손에 물 묻은 채로 스킵하는 게 늘 번거로웠는데, 여긴 텍스트로 깔끔하게 정리돼 있어서 훨씬 빨라요. 개발자분 감사합니다.",
        avatar: "👨‍💻",
        rating: 5,
        highlight: "확실히 빨라짐",
      },
      {
        name: "한승우",
        role: "미식가 · 부산",
        content:
          "블로그 레시피는 잘 안 믿는 편인데, 여긴 검증된 셰프들 유튜브 기반이라 맛은 확실하더라고요. 주말에 유명 셰프 레시피 그대로 따라 했더니 와이프가 식당 차리자고 하네요 ㅋㅋ",
        avatar: "🍷",
        rating: 5,
        highlight: "맛은 보장됨",
      },
      {
        name: "오연주",
        role: "푸드 스타일리스트 · 인천",
        content:
          "홈파티 카테고리 요리들 비주얼이 좋아서 자주 봐요. 친구들 왔을 때 오븐 요리 하나 했는데 다들 사 온 줄 알더라고요. 플레이팅 팁까지 있어서 좋습니다.",
        avatar: "🎉",
        rating: 5,
        highlight: "홈파티용으로 딱",
      },
      {
        name: "이동혁",
        role: "요리 입문 1개월 · 대구",
        content:
          "라면 물도 못 맞추던 사람인데 '이게 되나?' 하고 따라 해봤더니 됨;; 계량이 정확하게 나와서 나 같은 똥손도 안 망함.",
        avatar: "🍳",
        rating: 5,
        highlight: "똥손도 성공함",
      },
      {
        name: "송지아",
        role: "트렌드세터 · 서울",
        content:
          "릴스나 쇼츠에서 뜨는 레시피 업데이트가 빨라요. 유행하는 거 먹어보고 싶은데 유튜브 일일이 찾기 귀찮을 때, 그냥 여기 들어오면 다 있어서 좋습니다.",
        avatar: "✨",
        rating: 5,
        highlight: "유행 레시피 빠름",
      },
      {
        name: "김영희",
        role: "워킹맘 · 일산",
        content:
          "퇴근하고 장 볼 시간 없을 때 냉장고에 계란이랑 두부 있는 걸 체크했더니 반찬이 뚝딱 나왔어요. '오늘 뭐 먹지' 고민하는 시간이 줄어든 게 제일 큽니다.",
        avatar: "👩‍👧‍👦",
        rating: 5,
        highlight: "메뉴 고민 끝",
      },
      {
        name: "박성훈",
        role: "다이어터 · 광주",
        content:
          "다이어트한다고 맨날 샐러드만 먹다 질렸는데 '맛있는 다이어트' 카테고리 보고 살았음. 칼로리 낮은데 맛있는 게 많아서 이거 보고 해먹으니까 살 알아서 빠짐 ㅇㅇ",
        avatar: "🥗",
        rating: 5,
        highlight: "맛있게 다이어트",
      },
      {
        name: "장민석",
        role: "앱 기획자 · 판교",
        content:
          "앱 UI가 깔끔해서 좋아요. 다른 레시피 앱들은 광고가 덕지덕지인데 여긴 그런 게 없고, 스크랩 기능도 잘 돼 있어서 잘 쓰고 있습니다.",
        avatar: "📱",
        rating: 4,
        highlight: "광고 없고 깔끔",
      },
      {
        name: "윤서아",
        role: "신혼부부 · 하남",
        content:
          "맨날 된장찌개 김치찌개만 하다가 '세계 요리' 카테고리 보고 감바스를 처음 해봤는데 남편이 깜짝 놀라더라고요. 특별한 날 뭐 할지 막막할 때 보기 좋아요.",
        avatar: "💑",
        rating: 5,
        highlight: "메뉴가 다양해짐",
      },
    ],
  },
  finalCta: {
    titleLine1: "오늘부터 시작하는",
    titleHighlight: "더 쉬운 요리 생활",
    subtitle:
      "YouTube 추출부터 현지인 레시피, AI 맞춤 추천까지 — {count} 레시피를 지금 무료로 시작해보세요",
    primaryCta: "무료로 시작하기",
    secondaryCta: "인기 레시피 둘러보기",
  },
};
