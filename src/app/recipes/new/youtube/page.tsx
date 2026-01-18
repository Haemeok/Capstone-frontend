"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState, useMemo, Suspense } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useAutoScrollOnMobile } from "@/shared/hooks/useAutoScrollOnMobile";
import {
  YoutubePreviewCard,
  TrendingRecipes,
  TrendingRecipesSkeleton,
  useYoutubeMeta,
  useYoutubeImportStore,
  useYoutubeDuplicateCheck,
  DuplicateRecipeSection,
} from "@/features/recipe-import-youtube";
import LoginEncourageDrawer from "@/widgets/LoginEncourageDrawer";
import { validateYoutubeUrl } from "@/features/recipe-import-youtube/lib/urlValidation";
import { useMyInfoQuery } from "@/entities/user/model/hooks";
import { useToastStore } from "@/widgets/Toast";
import { Container } from "@/shared/ui/Container";

import { Skeleton } from "@/shared/ui/shadcn/skeleton";
import { Image } from "@/shared/ui/image/Image";
import {
  ICON_BASE_URL,
} from "@/shared/config/constants/recipe";
import { Search } from "lucide-react";
import YouTubeIconBadge from "@/shared/ui/badge/YouTubeIconBadge";

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
  const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(false);
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

  const {
    data: duplicateCheck,
    isLoading: isCheckingDuplicate,
    isFetching: isFetchingDuplicate,
  } = useYoutubeDuplicateCheck(validatedUrl);

  const startImport = useYoutubeImportStore((state) => state.startImport);
  const importStatus = useYoutubeImportStore((state) =>
    validatedUrl ? state.imports[validatedUrl]?.status : undefined
  );
  const isImporting = importStatus === "pending";

  const isDuplicate = duplicateCheck?.recipeId !== undefined;

  const hasYoutubeData =
    youtubeMeta &&
    !isLoadingMeta &&
    !isFetchingMeta &&
    !isCheckingDuplicate &&
    !isFetchingDuplicate;

  const previewSectionRef = useAutoScrollOnMobile(!!hasYoutubeData, 500);

  const handleConfirmImport = async () => {
    if (!validatedUrl || !videoId || !youtubeMeta) return;

    if (!user) {
      setIsLoginDrawerOpen(true);
      return;
    }

    router.push(`/users/${user.id}?tab=saved`);
    addToast({
      message: "영상을 분석 중입니다. 잠시만 기다려주세요.",
      variant: "info",
    });

    startImport(validatedUrl, youtubeMeta, queryClient, (recipeId: string) => {
      addToast({
        message: "",
        variant: "rich-youtube",
        position: "bottom",
        persistent: true,
        dismissible: "both",
        richContent: {
          thumbnail: youtubeMeta.thumbnailUrl,
          title: "유튜브 레시피 추출이 완료 되었어요!",
          subtitle: youtubeMeta.title,
          badgeIcon: <YouTubeIconBadge className="h-6 w-6" />,
          recipeId,
        },
        action: {
          onClick: () => {
            router.push(`/recipes/${recipeId}`);
          },
        },
      });
    });
  };

  const handleTrendingSelect = (url: string) => {
    setValue("url", url);
    setCurrentUrl(url);
  };

  return (
    <Container className="min-h-screen bg-white pb-20">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center pt-8 md:pt-12">
        <Image
          src={`${ICON_BASE_URL}youtube.webp`}
          alt="YouTube Premium"
          wrapperClassName="w-1/2"
          imgClassName="drop-shadow-xl"
        />

        <div className="mb-8 space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
              유튜브 레시피 가져오기
            </h1>
            <p className="text-lg text-gray-500">
              영상만 보고 따라하기 힘드셨나요?
              <br />
              <span className="text-olive-light font-bold">
                영상과 레시피를 한눈에
              </span>{" "}
              보며 더 편하게 요리하세요.
            </p>
          </div>

          <div className="mx-auto grid max-w-lg grid-cols-2 gap-3 md:grid-cols-4">
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gray-50 p-3 text-center">
              <Image
                src={`${ICON_BASE_URL}nutrition_info.webp`}
                alt="영양성분"
                wrapperClassName="w-16 h-16"
                lazy={false}
              />
              <span className="text-sm font-semibold text-gray-600">
                영양성분·칼로리
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gray-50 p-3 text-center">
              <Image
                src={`${ICON_BASE_URL}cost_analysis.webp`}
                alt="원가 분석"
                wrapperClassName="w-16 h-16"
                lazy={false}
              />
              <span className="text-sm font-semibold text-gray-600">
                예상 원가 분석
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gray-50 p-3 text-center">
              <Image
                src={`${ICON_BASE_URL}timer_tool.webp`}
                alt="타이머"
                wrapperClassName="w-16 h-16"
                lazy={false}
              />
              <span className="text-sm font-semibold text-gray-600">
                조리 타이머
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gray-50 p-3 text-center">
              <Image
                src={`${ICON_BASE_URL}portion_calculator.webp`}
                alt="인분 변환"
                wrapperClassName="w-16 h-16"
                lazy={false}
              />
              <span className="text-sm font-semibold text-gray-600">
                인분수 변환
              </span>
            </div>
          </div>
        </div>

        <section className="w-full space-y-10">
          <div className="w-full space-y-8">
            <div className="relative mx-auto w-full transition-all duration-300 hover:-translate-y-1">
              <div
                className={`relative flex items-center overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] ring-1 transition-all focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.12)] focus-within:ring-2 ${
                  errors.url
                    ? "ring-red-500 focus-within:ring-red-500"
                    : "focus-within:ring-olive-light ring-gray-100"
                }`}
              >
                <div className="pl-6 text-gray-400">
                  <Search className="h-6 w-6" />
                </div>
                <input
                  type="text"
                  {...register("url", {
                    onChange: (e) => setCurrentUrl(e.target.value),
                  })}
                  placeholder="유튜브 링크를 붙여넣으세요"
                  className="w-full bg-transparent px-4 py-5 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  autoComplete="off"
                />
              </div>
              {errors.url && (
                <p
                  className="animate-slide-up-fade mt-2 px-2 text-sm font-medium text-red-500"
                  role="alert"
                >
                  {errors.url.message}
                </p>
              )}
            </div>

            <div className="w-full overflow-hidden rounded-3xl bg-gray-50/50">
              <Suspense
                fallback={<TrendingRecipesSkeleton className="w-full" />}
              >
                <TrendingRecipes
                  onSelect={handleTrendingSelect}
                  className="w-full"
                />
              </Suspense>
            </div>
          </div>

          {(isLoadingMeta ||
            isFetchingMeta ||
            isCheckingDuplicate ||
            isFetchingDuplicate) && (
            <div
              ref={previewSectionRef}
              className="mx-auto w-full animate-pulse rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="flex gap-4">
                <Skeleton className="h-24 w-40 rounded-xl" />
                <div className="flex-1 space-y-3 py-2">
                  <Skeleton className="h-6 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-1/2 rounded-md" />
                </div>
              </div>
              <Skeleton className="mt-6 h-14 w-full rounded-xl" />
            </div>
          )}

          {validatedUrl && !isLoadingMeta && !youtubeMeta && (
            <div className="animate-fade-in mx-auto w-full rounded-2xl bg-red-50/80 p-6 text-center text-red-600">
              <p className="font-medium">
                영상 정보를 불러올 수 없습니다.
                <br />
                올바른 링크인지, 공개된 영상인지 확인해주세요.
              </p>
            </div>
          )}

          {youtubeMeta &&
            !isLoadingMeta &&
            !isFetchingMeta &&
            !isCheckingDuplicate &&
            !isFetchingDuplicate &&
            isDuplicate &&
            duplicateCheck?.recipeId && (
              <div className="animate-fade-in-up">
                <DuplicateRecipeSection
                  recipeId={duplicateCheck.recipeId}
                  onSaveSuccess={() => {
                    addToast({
                      message: "레시피가 저장되었습니다!",
                      variant: "success",
                    });
                  }}
                />
              </div>
            )}

          {youtubeMeta &&
            !isLoadingMeta &&
            !isFetchingMeta &&
            !isCheckingDuplicate &&
            !isFetchingDuplicate &&
            !isDuplicate && (
              <div className="animate-fade-in-up">
                <YoutubePreviewCard
                  meta={youtubeMeta}
                  onConfirm={handleConfirmImport}
                  isLoading={isImporting}
                />
              </div>
            )}
        </section>
      </div>

      <LoginEncourageDrawer
        isOpen={isLoginDrawerOpen}
        onOpenChange={setIsLoginDrawerOpen}
      />
    </Container>
  );
};

export default YoutubeImportPage;
