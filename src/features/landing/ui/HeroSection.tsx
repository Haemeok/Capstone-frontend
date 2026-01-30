"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { Button } from "@/shared/ui/shadcn/button";
import { markLandingVisited } from "@/app/landing/actions";
import { CarouselRow } from "./RecipeCarousel";

export const HeroSection = () => {
  const handleStartClick = async () => {
    await markLandingVisited();
  };
  return (
    <section className="via-beige/30 relative overflow-hidden bg-gradient-to-b from-white to-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(145,199,136,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(67,194,120,0.08),transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative flex min-h-[70vh] flex-col items-center justify-center px-4 pt-20 text-center md:pt-32"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="border-olive-light/30 bg-olive-light/10 font-bold text-olive-medium mb-6 inline-block rounded-full border px-6 py-2 text-sm  backdrop-blur-sm"
        >
          🍳 10,000+ 레시피 · AI 추천 · 스마트 재료 관리
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-dark mb-8 max-w-5xl text-5xl leading-[1.15] font-extrabold tracking-tight md:text-7xl lg:text-8xl"
        >
          매일의 요리를
          <br />
          <span className="relative inline-block">
            <span className="from-olive-light via-olive-mint to-olive-medium absolute -inset-1 animate-pulse bg-gradient-to-r opacity-20 blur-2xl" />
            <span className="from-olive via-olive-medium to-olive-mint relative bg-gradient-to-r bg-clip-text text-transparent">
              더 쉽고 즐겁게
            </span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12 max-w-3xl text-xl leading-relaxed text-gray-600 md:text-2xl"
        >
          복잡한 레시피 검색은 그만, 냉장고 재료로 바로 만드는
          <br className="hidden sm:block" />
          <span className="text-olive-medium font-semibold">
            당신만을 위한 맞춤 레시피
          </span>
          를 경험하세요
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col items-center gap-4 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="group from-olive-medium to-olive-mint shadow-olive-medium/30 hover:shadow-olive-mint/40 relative h-14 overflow-hidden bg-gradient-to-r px-8 text-lg font-bold text-white shadow-2xl transition-all hover:shadow-2xl"
          >
            <Link href="/" onClick={handleStartClick}>
              <span className="relative z-10">무료로 시작하기</span>
              <span className="from-olive to-olive-medium absolute inset-0 -z-0 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span>회원가입 불필요</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span>무료로 모든 기능 이용</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span>1분만에 시작</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Recipe Carousel Section */}
      <div className="relative mt-12 pb-8">
        <div className="space-y-5">
          <CarouselRow direction="left" />
          <CarouselRow direction="right" />
        </div>
      </div>
    </section>
  );
};
