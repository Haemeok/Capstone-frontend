"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { Button } from "@/shared/ui/shadcn/button";

export const FinalCTA = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-olive via-olive-medium to-olive-mint px-4 py-24 md:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.08),transparent_50%)]" />

      <div className="absolute left-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-10"
        >
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 inline-block"
            >
              <div className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 backdrop-blur-sm">
                <p className="text-sm font-bold text-white">
                  🎉 지금 가입하면 첫 달 프리미엄 기능 무료
                </p>
              </div>
            </motion.div>

            <h2 className="text-5xl font-extrabold leading-[1.1] text-white md:text-6xl lg:text-7xl">
              오늘부터 시작하는
              <br />
              <span className="relative inline-block">
                <span className="absolute -inset-2 animate-pulse bg-white/20 blur-xl" />
                <span className="relative text-beige">더 쉬운 요리 생활</span>
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
              asChild
              size="lg"
              className="group relative h-16 overflow-hidden border-2 border-white/20 bg-white px-10 text-xl font-extrabold text-olive shadow-2xl transition-all hover:scale-105 hover:border-white hover:shadow-[0_20px_60px_rgba(255,255,255,0.4)]"
            >
              <Link href="/recipes/new/ai">
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
                <span className="absolute inset-0 -z-0 bg-beige opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
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

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="space-y-6 pt-8"
          >
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/90 md:gap-8">
              <div className="flex items-center gap-2">
                <svg
                  className="h-6 w-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">신용카드 불필요</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-6 w-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">즉시 이용 가능</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-6 w-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">언제든 해지 가능</span>
              </div>
            </div>

            <p className="text-sm text-white/70">
              이미 1,200명 이상이 더 쉬운 요리 생활을 경험하고 있어요
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
