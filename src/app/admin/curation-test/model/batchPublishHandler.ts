import {
  CurationError,
  type CurationErrorCode,
  type CurationParams,
  type GenerateCurationInput,
  type GenerateCurationOutput,
} from "@/entities/curation";

const DEAD_SLUG_CODES = new Set<CurationErrorCode>([
  "INSUFFICIENT_RECIPES",
  "LLM_ERROR",
  "VALIDATION_FAILED",
]);

import {
  mapResultToRequest,
  postCurationArticle,
  publishCurationArticle,
} from "@/features/curation-write";

import { finalizeCurationBatch } from "@/app/actions/curation.finalize";

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
  // INSUFFICIENT_RECIPES 발생 시: 사용자에게 실패로 보이는 것보다 조용히 hide.
  // store.setError 대신 이 콜백이 불려서 caller 가 dead-slug 영속/필터를 처리.
  onDeadSlug?: (key: string) => void;
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
        // 이 슬러그로는 정상 큐레이션을 못 만든다는 신호 — 사용자에게 실패로 보이지 말고 hide.
        // INSUFFICIENT_RECIPES: 후보 레시피 부족
        // LLM_ERROR: title 호출 schema 위반 N회
        // VALIDATION_FAILED: title-body N 일관성 N회 실패
        if (
          e instanceof CurationError &&
          DEAD_SLUG_CODES.has(e.code) &&
          opts.onDeadSlug
        ) {
          opts.onDeadSlug(item.key);
          return;
        }
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

  const succeeded: BatchPublishItem[] = [];
  await Promise.all(
    items.map(async (item) => {
      try {
        const body = mapResultToRequest(item.result);
        const { articleId } = await postCurationArticle(body);
        await publishCurationArticle(articleId);
        useBatchPublishStore.getState().setDone(item.key, articleId);
        succeeded.push(item);
        opts.onItemDone?.(item.key);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        useBatchPublishStore.getState().setError(item.key, msg);
      }
    }),
  );

  if (succeeded.length === 0) return;

  // revalidate + 로컬 저장은 1회만. server action POST가 아이템마다 따로 나가지 않게.
  try {
    await finalizeCurationBatch(succeeded.map((s) => s.result));
  } catch {
    // finalize 실패는 발행 자체 실패로 보지 않음 (캐시/마커는 후속 작업으로 복구 가능).
  }
};
