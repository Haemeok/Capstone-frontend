"use client";

import { motion } from "motion/react";
import { Image } from "@/shared/ui/image/Image";

type ProblemCard = {
  image: string;
  title: string;
  description: string;
  accent: string;
};

const PROBLEMS: ProblemCard[] = [
  {
    image: "/landing/graph.webp",
    title: "치솟는 외식물가와 배달물가",
    description:
      "매일 오르는 외식 비용, 이제는 집에서 요리하는 것이 더 경제적이에요",
    accent: "from-red-500/10 to-orange-500/10",
  },
  {
    image: "/landing/note.webp",
    title: "재료 정리가 불편한 유튜브 영상",
    description:
      "영상을 보며 재료를 일일이 메모하고 정리하는 번거로움, 이제 그만!",
    accent: "from-yellow-500/10 to-amber-500/10",
  },
  {
    image: "/landing/search.webp",
    title: "남은 재료, 어떻게 처리하죠?",
    description: "레시피대로 만들었는데 남은 재료 처리가 고민이신가요?",
    accent: "from-blue-500/10 to-cyan-500/10",
  },
  {
    image: "/landing/sleep.webp",
    title: "요리 시간이 너무 오래 걸려요",
    description:
      "바쁜 일상 속에서도 빠르고 간편하게 만들 수 있는 레시피가 필요해요",
    accent: "from-purple-500/10 to-violet-500/10",
  },
];

export const ProblemCards = () => {
  return (
    <section className="to-beige/30 relative w-full overflow-hidden bg-gradient-to-b from-white px-4 py-12 md:py-20">
      <div className="bg-olive-light/5 absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-block rounded-full bg-red-50 px-4 py-1 text-sm font-semibold text-red-600">
            이런 경험 있으신가요?
          </div>
          <h2 className="text-dark mb-4 text-4xl font-extrabold md:text-5xl">
            요리, 왜 이렇게 어려울까요?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            많은 분들이 겪고 있는 요리의 어려움,
            <br className="hidden sm:block" />더 이상 혼자 고민하지 마세요
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {PROBLEMS.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${problem.accent} opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100`}
              />
              <div className="h-full rounded-3xl border border-gray-200/50 bg-white p-4 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:border-gray-300 group-hover:shadow-2xl md:p-8">
                <div className="mb-4 flex justify-center md:mb-6">
                  <Image
                    src={problem.image}
                    alt={problem.title}
                    wrapperClassName="h-28 w-28 md:h-32 md:w-32 lg:h-40 lg:w-40"
                  />
                </div>

                <h3 className="text-dark mb-2 text-sm leading-tight font-bold text-balance break-keep md:mb-4 md:text-xl">
                  {problem.title}
                </h3>
                <p className="text-xs leading-relaxed text-pretty break-keep text-gray-600 md:text-sm">
                  {problem.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
