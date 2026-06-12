import { ReactNode } from "react";

import { Lightbulb } from "lucide-react";

type RecipeCookingTipsSectionProps = {
  tips: string | undefined;
  headerExtra?: ReactNode;
};

export default function RecipeCookingTipsSection({
  tips,
  headerExtra,
}: RecipeCookingTipsSectionProps) {
  if (!tips) return null;

  return (
    <section className="rounded-card border-olive-light/20 bg-olive-light/5 my-6 border p-4">
      <div className="flex items-start gap-3">
        <Lightbulb className="text-olive-dark h-6 w-6 flex-shrink-0" />
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-olive-dark text-sm font-bold">
              Chef&apos;s Tips
            </span>
            {headerExtra}
          </div>
          <p className="text-ink-sub text-sm leading-relaxed whitespace-pre-wrap">
            {tips}
          </p>
        </div>
      </div>
    </section>
  );
}
