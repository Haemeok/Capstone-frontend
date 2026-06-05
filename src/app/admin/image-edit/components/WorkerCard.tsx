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

import { FACE_SWAP_MAX_REFS, FACE_SWAP_PROMPT } from "../lib/faceSwapPrompt";
import {
  type ImageEditQuality,
  QUALITY_TO_MODEL_ID,
  useImageEdit,
} from "../lib/useImageEdit";
import { ResultCard } from "./ResultCard";

const QUALITY_ORDER: ReadonlyArray<ImageEditQuality> = [
  "low",
  "medium",
  "high",
];
const MAX_REFERENCES = 16;
const FACE_SWAP_SLOT_LABELS = ["SCENE", "FACE"] as const;

type Props = {
  index: number;
  onAfterRun: () => void;
  onDelete: () => void;
  canDelete: boolean;
};

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result;
      if (typeof r === "string") resolve(r);
      else reject(new Error("FileReader returned non-string"));
    };
    reader.onerror = () =>
      reject(reader.error ?? new Error("FileReader error"));
    reader.readAsDataURL(file);
  });

export const WorkerCard = ({
  index,
  onAfterRun,
  onDelete,
  canDelete,
}: Props) => {
  const [referenceImageUrls, setReferenceImageUrls] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [faceSwap, setFaceSwap] = useState(false);
  const [selected, setSelected] = useState<Set<ImageEditQuality>>(
    () => new Set(["low"])
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { results, running, submit, cancel, reset } = useImageEdit();

  const effectiveMax = faceSwap ? FACE_SWAP_MAX_REFS : MAX_REFERENCES;

  const appendFiles = useCallback(
    async (files: readonly File[]) => {
      const images = files.filter((f) => f.type.startsWith("image/"));
      if (images.length === 0) return;
      try {
        const dataUrls = await Promise.all(images.map(readFileAsDataUrl));
        setReferenceImageUrls((prev) => {
          const next = [...prev, ...dataUrls].slice(0, effectiveMax);
          if (next.length > prev.length) triggerHaptic("Light");
          return next;
        });
      } catch (err) {
        console.error("이미지 읽기 실패", err);
      }
    },
    [effectiveMax]
  );

  const handleToggleFaceSwap = useCallback(() => {
    triggerHaptic("Light");
    setFaceSwap((prev) => {
      const next = !prev;
      if (next) {
        setReferenceImageUrls((curr) => curr.slice(0, FACE_SWAP_MAX_REFS));
        setPrompt(FACE_SWAP_PROMPT);
      }
      return next;
    });
  }, []);

  const handleFileSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        void appendFiles(Array.from(files));
      }
      e.target.value = "";
    },
    [appendFiles]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files ?? []);
      if (files.length > 0) void appendFiles(files);
    },
    [appendFiles]
  );

  const handlePromptPaste = useCallback(
    (e: ClipboardEvent<HTMLTextAreaElement>) => {
      const items = Array.from(e.clipboardData?.items ?? []);
      const files = items
        .filter((i) => i.type.startsWith("image/"))
        .map((i) => i.getAsFile())
        .filter((f): f is File => f !== null);
      if (files.length > 0) {
        e.preventDefault();
        void appendFiles(files);
      }
    },
    [appendFiles]
  );

  const handleRemoveOne = useCallback((idx: number) => {
    triggerHaptic("Light");
    setReferenceImageUrls((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const toggleQuality = useCallback((q: ImageEditQuality) => {
    triggerHaptic("Light");
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(q)) next.delete(q);
      else next.add(q);
      return next;
    });
  }, []);

  const canSubmit = prompt.trim().length > 0 && selected.size > 0 && !running;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    triggerHaptic("Medium");
    await submit({
      qualities: Array.from(selected),
      prompt: prompt.trim(),
      referenceImageUrls,
    });
    onAfterRun();
  }, [canSubmit, onAfterRun, prompt, referenceImageUrls, selected, submit]);

  const handleCancel = useCallback(() => {
    triggerHaptic("Warning");
    cancel();
  }, [cancel]);

  const handleClearAll = useCallback(() => {
    triggerHaptic("Light");
    setReferenceImageUrls([]);
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
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-gray-900">워커 #{index + 1}</h2>
          <label className="flex cursor-pointer items-center gap-1.5 text-[11px] text-gray-600">
            <input
              type="checkbox"
              checked={faceSwap}
              onChange={handleToggleFaceSwap}
              className="accent-olive-light h-3.5 w-3.5"
            />
            얼굴 스왑 모드
            {faceSwap && (
              <span className="bg-olive-light/15 text-olive-dark rounded px-1.5 py-0.5 text-[10px] font-medium">
                1=SCENE · 2=FACE
              </span>
            )}
          </label>
        </div>
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
        <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
          <div className="mb-1 flex items-center justify-between">
            <p className="text-[11px] font-semibold text-gray-700">
              입력 이미지 ({referenceImageUrls.length}/{effectiveMax})
            </p>
            {referenceImageUrls.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[10px] text-gray-500 underline"
              >
                전체 제거
              </button>
            )}
          </div>

          {referenceImageUrls.length > 0 ? (
            <div className="grid grid-cols-3 gap-1.5">
              {referenceImageUrls.map((url, idx) => (
                <div key={`${idx}-${url.slice(0, 32)}`} className="relative">
                  <img
                    src={url}
                    alt={`reference ${idx + 1}`}
                    className="rounded-card aspect-square w-full object-cover"
                  />
                  {faceSwap && idx < FACE_SWAP_SLOT_LABELS.length && (
                    <span className="absolute top-0.5 left-0.5 rounded bg-black/65 px-1 py-0.5 text-[9px] font-bold text-white">
                      {FACE_SWAP_SLOT_LABELS[idx]}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveOne(idx)}
                    className="absolute top-0.5 right-0.5 rounded-full bg-white/90 p-0.5 text-gray-600 shadow"
                    aria-label={`${idx + 1}번 이미지 제거`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {referenceImageUrls.length < effectiveMax && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-square w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 hover:bg-gray-100"
                  aria-label="이미지 추가"
                >
                  <Upload className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-2 text-center text-[10px] text-gray-500 hover:bg-gray-100"
            >
              <Upload className="h-5 w-5 text-gray-400" />
              {faceSwap ? (
                <>
                  <span>1번 = SCENE (상태 원본)</span>
                  <span>2번 = FACE (신원 원본)</span>
                </>
              ) : (
                <>
                  <span>클릭 · 드래그 (여러 장)</span>
                  <span>(텍스트박스에 Ctrl+V도 가능)</span>
                </>
              )}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={!faceSwap}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <div>
          <p className="mb-1 text-[11px] font-semibold text-gray-700">
            프롬프트
          </p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onPaste={handlePromptPaste}
            rows={6}
            placeholder="이미지를 어떻게 편집할지 작성하세요. 클립보드에 이미지가 있으면 여기서 Ctrl+V → 입력 이미지로 들어갑니다."
            className="focus:border-olive-light w-full resize-y rounded-xl border border-gray-200 p-3 text-sm focus:outline-none"
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
            className="bg-olive-light h-10 rounded-xl px-4 text-sm font-bold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
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
