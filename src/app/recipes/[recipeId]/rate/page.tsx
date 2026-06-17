"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";

import { format, useLocalizedRouter, useRatingsDict } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";
import Circle from "@/shared/ui/Circle";
import { Container } from "@/shared/ui/Container";
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
  const { recipeId } = useParams<{ recipeId: string }>();
  const router = useLocalizedRouter();
  const { form: t } = useRatingsDict();
  const { recipeData } = useRecipeDetailQuery(recipeId);

  const { mutate: postReview, isPending } = usePostReviewMutation(recipeId);

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
            message: t.successToast,
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

  const submitDisabled = rating === 0;

  return (
    <div className="flex flex-col bg-white">
      <header className="border-b border-gray-200">
        <Container className="relative flex items-center justify-center py-4">
          <button
            onClick={() => router.back()}
            type="button"
            className="text-ink-sub absolute left-4 md:left-6"
          >
            {t.cancel}
          </button>
          <h1 className="text-xl font-bold">{t.title}</h1>
        </Container>
      </header>

      <Container>
        <main className="flex-grow py-6">
          <div className="flex flex-col gap-1 text-center">
            <h2 className="text-2xl font-bold">
              {format(t.prompt, { recipeName: recipeData.title })}
            </h2>
            <h2 className="text-2xl font-bold">{t.promptCta}</h2>
            <div className="flex justify-center">
              <Ratings
                starCount={5}
                precision={0.5}
                allowHalf
                value={rating}
                onChange={(value) => setRating(value)}
              />
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-1">
            <h3 className="text-ink-sub mb-2 text-base font-medium">
              {t.feedbackHint}
            </h3>
            <div className="rounded-lg border border-gray-300 p-4">
              <div className="mb-3 flex items-start">
                <img
                  src={user?.profileImage || ""}
                  alt={t.profileAlt}
                  className="mr-3 h-8 w-8 flex-shrink-0 rounded-full"
                  width={32}
                  height={32}
                />
                <div className="flex-grow">
                  <p className="text-ink font-bold">{user?.nickname}</p>
                  <textarea
                    className="text-ink mt-1 min-h-20 w-full resize-none placeholder-gray-400 focus:outline-none"
                    rows={3}
                    placeholder={t.placeholderExample}
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
              "mt-4 flex w-full items-center justify-center rounded-lg py-3 font-bold text-white",
              "transition-all duration-300 ease-in-out",
              submitDisabled
                ? "bg-gray-300"
                : "bg-olive-light hover:bg-opacity-90"
            )}
          >
            {isPending ? <Circle size={20} /> : <p>{t.submit}</p>}
          </button>
        </main>
      </Container>
    </div>
  );
};

export default ReviewPage;
