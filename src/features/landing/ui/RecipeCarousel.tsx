"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const CARD_COUNT = 8;
const CARD_WIDTH = 340;
const CARD_GAP = 20;
const ANIMATION_DURATION = 50;

const RECIPE_CATEGORIES = [
  { name: "한식", color: "from-red-400 to-orange-400", icon: "🍚" },
  { name: "양식", color: "from-yellow-400 to-amber-400", icon: "🍝" },
  { name: "중식", color: "from-rose-400 to-pink-400", icon: "🥟" },
  { name: "일식", color: "from-blue-400 to-cyan-400", icon: "🍱" },
  { name: "디저트", color: "from-purple-400 to-violet-400", icon: "🍰" },
  { name: "샐러드", color: "from-green-400 to-emerald-400", icon: "🥗" },
  { name: "스프", color: "from-orange-400 to-red-400", icon: "🍲" },
  { name: "음료", color: "from-cyan-400 to-blue-400", icon: "🧃" },
];

const RecipeCard = ({ index }: { index: number }) => {
  const category = RECIPE_CATEGORIES[index % RECIPE_CATEGORIES.length];

  return (
    <div className="group flex-shrink-0 overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div
        className={`relative flex items-center justify-center bg-gradient-to-br ${category.color}`}
        style={{ width: CARD_WIDTH, height: 240 }}
      >
        <div className="absolute inset-0 bg-white/0 transition-all duration-300 group-hover:bg-white/10" />
        <div className="relative text-center">
          <div className="mb-3 text-7xl drop-shadow-lg">{category.icon}</div>
          <div className="rounded-full bg-white/90 px-6 py-2 backdrop-blur-sm">
            <span className="text-lg font-bold text-gray-800">
              {category.name}
            </span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="mb-2 h-2 w-3/4 rounded bg-gray-200" />
        <div className="h-2 w-1/2 rounded bg-gray-100" />
      </div>
    </div>
  );
};

const CarouselRow = ({
  direction = "left",
}: {
  direction?: "left" | "right";
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rowRef.current) return;

    const totalWidth = (CARD_WIDTH + CARD_GAP) * CARD_COUNT;
    const isLeftDirection = direction === "left";

    gsap.set(rowRef.current, {
      x: isLeftDirection ? 0 : -totalWidth / 2,
    });

    const animation = gsap.to(rowRef.current, {
      x: isLeftDirection ? -totalWidth / 2 : 0,
      duration: ANIMATION_DURATION,
      ease: "none",
      repeat: -1,
    });

    return () => {
      animation.kill();
    };
  }, [direction]);

  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={rowRef}
        className="flex"
        style={{
          width: (CARD_WIDTH + CARD_GAP) * CARD_COUNT * 2,
          gap: CARD_GAP,
        }}
      >
        {Array.from({ length: CARD_COUNT * 2 }).map((_, index) => (
          <RecipeCard key={index} index={index % CARD_COUNT} />
        ))}
      </div>
    </div>
  );
};

export const RecipeCarousel = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-white via-beige/40 to-white py-20 md:py-32">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative mb-16 px-4 text-center">
        <div className="mb-4 inline-block rounded-full bg-olive-light/10 px-4 py-1 text-sm font-semibold text-olive-medium">
          레시피 카테고리
        </div>
        <h2 className="mb-4 text-4xl font-extrabold text-dark md:text-5xl">
          다양한 레시피를 만나보세요
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          한식, 양식, 중식, 일식부터 디저트까지
          <br className="hidden sm:block" />
          모든 카테고리의 레시피가 한 곳에
        </p>
      </div>

      <div className="space-y-5">
        <CarouselRow direction="left" />
        <CarouselRow direction="right" />
      </div>

      <div className="mt-16 text-center">
        <p className="text-sm font-medium text-gray-500">
          매주 새로운 레시피가 업데이트됩니다
        </p>
      </div>
    </section>
  );
};
