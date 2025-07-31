"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/shared/lib/utils";
import Circle from "@/shared/ui/Circle";
import Ratings from "@/shared/ui/Ratings";

import { useRecipeDetailQuery } from "@/entities/recipe/model/hooks";
import { useUserStore } from "@/entities/user";

import usePostReviewMutation from "@/features/recipe-review/model/hooks";

import { useToastStore } from "@/widgets/Toast";

const ReviewPage = () => {
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const { user } = useUserStore();
  const { addToast } = useToastStore();
  const { recipeId } = useParams();
  const router = useRouter();
  const { recipeData } = useRecipeDetailQuery(Number(recipeId));

  const { mutate: postReview, isPending } = usePostReviewMutation(
    Number(recipeId)
  );

  const handleReviewTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReviewText(event.target.value);
  };

  const handleSubmit = () => {
    postReview(
      { comment: reviewText, rating },
      {
        onSuccess: () => {
          router.replace(`/recipes/${recipeId}`);
          addToast({
            message: "코멘트가 작성되었습니다.",
            variant: "default",
            position: "bottom",
            size: "medium",
          });
          setReviewText("");
          setRating(0);
        },
      }
    );
  };

  const submitDisabled = reviewText.trim().length === 0 || rating === 0;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="relative flex items-center justify-center border-b border-gray-200 p-4">
        <button
          onClick={() => router.back()}
          type="button"
          className="absolute left-4 text-gray-600"
        >
          취소
        </button>
        <h1 className="text-xl font-semibold">평가하기</h1>
      </header>

      <main className="flex-grow p-6">
        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-2xl font-bold">
            {recipeData.title} 만들어 보셨나요?
          </h2>
          <h2 className="text-2xl font-bold">평가해주세요!</h2>
          <div className="flex justify-center">
            <Ratings
              starCount={5}
              precision={0.5}
              allowHalf={true}
              value={rating}
              onChange={(value) => setRating(value)}
            />
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-1">
          <h3 className="mb-2 text-base font-medium text-gray-700">
            커뮤니티를 위해 레시피에 대한 자세한 피드백이나 조언을 공유해주세요.
            여러분의 경험이 큰 도움이 될 거예요!
          </h3>
          <div className="rounded-lg border border-gray-300 p-4">
            <div className="mb-3 flex items-start">
              <img
                src={user?.profileImage || ""}
                alt="프로필 이미지"
                className="mr-3 rounded-full w-8 h-8 flex-shrink-0"
                width={32}
                height={32}
              />
              <div className="flex-grow">
                <p className="font-semibold text-gray-800">{user?.nickname}</p>
                <textarea
                  className="text-dark mt-1 min-h-20 w-full resize-none placeholder-gray-400 focus:outline-none"
                  rows={3}
                  placeholder="예) 정말 맛있었어요! 저는 여기에 꿀을 살짝 추가했더니 풍미가 더 좋더라고요."
                  value={reviewText}
                  onChange={handleReviewTextChange}
                />
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          disabled={submitDisabled}
          onClick={handleSubmit}
          className={cn(
            "mt-4 flex w-full items-center justify-center rounded-lg py-3 font-semibold text-white",
            "transition-all duration-300 ease-in-out",
            submitDisabled
              ? "bg-gray-300"
              : "bg-olive-light hover:bg-opacity-90"
          )}
        >
          {isPending ? <Circle size={20} /> : <p>코멘트 작성하기</p>}
        </button>
      </main>
    </div>
  );
};

export default ReviewPage;
