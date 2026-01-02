export type BatchUpdateResult = {
  recipeId: string;
  status: "fulfilled" | "rejected";
  value?: any;
  reason?: any;
  likeCount?: number;
  ratingCount?: number;
};

export type BatchUpdateState = {
  results: BatchUpdateResult[];
  isPending: boolean;
  progress: number; // 0-100
  total: number;
  successCount: number;
  failCount: number;
};
