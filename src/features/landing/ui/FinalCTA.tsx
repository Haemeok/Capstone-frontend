"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { Button } from "@/shared/ui/shadcn/button";
import { markLandingVisited } from "@/app/landing/actions";

export const FinalCTA = () => {
  const handleStartClick = async () => {
    await markLandingVisited();
  };
  return (
    <section className="from-olive via-olive-medium to-olive-mint relative w-full overflow-hidden bg-gradient-to-br px-4 py-24 md:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.08),transparent_50%)]" />

      <div className="absolute top-1/2 left-0 h-96 w-96 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute top-1/2 right-0 h-96 w-96 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-10"
        >
          <div className="space-y-6">
            <h2 className="text-5xl leading-[1.1] font-extrabold text-white md:text-6xl lg:text-7xl">
              오늘부터 시작하는
              <br />
              <span className="relative inline-block">
                <span className="absolute -inset-2 animate-pulse bg-white/20 blur-xl" />
                <span className="text-beige relative">더 쉬운 요리 생활</span>
              </span>
            </h2>

            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-white/95 md:text-2xl">
              1,000개 이상의 레시피와 AI 추천, 스마트 재료 관리까지
              <br className="hidden sm:block" />
              지금 바로 무료로 시작해보세요
            </p>
          </div>

          <div className="flex flex-col items-center gap-5 pt-6 sm:flex-row sm:justify-center">
            <Button
              onClick={handleStartClick}
              size="lg"
              className="group text-olive relative h-16 overflow-hidden border-2 border-white/20 bg-white px-10 text-xl font-extrabold shadow-2xl transition-all hover:scale-105 hover:border-white hover:shadow-[0_20px_60px_rgba(255,255,255,0.4)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                무료로 시작하기
                <svg
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              <span className="bg-beige absolute inset-0 -z-0 opacity-0 transition-opacity group-hover:opacity-100" />
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-16 border-2 border-white/50 bg-white/10 px-10 text-xl font-bold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/20"
            >
              <Link href="/search">인기 레시피 둘러보기</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
