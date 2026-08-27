import { ArrowRight } from "lucide-react";

import type { HomeDict } from "@/shared/i18n";
import YouTubeIconBadge from "@/shared/ui/badge/YouTubeIconBadge";

type DesktopYoutubeTransformPreviewProps = {
  messages: HomeDict["desktopYoutubeImport"];
};

export const DesktopYoutubeTransformPreview = ({
  messages,
}: DesktopYoutubeTransformPreviewProps) => {
  const summaryItems = [
    {
      value: messages.summary.ingredientValue,
      label: messages.summary.ingredientLabel,
    },
    {
      value: messages.summary.stepValue,
      label: messages.summary.stepLabel,
    },
    {
      value: messages.summary.timeValue,
      label: messages.summary.timeLabel,
    },
  ];

  return (
    <div className="mx-auto grid w-full max-w-[500px] grid-cols-[minmax(0,1fr)_42px_minmax(0,1fr)] items-center gap-3">
      <article
        data-testid="youtube-source-card"
        className="flex h-56 min-w-0 flex-col overflow-hidden rounded-[18px] border border-gray-100 bg-white shadow-[0_12px_30px_rgb(34_34_34/0.08)]"
      >
        <div className="relative min-h-36 flex-1 overflow-hidden">
          <img
            src="/events/cooking-record/food-cluster.webp"
            alt={messages.previewAlt}
            className="h-full w-full object-cover"
          />
          <YouTubeIconBadge className="absolute top-1/2 left-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 drop-shadow-md" />
        </div>
        <div className="px-4 py-3">
          <strong className="text-ink block truncate text-sm leading-[1.35]">
            {messages.sourceTitle}
          </strong>
          <span className="text-ink-muted mt-1 block text-[11px]">
            {messages.sourceMeta}
          </span>
        </div>
      </article>

      <span
        data-testid="youtube-transform-arrow"
        aria-hidden="true"
        className="bg-ink grid h-[42px] w-[42px] place-items-center rounded-[13px] text-white shadow-[0_6px_16px_rgb(34_34_34/0.14)]"
      >
        <ArrowRight className="h-6 w-6" strokeWidth={2} />
      </span>

      <article
        data-testid="youtube-recipe-card"
        className="flex h-56 min-w-0 flex-col rounded-[18px] border border-gray-100 bg-white p-[18px] shadow-[0_12px_30px_rgb(34_34_34/0.08)]"
      >
        <span className="text-olive-dark text-[11px] font-bold">
          {messages.resultLabel}
        </span>
        <h2 className="text-ink mt-2 mb-4 truncate text-lg font-bold tracking-[-0.035em]">
          {messages.resultTitle}
        </h2>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-2">
          {messages.ingredients.map((ingredient) => (
            <li
              key={ingredient.name}
              className="text-ink-sub flex min-w-0 justify-between gap-1 border-b border-gray-100 pb-1.5 text-[11px]"
            >
              <span className="truncate">{ingredient.name}</span>
              <b className="text-ink shrink-0">{ingredient.amount}</b>
            </li>
          ))}
        </ul>
        <div className="mt-auto grid grid-cols-3 border-t border-gray-100 pt-3 text-center">
          {summaryItems.map((item, index) => (
            <span
              key={item.label}
              className={index > 0 ? "border-l border-gray-100" : undefined}
            >
              <b className="text-ink block text-xs">{item.value}</b>
              <span className="text-ink-muted mt-0.5 block text-[10px]">
                {item.label}
              </span>
            </span>
          ))}
        </div>
      </article>
    </div>
  );
};
