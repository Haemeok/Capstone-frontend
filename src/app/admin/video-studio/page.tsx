"use client";

import { useCallback, useState } from "react";

import { getRecipe } from "@/entities/recipe/model/api";
import type { DetailedRecipeGridItem } from "@/entities/recipe/model/types";

import { RecipeSearchPanel } from "@/app/admin/image-quality-test/components/RecipeSearchPanel";
import { buildPrompt } from "@/app/admin/image-quality-test/lib/buildPrompt";

import { ImageGenerationPanel } from "./components/ImageGenerationPanel";
import { ImageGrid } from "./components/ImageGrid";
import { VideoGenerationPanel } from "./components/VideoGenerationPanel";
import { VideoResultCard } from "./components/VideoResultCard";
import { buildDefaultVideoPrompt } from "./lib/buildVideoPrompt";
import type {
  SeedanceModelId,
  SeedanceRatio,
  SeedanceResolution,
} from "./lib/types";
import { useImageGeneration } from "./lib/useImageGeneration";
import { useVideoGeneration } from "./lib/useVideoGeneration";

const VideoStudioPage = () => {
  const [recipe, setRecipe] = useState<DetailedRecipeGridItem | null>(null);

  // image stage
  const [imagePrompt, setImagePrompt] = useState("");
  const [quality, setQuality] = useState<"low" | "medium" | "high">("medium");
  const [count, setCount] = useState(2);
  const [refImage, setRefImage] = useState<string | null>(null);
  const { state: imageState, run: runImage, cancel: cancelImage } =
    useImageGeneration();
  // null = no manual pick yet → fall back to first generated image
  const [userSelectedImage, setUserSelectedImage] = useState<string | null>(
    null
  );

  // video stage
  const [videoPrompt, setVideoPrompt] = useState(() =>
    buildDefaultVideoPrompt()
  );
  const [model, setModel] = useState<SeedanceModelId>(
    "dreamina-seedance-2-0-fast-260128"
  );
  const [resolution, setResolution] = useState<SeedanceResolution>("720p");
  const [ratio, setRatio] = useState<SeedanceRatio>("16:9");
  const [durationSec, setDurationSec] = useState(5);
  const [generateAudio, setGenerateAudio] = useState(false);
  const { state: videoState, run: runVideo, cancel: cancelVideo } =
    useVideoGeneration();

  const handleRecipeSelect = useCallback(async (r: DetailedRecipeGridItem) => {
    setRecipe(r);
    setImagePrompt("레시피 상세 조회 중...");
    setVideoPrompt(buildDefaultVideoPrompt({ title: r.title }));
    try {
      const detail = await getRecipe(r.id);
      setImagePrompt(
        buildPrompt({
          title: detail.title,
          description: detail.description,
          dishType: detail.dishType,
          ingredients: detail.ingredients,
          steps: detail.steps,
          fineDiningInfo: detail.fineDiningInfo,
        })
      );
    } catch (err) {
      console.error("레시피 상세 조회 실패", err);
      setImagePrompt(buildPrompt({ title: r.title }));
    }
  }, []);

  const generatedImages =
    imageState.status === "success" ? imageState.imageDataUrls : [];
  const selectedImage = userSelectedImage ?? generatedImages[0] ?? null;

  const handleGenerateImages = useCallback(() => {
    setUserSelectedImage(null);
    runImage({
      prompt: imagePrompt,
      quality,
      n: count,
      referenceImageUrl: refImage ?? undefined,
    });
  }, [imagePrompt, quality, count, refImage, runImage]);

  const handleGenerateVideo = useCallback(() => {
    if (!selectedImage) return;
    runVideo({
      model,
      prompt: videoPrompt,
      imageDataUrlOrUrl: selectedImage,
      resolution,
      ratio,
      durationSec,
      generateAudio,
    });
  }, [
    selectedImage,
    model,
    videoPrompt,
    resolution,
    ratio,
    durationSec,
    generateAudio,
    runVideo,
  ]);

  const imageRunning = imageState.status === "pending";
  const videoRunning =
    videoState.status === "submitting" || videoState.status === "polling";
  const videoPollLabel =
    videoState.status === "polling"
      ? videoState.lastStatus
      : videoState.status === "submitting"
      ? "submit"
      : undefined;

  return (
    <div className="mx-auto min-h-screen max-w-6xl bg-beige-light/40 p-4 md:p-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Video Studio</h1>

      <div className="mb-4">
        <RecipeSearchPanel
          selectedId={recipe?.id ?? null}
          onSelect={handleRecipeSelect}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ImageGenerationPanel
          prompt={imagePrompt}
          onPromptChange={setImagePrompt}
          quality={quality}
          onQualityChange={setQuality}
          count={count}
          onCountChange={setCount}
          referenceImageUrl={refImage}
          onReferenceImageChange={setRefImage}
          running={imageRunning}
          onSubmit={handleGenerateImages}
          onCancel={cancelImage}
        />

        <VideoGenerationPanel
          selectedImageUrl={selectedImage}
          prompt={videoPrompt}
          onPromptChange={setVideoPrompt}
          model={model}
          onModelChange={setModel}
          resolution={resolution}
          onResolutionChange={setResolution}
          ratio={ratio}
          onRatioChange={setRatio}
          durationSec={durationSec}
          onDurationChange={setDurationSec}
          generateAudio={generateAudio}
          onGenerateAudioChange={setGenerateAudio}
          running={videoRunning}
          pollLabel={videoPollLabel}
          onSubmit={handleGenerateVideo}
          onCancel={cancelVideo}
        />
      </div>

      <div className="mt-4 space-y-4">
        {imageState.status === "error" && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            이미지 생성 실패: {imageState.message}
          </div>
        )}
        <ImageGrid
          imageUrls={generatedImages}
          selectedUrl={selectedImage}
          onSelect={setUserSelectedImage}
        />
        <VideoResultCard state={videoState} />
      </div>
    </div>
  );
};

export default VideoStudioPage;
