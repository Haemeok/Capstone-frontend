"use client";

import type { LucideIcon } from "lucide-react";
import { ChevronRight, Lightbulb, Refrigerator, Replace } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";

type QuickPrompt = {
  icon: LucideIcon;
  iconColor: string;
  label: string;
};

const QUICK_PROMPTS: readonly QuickPrompt[] = [
  {
    icon: Refrigerator,
    iconColor: "text-blue-500",
    label: "보관 방법 알려주세요",
  },
  {
    icon: Replace,
    iconColor: "text-orange-500",
    label: "재료 대체할 수 있을까요?",
  },
  {
    icon: Lightbulb,
    iconColor: "text-amber-500",
    label: "꿀팁 좀 알려주세요",
  },
];

type ChatEmptyStateProps = {
  onQuickQuestion?: (question: string) => void;
};

const ChatEmptyState = ({ onQuickQuestion }: ChatEmptyStateProps) => {
  const handleClick = (question: string) => {
    if (!onQuickQuestion) return;
    triggerHaptic("Light");
    onQuickQuestion(question);
  };

  const interactive = !!onQuickQuestion;

  return (
    <div className="flex flex-col gap-5 px-5 pt-8 pb-6">
      <div>
        <p className="text-[15px] font-bold text-gray-900">
          레시피오 AI에게 무엇이든 물어보세요
        </p>
        <p className="mt-1 text-sm leading-6 text-gray-500">
          재료부터 보관까지 친절하게 답해드려요
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {QUICK_PROMPTS.map(({ icon: Icon, iconColor, label }) => (
          <button
            key={label}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(label)}
            className="flex w-full items-center justify-between rounded-2xl bg-gray-50 px-4 py-3.5 text-left transition-colors active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="flex items-center gap-3">
              <Icon className={`h-5 w-5 shrink-0 ${iconColor}`} />
              <p className="text-sm font-semibold text-gray-900">{label}</p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatEmptyState;
