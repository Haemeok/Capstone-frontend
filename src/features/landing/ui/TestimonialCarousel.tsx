"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

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
    name: "김민지",
    role: "직장인 · 서울",
    content:
      "냉장고에 있는 재료로 뭘 만들 수 있을까 매번 고민했는데, 이제는 앱이 알아서 추천해줘서 너무 편해요. 음식물 쓰레기도 줄고 요리도 재미있어졌어요!",
    avatar: "👩‍💼",
    rating: 5,
    highlight: "재료 낭비 50% 감소",
  },
  {
    name: "박준호",
    role: "대학생 · 부산",
    content:
      "유튜브 보면서 재료 메모하는 게 정말 귀찮았는데, 여기는 레시피가 깔끔하게 정리되어 있어서 좋아요. 1인 가구 레시피도 많아서 자주 이용하고 있어요.",
    avatar: "👨‍🎓",
    rating: 5,
    highlight: "주 3회 이상 요리 시작",
  },
  {
    name: "이서연",
    role: "주부 · 인천",
    content:
      "아이들 간식부터 저녁 메뉴까지 다양한 레시피가 있어서 매일 메뉴 고민이 사라졌어요. 특히 영양 정보가 표시되어 있어서 건강한 식단 관리에 큰 도움이 돼요.",
    avatar: "👩‍🍳",
    rating: 5,
    highlight: "월 30만원 외식비 절감",
  },
  {
    name: "최동욱",
    role: "요리 초보 · 대전",
    content:
      "요리를 처음 시작하는데 단계별로 설명이 잘 되어 있어서 실패 없이 만들 수 있었어요. 이제는 친구들 초대해서 요리해줄 수 있을 정도로 실력이 늘었어요!",
    avatar: "👨‍🍳",
    rating: 5,
    highlight: "2개월 만에 요리 실력 향상",
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
            index < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
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
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-beige/30 via-white to-white px-4 py-20 md:py-32">
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-200/20 blur-3xl" />

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
          <h2 className="mb-4 text-4xl font-extrabold text-dark md:text-5xl">
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
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-r from-olive-light/20 via-olive-mint/20 to-olive-medium/20 opacity-50 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-gray-200/50 bg-white p-10 shadow-2xl md:p-14">
                <div className="absolute right-8 top-8 text-8xl text-olive-light/10">
                  "
                </div>

                <div className="relative mb-8 flex items-start justify-between">
                  <div className="flex items-center gap-5">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-olive-light/20 to-olive-mint/20 text-4xl shadow-lg">
                      {currentTestimonial.avatar}
                    </div>
                    <div>
                      <h3 className="mb-1 text-2xl font-extrabold text-dark">
                        {currentTestimonial.name}
                      </h3>
                      <p className="mb-2 text-sm text-gray-500">
                        {currentTestimonial.role}
                      </p>
                      <StarRating rating={currentTestimonial.rating} />
                    </div>
                  </div>

                  <div className="hidden rounded-xl bg-olive-mint/10 px-4 py-2 md:block">
                    <p className="text-sm font-bold text-olive-medium">
                      {currentTestimonial.highlight}
                    </p>
                  </div>
                </div>

                <p className="relative text-xl leading-relaxed text-gray-700 md:text-2xl">
                  "{currentTestimonial.content}"
                </p>

                <div className="mt-6 block rounded-xl bg-olive-mint/10 px-4 py-2 md:hidden">
                  <p className="text-sm font-bold text-olive-medium">
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
                    ? "bg-olive-medium shadow-lg shadow-olive-medium/30"
                    : "bg-gray-300 group-hover:bg-gray-400"
                }`}
              />
            </button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col gap-2 rounded-2xl bg-gradient-to-r from-olive-light/5 to-olive-mint/5 px-8 py-6 backdrop-blur-sm sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-extrabold text-olive-medium">
                4.9
              </span>
              <div>
                <StarRating rating={5} />
                <p className="mt-1 text-xs text-gray-500">평균 평점</p>
              </div>
            </div>
            <div className="h-px w-full bg-gray-300 sm:h-10 sm:w-px" />
            <div className="text-center">
              <p className="text-2xl font-extrabold text-dark">1,200+</p>
              <p className="text-xs text-gray-500">누적 사용자 후기</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
