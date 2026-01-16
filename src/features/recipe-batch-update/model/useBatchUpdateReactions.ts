import { useState, useCallback } from "react";
import { postRecipeReactions } from "@/features/recipe-create/model/api";
import { BatchUpdateState, BatchUpdateResult } from "./types";

export const useBatchUpdateReactions = () => {
  const [state, setState] = useState<BatchUpdateState>({
    results: [],
    isPending: false,
    progress: 0,
    total: 0,
    successCount: 0,
    failCount: 0,
  });

  const generateRandomStats = () => {
    const ratingCount = Math.floor(Math.random() * (34 - 5 + 1)) + 5;
    const likeCount =
      Math.floor(Math.random() * (35 - (ratingCount + 1) + 1)) +
      (ratingCount + 1);

    return { likeCount, ratingCount };
  };

  const executeBatchUpdate = useCallback(async (recipeIds: string[]) => {
    setState({
      results: [],
      isPending: true,
      progress: 0,
      total: recipeIds.length,
      successCount: 0,
      failCount: 0,
    });

    try {
      // Create promises with the random data generation included
      const promises = recipeIds.map(async (id) => {
        const { likeCount, ratingCount } = generateRandomStats();

        try {
          await postRecipeReactions(id, { likeCount, ratingCount });
          return {
            recipeId: id,
            status: "fulfilled" as const,
            likeCount,
            ratingCount,
            value: "Success",
          };
        } catch (error) {
          return {
            recipeId: id,
            status: "rejected" as const,
            reason: error,
            likeCount,
            ratingCount,
          };
        }
      });

      // 2. id를 파싱해서 promiseallSettled로 진행상황도 추적할 것
      const results = await Promise.allSettled(promises);

      // Process results to match our internal type
      const processedResults: BatchUpdateResult[] = results.map(
        (result, index) => {
          if (result.status === "fulfilled") {
            return result.value as unknown as BatchUpdateResult;
          } else {
            // Should not happen because we catch inside map, but for safety of Promise.allSettled typing
            // Actually, since we return objects in both try/catch above, result.status will always be "fulfilled" from Promise.allSettled's perspective
            // unless the map function itself throws synchronously (unlikely).
            // However, strictly speaking, Promise.allSettled returns { status: 'fulfilled', value: T } | { status: 'rejected', reason: any }
            // Our map function ensures we return the object structure we want.
            return (
              (result as any).value || {
                recipeId: recipeIds[index],
                status: "rejected",
                reason: (result as any).reason,
              }
            );
          }
        }
      );

      const successCount = processedResults.filter(
        (r) => r.status === "fulfilled"
      ).length;
      const failCount = processedResults.filter(
        (r) => r.status === "rejected"
      ).length;

      setState((prev) => ({
        ...prev,
        results: processedResults,
        isPending: false,
        progress: 100,
        successCount,
        failCount,
      }));
    } catch (error) {
      console.error("Batch update failed:", error);
      setState((prev) => ({ ...prev, isPending: false }));
    }
  }, []);

  return {
    ...state,
    executeBatchUpdate,
  };
};
