import type {
  CurationParams,
  GenerateCurationInput,
  GenerateCurationOutput,
} from "@/entities/curation";

import {
  mapResultToRequest,
  postCurationArticle,
  publishCurationArticle,
} from "@/features/curation-write";

import { revalidateCurationPath } from "@/app/actions/curation.revalidate";
import { saveCurationLocal } from "@/app/actions/curationLocal";

import { generateCurationViaApi } from "../lib/generateCurationClient";
import { useBatchPublishStore } from "./batchPublishStore";

export type BatchGenerateItem = {
  key: string; // slug
  params: CurationParams;
};

export type BatchPublishItem = {
  key: string; // slug
  result: GenerateCurationOutput;
};

export type BatchGenerateOptions = {
  recipeCount?: number;
  forceToneSeed?: GenerateCurationInput["forceToneSeed"];
  onItemDone?: (key: string) => void;
};

export type BatchPublishOptions = {
  onItemDone?: (key: string) => void;
};

export const runBatchGenerate = async (
  items: BatchGenerateItem[],
  opts: BatchGenerateOptions = {},
): Promise<void> => {
  const store = useBatchPublishStore.getState();
  for (const item of items) {
    store.setStatus(item.key, "generating");
  }

  await Promise.all(
    items.map(async (item) => {
      try {
        const result = await generateCurationViaApi({
          params: item.params,
          recipeCount: opts.recipeCount,
          forceToneSeed: opts.forceToneSeed,
        });
        useBatchPublishStore.getState().setGenerated(item.key, result);
        opts.onItemDone?.(item.key);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        useBatchPublishStore.getState().setError(item.key, msg);
      }
    }),
  );
};

export const runBatchPublish = async (
  items: BatchPublishItem[],
  opts: BatchPublishOptions = {},
): Promise<void> => {
  const store = useBatchPublishStore.getState();
  for (const item of items) {
    store.setStatus(item.key, "publishing");
  }

  await Promise.all(
    items.map(async (item) => {
      try {
        const body = mapResultToRequest(item.result);
        const { articleId } = await postCurationArticle(body);
        await publishCurationArticle(articleId);
        await revalidateCurationPath(item.result.slug);
        try {
          await saveCurationLocal(item.result);
        } catch {
          // 마커 저장 실패는 발행 실패로 보지 않음
        }
        useBatchPublishStore.getState().setDone(item.key, articleId);
        opts.onItemDone?.(item.key);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        useBatchPublishStore.getState().setError(item.key, msg);
      }
    }),
  );
};
