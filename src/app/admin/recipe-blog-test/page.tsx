"use client";

import { useState } from "react";

import { triggerHaptic } from "@/shared/lib/bridge";

import { AccountActionsCard } from "./components/AccountActionsCard";
import { CurationBlogMode } from "./components/CurationBlogMode";
import { QueueStatusCard } from "./components/QueueStatusCard";
import { RecipeBlogMode } from "./components/RecipeBlogMode";
import { TodayStatsCard } from "./components/TodayStatsCard";

type Mode = "recipe" | "curation";

const MODE_LABEL: Record<Mode, string> = {
  recipe: "레시피 1개",
  curation: "큐레이션",
};

const BlogPublishPage = () => {
  const [mode, setMode] = useState<Mode>("recipe");

  const handleSelectMode = (next: Mode) => {
    triggerHaptic("Light");
    setMode(next);
  };

  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-beige-light/40 p-4 md:p-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">블로그 발행 (관리자)</h1>
        <div className="flex rounded-2xl border border-gray-200 bg-white p-1 text-sm">
          {(["recipe", "curation"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => handleSelectMode(m)}
              className={`cursor-pointer rounded-xl px-4 py-2 transition ${
                mode === m
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {MODE_LABEL[m]}
            </button>
          ))}
        </div>
      </header>

      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <QueueStatusCard />
        <TodayStatsCard />
        <AccountActionsCard />
      </div>

      {mode === "recipe" ? <RecipeBlogMode /> : <CurationBlogMode />}
    </div>
  );
};

export default BlogPublishPage;
