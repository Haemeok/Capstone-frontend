"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Image } from "@/shared/ui/image/Image";
import {
  ICON_BASE_URL,
  IMAGE_BASE_URL,
} from "@/shared/config/constants/recipe";

type StatCard = {
  image: string;
  metric: string;
  label: string;
  description: string;
  accent: string;
};

const STATS: StatCard[] = [
  {
    image: `${ICON_BASE_URL}money.webp`,
    metric: "45%",
    label: "월 평균 식비 절감",
    description: "배달·외식 대비 절약 효과",
    accent: "from-green-500/10 to-emerald-500/10",
  },
  {
    image: `${ICON_BASE_URL}clock.webp`,
    metric: "48분",
    label: "일 평균 고민 시간 단축",
    description: "'오늘 뭐 먹지?' 결정 시간",
    accent: "from-blue-500/10 to-cyan-500/10",
  },
  {
    image: `${ICON_BASE_URL}food.webp`,
    metric: "98%",
    label: "냉장고 재료 소진율",
    description: "버려지는 식재료 최소화",
    accent: "from-orange-500/10 to-amber-500/10",
  },
  {
    image: `${ICON_BASE_URL}book.webp`,
    metric: "5,000+",
    label: "검증된 셰프 레시피",
    description: "매주 업데이트되는 큐레이션",
    accent: "from-purple-500/10 to-pink-500/10",
  },
];
const AnimatedCounter = ({ value }: { value: string }) => {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayValue(value);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value]);

  return (
    <div
      ref={ref}
      className="from-olive-light via-olive-mint to-olive-medium bg-gradient-to-br bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl lg:text-5xl"
    >
      {displayValue}
    </div>
  );
};

export const StatsSection = () => {
  return (
    <section className="from-beige/30 relative w-full overflow-hidden bg-gradient-to-b to-white px-4 py-12 md:py-20">
      <div className="bg-olive-mint/5 absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-dark mb-4 text-4xl font-extrabold md:text-5xl">
            실제 사용자들의 결과
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            레시피오에서 요리를 시작한 사용자들이
            <br className="hidden sm:block" />
            경험한 실제 변화를 확인하세요
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${stat.accent} opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100`}
              />
              <div className="relative h-full rounded-3xl border border-gray-200/50 bg-white p-4 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:border-gray-300 group-hover:shadow-2xl md:p-8">
                <div className="mb-4 flex justify-center md:mb-6">
                  <Image
                    src={stat.image}
                    alt={stat.label}
                    wrapperClassName="h-28 w-28 md:h-32 md:w-32 lg:h-40 lg:w-40"
                  />
                </div>
                <AnimatedCounter value={stat.metric} />
                <h3 className="text-dark mt-3 mb-1 text-sm font-bold text-balance break-keep md:mt-4 md:mb-2 md:text-xl">
                  {stat.label}
                </h3>
                <p className="text-xs text-pretty break-keep text-gray-500 md:text-sm">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
