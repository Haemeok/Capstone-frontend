"use client";

import { useCallback, useState } from "react";

import { getRecipe } from "@/entities/recipe/model/api";
import type { DetailedRecipeGridItem } from "@/entities/recipe/model/types";

import { RecipeSearchPanel } from "@/app/admin/image-quality-test/components/RecipeSearchPanel";
import { buildPrompt } from "@/app/admin/image-quality-test/lib/buildPrompt";

import { CostSummary } from "./components/CostSummary";
import {
  ImageGenerationPanel,
  type ImageModelId,
} from "./components/ImageGenerationPanel";
import { ImageGrid } from "./components/ImageGrid";
import { VideoGenerationPanel } from "./components/VideoGenerationPanel";
import { VideoResultCard } from "./components/VideoResultCard";
import { buildDefaultVideoPrompt } from "./lib/buildVideoPrompt";
import {
  addImageGen,
  addVideoGen,
  loadCostHistory,
  resetCostHistory,
} from "./lib/costStorage";
import type {
  SeedanceModelId,
  SeedanceRatio,
  SeedanceResolution,
} from "./lib/types";
import { useImageGeneration } from "./lib/useImageGeneration";
import { useVideoGeneration } from "./lib/useVideoGeneration";
import { estimateVideoCost } from "./lib/videoPricing";

const VideoStudioPage = () => {
  const [recipe, setRecipe] = useState<DetailedRecipeGridItem | null>(null);

  // image stage
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageModelId, setImageModelId] =
    useState<ImageModelId>("gpt-image-2-medium");
  const [count, setCount] = useState(2);
  const [refImage, setRefImage] = useState<string | null>(null);
  const { state: imageState, run: runImage, cancel: cancelImage } =
    useImageGeneration();

  // unified video input image — set by Stage 1 grid select OR Stage 2 upload
  const [videoInputImage, setVideoInputImage] = useState<string | null>(null);

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

  // cost history (localStorage hydrated)
  const [history, setHistory] = useState(() => loadCostHistory());

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

  const handleGenerateImages = useCallback(async () => {
    setVideoInputImage(null);
    const result = await runImage({
      modelId: imageModelId,
      prompt: imagePrompt,
      n: count,
      referenceImageUrl: refImage ?? undefined,
    });
    if (!result) return;
    // auto-fill the video-stage input with the first generated image
    setVideoInputImage(result.images[0] ?? null);
    // log cost: we generated `count` images at pricePerImage each
    const cost = result.images.length * result.pricePerImage;
    setHistory(addImageGen(result.modelId, cost));
  }, [imageModelId, imagePrompt, count, refImage, runImage]);

  const handleGenerateVideo = useCallback(async () => {
    if (!videoInputImage) return;
    const cost = estimateVideoCost({ model, resolution, durationSec });
    const ok = await runVideo({
      model,
      prompt: videoPrompt,
      imageDataUrlOrUrl: videoInputImage,
      resolution,
      ratio,
      durationSec,
      generateAudio,
    });
    if (!ok) return;
    setHistory(addVideoGen(model, cost));
  }, [
    videoInputImage,
    model,
    videoPrompt,
    resolution,
    ratio,
    durationSec,
    generateAudio,
    runVideo,
  ]);

  const handleResetCost = useCallback(() => {
    setHistory(resetCostHistory());
  }, []);

  const imageRunning = imageState.status === "pending";
  const videoRunning =
    videoState.status === "submitting" || videoState.status === "polling";
  const videoPollLabel =
    videoState.status === "polling"
      ? videoState.lastStatus
      : videoState.status === "submitting"
      ? "submit"
      : undefined;
  const generatedImages =
    imageState.status === "success" ? imageState.imageDataUrls : [];

  return (
    <div className="mx-auto min-h-screen max-w-6xl bg-beige-light/40 p-4 md:p-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Video Studio</h1>

      <div className="mb-4">
        <RecipeSearchPanel
          selectedId={recipe?.id ?? null}
          onSelect={handleRecipeSelect}
        />
      </div>

      <div className="mb-4">
        <CostSummary history={history} onReset={handleResetCost} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ImageGenerationPanel
          prompt={imagePrompt}
          onPromptChange={setImagePrompt}
          modelId={imageModelId}
          onModelChange={setImageModelId}
          count={count}
          onCountChange={setCount}
          referenceImageUrl={refImage}
          onReferenceImageChange={setRefImage}
          running={imageRunning}
          onSubmit={handleGenerateImages}
          onCancel={cancelImage}
        />

        <VideoGenerationPanel
          selectedImageUrl={videoInputImage}
          onImageUpload={setVideoInputImage}
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
          selectedUrl={videoInputImage}
          onSelect={setVideoInputImage}
        />
        <VideoResultCard state={videoState} />
      </div>
    </div>
  );
};

export default VideoStudioPage;
