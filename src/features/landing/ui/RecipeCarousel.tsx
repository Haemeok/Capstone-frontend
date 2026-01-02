"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { IMAGE_BASE_URL } from "@/shared/config/constants/recipe";
import { Image } from "@/shared/ui/image/Image";

const CARD_COUNT = 8;
const CARD_WIDTH = 340;
const CARD_GAP = 20;
const ANIMATION_DURATION = 50;

const RECIPE_CATEGORIES = [
  1314, 1313, 1312, 1311, 1310, 1309, 1308, 1305, 1304, 1303, 1302, 1301, 1300,
  1298, 1297, 1296, 1295, 1294, 1293, 1292, 1291, 1290, 1189, 1188, 1187,
];

const RecipeCard = ({
  index,
  direction,
}: {
  index: number;
  direction: "left" | "right";
}) => {
  const module = direction === "left" ? 2 * index + 1 : 2 * index;
  const id = RECIPE_CATEGORIES[module % RECIPE_CATEGORIES.length];
  const imageUrl = `${IMAGE_BASE_URL}recipes/7/${id}/main.webp`;

  return (
    <div className="group flex-shrink-0 overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <Image
        src={imageUrl}
        alt={`Recipe ${id}`}
        width={CARD_WIDTH}
        height={240}
      />
    </div>
  );
};

export const CarouselRow = ({
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
          <RecipeCard
            key={index}
            index={index % CARD_COUNT}
            direction={direction}
          />
        ))}
      </div>
    </div>
  );
};

export const RecipeCarousel = () => {
  return (
    <section className="via-beige/40 relative w-full overflow-hidden bg-gradient-to-b from-white to-white py-20 md:py-32">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative mb-16 px-4 text-center">
        <div className="bg-olive-light/10 text-olive-medium mb-4 inline-block rounded-full px-4 py-1 text-sm font-semibold">
          레시피 카테고리
        </div>
        <h2 className="text-dark mb-4 text-4xl font-extrabold md:text-5xl">
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
