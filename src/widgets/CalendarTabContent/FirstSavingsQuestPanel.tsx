"use client";

import { useRouter } from "next/navigation";

import { ONBOARDING_RECIPE_ID } from "@/shared/config/constants/recipe";

const FirstSavingsQuestPanel = () => {
  const router = useRouter();

  const handleQuestClick = () => {
    router.push(`/recipes/${ONBOARDING_RECIPE_ID}`);
  };

  return (
    <div className="from-olive-light/5 to-beige-light/5 mx-auto my-6 flex max-w-sm flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gradient-to-br p-8 text-center">
      <h4 className="mb-3 text-lg font-bold text-gray-800">
        첫 절약 퀘스트에 도전하세요!
      </h4>
      <p className="mb-6 text-sm leading-relaxed text-gray-600">
        '요리 완료' 버튼을 누르면
        <br />이 캘린더에 절약 금액이 쌓여요.
      </p>
      <button
        onClick={handleQuestClick}
        className="bg-olive-mint hover:bg-olive-light rounded-full px-6 py-3 font-semibold text-white transition-all active:scale-95"
      >
        🎯 첫 절약 퀘스트 하러가기
      </button>
    </div>
  );
};

export default FirstSavingsQuestPanel;
