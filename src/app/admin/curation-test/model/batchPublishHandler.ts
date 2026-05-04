import type { CurationParams, GenerateCurationInput } from "@/entities/curation";

import {
  mapResultToRequest,
  postCurationArticle,
  publishCurationArticle,
} from "@/features/curation-write";

import { generateCuration } from "@/app/actions/curation";
import { revalidateCurationPath } from "@/app/actions/curation.revalidate";
import { saveCurationLocal } from "@/app/actions/curationLocal";

import { pMap } from "../lib/pLimit";
import { useBatchPublishStore } from "./batchPublishStore";

export type BatchPublishItem = {
  key: string; // slug
  params: CurationParams;
};

export type BatchPublishOptions = {
  recipeCount?: number;
  forceToneSeed?: GenerateCurationInput["forceToneSeed"];
  concurrency?: number;
  onItemDone?: (key: string) => void;
};

export const runBatchPublish = async (
  items: BatchPublishItem[],
  opts: BatchPublishOptions = {},
): Promise<void> => {
  const concurrency = opts.concurrency ?? 3;
  const store = useBatchPublishStore.getState();

  for (const item of items) {
    store.setStatus(item.key, "generating");
  }

  await pMap(items, concurrency, async (item) => {
    try {
      useBatchPublishStore.getState().setStatus(item.key, "generating");
      const result = await generateCuration({
        params: item.params,
        recipeCount: opts.recipeCount,
        forceToneSeed: opts.forceToneSeed,
      });

      useBatchPublishStore.getState().setStatus(item.key, "publishing");
      const body = mapResultToRequest(result);
      const { articleId } = await postCurationArticle(body);
      await publishCurationArticle(articleId);
      await revalidateCurationPath(result.slug);
      try {
        await saveCurationLocal(result);
      } catch {
        // 마커 실패는 발행 실패가 아님
      }

      useBatchPublishStore.getState().setDone(item.key, articleId);
      opts.onItemDone?.(item.key);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      useBatchPublishStore.getState().setError(item.key, msg);
    }
  });
};
