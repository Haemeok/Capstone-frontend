"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@/shared/hooks/useDebounce";
import {
  YoutubePreviewCard,
  TrendingRecipes,
  useYoutubeMeta,
  useYoutubeImportStore,
} from "@/features/recipe-import-youtube";
import { validateYoutubeUrl } from "@/features/recipe-import-youtube/lib/urlValidation";
import { useMyInfoQuery } from "@/entities/user/model/hooks";
import { useToastStore } from "@/widgets/Toast";
import { Container } from "@/shared/ui/Container";
import PrevButton from "@/shared/ui/PrevButton";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";
import { Image } from "@/shared/ui/image/Image";
import { SAVINGS_BASE_URL } from "@/shared/config/constants/recipe";

const youtubeUrlSchema = z.object({
  url: z.string().refine(
    (url) => {
      if (!url.trim()) return true;
      const result = validateYoutubeUrl(url);
      return result.valid;
    },
    {
      message: "올바른 유튜브 링크를 입력해주세요",
    }
  ),
});

type YoutubeUrlFormValues = z.infer<typeof youtubeUrlSchema>;

const YoutubeImportPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);
  const { user } = useMyInfoQuery();

  const [currentUrl, setCurrentUrl] = useState("");
  const debouncedUrl = useDebounce(currentUrl, 500);

  const {
    register,
    setValue,
    formState: { errors },
  } = useForm<YoutubeUrlFormValues>({
    resolver: zodResolver(youtubeUrlSchema),
    defaultValues: {
      url: "",
    },
    mode: "onBlur",
  });

  const validatedUrlResult = useMemo(
    () => validateYoutubeUrl(debouncedUrl),
    [debouncedUrl]
  );

  const validatedUrl = validatedUrlResult.valid
    ? validatedUrlResult.cleanUrl
    : null;
  const videoId = validatedUrlResult.valid ? validatedUrlResult.videoId : null;

  const {
    data: youtubeMeta,
    isLoading: isLoadingMeta,
    isFetching: isFetchingMeta,
  } = useYoutubeMeta(validatedUrl);

  const startImport = useYoutubeImportStore((state) => state.startImport);
  const importStatus = useYoutubeImportStore((state) =>
    validatedUrl ? state.imports[validatedUrl]?.status : undefined
  );
  const isImporting = importStatus === "pending";

  const handleConfirmImport = async () => {
    if (!validatedUrl || !videoId || !user || !youtubeMeta) return;

    router.push(`/users/${user.id}?tab=saved`);
    addToast({
      message: "영상을 분석 중입니다. 잠시만 기다려주세요.",
      variant: "info",
    });

    startImport(validatedUrl, youtubeMeta, queryClient, () => {
      addToast({
        message: "레시피 분석이 완료되었습니다!",
        variant: "success",
      });
    });
  };

  const handleTrendingSelect = (url: string) => {
    setValue("url", url);
    setCurrentUrl(url);
  };

  return (
    <Container>
      <div className="mb-6 flex items-center gap-4">
        <PrevButton showOnDesktop />
        <h1 className="text-dark text-2xl font-bold md:text-3xl">
          유튜브 레시피 가져오기
        </h1>
      </div>

      <div className="mx-auto mb-8 flex justify-center">
        <Image
          src={`${SAVINGS_BASE_URL}youtube_premium.webp`}
          alt="YouTube Premium"
          width={200}
          height={200}
        />
      </div>

      {/* Hero Section */}
      <div className="mb-8 text-center md:text-left">
        <p className="text-olive-medium">
          유튜브 영상 링크를 입력하면 자동으로 재료와 순서를 분석해드려요.
        </p>
      </div>

      <section className="space-y-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="mx-auto w-full max-w-2xl space-y-2">
            <input
              type="text"
              {...register("url", {
                onChange: (e) => setCurrentUrl(e.target.value),
              })}
              placeholder="유튜브 링크를 붙여넣으세요"
              className={`w-full rounded-lg border px-4 py-3 transition-all focus:ring-2 focus:outline-none ${
                errors.url
                  ? "border-red-500 focus:ring-red-200"
                  : "focus:ring-olive-light/30 border-gray-300"
              }`}
              aria-invalid={!!errors.url}
            />
            {errors.url && (
              <p className="px-1 text-xs text-red-500" role="alert">
                {errors.url.message}
              </p>
            )}
          </div>

          <TrendingRecipes onSelect={handleTrendingSelect} />
        </div>

        {/* Loading State */}
        {(isLoadingMeta || isFetchingMeta) && (
          <div className="mx-auto w-full max-w-2xl rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex gap-4">
              <Skeleton className="h-24 w-40 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <Skeleton className="mt-4 h-12 w-full rounded-lg" />
          </div>
        )}

        {/* Error State */}
        {validatedUrl && !isLoadingMeta && !youtubeMeta && (
          <div className="mx-auto w-full max-w-2xl rounded-lg bg-red-50 p-4 text-center text-red-600">
            <p>
              영상 정보를 불러올 수 없습니다. 링크가 올바른지, 공개된 영상인지
              확인해주세요.
            </p>
          </div>
        )}

        {/* Preview Card */}
        {youtubeMeta && !isLoadingMeta && !isFetchingMeta && (
          <YoutubePreviewCard
            meta={youtubeMeta}
            onConfirm={handleConfirmImport}
            isLoading={isImporting}
          />
        )}
      </section>
    </Container>
  );
};

export default YoutubeImportPage;
