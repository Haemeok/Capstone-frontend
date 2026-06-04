"use client";

import {
  type ChangeEvent,
  type DragEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Download, ImageUp } from "lucide-react";

import {
  DEFAULT_SETTINGS,
  exportWatermarked,
  type LoadedImage,
  readImage,
  type WatermarkSettings,
} from "../lib/watermark";
import { WatermarkCanvas } from "./WatermarkCanvas";
import { WatermarkControls } from "./WatermarkControls";

const PREVIEW_MAX = 440;
const MAX_SAFE_DIMENSION = 8000;

export const WatermarkSection = () => {
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [settings, setSettings] = useState<WatermarkSettings>(DEFAULT_SETTINGS);
  const [exporting, setExporting] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    try {
      const loaded = await readImage(file);
      if (
        loaded.width > MAX_SAFE_DIMENSION ||
        loaded.height > MAX_SAFE_DIMENSION
      ) {
        console.warn(
          `이미지가 매우 큽니다 (${loaded.width}×${loaded.height}). 일부 환경에서 내보내기가 실패할 수 있어요.`
        );
      }
      setImage(loaded);
    } catch (err) {
      console.error("이미지 읽기 실패", err);
    }
  }, []);

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const file = Array.from(e.clipboardData?.items ?? [])
        .filter((i) => i.type.startsWith("image/"))
        .map((i) => i.getAsFile())
        .find((f): f is File => f !== null);
      if (file) {
        e.preventDefault();
        void loadFile(file);
      }
    };
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [loadFile]);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void loadFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) void loadFile(file);
  };

  const handleSettingsChange = (patch: Partial<WatermarkSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  const handleExport = async () => {
    if (!canvasRef.current) return;
    setExporting(true);
    try {
      await exportWatermarked(canvasRef.current, `watermark-${Date.now()}.png`);
    } catch (err) {
      console.error("내보내기 실패", err);
    } finally {
      setExporting(false);
    }
  };

  const previewScale = image
    ? Math.min(1, PREVIEW_MAX / image.width, PREVIEW_MAX / image.height)
    : 1;

  return (
    <section className="grid gap-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_280px]">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="bg-beige-light/30 flex min-h-[320px] items-center justify-center rounded-xl p-4"
      >
        {image ? (
          <div
            style={{
              width: image.width * previewScale,
              height: image.height * previewScale,
            }}
          >
            <div
              style={{
                transform: `scale(${previewScale})`,
                transformOrigin: "top left",
              }}
            >
              <WatermarkCanvas
                ref={canvasRef}
                imageUrl={image.url}
                naturalWidth={image.width}
                naturalHeight={image.height}
                {...settings}
              />
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="hover:border-olive-light hover:bg-olive-light/5 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-10 py-12 text-sm text-gray-500 transition"
          >
            <ImageUp className="h-7 w-7 text-gray-400" />
            <span>클릭 · 드래그 · Ctrl+V로 이미지 올리기</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        <WatermarkControls
          settings={settings}
          onChange={handleSettingsChange}
        />

        <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-10 cursor-pointer rounded-xl border border-gray-200 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            {image ? "이미지 교체" : "이미지 선택"}
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={!image || exporting}
            className="bg-olive-light flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-xl text-sm font-bold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            <Download className="h-4 w-4" />
            {exporting ? "내보내는 중…" : "PNG 저장"}
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </section>
  );
};
