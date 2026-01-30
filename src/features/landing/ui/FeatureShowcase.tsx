"use client";

import { motion } from "motion/react";

type Feature = {
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  benefits: string[];
};

const FEATURES: Feature[] = [
  {
    badge: "유명 최신 레시피",
    badgeColor: "bg-blue-50 text-blue-600",
    title: "10,000개 이상의 검증된 레시피",
    description:
      "다양한 카테고리의 레시피와 유명 유튜버, 셰프들의 레시피 후기들을 만나보세요",
    benefits: ["유명 최신 레시피", "유튜버, 셰프들의 레시피 후기"],
  },
  {
    badge: "AI 추천",
    badgeColor: "bg-purple-50 text-purple-600",
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
    badgeColor: "bg-green-50 text-green-600",
    title: "냉장고 재료로 레시피 자동 추천",
    description:
      "보유한 재료를 등록하면 AI가 만들 수 있는 레시피를 자동으로 찾아드려요. 재료 낭비 없이 효율적으로!",
    benefits: ["남은 재료 활용 레시피"],
  },
];

export const FeatureShowcase = () => {
  return (
    <section className="from-beige/30 to-beige/30 relative w-full overflow-hidden bg-gradient-to-b via-white px-4 py-12 md:py-20">
      <div className="bg-olive-mint/10 absolute top-1/4 left-0 h-96 w-96 rounded-full blur-3xl" />
      <div className="bg-olive-light/10 absolute right-0 bottom-1/4 h-96 w-96 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <div className="bg-olive-light/10 text-olive-medium mb-4 inline-block rounded-full px-4 py-1 text-sm font-semibold">
            핵심 기능
          </div>
          <h2 className="text-dark mb-4 text-4xl font-extrabold md:text-5xl">
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
                <div className="flex-1 space-y-6">
                  <div>
                    <div
                      className={`mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-bold ${feature.badgeColor}`}
                    >
                      {feature.badge}
                    </div>
                    <h3 className="text-dark mb-4 text-3xl leading-tight font-extrabold md:text-4xl lg:text-5xl">
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
                        transition={{
                          duration: 0.4,
                          delay: benefitIndex * 0.1,
                        }}
                        className="flex items-center gap-3"
                      >
                        <div className="bg-olive-mint/20 flex h-6 w-6 items-center justify-center rounded-full">
                          <svg
                            className="text-olive-medium h-4 w-4"
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
