"use client";

import { useEffect, useState } from "react";

import { AnimatePresence,motion } from "motion/react";

type Testimonial = {
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
  highlight: string;
};

const TESTIMONIALS: Testimonial[] = [
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
];

const AUTO_ADVANCE_DELAY = 6000;

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          className={`h-5 w-5 ${
            index < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, AUTO_ADVANCE_DELAY);

    return () => clearInterval(timer);
  }, []);

  const currentTestimonial = TESTIMONIALS[currentIndex];

  return (
    <section className="from-beige/30 relative w-full overflow-hidden bg-gradient-to-b via-white to-white px-4 py-20 md:py-32">
      <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-block rounded-full bg-purple-50 px-4 py-1 text-sm font-semibold text-purple-600">
            사용자 후기
          </div>
          <h2 className="text-dark mb-4 text-4xl font-extrabold md:text-5xl">
            이미 많은 분들이 경험하고 있어요
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            실제 사용자들의 솔직한 이야기를 들어보세요
          </p>
        </motion.div>

        <div className="relative min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div className="from-olive-light/20 via-olive-mint/20 to-olive-medium/20 absolute -inset-4 rounded-[2.5rem] bg-gradient-to-r opacity-50 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-gray-200/50 bg-white p-10 shadow-2xl md:p-14">
                <div className="text-olive-light/10 absolute top-8 right-8 text-8xl">
                  "
                </div>

                <div className="relative mb-8 flex items-start justify-between">
                  <div className="flex items-center gap-5">
                    <div className="from-olive-light/20 to-olive-mint/20 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br text-4xl shadow-lg">
                      {currentTestimonial.avatar}
                    </div>
                    <div>
                      <h3 className="text-dark mb-1 text-2xl font-extrabold">
                        {currentTestimonial.name}
                      </h3>
                      <p className="mb-2 text-sm text-gray-500">
                        {currentTestimonial.role}
                      </p>
                      <StarRating rating={currentTestimonial.rating} />
                    </div>
                  </div>

                  <div className="bg-olive-mint/10 hidden rounded-xl px-4 py-2 md:block">
                    <p className="text-olive-medium text-sm font-bold">
                      {currentTestimonial.highlight}
                    </p>
                  </div>
                </div>

                <p className="relative text-xl leading-relaxed text-gray-700 md:text-2xl">
                  "{currentTestimonial.content}"
                </p>

                <div className="bg-olive-mint/10 mt-6 block rounded-xl px-4 py-2 md:hidden">
                  <p className="text-olive-medium text-sm font-bold">
                    {currentTestimonial.highlight}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex items-center justify-center gap-3">
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`group relative transition-all ${
                index === currentIndex ? "w-12" : "w-3"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            >
              <div
                className={`h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-olive-medium shadow-olive-medium/30 shadow-lg"
                    : "bg-gray-300 group-hover:bg-gray-400"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
