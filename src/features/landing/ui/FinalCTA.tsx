"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Image } from "@/shared/ui/image/Image";

import { Button } from "@/shared/ui/shadcn/button";
import { markLandingVisited } from "@/app/landing/actions";

export const FinalCTA = () => {
  const handleStartClick = async () => {
    await markLandingVisited();
  };
  return (
    <section className="relative w-full overflow-hidden bg-white px-4 py-24 md:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(145,199,136,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(67,194,120,0.08),transparent_50%)]" />

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-10"
        >
          <div className="space-y-6">
            <h2 className="text-dark text-5xl leading-[1.1] font-extrabold md:text-6xl lg:text-7xl">
              오늘부터 시작하는
              <br />
              <span className="relative inline-block">
                <span className="from-olive-light via-olive-mint to-olive-medium absolute -inset-1 animate-pulse bg-gradient-to-r opacity-20 blur-2xl" />
                <span className="from-olive via-olive-medium to-olive-mint relative bg-gradient-to-r bg-clip-text text-transparent">
                  더 쉬운 요리 생활
                </span>
              </span>
            </h2>

            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600 md:text-2xl">
              1,000개 이상의 레시피와 AI 추천, 스마트 재료 관리까지
              <br className="hidden sm:block" />
              지금 바로 무료로 시작해보세요
            </p>
          </div>

          <div className="flex flex-col items-center gap-5 pt-6 sm:flex-row sm:justify-center">
            <Button
              onClick={handleStartClick}
              size="lg"
              className="group from-olive-medium to-olive-mint shadow-olive-medium/30 hover:shadow-olive-mint/40 relative h-14 overflow-hidden bg-gradient-to-r px-8 text-lg font-bold text-white shadow-2xl transition-all hover:shadow-2xl"
            >
              <span className="relative z-10">무료로 시작하기</span>
              <span className="from-olive to-olive-medium absolute inset-0 -z-0 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100" />
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-dark hover:border-olive hover:bg-olive/10 h-16 border-2 border-gray-300 bg-white px-10 text-xl font-bold backdrop-blur-sm transition-all"
            >
              <Link href="/search">인기 레시피 둘러보기</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
