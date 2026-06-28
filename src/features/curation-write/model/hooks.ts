import { useMutation } from "@tanstack/react-query";

import type { GenerateCurationOutput } from "@/entities/curation";

import { revalidateCurationPath } from "@/app/actions/curation.revalidate";
import { saveCurationLocal } from "@/app/actions/curationLocal";

import { postCurationArticle, publishCurationArticle } from "./api";
import { mapResultToRequest } from "./mapper";

export type PostAndPublishOutcome = {
  articleId: string;
  slug: string;
};

export const usePostAndPublishArticle = () =>
  useMutation<PostAndPublishOutcome, Error, GenerateCurationOutput>({
    mutationFn: async (result) => {
      const body = mapResultToRequest(result);
      const { articleId } = await postCurationArticle(body);
      await publishCurationArticle(articleId);
      await revalidateCurationPath(result.slug);
      try {
        await saveCurationLocal(result);
      } catch {
        // marker 실패는 발행 실패가 아님
      }
      return { articleId, slug: result.slug };
    },
  });
