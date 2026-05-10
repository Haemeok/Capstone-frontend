"use client";

import {
  type ChangeEvent,
  type ClipboardEvent,
  type DragEvent,
  useCallback,
  useRef,
  useState,
} from "react";

import { Square, Trash2, Upload, X } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";

import { getModelById } from "@/app/admin/image-quality-test/lib/models";

import {
  type ImageEditQuality,
  QUALITY_TO_MODEL_ID,
  useImageEdit,
} from "../lib/useImageEdit";
import { ResultCard } from "./ResultCard";

const QUALITY_ORDER: ReadonlyArray<ImageEditQuality> = ["low", "medium", "high"];

type Props = {
  index: number;
  onAfterRun: () => void;
  onDelete: () => void;
  canDelete: boolean;
};

export const WorkerCard = ({ index, onAfterRun, onDelete, canDelete }: Props) => {
  const [referenceImageUrl, setReferenceImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [selected, setSelected] = useState<Set<ImageEditQuality>>(
    () => new Set(["low"])
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { results, running, submit, cancel, reset } = useImageEdit();

  const readFileAsDataUrl = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result;
      if (typeof r === "string") {
        setReferenceImageUrl(r);
        triggerHaptic("Light");
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) readFileAsDataUrl(file);
    },
    [readFileAsDataUrl]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) readFileAsDataUrl(file);
    },
    [readFileAsDataUrl]
  );

  const handlePromptPaste = useCallback(
    (e: ClipboardEvent<HTMLTextAreaElement>) => {
      const items = Array.from(e.clipboardData?.items ?? []);
      const item = items.find((i) => i.type.startsWith("image/"));
      const file = item?.getAsFile();
      if (file) {
        e.preventDefault();
        readFileAsDataUrl(file);
      }
    },
    [readFileAsDataUrl]
  );

  const toggleQuality = useCallback((q: ImageEditQuality) => {
    triggerHaptic("Light");
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(q)) next.delete(q);
      else next.add(q);
      return next;
    });
  }, []);

  const canSubmit =
    referenceImageUrl !== null &&
    prompt.trim().length > 0 &&
    selected.size > 0 &&
    !running;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || !referenceImageUrl) return;
    triggerHaptic("Medium");
    await submit({
      qualities: Array.from(selected),
      prompt: prompt.trim(),
      referenceImageUrl,
    });
    onAfterRun();
  }, [canSubmit, onAfterRun, prompt, referenceImageUrl, selected, submit]);

  const handleCancel = useCallback(() => {
    triggerHaptic("Warning");
    cancel();
  }, [cancel]);

  const handleClearImage = useCallback(() => {
    triggerHaptic("Light");
    setReferenceImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    reset();
  }, [reset]);

  const handleDelete = useCallback(() => {
    triggerHaptic("Warning");
    cancel();
    onDelete();
  }, [cancel, onDelete]);

  const estimatedCost = Array.from(selected).reduce((sum, q) => {
    const model = getModelById(QUALITY_TO_MODEL_ID[q]);
    return sum + (model?.pricePerImage ?? 0);
  }, 0);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">워커 #{index + 1}</h2>
        <button
          type="button"
          onClick={handleDelete}
          disabled={!canDelete}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="워커 삭제"
        >
          <Trash2 className="h-3.5 w-3.5" /> 삭제
        </button>
      </header>

      <div className="grid gap-3 md:grid-cols-[180px_1fr]">
        <div>
          <p className="mb-1 text-[11px] font-semibold text-gray-700">입력 이미지</p>
          {referenceImageUrl ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={referenceImageUrl}
                alt="reference"
                className="aspect-square w-full rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1 text-gray-600 shadow"
                aria-label="이미지 제거"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-2 text-center text-[10px] text-gray-500 hover:bg-gray-100"
            >
              <Upload className="h-5 w-5 text-gray-400" />
              <span>클릭 · 드래그</span>
              <span>(텍스트박스에 Ctrl+V도 가능)</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <div>
          <p className="mb-1 text-[11px] font-semibold text-gray-700">프롬프트</p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onPaste={handlePromptPaste}
            rows={6}
            placeholder="이미지를 어떻게 편집할지 작성하세요. 클립보드에 이미지가 있으면 여기서 Ctrl+V → 입력 이미지로 들어갑니다."
            className="w-full resize-y rounded-xl border border-gray-200 p-3 text-sm focus:border-olive-light focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {QUALITY_ORDER.map((id) => {
            const model = getModelById(QUALITY_TO_MODEL_ID[id]);
            const price = model?.pricePerImage ?? 0;
            const active = selected.has(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleQuality(id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-olive-light text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="capitalize">{id}</span>
                <span
                  className={`ml-1 ${
                    active ? "text-white/80" : "text-gray-400"
                  }`}
                >
                  ${price.toFixed(3)}
                </span>
              </button>
            );
          })}
          <span className="ml-1 text-[11px] text-gray-500">
            예상 ${estimatedCost.toFixed(3)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="h-10 rounded-xl bg-olive-light px-4 text-sm font-bold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            {running ? "생성 중…" : `생성 (${selected.size})`}
          </button>
          {running && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex h-10 items-center gap-1 rounded-xl border-2 border-red-200 bg-white px-3 text-xs font-medium text-red-500 hover:bg-red-50"
            >
              <Square className="h-3.5 w-3.5 fill-red-500" /> 취소
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {QUALITY_ORDER.map((q) => (
          <ResultCard
            key={q}
            quality={q}
            cell={results[q] ?? { status: "idle" }}
            included={selected.has(q)}
          />
        ))}
      </div>
    </section>
  );
};
