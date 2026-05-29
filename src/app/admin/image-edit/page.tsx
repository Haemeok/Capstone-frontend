"use client";

import { useCallback, useState } from "react";

import { Plus } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";

import {
  type CostHistory,
  loadCostHistory,
  resetCostHistory,
} from "@/app/admin/image-quality-test/lib/costStorage";

import { CostPanel } from "./components/CostPanel";
import { WatermarkSection } from "./components/WatermarkSection";
import { WorkerCard } from "./components/WorkerCard";

const EMPTY_HISTORY: CostHistory = { byModel: {}, totalCount: 0, totalCost: 0 };

const makeId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const ImageEditPage = () => {
  const [mode, setMode] = useState<"generate" | "watermark">("generate");
  const [workers, setWorkers] = useState<{ id: string }[]>(() => [
    { id: makeId() },
  ]);
  const [history, setHistory] = useState<CostHistory>(() =>
    typeof window === "undefined" ? EMPTY_HISTORY : loadCostHistory()
  );

  const refreshHistory = useCallback(() => {
    setHistory(loadCostHistory());
  }, []);

  const handleAddWorker = useCallback(() => {
    triggerHaptic("Medium");
    setWorkers((prev) => [...prev, { id: makeId() }]);
  }, []);

  const handleDeleteWorker = useCallback((id: string) => {
    setWorkers((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((w) => w.id !== id);
    });
  }, []);

  const handleResetCost = useCallback(() => {
    if (!window.confirm("누적 비용 기록을 초기화할까요?")) return;
    triggerHaptic("Warning");
    resetCostHistory();
    setHistory(EMPTY_HISTORY);
  }, []);

  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-beige-light/40 p-4 md:p-6">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">
        이미지 편집 (image-to-image)
      </h1>
      <p className="mb-4 text-sm text-gray-500">
        워커 단위로 (이미지 + 프롬프트 + 모델 N개 병렬). 워커는 자유롭게 추가·삭제하고
        각자 독립적으로 돌아가요.
      </p>

      <div className="mb-4 inline-flex rounded-xl border border-gray-200 bg-white p-1">
        {(["generate", "watermark"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`cursor-pointer rounded-lg px-4 py-1.5 text-sm font-medium transition ${
              mode === m
                ? "bg-olive-light text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {m === "generate" ? "이미지 생성" : "워터마크"}
          </button>
        ))}
      </div>

      {mode === "generate" ? (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <aside className="lg:sticky lg:top-4 lg:self-start">
            <CostPanel history={history} onReset={handleResetCost} />
          </aside>

          <main className="space-y-4">
            {workers.map((w, idx) => (
              <WorkerCard
                key={w.id}
                index={idx}
                onAfterRun={refreshHistory}
                onDelete={() => handleDeleteWorker(w.id)}
                canDelete={workers.length > 1}
              />
            ))}

            <button
              type="button"
              onClick={handleAddWorker}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 bg-white text-sm font-medium text-gray-600 transition hover:border-olive-light hover:bg-olive-light/5 hover:text-olive-light"
            >
              <Plus className="h-4 w-4" /> 워커 추가
            </button>
          </main>
        </div>
      ) : (
        <WatermarkSection />
      )}
    </div>
  );
};

export default ImageEditPage;
