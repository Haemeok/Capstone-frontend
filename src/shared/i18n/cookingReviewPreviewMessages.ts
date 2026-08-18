import type { Locale } from "./types";

type CookingReviewPreviewDict = {
  heading: string;
  viewAll: string;
  loading: string;
  emptyTitle: string;
  emptyDescription: string;
};

export const cookingReviewPreviewMessages: Record<
  Locale,
  CookingReviewPreviewDict
> = {
  ko: {
    heading: "만들어봤어요",
    viewAll: "전체 보기",
    loading: "후기 불러오는 중",
    emptyTitle: "아직 후기가 없어요",
    emptyDescription: "첫 요리 후기를 기다리고 있어요",
  },
  ja: {
    heading: "作ってみました",
    viewAll: "すべて見る",
    loading: "レビューを読み込み中",
    emptyTitle: "まだレビューがありません",
    emptyDescription: "最初の料理レビューをお待ちしています",
  },
  en: {
    heading: "Made it",
    viewAll: "View all",
    loading: "Loading reviews",
    emptyTitle: "No reviews yet",
    emptyDescription: "Be the first to share how it turned out",
  },
};
