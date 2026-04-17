"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AIModelId, aiModels } from "@/shared/config/constants/aiModel";
import { getRecentAIRecipes } from "@/shared/config/constants/localStorage";
import { SAVINGS_BASE_URL } from "@/shared/config/constants/recipe";
import { Image } from "@/shared/ui/image/Image";

import type { StaticDetailedRecipeGridItem } from "@/entities/recipe";

import useAuthenticatedAction from "@/features/auth/model/hooks/useAuthenticatedAction";

import StaticRecipeSlide from "@/widgets/RecipeSlide/StaticRecipeSlide";

const KEYWORDS = ["#자취생", "#다이어트", "#파인다이닝", "#가성비"];

// Temporary toy images mapping (to be replaced with actual assets)
const TEMP_TOY_IMAGES: Record<AIModelId, string> = {
  INGREDIENT_FOCUS: `${SAVINGS_BASE_URL}refrigerator.webp`,
  COST_EFFECTIVE: `${SAVINGS_BASE_URL}bbq.webp`,
  NUTRITION_BALANCE: `${SAVINGS_BASE_URL}omakase.webp`,
  FINE_DINING: `${SAVINGS_BASE_URL}mosu_dinner.webp`,
};

type AIModelInfo = {
  id: AIModelId;
  emoji: string;
  title: string;
  features: Array<{ icon: string; title: string; description: string }>;
  stats: { cookingTime: string; difficulty: string };
};

const AI_MODEL_DESCRIPTIONS: Record<AIModelId, AIModelInfo> = {
  INGREDIENT_FOCUS: {
    id: "INGREDIENT_FOCUS",
    emoji: "🥘",
    title: "냉장고 파먹기",
    features: [
      {
        icon: "♻️",
        title: "음식물 쓰레기 감소",
        description: "남은 재료를 활용해 환경도 지키고",
      },
      {
        icon: "🎨",
        title: "창의적인 조합",
        description: "예상치 못한 맛의 발견",
      },
      {
        icon: "💰",
        title: "장보기 부담 제로",
        description: "집에 있는 재료로 완성",
      },
    ],
    stats: { cookingTime: "30-40분", difficulty: "초급-중급" },
  },
  COST_EFFECTIVE: {
    id: "COST_EFFECTIVE",
    emoji: "💰",
    title: "가성비 요리",
    features: [
      {
        icon: "🏪",
        title: "저렴한 재료",
        description: "마트에서 쉽게 구할 수 있는",
      },
      {
        icon: "✨",
        title: "근사한 완성도",
        description: "적은 비용으로 특별한 한 끼",
      },
      {
        icon: "📊",
        title: "가격 투명성",
        description: "예산 내에서 딱 맞는 레시피",
      },
    ],
    stats: { cookingTime: "25-35분", difficulty: "초급" },
  },
  NUTRITION_BALANCE: {
    id: "NUTRITION_BALANCE",
    emoji: "💪",
    title: "영양 밸런스",
    features: [
      {
        icon: "🥗",
        title: "탄단지 균형",
        description: "영양소 비율을 정확하게",
      },
      {
        icon: "📉",
        title: "칼로리 관리",
        description: "목표 칼로리에 맞춘 식단",
      },
      {
        icon: "🏋️",
        title: "운동과 함께",
        description: "다이어트와 건강 관리에 최적화",
      },
    ],
    stats: { cookingTime: "35-45분", difficulty: "중급" },
  },
  FINE_DINING: {
    id: "FINE_DINING",
    emoji: "⭐",
    title: "파인 다이닝",
    features: [
      {
        icon: "👨‍🍳",
        title: "셰프의 기술",
        description: "미슐랭 레스토랑의 노하우",
      },
      {
        icon: "🎭",
        title: "아름다운 플레이팅",
        description: "눈으로 먼저 즐기는 요리",
      },
      {
        icon: "🍾",
        title: "특별한 순간",
        description: "기념일과 특별한 날을 위한",
      },
    ],
    stats: { cookingTime: "60-90분", difficulty: "고급" },
  },
};

type AIModelCardProps = {
  modelId: AIModelId;
  onClick: () => void;
};

const AIModelCard = ({ modelId, onClick }: AIModelCardProps) => {
  const model = aiModels[modelId];
  const modelInfo = AI_MODEL_DESCRIPTIONS[modelId];

  return (
    <button
      onClick={onClick}
      className="flex flex-col overflow-hidden rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={TEMP_TOY_IMAGES[modelId]}
          alt={model.name}
          wrapperClassName="absolute inset-0"
          imgClassName="object-contain"
          fit="contain"
        />
      </div>

      <div className="flex flex-col gap-2 p-4 text-center">
        <h3 className="text-base font-bold text-gray-900 md:text-lg">
          {model.name}
        </h3>
        <p className="text-xs leading-relaxed text-gray-600 md:text-sm">
          {modelInfo.features[0].description}{" "}
          {modelInfo.features[1].description}
        </p>
      </div>
    </button>
  );
};

const AIModelSelection = () => {
  const router = useRouter();
  const [recentRecipes, setRecentRecipes] = useState<
    StaticDetailedRecipeGridItem[]
  >([]);

  useEffect(() => {
    const recent = getRecentAIRecipes();
    const recipes: StaticDetailedRecipeGridItem[] = recent.map((item) => ({
      id: item.recipeId,
      title: item.title,
      imageUrl: item.imageUrl,
      authorName: item.authorName,
      authorId: item.authorId,
      profileImage: item.profileImage,
      cookingTime: item.cookingTime,
      createdAt: item.createdAt,
      avgRating: 0,
      ratingCount: 0,
      likeCount: 0,
    }));
    setRecentRecipes(recipes);
  }, []);

  const navigateToModel = (modelId: AIModelId) => {
    switch (modelId) {
      case "INGREDIENT_FOCUS":
        router.push("/recipes/new/ai/ingredient");
        break;
      case "COST_EFFECTIVE":
        router.push("/recipes/new/ai/price");
        break;
      case "NUTRITION_BALANCE":
        router.push("/recipes/new/ai/nutrition");
        break;
      case "FINE_DINING":
        router.push("/recipes/new/ai/finedining");
        break;
    }
  };

  const authenticatedSelectAI = useAuthenticatedAction<AIModelId, void>(
    navigateToModel,
    { notifyOnly: true }
  );

  const aiModelArray = Object.values(aiModels);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex w-full flex-col items-center gap-8 p-4 md:items-center md:justify-center md:py-12">
        <div className="flex w-full max-w-5xl flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-4xl">👨‍🍳</p>
            <p className="text-dark text-xl font-bold md:text-3xl">
              어떤 AI와 함께 요리할까요?
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {KEYWORDS.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700"
              >
                {keyword}
              </span>
            ))}
          </div>

          <div className="grid w-full grid-cols-2 gap-4 md:gap-6">
            {aiModelArray.map((ai) => (
              <AIModelCard
                key={ai.id}
                modelId={ai.id}
                onClick={() => authenticatedSelectAI(ai.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {recentRecipes.length > 0 && (
        <div className="w-full bg-gray-50 py-8">
          <div className="mx-auto max-w-5xl px-4">
            <StaticRecipeSlide
              title="최근 AI 레시피"
              staticRecipes={recentRecipes}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AIModelSelection;
