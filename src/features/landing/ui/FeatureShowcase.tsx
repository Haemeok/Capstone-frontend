"use client";

import { motion } from "motion/react";

type Feature = {
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  benefits: string[];
  visual: {
    type: "grid" | "single";
    items: Array<{ icon: string; label: string; color: string }>;
  };
};

const FEATURES: Feature[] = [
  {
    badge: "레시피 라이브러리",
    badgeColor: "bg-blue-50 text-blue-600",
    title: "1,000개 이상의 검증된 레시피",
    description:
      "한식, 양식, 중식, 일식부터 디저트까지. 전문가가 검증한 다양한 레시피를 한곳에서 만나보세요.",
    benefits: [
      "카테고리별 체계적 분류",
      "난이도별 레시피 추천",
      "조리 시간 및 칼로리 정보",
    ],
    visual: {
      type: "grid",
      items: [
        { icon: "🍚", label: "한식", color: "from-red-400 to-orange-400" },
        { icon: "🍝", label: "양식", color: "from-yellow-400 to-amber-400" },
        { icon: "🥟", label: "중식", color: "from-rose-400 to-pink-400" },
        { icon: "🍰", label: "디저트", color: "from-purple-400 to-violet-400" },
      ],
    },
  },
  {
    badge: "스마트 관리",
    badgeColor: "bg-green-50 text-green-600",
    title: "냉장고 재료로 레시피 자동 추천",
    description:
      "보유한 재료를 등록하면 AI가 만들 수 있는 레시피를 자동으로 찾아드려요. 재료 낭비 없이 효율적으로!",
    benefits: [
      "재료 유통기한 자동 알림",
      "남은 재료 활용 레시피",
      "장보기 목록 자동 생성",
    ],
    visual: {
      type: "single",
      items: [
        {
          icon: "🥬",
          label: "스마트 재료 관리",
          color: "from-green-400 to-emerald-500",
        },
      ],
    },
  },
  {
    badge: "AI 추천",
    badgeColor: "bg-purple-50 text-purple-600",
    title: "당신만을 위한 맞춤 레시피",
    description:
      "입맛, 식습관, 건강 목표를 학습하여 완벽한 레시피를 추천해드려요. 매일 새로운 요리의 즐거움을 경험하세요.",
    benefits: [
      "개인 맞춤 영양 분석",
      "선호도 기반 추천",
      "계절별 제철 재료 활용",
    ],
    visual: {
      type: "single",
      items: [
        {
          icon: "🤖",
          label: "AI 추천 시스템",
          color: "from-purple-400 to-pink-500",
        },
      ],
    },
  },
];

const FeatureVisual = ({ visual }: { visual: Feature["visual"] }) => {
  if (visual.type === "grid") {
    return (
      <div className="grid grid-cols-2 gap-4">
        {visual.items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
          >
            <div
              className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.color} opacity-20 blur-xl transition-opacity group-hover:opacity-40`}
            />
            <div className="relative flex aspect-square flex-col items-center justify-center gap-3 rounded-3xl border border-gray-200/50 bg-white p-6 shadow-xl transition-all group-hover:scale-105 group-hover:shadow-2xl">
              <span className="text-6xl">{item.icon}</span>
              <span className="text-sm font-bold text-gray-700">
                {item.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  const item = visual.items[0];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group relative"
    >
      <div
        className={`absolute inset-0 rounded-[3rem] bg-gradient-to-br ${item.color} opacity-30 blur-3xl`}
      />
      <div className="relative flex aspect-square items-center justify-center rounded-[3rem] border-2 border-gray-200/50 bg-white shadow-2xl transition-all group-hover:scale-105">
        <div className="text-center">
          <div className="mb-4 text-9xl">{item.icon}</div>
          <div className="text-xl font-bold text-gray-700">{item.label}</div>
        </div>
      </div>
    </motion.div>
  );
};

export const FeatureShowcase = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-beige/30 via-white to-beige/30 px-4 py-20 md:py-32">
      <div className="absolute left-0 top-1/4 h-96 w-96 rounded-full bg-olive-mint/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-0 h-96 w-96 rounded-full bg-olive-light/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <div className="mb-4 inline-block rounded-full bg-olive-light/10 px-4 py-1 text-sm font-semibold text-olive-medium">
            핵심 기능
          </div>
          <h2 className="mb-4 text-4xl font-extrabold text-dark md:text-5xl">
            요리를 더 쉽게 만드는 방법
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            복잡한 요리 과정을 단순하게, 당신의 주방을 스마트하게
          </p>
        </motion.div>

        <div className="space-y-32">
          {FEATURES.map((feature, index) => {
            const isReversed = index % 2 === 1;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                className={`flex flex-col items-center gap-12 lg:gap-16 ${
                  isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                }`}
              >
                <div className="flex-1">
                  <FeatureVisual visual={feature.visual} />
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <div
                      className={`mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-bold ${feature.badgeColor}`}
                    >
                      {feature.badge}
                    </div>
                    <h3 className="mb-4 text-3xl font-extrabold leading-tight text-dark md:text-4xl lg:text-5xl">
                      {feature.title}
                    </h3>
                    <p className="text-lg leading-relaxed text-gray-600">
                      {feature.description}
                    </p>
                  </div>

                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <motion.li
                        key={benefitIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: benefitIndex * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-olive-mint/20">
                          <svg
                            className="h-4 w-4 text-olive-medium"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-base font-medium text-gray-700">
                          {benefit}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
