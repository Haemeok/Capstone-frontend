import { TOTAL_RECIPE_COUNT_LABEL } from "@/shared/config/constants/siteStats";
import { Button } from "@/shared/ui/shadcn/button";
import { StoreBadges } from "@/shared/ui/StoreBadges";

import { markLandingVisited } from "@/app/landing/actions";

import { CarouselRow } from "./RecipeCarousel";

export const HeroSection = () => {
  return (
    <section className="via-beige/30 relative overflow-hidden bg-gradient-to-b from-white to-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(145,199,136,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(67,194,120,0.08),transparent_50%)]" />

      <div className="relative flex min-h-[70vh] flex-col items-center justify-center px-4 pt-20 text-center md:pt-32">
        <div
          className="hero-rise border-olive-light/30 bg-olive-light/10 text-olive-medium mb-6 inline-block rounded-full border px-6 py-2 text-sm font-bold backdrop-blur-sm"
          style={{ animationDelay: "0.1s" }}
        >
          🍳 {TOTAL_RECIPE_COUNT_LABEL} 레시피 · YouTube 링크 추출 · AI 맞춤
          추천
        </div>

        <h1
          className="hero-rise text-ink mb-8 max-w-5xl text-5xl leading-[1.15] font-extrabold tracking-tight md:text-7xl lg:text-8xl"
          style={{ animationDelay: "0.2s" }}
        >
          매일의 요리를
          <br />
          <span className="relative inline-block">
            <span className="from-olive-light via-olive-mint to-olive-medium absolute -inset-1 animate-pulse bg-gradient-to-r opacity-20 blur-2xl" />
            <span className="from-olive via-olive-medium to-olive-mint relative bg-gradient-to-r bg-clip-text text-transparent">
              더 쉽고 즐겁게
            </span>
          </span>
        </h1>

        <p
          className="hero-rise text-ink-sub mb-12 max-w-3xl text-xl leading-relaxed md:text-2xl"
          style={{ animationDelay: "0.4s" }}
        >
          <span className="text-olive-medium font-semibold">
            YouTube 링크 하나로 레시피를 저장
          </span>
          하고,
          <br className="hidden sm:block" />
          {TOTAL_RECIPE_COUNT_LABEL} 레시피에서 AI가 맞춤 추천해드려요
        </p>

        <form
          action={markLandingVisited}
          className="hero-rise flex flex-col items-center gap-4 sm:flex-row"
          style={{ animationDelay: "0.6s" }}
        >
          <Button
            type="submit"
            size="lg"
            className="group from-olive-medium to-olive-mint shadow-olive-medium/30 hover:shadow-olive-mint/40 relative h-14 overflow-hidden bg-gradient-to-r px-8 text-lg font-bold text-white shadow-2xl transition-all hover:shadow-2xl"
          >
            <span className="relative z-10">무료로 시작하기</span>
            <span className="from-olive to-olive-medium absolute inset-0 -z-0 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100" />
          </Button>
        </form>

        <div className="hero-rise mt-8" style={{ animationDelay: "0.8s" }}>
          <StoreBadges showAndroidNote />
        </div>

        <div
          className="hero-rise text-ink-muted mt-16 flex flex-wrap items-center justify-center gap-8 text-sm"
          style={{ animationDelay: "1.2s" }}
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
        </div>
      </div>

      <div className="relative mt-12 pb-8">
        <div className="space-y-5">
          <CarouselRow direction="left" />
          <CarouselRow direction="right" />
        </div>
      </div>
    </section>
  );
};
